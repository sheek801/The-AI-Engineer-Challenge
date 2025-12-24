import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI

# Try to import dotenv, but don't crash if it's missing (it's often pre-installed or handled by Vercel env)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass 

app = FastAPI()

# CORS so the frontend can talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ChatRequest(BaseModel):
    jobDescription: str
    resume: str

@app.post("/api/chat")
def chat(request: ChatRequest):
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")
    
    try:
        # Construct the user message with Job Description and Resume
        user_message = f"Job Description:\n{request.jobDescription}\n\nResume:\n{request.resume}"
        
        # Use GPT-5 with the standard chat.completions.create() API (same format as GPT-4)
        response = client.chat.completions.create(
            model="gpt-5",
            messages=[
                {
                    "role": "system", 
                    "content": """You are an expert technical recruiter. Analyze the provided Job Description and Resume. Provide:

1. Match Score (out of 100)
2. Top 3 missing keywords
3. Two specific resume bullet point improvements
4. Executive Summary: A concise paragraph (3-4 sentences) explaining the overall compatibility, the candidate's biggest strength relative to the role, and the single most important area they should focus on to land the interview.

Format your response clearly with section headers."""
                },
                {"role": "user", "content": user_message}
            ]
        )
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling OpenAI API: {str(e)}")
