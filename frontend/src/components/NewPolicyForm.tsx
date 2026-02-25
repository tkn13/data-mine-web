import { useState } from "react";
import type { Policy } from "../types"
import { useFetch } from "../hook/useFetch";

interface StepProps {
    data: Partial<Policy>;
    updateData: (fields: Partial<Policy>) => void;
    onNext: () => void;
    onBack?: () => void;
}

interface CarResponse {
    CarId: string,
    CarBrand: String,
    CarModel: String,
    CarYear: String
}

const Step1: React.FC<StepProps> = ({ data, updateData, onNext }) => {


    const { response } = useFetch<CarResponse[]>('http://localhost:3000/car');
    console.log(response)

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        // Implement here
        /*e.g 
        if (!data.FirstName) {
            newErrors.name = "First Name is require" 
        }
        */

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) onNext();
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Citizen id</label>
                    <input
                        type="text"
                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.name ? 'border-red-500' : 'border-slate-200'}`}
                        value={data.id || ''}
                        onChange={e => updateData({ id: e.target.value })}
                        placeholder="110-xxxxxx-xx"
                    />
                    {errors.id && <p className="text-xs text-red-500 mt-1">{errors.id}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">First name</label>
                    <input
                        type="text"
                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.name ? 'border-red-500' : 'border-slate-200'}`}
                        value={data.FirstName || ''}
                        onChange={e => updateData({ FirstName: e.target.value })}
                        placeholder="John Doe"
                    />
                    {errors.FirstName && <p className="text-xs text-red-500 mt-1">{errors.FirstName}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Last name</label>
                    <input
                        type="text"
                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.name ? 'border-red-500' : 'border-slate-200'}`}
                        value={data.LastName || ''}
                        onChange={e => updateData({ LastName: e.target.value })}
                        placeholder="John Doe"
                    />
                    {errors.LastName && <p className="text-xs text-red-500 mt-1">{errors.LastName}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Birth Date</label>
                    <input
                        type="date"
                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.name ? 'border-red-500' : 'border-slate-200'}`}
                        value={data.BirthDate instanceof Date
                            ? data.BirthDate.toISOString().split('T')[0]
                            : data.BirthDate || ''}
                        onChange={e => updateData({ BirthDate: e.target.valueAsDate ?? undefined })}
                    />
                    {errors.BirthDate && <p className="text-xs text-red-500 mt-1">{errors.BirthDate}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Driving Experience</label>
                    <input
                        type="number"
                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.name ? 'border-red-500' : 'border-slate-200'}`}
                        value={data.DrivingExperience || ''}
                        onChange={e => updateData({ DrivingExperience: e.target.valueAsNumber })}
                        placeholder="0"
                    />
                    {errors.DrivingExperience && <p className="text-xs text-red-500 mt-1">{errors.DrivingExperience}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                    <input
                        type="text"
                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.name ? 'border-red-500' : 'border-slate-200'}`}
                        value={data.Address || ''}
                        onChange={e => updateData({ Address: e.target.value })}
                        placeholder="0"
                    />
                    {errors.Address && <p className="text-xs text-red-500 mt-1">{errors.Address}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Car model</label>
                    <select
                        id="car-select"
                        value={data.CarId || ''}
                        onChange={e => updateData({ CarId: e.target.value })}
                    >
                        <option value="">--Please choose an option--</option>
                        {response?.map((car, index) => (
                            <option key={index} value={car.CarId}>
                                {car.CarYear} {car.CarBrand} {car.CarModel}
                            </option>
                        ))}
                    </select>
                    {errors.CarModel && <p className="text-xs text-red-500 mt-1">{errors.CarModel}</p>}
                </div>
            </div>
            <div className="flex justify-end pt-4">
                <button
                    onClick={handleNext}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                    Next Step
                </button>
            </div>
        </div>
    );
}

const Step2: React.FC<StepProps> = ({ data, updateData, onNext, onBack }) => {

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        // Implement here
        /*e.g 
        if (!data.FirstName) {
            newErrors.name = "First Name is require" 
        }
        */


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendData = () => {
        if (validate()) onNext();
    };


    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Total Policy in force</label>
                    <input
                        type="number"
                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.name ? 'border-red-500' : 'border-slate-200'}`}
                        value={data.TotalPolicy || 0}
                        onChange={e => updateData({ TotalPolicy: e.target.valueAsNumber })}
                        placeholder="0"
                    />
                    {errors.TotalPolicy && <p className="text-xs text-red-500 mt-1">{errors.TotalPolicy}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Total Policy Claim</label>
                    <input
                        type="number"
                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.TotalClaim ? 'border-red-500' : 'border-slate-200'}`}
                        value={data.TotalClaim || 0}
                        onChange={e => updateData({ TotalClaim: e.target.valueAsNumber })}
                        placeholder="0"
                    />
                    {errors.TotalClaim && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Calim Rate</label>
                    <input
                        type="number"
                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.ClaimRate ? 'border-red-500' : 'border-slate-200'}`}
                        value={data.ClaimRate || 0}
                        onChange={e => updateData({ ClaimRate: e.target.valueAsNumber })}
                        placeholder="0"
                    />
                    {errors.ClaimRate && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

            </div>
            <div className="flex justify-between pt-4">
                <button
                    onClick={onBack}
                    className="text-slate-600 px-6 py-2 rounded-lg font-medium hover:bg-slate-100 transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={handleSendData}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                    Calculate Premium
                </button>
            </div>
        </div>
    );
};

interface SummaryModelProps {
    data: Partial<Policy>;
    setShowSummary: React.Dispatch<React.SetStateAction<boolean>>;
    onSend: () => void;
}

const SummaryModel: React.FC<SummaryModelProps> = ({ data, setShowSummary, onSend }) => {

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8">
                <div>
                    {data.Premium}
                </div>
                <div className="flex gap-1">
                    <button
                        className="mt-4 block bg-red-500 text-white px-4 py-2"
                        onClick={() => setShowSummary(false)}>
                        <p>Close</p>
                    </button>
                    <button
                        className="mt-4 block bg-green-500 text-white px-4 py-2"
                        onClick={onSend}>
                        <p>Confirm</p>
                    </button>

                </div>
            </div>
        </div>
    )
}

function NewPolicyForm() {

    const [formData, setFormData] = useState<Partial<Policy>>({});
    const [step, setStep] = useState(1);
    const [showSummary, setShowSummary] = useState(false);

    const updateData = (fields: Partial<Policy>) => {
        setFormData(prev => ({ ...prev, ...fields }));
    };

    const handleSendData = async () => {

        try {
            const response = await fetch('http://localhost:3000/compute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const result = await response.json();
            updateData({ Premium: result.model_predict })
            setShowSummary(true)
        } catch (error) {
            console.error("Error sending data:", error);
        } finally {

        }
    }

    const handleCommitData = async () => {
        try {
            const response = await fetch('http://localhost:3000/commit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Network response was not ok');

            setShowSummary(false)
            setFormData({})
        } catch (error) {
            console.error("Error sending data:", error);
        } finally {

        }
    }

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Create New Policy</h2>
            {step === 1 && (
                <Step1
                    data={formData}
                    updateData={updateData}
                    onNext={() => setStep(2)}
                />
            )}
            {step === 2 && (
                <Step2
                    data={formData}
                    updateData={updateData}
                    onBack={() => setStep(1)}
                    onNext={handleSendData}
                />
            )}

            <div>
                {showSummary && (
                    <SummaryModel
                        data={formData}
                        setShowSummary={setShowSummary}
                        onSend={handleCommitData}
                    />
                )}
            </div>

        </div>
    );
}

export default NewPolicyForm