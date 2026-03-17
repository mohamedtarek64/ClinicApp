from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Clinic AI Service")

# Allow CORS for backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Clinic AI API is running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Placeholder for AI Model logic
    # Once you provide the model files, we will implement the actual prediction here
    return {
        "filename": file.filename,
        "prediction": "Placeholder Result (e.g., Normal/Abnormal)",
        "confidence": 0.95
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
