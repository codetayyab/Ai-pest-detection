Render deployment instructions for backend

1) Create a new Web Service on Render
- Connect your GitHub repo `codetayyab/Ai-pest-detection`.
- Render can use `render.yaml` from the repository root to configure the service.
- If you prefer manual setup, set "Root Directory" to `backend`.
- Environment: `Python 3.11` (or 3.10/3.12 as supported)
- Build Command: leave blank (Render will pip install using `requirements.txt`)
- Start Command: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker app:app --bind 0.0.0.0:$PORT`

2) Environment & Files
- `render.yaml` is included at the repository root for auto-deploy.
- `backend/requirements.txt` now includes `gunicorn`.
- `backend/Procfile` created (Render will respect the Procfile start command).

3) After deployment
- Copy the service public URL (e.g. `https://your-service.onrender.com`).
- In your Vercel project settings for the frontend, set an Environment Variable:
  - `VITE_API_URL` = `https://your-service.onrender.com`
- Redeploy the Vercel frontend (Vercel will pick up the env var at build time).

4) Local testing
- Run backend locally:

```bash
cd backend
python -m pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

- Run frontend locally (from repo root):

```bash
cd frontend
npm install
npm run dev
# open http://localhost:5173 (or the port Vite reports)
```

5) Notes & troubleshooting
- If you use YOLO/Ultralytics models, install `ultralytics` and upload `backend/model/best.pt` to the server or enable model download in `model.py`.
- Keep `backend/history.json` writable by the Render service (it will be ephemeral; consider using a persistent DB if you need history persisted across deploys).
