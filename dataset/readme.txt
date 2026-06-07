# YOLOv8 Plant Disease Dataset Structure

To train a custom YOLOv8 model for agricultural pest detection, organize your leaf images and bounding box annotation files (YOLO text format) as follows:

dataset/
│
├── data.yaml (dataset configuration)
│
├── images/
│   ├── train/ (e.g. leaf01.jpg, leaf02.jpg)
│   └── val/ (e.g. leaf03.jpg)
│
└── labels/
    ├── train/ (e.g. leaf01.txt, leaf02.txt - coordinates normalized 0-1)
    └── val/ (e.g. leaf03.txt)

## YOLO Annotation Format (.txt)
Each line represents one bounding box:
`<class_id> <x_center> <y_center> <width> <height>`

Example content for leaf01.txt:
`0 0.512 0.384 0.124 0.231` (representing Aphids)
