# AI Pest Detection System

A camera-enabled pest detection system for plants using a React frontend and FastAPI backend.

## Project Structure

- `backend/` - FastAPI API server that receives images or webcam frames and performs pest detection.
- `frontend/` - React + Vite app with webcam capture, image upload, live detection, and history display.
- `model/` - Detection logic and optional YOLO model support.
- `dataset/` - Supporting dataset metadata.

## Features

- Live camera scan using webcam
- Image upload analysis
- Pest detection with confidence and treatment suggestions
- Detection history storage

## Setup

### Backend

1. Create a Python virtual environment:
   ```powershell
   cd ai-pest-detection\backend
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```
2. Start the backend API:
   ```powershell
   uvicorn app:app --host 0.0.0.0 --port 8000 --reload
   ```

### Webcam Camera Detection

Use the webcam mode in the browser frontend. It captures frames in the browser
and sends them to the FastAPI API; no separate desktop OpenCV camera process is
required.

### Frontend

1. Install dependencies:
   ```powershell
   cd ..\frontend
   npm install
   ```
2. Start the frontend app:
   ```powershell
   npm run dev
   ```
3. Open the URL shown by Vite in your browser.

## Usage

- Use the live camera mode to scan plant leaves with your webcam.
- Use the upload mode to submit photos of leaves.
- The app shows a predicted pest/disease type, confidence score, and treatment suggestions.

## Notes

- You may need a physical webcam and browser permission to access it.
- The current backend uses a lightweight baseline heuristic only. It deliberately
  does not train, fine-tune, download, or load a model.
- A future trained detector should replace `backend/model.py` while preserving
  its existing response fields (`pest`, `confidence`, `solution`, dimensions,
  and `boxes`) so the frontend needs no API changes.

## Deployment

### Backend on Render

- `render.yaml` is included at the repository root.
- Backend service files are under `backend/`.
- Render will use `backend/Procfile` and `backend/requirements.txt`.
- After render deploy, copy the public backend URL and use it in Vercel as `VITE_API_URL`.

### Frontend on Vercel

- The frontend is deployed from the `frontend/` root.
- Set `VITE_API_URL` in the Vercel project environment variables.
- The app will automatically use that backend URL at build time.
- Use `frontend/.env.example` to create a local `.env` file for development.

For the complete two-project Vercel deployment procedure, limitations, CORS
configuration, and local verification steps, read [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md).

## GitHub Repository

This folder is now ready to be initialized as a Git repository for sharing on GitHub.
