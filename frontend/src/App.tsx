import { useState } from 'react'
import { Routes, Route } from 'react-router-dom' // Add this
import NewPolicyForm from "./components/NewPolicyForm"
import { Sidebar } from './components/Sidebar'
import CustomerDashboard from './components/CustomerDashboard';
import DebugPolicyPage from './components/Debug';

function App() {
  const [activeTab, setActiveTab] = useState<'registration' | 'dashboard'>('registration');

  return (
    <Routes>
      {/* 1. The Debug Path - Full screen or custom layout */}
      <Route path="/debug" element={<DebugPolicyPage />} />

      {/* 2. Your Existing App Layout */}
      <Route 
        path="/" 
        element={
          <div className="min-h-screen bg-slate-50 flex">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab}/>
            <main className='flex-1 ml-64 p-8'>
              {activeTab === 'registration' ? 
                <NewPolicyForm /> : 
                <CustomerDashboard />
              }
            </main>
          </div>
        } 
      />
    </Routes>
  )
}

export default App