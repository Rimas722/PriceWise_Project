import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar' 
import Home from './pages/Home'
import PriceComparison from './pages/PriceComparison';

function App() {
  return (
    <div>
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prices" element={<PriceComparison />} />
      </Routes>
    </div>
  )
}

export default App