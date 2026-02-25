import { useState } from "react";
import type { Policy } from "../types";
import { Edit2, RefreshCw, Search, Filter } from 'lucide-react';
import { useFetch } from "../hook/useFetch";

function CustomerDashboard() {

   const { response, isLoading } = useFetch<Policy[]>('http://localhost:3000/customer'); 


    const [searchTerm, setSearchTerm] = useState('');
    const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);

     const filteredPolicies = response?.filter(p => 
    p.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                                                <button
                                                    onClick={() => setEditingPolicy(policy)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Edit Policy"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                {policy.Status === "expired" && (
                                                    <button
                                                        onClick={()=>{}}
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

            {/* Edit Modal */}
            {editingPolicy && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">Edit Policy Details</h3>
                            <button onClick={() => setEditingPolicy(null)} className="text-slate-400 hover:text-slate-600">×</button>
                        </div>
                        <form onSubmit={()=>{}} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={editingPolicy.FirstName}
                                        onChange={e => setEditingPolicy({ ...editingPolicy, FirstName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Phone</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={editingPolicy.LastName}
                                        onChange={e => setEditingPolicy({ ...editingPolicy, LastName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setEditingPolicy(null)}
                                    className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-indigo-600 text-white font-medium hover:bg-indigo-700 rounded-lg transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

}

export default CustomerDashboard