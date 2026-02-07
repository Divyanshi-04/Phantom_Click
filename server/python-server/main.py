# uvicorn main:app --host 0.0.0.0 --port 8001 --reload
import asyncio

import os
import uuid
import logging
from contextlib import asynccontextmanager
from pathlib import Path
from dotenv import load_dotenv

from fastapi import (
    FastAPI,
    File,
    UploadFile,
    Form,
    HTTPException
)
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# -----------------------------
# Stage 1 imports
# -----------------------------
from get_scam_analysis import generate_explanation
from sandbox_annotate.annotate_service import annotate
from sandbox_annotate.detect_page_flags import analyze_page_text
from sandbox_annotate.get_replay_analysis import analyze_pages
from extract_url.central_logic import ScamBrain
from get_url_score.risk_scorer import RiskScorer


load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai-intel")

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static" / "annotated"
STATIC_DIR.mkdir(parents=True, exist_ok=True)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY environment variable not set")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting AI Intelligence Service...")

    # Stage 1 brain
    app.state.scam_brain = ScamBrain(gemini_api_key=GEMINI_API_KEY)

    # Stage 2 engines
    app.state.risk_scorer = RiskScorer()

    yield

    logger.info("🛑 Shutting down service...")


app = FastAPI(
    title="AI Intelligence Service",
    version="3.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/annotated", StaticFiles(directory=str(STATIC_DIR)), name="annotated")


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "ai-intel",
        "stages": ["stage1", "stage2"]
    }


@app.post("/annotate")
async def annotate_route(payload: dict):
    return await annotate(payload["flags"], payload["screenshot"])


@app.post("/explain-report")
async def explain(report: dict):
    return await generate_explanation(report)


@app.post("/ai-page-analysis")
async def ai_page_analysis(payload: dict):
    return await analyze_page_text(payload["html"])


@app.post("/ai/analyze-replay")
async def ai_replay_pages(payload: dict):
    return await analyze_pages(payload["pages"])


@app.post("/stage1/ocr")
async def process_sms_ocr(
    image: UploadFile = File(...),
    session_id: str = Form(...)
):
    try:
        if not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")

        image_data = await image.read()

        return await app.state.scam_brain.process_sms(
            image_data,
            session_id
        )

    except HTTPException:
        raise
    except Exception:
        logger.exception("OCR pipeline failed")
        raise HTTPException(status_code=500, detail="Internal server error")


class URLAnalysisRequest(BaseModel):
    url: str
    session_id: str | None = None


class URLAnalysisResponse(BaseModel):
    stage2_output: dict


@app.post("/stage2/analyze-url", response_model=URLAnalysisResponse)
async def analyze_url(request: URLAnalysisRequest):
    try:
        print("Hi")
        scorer = app.state.risk_scorer

        result = await asyncio.to_thread(
            scorer.calculate_risk_score,
            request.url
        )

        output = {
            "stage2_output": {
                "original_url": request.url,
                "final_domain": result["analysis"].get("domain", ""),
                "domain_age_days": result["analysis"]
                    .get("whois", {})
                    .get("domain_age_days", -1),
                "entropy_score": int(result["risk_breakdown"].get("entropy", 0)),
                "risk_breakdown": result["risk_breakdown"],
                "overall_threat_score": result["overall_threat_score"],
                "risk_level": result["risk_level"],
                "trigger_ghostview": result["trigger_ghostview"],
            }
        }

        return output

    except Exception as e:
        logger.exception("Stage 2 error")
        raise HTTPException(status_code=500, detail=str(e))