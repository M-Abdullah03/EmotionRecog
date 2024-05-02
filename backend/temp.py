import os

# Ignore TensorFlow warnings
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

import cv2
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import GridSearchCV
from scikeras.wrappers import KerasClassifier
from keras.api.optimizers import Adam
from keras.api.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization
from keras.api.models import Sequential
from keras.api.callbacks import EarlyStopping
from keras.src.legacy.preprocessing.image import ImageDataGenerator
import pickle
from pathlib import Path
import warnings

# Ignore UserWarnings from Keras
warnings.filterwarnings('ignore', category=UserWarning, module='keras')

# Define the input shape for the model
INPUT_SHAPE = (48, 48, 1)
NUM_CLASSES = 5

# Define a function to preprocess an image
def preprocess_image(file_path):
    image = cv2.imread(file_path, cv2.IMREAD_GRAYSCALE)
    normalized_image = cv2.normalize(image, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX)
    resized_image = cv2.resize(normalized_image, INPUT_SHAPE[:2])
    reshaped_image = np.reshape(resized_image, INPUT_SHAPE)
    return reshaped_image

def load_data(base_dir, le=None):
    # Create a list of directories for each emotion
    emotion_dirs = [os.path.join(base_dir, emotion) for emotion in os.listdir(base_dir)]

    # Initialize dictionaries to hold the data and labels for each emotion
    data_dict = {}

    # Loop over all directories
    for emotion_dir in emotion_dirs:
        emotion = os.path.basename(emotion_dir)  # Get the emotion name from the directory name
        emotion_files = [str(file) for file in Path(emotion_dir).rglob('*')]
        
        # Preprocess the images and get the labels for each emotion in the same loop
        data_dict[emotion] = [preprocess_image(file) for file in emotion_files]

    X = []
    y = []

    for emotion, images in data_dict.items():
        X.extend(images)
        y.extend([emotion] * len(images))

    X = np.array(X)
    y = np.array(y)

    # Encode the labels to integers
    if le is None:
        le = LabelEncoder()

    y = le.fit_transform(y)

    return X, y, le

# Set the base directory for the dataset
train_base_dir = 'archive/train'
test_base_dir = 'archive/test'

# Load the dataset
X_train, y_train, le = load_data(train_base_dir)

# Save the LabelEncoder
with open('label_encoder.pkl', 'wb') as f:
    pickle.dump(le, f)

# Load the test dataset
X_test, y_test, _ = load_data(test_base_dir, le)

# Get the shape of the first image in the dataset
image_height, image_width, num_channels = X_train[0].shape

# Data augmentation
datagen = ImageDataGenerator(
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    horizontal_flip=True,
    shear_range=0.2,
    zoom_range=0.2,
    fill_mode='nearest')

# Define a function to create your Keras sequential model
def create_model(neurons=64, learning_rate=0.001):
    # Create a more complex CNN model
    model = Sequential([
        Conv2D(64, (3, 3), activation='relu', input_shape=(image_height, image_width, num_channels), padding='same'),
        MaxPooling2D((2, 2)),
        BatchNormalization(),
        Dropout(0.25),

        Conv2D(128, (3, 3), activation='relu', padding='same'),
        MaxPooling2D((2, 2)),
        BatchNormalization(),
        Dropout(0.25),

        Conv2D(256, (3, 3), activation='relu', padding='same'),
        MaxPooling2D((2, 2)),
        BatchNormalization(),
        Dropout(0.25),

        Flatten(),

        Dense(neurons, activation='relu'),
        BatchNormalization(),
        Dropout(0.25),

        Dense(neurons*2, activation='relu'),
        BatchNormalization(),
        Dropout(0.25),

        Dense(NUM_CLASSES, activation='softmax')
    ])

    # Compile the model with a smaller learning rate
    model.compile(optimizer=Adam(learning_rate=learning_rate), loss='sparse_categorical_crossentropy', metrics=['accuracy'])

    # Return the model
    return model

param_grid = {
    'model__neurons': [64, 128],
    'model__learning_rate': [0.0001, 0.001, 0.01],
    'batch_size': [32, 64],
    'epochs': [30, 50]
}

# Wrap Keras model for use in scikit-learn
model = KerasClassifier(model=create_model, verbose=1)

# Perform grid search
grid = GridSearchCV(estimator=model, param_grid=param_grid, cv=2)
grid_result = grid.fit(X_train, y_train)

# Get best hyperparameters
best_neurons = grid_result.best_params_['model__neurons']
best_learning_rate = grid_result.best_params_['model__learning_rate']
best_batch_size = grid_result.best_params_['batch_size']
best_epochs = grid_result.best_params_['epochs']

# Print best hyperparameters
print(f"Best Neurons: {best_neurons}")
print(f"Best Learning Rate: {best_learning_rate}")
print(f"Best Batch Size: {best_batch_size}")
print(f"Best Epochs: {best_epochs}")

# Create the best model
best_model = create_model(neurons=best_neurons, learning_rate=best_learning_rate)

# Early stopping
early_stopping = EarlyStopping(monitor='val_loss', patience=2)

# Train the model with a larger batch size and more epochs
best_model.fit(datagen.flow(X_train, y_train, batch_size=best_batch_size),
               epochs=best_epochs,
               validation_data=(X_test, y_test),
               callbacks=[early_stopping])

# Get the predicted probabilities
y_pred_prob = best_model.predict(X_test)

# Get the class with the highest probability
y_pred = np.argmax(y_pred_prob, axis=1)

# Transform the predicted labels back into their original form
y_pred_labels = le.inverse_transform(y_pred)

# Print the predicted probabilities for each class
for i in range(len(y_pred_prob)):
    print(f'Predicted probabilities: {y_pred_prob[i]}')
    print(f'Predicted class: {y_pred_labels[i]}')
    print('Class probabilities:')
    for j in range(len(y_pred_prob[i])):
        print(f'{le.inverse_transform([j])[0]}: {y_pred_prob[i][j]}')

# Save the model using the pickle library
with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)