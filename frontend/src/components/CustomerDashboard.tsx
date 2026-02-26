import { useState } from "react";
import type { Policy } from "../types";
import { RefreshCw, Search, Filter } from 'lucide-react';
import { useFetch } from "../hook/useFetch";

function CustomerDashboard() {

    const [refreshKey, setRefreshKey] = useState(0);
    const { response, isLoading } = useFetch<Policy[]>(`http://localhost:3000/customer?reload=${refreshKey}`);
    const forceReload = () => setRefreshKey(old => old+1)

    const [searchTerm, setSearchTerm] = useState('');
    const [renewPolicy, setRenewPolicy] = useState<Policy | null>(null);
    const [isModelLoading, setIsModelLoading] = useState(false);

    const filteredPolicies = response?.filter(p =>
        p.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSendData = async (data: Policy) => {

        setRenewPolicy(data);
        setIsModelLoading(true);

        console.log("data from table", data)

        try {
            const response = await fetch('http://localhost:3000/compute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const result = await response.json();
            data.newPremium = result.model_predict
        } catch (error) {
            console.error("Error sending data:", error);
        } finally {
            setIsModelLoading(false);
        }
    }

    const handleRenewData = async () => {
        try {
            const response = await fetch('http://localhost:3000/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(renewPolicy)
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error("Error sending data:", error);
        } finally {
            setRenewPolicy(null);
            forceReload();
        } 
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Customer Dashboard</h1>
                    <p className="text-slate-500">Manage and track all active and expired insurance policies.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search name or plate..."
                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-64"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        <Filter className="w-5 h-5 text-slate-600" />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Vehicle</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Expiry Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Premium</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">Loading policies...</td>
                                </tr>
                            ) : filteredPolicies?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">No policies found.</td>
                                </tr>
                            ) : (
                                filteredPolicies?.map(policy => (
                                    <tr key={policy.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-sm text-slate-700">
                                            {policy.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{policy.FirstName}</div>
                                            <div className="text-xs text-slate-500">{policy.LastName}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {policy.CarBrand} {policy.CarModel}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {new Date(policy.BirthDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <p>${policy.Premium}</p>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {policy.Status === "expired" && (
                                                    <button
                                                        onClick={() => { handleSendData(policy) }}
                                                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1"
                                                        title="Renew Policy"
                                                    >
                                                        <RefreshCw className="w-4 h-4" />
                                                        <span className="text-xs font-bold">Renew</span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* renew Modal */}
            {renewPolicy && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden min-h-400px flex flex-col transition-all">

                        {isModelLoading ? (
                            /* --- LOADING STATE --- */
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                                <div className="relative mb-6">
                                    {/* Elegant Spinning Ring */}
                                    <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">Recalculating Premium</h3>
                                <p className="text-sm text-slate-500 mt-2 max-w-240px">
                                    We're analyzing recent claim data and car valuation...
                                </p>
                            </div>
                        ) : (
                            /* --- RENEWAL DETAIL STATE --- */
                            <>
                                {/* Header */}
                                {/* Header: Premium Comparison */}
                                <div className="bg-indigo-50 p-6 border-b border-indigo-100 text-center animate-in fade-in slide-in-from-top-4 duration-500">
                                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">New Premium Rate</p>

                                    <div className="flex flex-col items-center justify-center">
                                        {/* Large New Premium */}
                                        <h2 className="text-4xl font-extrabold text-slate-900 leading-none">
                                            ${renewPolicy.newPremium.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </h2>

                                        {/* Comparison Logic */}
                                        <div className="flex items-center gap-2 mt-3">
                                            <span className="text-xs text-slate-400 line-through font-medium">
                                                Was ${renewPolicy.Premium.toLocaleString()}
                                            </span>

                                            {(() => {
                                                const diff = renewPolicy.newPremium - renewPolicy.Premium;
                                                const percent = ((diff / renewPolicy.Premium) * 100).toFixed(1);
                                                const isUp = diff > 0;

                                                if (diff === 0) return <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 bg-slate-100 rounded">NO CHANGE</span>;

                                                return (
                                                    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${isUp ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                                                        }`}>
                                                        {isUp ? '↑' : '↓'} {Math.abs(Number(percent))}%
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xs font-bold text-slate-400 uppercase">Policy Holder</h3>
                                            <p className="text-lg font-semibold text-slate-800">{renewPolicy.FirstName} {renewPolicy.LastName}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${renewPolicy.Status === 'expired' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                            {renewPolicy.Status.toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center gap-4">
                                        <div className="text-2xl">🚗</div>
                                        <div>
                                            <p className="font-bold text-slate-800">{renewPolicy.CarBrand} {renewPolicy.CarModel}</p>
                                            <p className="text-xs text-slate-500">Year: {renewPolicy.CarYear}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 rounded-lg border border-slate-100">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Claim Rate</p>
                                            <p className="text-lg font-bold text-slate-700">{renewPolicy.ClaimRate}%</p>
                                        </div>
                                        <div className="p-3 rounded-lg border border-slate-100">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Total Claims</p>
                                            <p className="text-lg font-bold text-slate-700">{renewPolicy.TotalClaim}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center gap-3 p-6 bg-slate-50/50">
                                    <button
                                        className="flex-1 px-4 py-3 rounded-xl font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                                        onClick={() => setRenewPolicy(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="flex-2 px-4 py-3 rounded-xl font-semibold text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-[0.98]"
                                        onClick={() => { handleRenewData()}}
                                    >
                                        Confirm Renew
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

        </div>
    );

}

export default CustomerDashboard