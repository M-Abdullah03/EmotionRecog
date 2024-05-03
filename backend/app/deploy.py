# ignore tensorflow warnings
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from mangum import Mangum
from keras.api.models import load_model
from PIL import Image
import io
import numpy as np
from preproc import preprocess_image
import uvicorn
import warnings
import pickle
from datetime import datetime


warnings.filterwarnings("ignore", category=UserWarning, module="keras")


app = FastAPI()

with open('./backend/model.pkl', 'rb') as f:
    model = pickle.load(f)
    
with open('./backend/label_encoder.pkl', 'rb') as f:
    encoder = pickle.load(f)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()
        preprocessed_image = preprocess_image(file_bytes)
        
        if preprocessed_image is type(int):
            if preprocessed_image == -1:
                return JSONResponse(content={"error": "The image does not contain a single face.", "status": "failure"}, status_code=404)
            
            if preprocessed_image == -2:
                return JSONResponse(content={"error": "The image contains more than one face.", "status": "failure"}, status_code=405)
            
        # Reshape the image
        image = np.expand_dims(preprocessed_image, axis=0)
        
        # Predict the emotion of the image
        y_pred_prob = model.predict(image)
        y_pred_prob = np.array(y_pred_prob).tolist()

        # Get the predicted class label
        y_pred_label = np.argmax(y_pred_prob, axis=1)

        # Convert the NumPy ndarray object to a native Python value
        y_pred_label = encoder.inverse_transform(y_pred_label)[0]

        # Create a dictionary to hold the class probabilities
        class_probabilities = {}
        for j in range(len(y_pred_prob[0])):
            class_probabilities[encoder.inverse_transform([j])[0]] = y_pred_prob[0][j]
            
        current_date = datetime.now().strftime("%A, %d-%m %H:%M")
                
        return JSONResponse(content={"filename": file.filename, "date": current_date, "predicted_class": y_pred_label, "class_probabilities": class_probabilities, "status": "success"}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    
# handler = Mangum(app)