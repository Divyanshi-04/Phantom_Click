# backend/python-ai/stage2/train_model.py

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
# backend/python-ai/stage2/train_model.py

import pandas as pd
import numpy as np
from pathlib import Path
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    roc_auc_score,
    precision_recall_curve,
    auc
)

def train_phishing_detector():
    print("📂 Loading dataset...")

    BASE_DIR = Path(__file__).resolve().parent
    ROOT_DIR = BASE_DIR.parent

    data_path = ROOT_DIR / 'data' / 'datasets' / 'features_dataset.csv'
    df = pd.read_csv(data_path)

    # -------------------------------
    # 1️⃣ Drop leaky / non-numeric features
    # -------------------------------
    drop_cols = [
        'domain',
        'suffix',
        'full_domain',
        'closest_legit_domain'
    ]
    df = df.drop(columns=[c for c in drop_cols if c in df.columns])

    # -------------------------------
    # 2️⃣ Split features & labels
    # -------------------------------
    X = df.drop('label', axis=1)
    y = df['label']

    print(f"📊 Dataset shape: {X.shape}")
    print(f"\n📊 Class distribution:\n{y.value_counts()}")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    # -------------------------------
    # 3️⃣ Train Random Forest (balanced)
    # -------------------------------
    print("\n🌲 Training Random Forest (class-balanced)...")

    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=18,
        min_samples_split=10,
        min_samples_leaf=5,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1
    )

    model.fit(X_train, y_train)

    # -------------------------------
    # 4️⃣ Evaluation
    # -------------------------------
    print("\n📈 Evaluating model...")

    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]

    print("\n" + "=" * 55)
    print("CLASSIFICATION REPORT")
    print("=" * 55)
    print(classification_report(
        y_test, y_pred,
        target_names=["Legitimate", "Phishing"],
        digits=4
    ))

    print("\nCONFUSION MATRIX")
    print(confusion_matrix(y_test, y_pred))

    roc = roc_auc_score(y_test, y_proba)
    print(f"\n🎯 ROC-AUC: {roc:.4f}")

    # Precision-Recall AUC (better for imbalance)
    precision, recall, _ = precision_recall_curve(y_test, y_proba)
    pr_auc = auc(recall, precision)
    print(f"📉 PR-AUC: {pr_auc:.4f}")

    # -------------------------------
    # 5️⃣ Feature importance
    # -------------------------------
    feature_importance = (
        pd.DataFrame({
            "feature": X.columns,
            "importance": model.feature_importances_
        })
        .sort_values(by="importance", ascending=False)
    )

    print("\n" + "=" * 55)
    print("TOP IMPORTANT FEATURES")
    print("=" * 55)
    print(feature_importance.head(10))

    # -------------------------------
    # 6️⃣ Save artifacts
    # -------------------------------
    model_dir = ROOT_DIR / "models"
    model_dir.mkdir(exist_ok=True)

    joblib.dump(model, model_dir / "phishing_detector_rf.pkl")
    joblib.dump(list(X.columns), model_dir / "feature_names.pkl")
    feature_importance.to_csv(model_dir / "feature_importance.csv", index=False)

    print("\n✅ Training complete (balanced & safer).")

    return model, feature_importance


if __name__ == "__main__":
    train_phishing_detector()
