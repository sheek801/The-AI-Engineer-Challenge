import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

@app.get("/")
def root():
    return {"status": "ok"}

@app.post("/api/chat")
def chat(request: ChatRequest):
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")
    
    try:
        # Construct the user message with Job Description and Resume
        user_message = f"Job Description:\n{request.jobDescription}\n\nResume:\n{request.resume}"
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Using a valid model name instead of gpt-5
            messages=[
                {
                    "role": "system", 
                    "content": "You are an expert technical recruiter. You will receive a Job Description and a Resume. Your task is to provide a \"Match Score\" out of 100, identify the top 3 missing keywords, and suggest 2 specific bullet point improvements for the resume."
                },
                {"role": "user", "content": user_message}
            ]
        )
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling OpenAI API: {str(e)}")
