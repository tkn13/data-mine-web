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
    CarBrand: string,
    CarModel: string,
    CarYear: number
}

const Step1: React.FC<StepProps> = ({ data, updateData, onNext }) => {


    const { response } = useFetch<CarResponse[]>('http://localhost:3000/car');
    console.log(response)

    const [errors, setErrors] = useState<Record<string, string>>({});

    const calculateAge = (birthDate: Date) => {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    const validate = () => {
        const newErrors: Record<string, string> = {};

        // ID
        if (!data.id) {
            newErrors.id = "ID is require"
        }
        else if (!/^\d-\d{4}-\d{5}-\d{2}-\d$/.test(data.id)) {
            newErrors.id = "ID must be in the format 1-10xx-xxxxx-xx-x"
        }

        // FirstName
        if (!data.FirstName) {
            newErrors.FirstName = "First Name is require"
        }

        // LastName
        if (!data.LastName) {
            newErrors.LastName = "Last Name is require"
        }

        // BirthDate
        if (!data.BirthDate) {
            newErrors.BirthDate = "Birth Date is require"
        }
        else if (data.BirthDate instanceof Date && calculateAge(data.BirthDate) < 18) {
            newErrors.BirthDate = "You must be at least 18 years old"
        }

        // DrivingExperience
        if (data.DrivingExperience === undefined) {
            newErrors.DrivingExperience = "Driving Experience is require"
        }
        else if (data.DrivingExperience !== undefined && data.DrivingExperience < 0) {
            newErrors.DrivingExperience = "Driving Experience cannot be negative"
        }

        // Address
        if (!data.Address) {
            newErrors.Address = "Address is require"
        }

        // CarModel
        if (!data.CarModel) {
            newErrors.CarModel = "Car Model is require"
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const formatID = (value: string) => {
        const numbers = value.replace(/\D/g, '');

        const char = numbers.substring(0, 13);

        let formatted = "";
        if (char.length > 0) formatted += char.substring(0, 1);
        if (char.length > 1) formatted += "-" + char.substring(1, 5);
        if (char.length > 5) formatted += "-" + char.substring(5, 10);
        if (char.length > 10) formatted += "-" + char.substring(10, 12);
        if (char.length > 12) formatted += "-" + char.substring(12, 13);

        return formatted;
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
                        onChange={e => updateData({ id: formatID(e.target.value) })}
                        placeholder="1-10xx-xxxxx-xx-x"
                    />
                    {errors.id && <p className="text-xs text-red-500 mt-1">{errors.id}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">First name</label>
                    <input
                        type="text"
                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.name ? 'border-red-500' : 'border-slate-200'}`}
                        value={data.FirstName || ''}
                        onChange={e => updateData({ FirstName: e.target.value.trim() })}
                        placeholder="Enter your first name"
                    />
                    {errors.FirstName && <p className="text-xs text-red-500 mt-1">{errors.FirstName}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Last name</label>
                    <input
                        type="text"
                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.name ? 'border-red-500' : 'border-slate-200'}`}
                        value={data.LastName || ''}
                        onChange={e => updateData({ LastName: e.target.value.trim() })}
                        placeholder="Enter your last name"
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
                    <label className="block text-sm font-medium text-slate-700 mb-1">Driving Experience (years)</label>
                    <input
                        type="number"
                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.name ? 'border-red-500' : 'border-slate-200'}`}
                        value={(data.DrivingExperience === undefined) ? '' : data.DrivingExperience || 0}
                        min={0}
                        placeholder="e.g. 1"
                        onChange={e => updateData({ DrivingExperience: e.target.valueAsNumber })}
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
                        placeholder="Street, House No., City, Zip Code"
                    />
                    {errors.Address && <p className="text-xs text-red-500 mt-1">{errors.Address}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Car model</label>
                    <select
                        id="car-select"
                        className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500" // Added some styling
                        value={data.CarId || ''}
                        onChange={e => {
                            const selectedId = e.target.value;
                            // 1. Find the car object in your response array
                            const selectedCar = response?.find(car => car.CarId === selectedId);

                            if (selectedCar) {
                                // 2. Update all relevant fields at once
                                updateData({
                                    CarId: selectedCar.CarId,
                                    CarBrand: selectedCar.CarBrand,
                                    CarModel: selectedCar.CarModel,
                                    CarYear: selectedCar.CarYear
                                });
                            } else {
                                // Clear fields if the "Please choose" option is selected
                                updateData({ CarId: '', CarBrand: '', CarModel: '', CarYear: 0 });
                            }
                        }}
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

        // TotlPolicy
        if (data.TotalPolicy === undefined) {
            newErrors.TotalPolicy = "Total Policy in force is require"
        }
        else if (data.TotalPolicy !== undefined && data.TotalPolicy < 0) {
            newErrors.TotalPolicy = "Total Policy in force cannot be negative"
        }

        // TotalClaim
        if (data.TotalClaim === undefined) {
            newErrors.TotalClaim = "Total Policy Claim is require"
        }
        else if (data.TotalClaim !== undefined && data.TotalClaim < 0) {
            newErrors.TotalClaim = "Total Policy Claim cannot be negative"
        }

        // ClaimRate
        if (data.ClaimRate === undefined) {
            newErrors.ClaimRate = "Calim Rate is require"
        }
        else if (data.ClaimRate !== undefined && (data.ClaimRate < 0 || data.ClaimRate > 1)) {
            newErrors.ClaimRate = "Calim Rate must be between 0 and 1"
        }

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
                        value={(data.TotalPolicy === undefined) ? '' : data.TotalPolicy || 0}
                        min={0}
                        placeholder="e.g. 1"
                        onChange={e => updateData({ TotalPolicy: e.target.valueAsNumber })}
                    />
                    {errors.TotalPolicy && <p className="text-xs text-red-500 mt-1">{errors.TotalPolicy}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Total Policy Claim</label>
                    <input
                        type="number"
                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.TotalClaim ? 'border-red-500' : 'border-slate-200'}`}
                        value={(data.TotalClaim === undefined) ? '' : data.TotalClaim || 0}
                        placeholder="e.g. 1"
                        min={0}
                        onChange={e => updateData({ TotalClaim: e.target.valueAsNumber })}
                    />
                    {errors.TotalClaim && <p className="text-xs text-red-500 mt-1">{errors.TotalClaim}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Calim Rate</label>
                    <input
                        type="number"
                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.ClaimRate ? 'border-red-500' : 'border-slate-200'}`}
                        value={(data.ClaimRate === undefined) ? '' : data.ClaimRate || 0}
                        min={0}
                        step={0.1}
                        max={1}
                        placeholder="e.g. 0.5"
                        onChange={e => updateData({ ClaimRate: e.target.valueAsNumber })}
                    />
                    {errors.ClaimRate && <p className="text-xs text-red-500 mt-1">{errors.ClaimRate}</p>}
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">

                {/* Header: Focus on Premium */}
                <div className="bg-slate-50 p-6 border-b border-slate-100 text-center">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Premium</p>
                    <h2 className="text-4xl font-bold text-slate-900 mt-1">
                        ${data.Premium?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h2>
                    <div className="mt-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${data.Status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {data.Status}
                        </span>
                    </div>
                </div>

                {/* Content: The Details */}
                <div className="p-6 space-y-6">

                    {/* Section 1: Policy Holder */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Policy Holder</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-slate-500">Full Name</p>
                                <p className="font-medium">{data.FirstName} {data.LastName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Driving Experience</p>
                                <p className="font-medium">{data.DrivingExperience} Years</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Vehicle Information */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Vehicle Details</h3>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-lg font-semibold text-slate-800">{data.CarBrand} {data.CarModel}</p>
                                <p className="text-sm text-slate-500">Year: {data.CarYear} • ID: {data.CarId}</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Risk & History */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-t border-slate-100 pt-4">
                        <div className="text-center">
                            <p className="text-[10px] text-slate-500 uppercase">Claims</p>
                            <p className="font-bold text-slate-700">{data.TotalClaim}</p>
                        </div>
                        <div className="text-center border-x border-slate-100">
                            <p className="text-[10px] text-slate-500 uppercase">Claim Rate</p>
                            <p className="font-bold text-slate-700">{data.ClaimRate}%</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] text-slate-500 uppercase">Total Policies</p>
                            <p className="font-bold text-slate-700">{data.TotalPolicy}</p>
                        </div>
                    </div>
                </div>

                {/* Footer: Actions */}
                <div className="flex items-center gap-3 p-6 pt-0">
                    <button
                        className="flex-1 px-4 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                        onClick={() => setShowSummary(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="flex-2 px-4 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
                        onClick={onSend}
                    >
                        Confirm & Issue Policy
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