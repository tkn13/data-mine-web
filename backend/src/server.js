const express = require('express');
const app = express();
const cors = require('cors');
const CRUD = require('./utils/CRUD')

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MODEL_SERVICE_URL = process.env.MODEL_URL || 'http://localhost:5000';

app.get('/', async (req, res) => {
    res.send('<h1>Hello, Express.js Server!</h1>');
});

app.get('/car', async (req, res) => {
    res.json(await CRUD.read('car'));
});

app.get('/customer', async (req, res) => {
    res.json(await CRUD.read('customer'));
});

app.post('/compute', async (req, res) => {

    const cars = await CRUD.read('car')
    let selectedCar;

    cars.forEach((car) => {
        if (req.body.CarId == car.CarId) {
            selectedCar = car;
        }
    })

    const modelInput = {
        Driving_experience: req.body.DrivingExperience,
        Value_vehicle: selectedCar.ValueVehicle,
        Power: selectedCar.Power,
        Weight: selectedCar.Weight,
        Length_of_vehicle_usage: (new Date()).getFullYear() - selectedCar.CarYear,
        R_Claims_history: req.body.ClaimRate ? req.body.ClaimRate : 0,
        N_claims_history: req.body.TotalClaim ? req.body.TotalClaim : 0,
        Old: (new Date).getFullYear() - new Date(req.body.BirthDate).getFullYear(),
        Length: selectedCar.Length,
        Cylinder_capacity: selectedCar.CylinderCapacity,
        Policies_in_force: req.body.TotalPolicy ? req.body.TotalPolicy : 0
    }


    try {
        const response = await fetch(`${MODEL_SERVICE_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(modelInput),
        });

        const data = await response.json();

        
        const predVal = data.prediction;

        res.json({'model_predict': predVal});

    } catch (error) {
        console.error("Error fetching prediction:", error);
        res.json({'model_predict': -1})
    }
});

app.post('/commit', async (req, res) => {
    
    const cars = await CRUD.read('car')
    let selectedCar;

    cars.forEach((car) => {
        if (req.body.CarId == car.CarId) {
            selectedCar = car;
        }
    })
    
    const customerData = {
        id: req.body.id,
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        BirthDate: req.body.BirthDate,
        DrivingExperience: req.body.DrivingExperience,
        Address: req.body.Address,
        CarId: selectedCar.CarId,
        CarBrand: selectedCar.CarBrand,
        CarModel: selectedCar.CarModel,
        CarYear: selectedCar.CarYear,
        TotalPolicy: req.body.TotalPolicy,
        TotalClaim: req.body.TotalClaim,
        ClaimRate: req.body.ClaimRate,
        Premium: req.body.Premium,
        Status: 'active',
        CreatedAt: new Date()
    };

    await CRUD.create('customer', customerData);
    res.json({ 'status': 'ok' });
});

app.post('/update', async (req,res) => {

    const updateData = {
        Status: 'active',
        Premium: req.body.newPremium
    }
    await CRUD.update('customer', req.body.id, updateData);
    res.json({'status': 'ok'});
})

app.post('/updatedebug', async (req, res) => {
    const customerData = {
        id: req.body.id,
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        BirthDate: req.body.BirthDate,
        DrivingExperience: req.body.DrivingExperience,
        Address: req.body.Address,
        CarId: req.body.CarId,
        CarBrand: req.body.CarBrand,
        CarModel: req.body.CarModel,
        CarYear: req.body.CarYear,
        TotalPolicy: req.body.TotalPolicy,
        TotalClaim: req.body.TotalClaim,
        ClaimRate: req.body.ClaimRate,
        Premium: req.body.Premium,
        Status: req.body.Status
    };
    await CRUD.update('customer', req.body.id, customerData);
    res.json({'status': 'ok'});
   
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});