from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Global variables to store loaded models
model = None
columns = None
scaler = None

def load_models():
    """Load the trained model, columns, and scaler"""
    global model, columns, scaler
    
    try:
    # Load model and scaler using joblib
        model = joblib.load("KNN_heart.pkl")
        scaler = joblib.load("scaler.pkl")
        columns = joblib.load("columns.pkl")
        logger.info("Models loaded successfully")
        logger.info(f"Expected columns: {columns}")
        
    except FileNotFoundError as e:
        logger.error(f"Model files not found: {e}")
        raise

# Load models at import time to avoid cold-start delays in production servers
try:
    load_models()
except Exception as e:
    logger.error(f"Startup model load failed: {e}")
    except Exception as e:
        logger.error(f"Error loading models: {e}")
        raise

def preprocess_input(user_input):
    """Preprocess user input for prediction"""
    try:
        # Expected columns from your training data
        expected_columns = [
            'Age', 'RestingBP', 'Cholesterol', 'FastingBS', 'MaxHR', 'Oldpeak',
            'Sex_M', 'ChestPainType_ATA', 'ChestPainType_NAP', 'ChestPainType_TA',
            'RestingECG_Normal', 'RestingECG_ST', 'ExerciseAngina_Y', 
            'ST_Slope_Flat', 'ST_Slope_Up'
        ]
        
        # Initialize with zeros
        processed_data = {col: 0 for col in expected_columns}
        
        # Set numerical features
        processed_data['Age'] = user_input['Age']
        processed_data['RestingBP'] = user_input['RestingBP']
        processed_data['Cholesterol'] = user_input['Cholesterol']
        processed_data['FastingBS'] = user_input['FastingBS']
        processed_data['MaxHR'] = user_input['MaxHR']
        processed_data['Oldpeak'] = user_input['Oldpeak']
        
        # Handle Sex (Male = 1, Female = 0)
        processed_data['Sex_M'] = 1 if user_input['Sex'] == 'M' else 0
        
        # Handle ChestPainType (one-hot encoding)
        chest_pain = user_input['ChestPainType']
        if chest_pain == 'ATA':
            processed_data['ChestPainType_ATA'] = 1
        elif chest_pain == 'NAP':
            processed_data['ChestPainType_NAP'] = 1
        elif chest_pain == 'TA':
            processed_data['ChestPainType_TA'] = 1
        # ASY is the reference category (all zeros)
        
        # Handle RestingECG (one-hot encoding)
        resting_ecg = user_input['RestingECG']
        if resting_ecg == 'Normal':
            processed_data['RestingECG_Normal'] = 1
        elif resting_ecg == 'ST':
            processed_data['RestingECG_ST'] = 1
        # LVH is the reference category (all zeros)
        
        # Handle ExerciseAngina (Y = 1, N = 0)
        processed_data['ExerciseAngina_Y'] = 1 if user_input['ExerciseAngina'] == 'Y' else 0
        
        # Handle ST_Slope (one-hot encoding)
        st_slope = user_input['ST_Slope']
        if st_slope == 'Flat':
            processed_data['ST_Slope_Flat'] = 1
        elif st_slope == 'Up':
            processed_data['ST_Slope_Up'] = 1
        # Down is the reference category (all zeros)
        
        # Create DataFrame
        df = pd.DataFrame([processed_data])
        
        # Ensure columns are in the correct order
        df = df[expected_columns]
        
        # Scale the features
        scaled_features = scaler.transform(df)
        
        return scaled_features
        
    except Exception as e:
        logger.error(f"Error in preprocessing: {e}")
        raise

@app.route('/predict', methods=['POST'])
def predict():
    """Endpoint for heart disease prediction"""
    try:
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['Age', 'Sex', 'ChestPainType', 'RestingBP', 'Cholesterol', 
                          'FastingBS', 'RestingECG', 'MaxHR', 'ExerciseAngina', 
                          'Oldpeak', 'ST_Slope']
        
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({'error': f'Missing required fields: {missing_fields}'}), 400
        
        # Preprocess the input
        processed_input = preprocess_input(data)
        
        # Make prediction
        prediction = model.predict(processed_input)[0]
        prediction_proba = model.predict_proba(processed_input)[0]
        
        # Prepare response
        response = {
            'prediction': int(prediction),
            'prediction_text': 'Heart Disease Detected' if prediction == 1 else 'No Heart Disease',
            'probability': {
                'no_disease': float(prediction_proba[0]),
                'heart_disease': float(prediction_proba[1])
            },
            'confidence': float(max(prediction_proba))
        }
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error in prediction: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Heart Disease Prediction API is running'})

@app.route('/', methods=['GET'])
def home():
    """Home endpoint"""
    return jsonify({
        'message': 'Heart Disease Prediction API',
        'endpoints': {
            'predict': '/predict (POST)',
            'health': '/health (GET)'
        }
    })

if __name__ == '__main__':
    # Load models on startup
    load_models()
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)