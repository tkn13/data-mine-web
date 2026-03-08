from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)
CORS(app)

# 1. โหลด Model และ Transformers ทั้งหมดที่ใช้ใน Notebook
model = joblib.load('lightgbm_model.joblib')
yeo_y = joblib.load('yeo_y.joblib')

# โหลดตัวแปลงของแต่ละ Feature (ตามที่คุณทำแยกไว้ใน Cell 21-31)
transformers = {
    'Value_vehicle': joblib.load('yeo_value_vehicle.joblib'),
    'R_Claims_history': joblib.load('yeo_R_Claims_history.joblib'),
    'Power': joblib.load('yeo_Power.joblib'),
    'Cylinder_capacity': joblib.load('yeo_Cylinder_capacity.joblib'),
    'N_claims_history': joblib.load('yeo_N_claims_history.joblib'),
    'Policies_in_force': joblib.load('yeo_Policies_in_force.joblib')
}

# ลำดับ Features ที่ใช้เทรน (ต้องตรงกับ X_train_final.columns)
FEATURE_ORDER = [
    'Driving_experience', 'Value_vehicle', 'Power', 'Weight',
    'Length_of_vehicle_usage', 'R_Claims_history', 'N_claims_history',
    'Old', 'Length', 'Cylinder_capacity', 'Policies_in_force'
]

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    try:
        # 2. จัดรูปแบบข้อมูลเป็น DataFrame
        input_df = pd.DataFrame([{col: float(data.get(col, 0)) for col in FEATURE_ORDER}])
        
        # 3. ทำ Feature Transformation (เฉพาะตัวที่คุณทำ Yeo-Johnson ไว้)
        for col, transformer in transformers.items():
            if col in input_df.columns:
                # แปลงค่า X ของคอลัมน์นั้นๆ
                input_df[col] = transformer.transform(input_df[[col]])                

        # 4. Predict (จะได้ค่าที่ยังเป็น Yeo-Johnson scale)
        pred_scaled = model.predict(input_df)
        
        # 5. Inverse Transform Y (แปลงจากเลขน้อยๆ กลับเป็นค่าพรีเมียมจริง)
        pred_final = yeo_y.inverse_transform(pred_scaled.reshape(-1, 1))
        
        return jsonify({
            'prediction': round(float(pred_final[0][0]), 2),
            'status': 'success'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)