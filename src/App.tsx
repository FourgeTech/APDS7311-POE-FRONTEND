import { Routes, Route } from 'react-router-dom';
import BankingLoginForm from './components/Auth/Login'
import Register from './components/Auth/Register'

function App() {
  return (
    <div>
      <Routes>
         {/* Public Route */}
        <Route path="/login" element={<BankingLoginForm />} />

        {/* Public Route */}
        <Route path="/register" element={<Register />} />

        {/* Protected Route */}
        <Route path="/dashboard" element={<div />}/>

        {/* Catch all other routes */}
        <Route path="*" element={<div />} />
      </Routes>
    </div>
  )
}

export default App
