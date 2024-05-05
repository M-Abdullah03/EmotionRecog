import { Alert } from 'react-native';
import Constants from 'expo-constants';

const { manifest } = Constants;
const uri = Constants?.expoConfig?.hostUri
    ? Constants.expoConfig.hostUri.split(`:`).shift().concat(`:8080`)
    : `yourapi.com`;
const uploadImage = async (selectedImage) => {

    console.log('ip', uri);
    let data = new FormData();
    data.append('file', {
        uri: selectedImage,
        type: 'image/jpeg', // or 'image/png' if your image is a png
        name: 'test.jpg', // you can replace 'test' with the actual file name
    });

    try {
        let response = await fetch(`${uri}/predict`, {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        let responseJson = await response.json();

        if (response.ok) {
            // Create a new object with the class probabilities in the desired order
            let orderedClassProbabilities = {
                "surprise": responseJson.class_probabilities.surprise,
                "happy": responseJson.class_probabilities.happy,
                "neutral": responseJson.class_probabilities.neutral,
                "sad": responseJson.class_probabilities.sad,
                "angry": responseJson.class_probabilities.angry
            };

            // Replace the class_probabilities in the response with the ordered object
            responseJson.class_probabilities = orderedClassProbabilities;
            responseJson.filename = selectedImage;

            return responseJson;
        } else {
            Alert.alert(
                'Oops!',
                responseJson.error,
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    }
                ],
                { cancelable: false }
            );
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

export default uploadImage;