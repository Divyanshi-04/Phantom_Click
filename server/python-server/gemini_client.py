import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

# New SDK automatically reads GOOGLE_API_KEY
client = genai.Client()


async def ask_gemini(prompt: str) -> str:
    """
    Wrapper around Gemini call
    Returns plain text response
    """

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=prompt,
    )

    return response.text
