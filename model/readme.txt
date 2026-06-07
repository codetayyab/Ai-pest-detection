# YOLOv8 Custom Trained Model Folder

Place your trained PyTorch weights file `best.pt` inside this directory.

File path should be:
`ai-pest-detection/model/best.pt`

If this file is present, the Flask backend will automatically load it for inference. If it is not found, the backend will attempt to download the official `yolov8n.pt` model as a fallback, or run in simulated OpenCV heuristic mode.
