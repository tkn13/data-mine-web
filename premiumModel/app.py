from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd # แนะนำให้ใช้ pandas เพื่อรักษาชื่อคอลัมน์ตอนทำ transform

app = Flask(__name__)
CORS(app) # Allows JavaScript from different origins to call this API

# Load the model and scalers once when the server starts
model = joblib.load('rf_model.joblib')
ct = joblib.load('ct.joblib')       
pt_y = joblib.load('pt_y.joblib')   

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    try:
        # 1. จัดรูปแบบเป็น Dictionary ที่ใส่ List ไว้ด้านใน (เพื่อให้แปลงเป็น DataFrame 1 แถวได้)
        feature_dict = {
            'Driving_experience': [float(data['Driving_experience'])],
            'Value_vehicle': [float(data['Value_vehicle'])],
            'Power': [float(data['Power'])],
            'Weight': [float(data['Weight'])],
            'Length_of_vehicle_usage': [float(data['Length_of_vehicle_usage'])],
            'R_Claims_history': [float(data['R_Claims_history'])],
            'N_claims_history': [float(data['N_claims_history'])],
            'Old': [float(data['Old'])],
            'Length': [float(data['Length'])],
            'Cylinder_capacity': [float(data['Cylinder_capacity'])],
            'Policies_in_force': [float(data['Policies_in_force'])]
        }
        
        # 2. แปลงเป็น DataFrame ให้ตัวสเกล (ct) มองเห็นชื่อคอลัมน์เหมือนตอนเทรน
        input_df = pd.DataFrame(feature_dict)
        
        # 3. สเกลขาเข้า (ได้ผลลัพธ์เป็น 2D Array พร้อมใช้)
        features_scaled = ct.transform(input_df)
        
        # 4. ให้โมเดลทำนาย (โยน features_scaled เข้าไปตรงๆ ได้เลย)
        prediction_scaled = model.predict(features_scaled)
        
        # 5. สเกลขาออก กลับเป็นหน่วย "บาท"
        prediction_final = pt_y.inverse_transform(prediction_scaled.reshape(-1, 1))
        
        # 6. Return as JSON (ต้องดึงค่าที่ตำแหน่ง [0][0] เพราะผลลัพธ์เป็น 2D Array)
        return jsonify({'prediction': float(prediction_final[0][0])})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(port=5000)