# CORS Setup for Backend API

Since your backend API at `http://44.249.168.221:8000` needs to accept requests from your Amplify deployment, you need to enable CORS on the backend.

## Option 1: Enable CORS on the Backend (Recommended)

If you have access to the backend code (FastAPI/uvicorn), add CORS middleware:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your Amplify domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Your existing routes...
```

## Option 2: Use a CORS Proxy (Quick Fix)

If you can't modify the backend, you can use a CORS proxy service:

1. Use a public CORS proxy like `https://corsproxy.io/`
2. Update the API URL in the code to: `https://corsproxy.io/?http://44.249.168.221:8000/loadcurve/${podNumber}`

## Option 3: Create an AWS Lambda Proxy

Create a simple Lambda function that proxies requests to your API with CORS headers enabled.

## Current Implementation

The app now:
- Uses Vite proxy in development (no CORS issues)
- Calls the API directly in production (requires backend CORS)

To test if CORS is the issue, check the browser console for CORS-related errors.
