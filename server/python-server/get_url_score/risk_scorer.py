# backend/python-ai/stage2/risk_scorer.py

import joblib
import numpy as np
import pandas as pd
from pathlib import Path
import tldextract

from .feature_extractor import URLFeatureExtractor
from .whois_analyzer import WHOISAnalyzer



class RiskScorer:

    def __init__(self):
        BASE_DIR = Path(__file__).resolve().parent
        model_dir = BASE_DIR / "models"

        self.model = joblib.load(model_dir / "phishing_detector_rf.pkl")
        self.feature_names = joblib.load(model_dir / "feature_names.pkl")

        self.url_extractor = URLFeatureExtractor()
        self.whois_analyzer = WHOISAnalyzer()


        # Known legit domains (VERY IMPORTANT)
        self.legit_domains = {
            "sbi.co.in",
            "google.com",
            "paypal.com",
            "amazon.in",
            "amazon.com",
            "microsoft.com"
        }

    # -----------------------------------------------------

    def calculate_risk_score(self, url: str) -> dict:
        result = {
            "url": url,
            "analysis": {},
            "risk_breakdown": {},
            "overall_threat_score": 0,
            "risk_level": "Unknown",
            "trigger_ghostview": False,
            "ml_prediction_score": 0
        }

        try:
            # -------- Feature extraction --------
            url_features = self.url_extractor.extract_all_features(url)

            extracted = tldextract.extract(url)
            domain = f"{extracted.domain}.{extracted.suffix}"

            # -------- WHOIS --------
            whois_data = self.whois_analyzer.analyze_domain(domain)

            # -------- Store raw analysis --------
            result["analysis"] = {
                "domain": domain,
                "url_features": url_features,
                "whois": whois_data
            }

            # -------- Risk components --------
            lookalike_risk = self._calculate_lookalike_risk(domain, url_features)
            domain_age_risk = self._calculate_domain_age_risk(whois_data)
            entropy_risk = self._calculate_entropy_risk(url_features)
            pattern_risk = self._calculate_pattern_risk(url_features)
            ml_score = self._get_ml_prediction(url_features)

            result["risk_breakdown"] = {
                "lookalike": lookalike_risk,
                "domain_age": domain_age_risk,
                "entropy": entropy_risk,
                "pattern": pattern_risk,
                "ml": int(ml_score)
            }

            # -------- Weighted scoring --------
            weights = {
                "lookalike": 0.30,
                "domain_age": 0.20,
                "entropy": 0.10,
                "pattern": 0.15,
                "ml": 0.25
            }

            overall_score = (
                lookalike_risk * weights["lookalike"] +
                domain_age_risk * weights["domain_age"] +
                entropy_risk * weights["entropy"] +
                pattern_risk * weights["pattern"] +
                ml_score * weights["ml"]
            )

            # -------- HARD SECURITY OVERRIDES --------
            if url_features.get("has_ip", 0) == 1:
                overall_score = max(overall_score, 65)

            if ml_score >= 90:
                overall_score = max(overall_score, 80)

            # -------- Final output --------
            result["overall_threat_score"] = int(float(overall_score))
            result["ml_prediction_score"] = int(float(ml_score))
            result["risk_level"] = self._get_risk_level(overall_score)
            result["trigger_ghostview"] = bool(overall_score >= 20)


        except Exception as e:
            result["error"] = str(e)

        return result

    # -----------------------------------------------------

    def _calculate_lookalike_risk(self, domain, features):
        """Lookalike ONLY if similar but NOT equal"""

        if domain in self.legit_domains:
            return 0

        if features.get("is_potential_lookalike", 0) == 1:
            return min(features.get("lookalike_score", 0), 100)

        return 0

    # -----------------------------------------------------

    def _calculate_domain_age_risk(self, whois_data):
        """WHOIS-safe domain age scoring"""

        age_days = whois_data.get("domain_age_days")

        if age_days is None:
            return 50  # Unknown = suspicious

        if age_days < 3:
            return 100
        elif age_days < 30:
            return 70
        elif age_days < 365:
            return 40
        else:
            return 10

    # -----------------------------------------------------

    def _calculate_entropy_risk(self, features):
        entropy = features.get("entropy", 0)

        if entropy > 4.5:
            return 80
        elif entropy > 4.0:
            return 60
        elif entropy > 3.5:
            return 40
        else:
            return 20

    # -----------------------------------------------------

    def _calculate_pattern_risk(self, features):
        risk = 0

        risk += min(features.get("suspicious_keyword_count", 0) * 15, 45)

        if features.get("has_ip", 0) == 1:
            risk += 40

        if features.get("has_suspicious_tld", 0) == 1:
            risk += 25

        if features.get("has_https", 1) == 0:
            risk += 20

        return min(risk, 100)

    # -----------------------------------------------------

    def _get_ml_prediction(self, features):
        """Safe ML inference"""

        X = pd.DataFrame(
            [[features.get(f, 0) for f in self.feature_names]],
            columns=self.feature_names
        )

        proba = self.model.predict_proba(X)[0][1]
        return proba * 100

    # -----------------------------------------------------

    def _get_risk_level(self, score):
        if score >= 80:
            return "Critical"
        elif score >= 60:
            return "High"
        elif score >= 40:
            return "Medium"
        elif score >= 20:
            return "Low"
        else:
            return "Minimal"

