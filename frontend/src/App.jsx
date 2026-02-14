import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar' 
import Home from './pages/Home'
import PriceComparison from './pages/PriceComparison';
import Login from './pages/Login';
import Register from './pages/Register';
import AddPrice from './pages/AddPrice';
import MyListings from './pages/MyListings';

function App() {
  return (
    <div>
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prices" element={<PriceComparison />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-price" element={<AddPrice />} />
        <Route path="/my-listings" element={<MyListings />} />
      </Routes>
    </div>
  )
}

export default App