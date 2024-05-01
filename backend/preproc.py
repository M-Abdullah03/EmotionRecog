from keras.api.models import load_model
import numpy as np
import cv2

# Load the Haar cascade xml file for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Define the input shape for the model
INPUT_SHAPE = (48, 48, 1)

# Define a function to preprocess an image
def preprocess_image(file_bytes):
    nparr = np.frombuffer(file_bytes, np.uint8)

    # Decode the image from the byte array
    image = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)

    # Perform face detection
    faces = face_cascade.detectMultiScale(image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    # If only single face is not detected, return None
    if len(faces) != 1:
        return None
    
    normalized_image = cv2.normalize(image, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX)
    resized_image = cv2.resize(normalized_image, INPUT_SHAPE[:2])
    reshaped_image = np.reshape(resized_image, INPUT_SHAPE)
    return reshaped_image
