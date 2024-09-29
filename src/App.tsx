import { Routes, Route } from 'react-router-dom';
import BankingLoginForm from './components/Auth/Login'

function App() {
  return (
    <div>
      <Routes>
         {/* Public Route */}
        <Route path="/login" element={<BankingLoginForm />} />

        {/* Protected Route */}
        <Route path="/dashboard" element={<div />}/>

        {/* Catch all other routes */}
        <Route path="*" element={<div />} />
      </Routes>
    </div>
  )
}

export default App
