# Vercel deployment

The frontend and backend are deployed as **two Vercel projects from the same repository**. The backend runs the pretrained YOLOv8n base model by default. It performs generic COCO object detection and is not a pest or plant-disease classifier.

## 1. Push the repository to GitHub

Create a GitHub repository and push the `Ai-pest-detection` directory. Do not commit `.env` files or a future model weight file.

## 2. Deploy the backend

1. In Vercel, select **Add New → Project** and import the GitHub repository.
2. You may set **Root Directory** to `backend` (recommended) or leave it at the repository root. Both layouts are configured. If you leave it at the repository root, Vercel uses the root `pyproject.toml` and `requirements.txt` to locate `backend.app:app`.
3. Select the Python/FastAPI preset if prompted; leave the build command blank.
4. Deploy. Vercel automatically detects the FastAPI `app` in `app.py` and routes API requests to it.
5. Open `https://YOUR-BACKEND.vercel.app/health`. It must return JSON with `"status":"ok"`.

In the backend project's **Settings → Environment Variables**, set this for Production (and Preview if you want preview frontends to work):

```
CORS_ORIGINS=https://YOUR-FRONTEND.vercel.app
```

For multiple origins, use a comma-separated list. A value of `*` is acceptable only while testing because this API does not use cookies or credentials.

## 3. Deploy the frontend

1. Create a second Vercel project from the same GitHub repository.
2. Set **Root Directory** to `frontend`. Framework preset: **Vite**.
3. Add an environment variable before deploying:

```
VITE_API_URL=https://YOUR-BACKEND.vercel.app
```

4. Deploy, then copy the frontend URL into the backend's `CORS_ORIGINS` variable and redeploy the backend.
5. Test upload, webcam scan, and Dashboard history.

`VITE_API_URL` is compiled into the Vite bundle, so changing it requires a frontend redeploy. Do not add a trailing slash.

## Important limitations

- Vercel functions have an ephemeral filesystem. `history.json` can disappear whenever a function instance is replaced, so Dashboard history is temporary. Use Postgres, Supabase, or another database before relying on history in production.
- YOLOv8n has no aphid, mite, whitefly, caterpillar, or plant-disease classes. A response from this model is an object detection result, not an agricultural diagnosis.
- YOLOv8/PyTorch may exceed Vercel serverless package, memory, execution-time, or cold-start limits. If this deployment cannot build or times out, deploy inference on a dedicated container/GPU service and keep this API/frontend contract.
- When a pest-trained `.pt` file is available, set `YOLO_MODEL_PATH` to its path. Do not change the frontend API contract.

## Local run

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

In a second terminal:

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

The local default in `.env.example` already points at `http://localhost:8000`.
