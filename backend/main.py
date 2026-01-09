from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    # Simulate a "math" operation to prove numpy is working
    matrix = np.random.rand(3,3).tolist()
    return {
        "status": "Vector Corals API is Online",
        "digital_dna_sample": matrix
    }