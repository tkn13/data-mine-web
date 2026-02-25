import {useState} from 'react'
import NewPolicyForm from "./components/NewPolicyForm"
import { Sidebar } from './components/Sidebar'
import CustomerDashboard from './components/CustomerDashboard';

function App() {

     const [activeTab, setActiveTab] = useState<'registration' | 'dashboard'>('registration');

    return(
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab}/>
            <main className='flex-1 ml-64 p-8'>
                {activeTab === 'registration' ?
                <NewPolicyForm />
                : <CustomerDashboard />}
            </main>
        </div>

    )
}

export default App