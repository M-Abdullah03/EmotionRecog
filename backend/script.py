from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from keras.api.models import load_model
from PIL import Image
import io
import numpy as np
from backend.preproc import preprocess_image
import uvicorn

app = FastAPI()

# get model from .h5 file
# model = load_model('model.h5')

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()
        preprocessed_image = preprocess_image(io.BytesIO(file_bytes))
        
        if preprocessed_image is None:
            return JSONResponse(content={"error": "The image does not contain a single face.", "status": "failure"}, status_code=400)
        
        # Reshape the image
        image = np.expand_dims(image, axis=0)
        
        # Predict the emotion of the image
        # emotion = model.predict_classes(image)[0]
    
        return JSONResponse(content={"filename": file.filename, "prediction": "emotion", "status": "success"}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    
# Run the server
if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)