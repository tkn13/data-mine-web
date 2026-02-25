from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app) # Allows JavaScript from different origins to call this API

# Load the model once when the server starts
model = joblib.load('rf_model.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    try:
        # Extract features in the exact order required by the model
        features = [
            float(data['Driving_experience']),
            float(data['Value_vehicle']),
            float(data['Power']),
            float(data['Weight']),
            float(data['Length_of_vehicle_usage']),
            float(data['R_Claims_history']),
            float(data['N_claims_history']),
            float(data['Old']),
            float(data['Length']),
            float(data['Cylinder_capacity']),
            float(data['Policies_in_force'])
        ]
        
        # Convert to 2D array and predict
        prediction = model.predict([features])
        
        # Return as JSON
        return jsonify({'prediction': float(prediction[0])})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(port=5000)