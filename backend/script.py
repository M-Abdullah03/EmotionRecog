from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from keras.api.models import load_model
from PIL import Image
import io
import numpy as np

app = FastAPI()

# get model from .h5 file
model = load_model('model.h5')

def preprocess(data):
    # preprocess data
    return data

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Read image file
        image = Image.open(io.BytesIO(await file.read()))
        image = np.array(image)
        
            # prediction = your_model.predict(image)

        return JSONResponse(content={"filename": file.filename, "prediction": "placeholder"})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)