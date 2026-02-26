import React, { useEffect, useState } from 'react';
import type { Policy } from '../types';

const DebugPolicyPage = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/customer');
      const data = await response.json();
      setPolicies(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editForm) return;
    const { name, value, type } = e.target;
    setEditForm({
      ...editForm,
      [name]: type === 'number' ? parseFloat(value) : value
    });
  };

  const saveUpdate = async () => {
    if (!editForm) return;
    try {
      const response = await fetch('http://localhost:3000/updatedebug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (response.ok) {
        setEditingId(null);
        fetchData();
      }
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return <div className="p-10 text-center font-mono text-white bg-slate-900 h-screen">LOADING...</div>;

  return (
    <div className="p-4 bg-slate-900 min-h-screen text-slate-200 font-mono text-[10px]">
      <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
        <h1 className="text-lg font-bold text-blue-400 italic">DEBUG_DATABASE_OVERRIDE</h1>
        <button onClick={fetchData} className="bg-slate-800 hover:bg-slate-700 px-4 py-1 rounded border border-slate-600">REFRESH</button>
      </div>

      <div className="overflow-x-auto border border-slate-700">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800 text-slate-400 uppercase tracking-tighter">
              <th className="p-1 border border-slate-700">Identity</th>
              <th className="p-1 border border-slate-700">Car Details</th>
              <th className="p-1 border border-slate-700">Metrics</th>
              <th className="p-1 border border-slate-700">Premiums</th>
              <th className="p-1 border border-slate-700 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((p) => {
              const isEditing = editingId === p.id;
              const target = isEditing ? editForm! : p;

              return (
                <tr key={p.id} className={`border-b border-slate-800 ${isEditing ? 'bg-blue-900/20' : ''}`}>
                  {/* Identity */}
                  <td className="p-1 border border-slate-800">
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-500">{p.id}</span>
                      <input name="FirstName" disabled={!isEditing} value={target.FirstName} onChange={handleInputChange} className="bg-transparent border-none outline-none focus:bg-slate-800 w-full" />
                      <input name="LastName" disabled={!isEditing} value={target.LastName} onChange={handleInputChange} className="bg-transparent border-none outline-none focus:bg-slate-800 w-full" />
                      <input name="Address" disabled={!isEditing} value={target.Address} onChange={handleInputChange} className="bg-transparent border-none outline-none focus:bg-slate-800 w-full text-[9px]" />
                    </div>
                  </td>

                  {/* Car */}
                  <td className="p-1 border border-slate-800">
                    <div className="flex flex-col gap-1">
                      <input name="CarBrand" disabled={!isEditing} value={target.CarBrand} onChange={handleInputChange} className="bg-transparent border-none outline-none focus:bg-slate-800 w-full" />
                      <input name="CarModel" disabled={!isEditing} value={target.CarModel} onChange={handleInputChange} className="bg-transparent border-none outline-none focus:bg-slate-800 w-full" />
                      <input name="CarYear" type="number" disabled={!isEditing} value={target.CarYear} onChange={handleInputChange} className="bg-transparent border-none outline-none focus:bg-slate-800 w-full" />
                    </div>
                  </td>

                  {/* Metrics */}
                  <td className="p-1 border border-slate-800">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between"><span>Pol:</span> <input name="TotalPolicy" type="number" disabled={!isEditing} value={target.TotalPolicy} onChange={handleInputChange} className="bg-transparent border-none outline-none focus:bg-slate-800 w-12 text-right" /></div>
                      <div className="flex justify-between"><span>Clm:</span> <input name="TotalClaim" type="number" disabled={!isEditing} value={target.TotalClaim} onChange={handleInputChange} className="bg-transparent border-none outline-none focus:bg-slate-800 w-12 text-right" /></div>
                      <div className="flex justify-between text-yellow-500"><span>Rate:</span> <input name="ClaimRate" type="number" step="0.01" disabled={!isEditing} value={target.ClaimRate} onChange={handleInputChange} className="bg-transparent border-none outline-none focus:bg-slate-800 w-12 text-right" /></div>
                    </div>
                  </td>

                  {/* Premiums & Status */}
                  <td className="p-1 border border-slate-800">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between"><span>Base:</span> <input name="Premium" type="number" disabled={!isEditing} value={target.Premium} onChange={handleInputChange} className="bg-transparent border-none outline-none focus:bg-slate-800 w-16 text-right" /></div>
                      <div className="flex justify-between"><span>New:</span> <input name="newPremium" type="number" disabled={!isEditing} value={target.newPremium} onChange={handleInputChange} className="bg-transparent border-none outline-none focus:bg-slate-800 w-16 text-right" /></div>
                      <select name="Status" disabled={!isEditing} value={target.Status} onChange={handleInputChange} className="bg-transparent border-none outline-none focus:bg-slate-800 w-full appearance-none">
                        <option value="active">active</option>
                        <option value="expired">expired</option>
                      </select>
                    </div>
                  </td>

                  {/* Commands */}
                  <td className="p-1 border border-slate-800 text-center">
                    {isEditing ? (
                      <div className="flex flex-col gap-1">
                        <button onClick={saveUpdate} className="bg-green-700 text-white p-1">SAVE</button>
                        <button onClick={() => setEditingId(null)} className="bg-red-700 text-white p-1">CANCEL</button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditingId(p.id); setEditForm(p); }} className="text-blue-500 hover:underline">EDIT</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DebugPolicyPage;