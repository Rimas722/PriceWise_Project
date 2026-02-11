import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar' 
import Home from './pages/Home'
import PriceComparison from './pages/PriceComparison';
import Login from './pages/Login';

function App() {
  return (
    <div>
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prices" element={<PriceComparison />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App