from keras.api.models import load_model
from mtcnn import MTCNN
import numpy as np
import cv2
import matplotlib.pyplot as plt

# # Load the Haar cascade xml file for face detection
# face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

detector = MTCNN()
print("Loading MTCNN detector...")

# Define the input shape for the model
INPUT_SHAPE = (48, 48, 1)

def preprocess_image(file_bytes):
    
    nparr = np.frombuffer(file_bytes, np.uint8)

    # Decode the image from the byte array in color
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # plot the image
    # plt.imshow(image)
    # plt.show()

    # Convert the image from BGR to RGB
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Perform face detection
    faces = detector.detect_faces(image)

    # If only single face is not detected, return None
    if len(faces) == 0:
        return -1
    
    if len(faces) > 1:
        return -2
    
    # extract face 
    x, y, width, height = faces[0]['box']
    face = image[y:y+height, x:x+width]
    
    # Convert the image to grayscale
    image = cv2.cvtColor(face, cv2.COLOR_RGB2GRAY)    
    normalized_image = cv2.normalize(image, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX)    
    resized_image = cv2.resize(normalized_image, INPUT_SHAPE[:2])    
    reshaped_image = np.reshape(resized_image, INPUT_SHAPE)
    plt.imshow(reshaped_image)
    plt.show()
    return reshaped_image


# file_bytes = open('./backend/happy-bg.jpg', 'rb').read()
# preprocess_image(file_bytes)