import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    axios.get('http://localhost:5000/')
      .then(response => setMessage(response.data))
      .catch(error => setMessage('Error connecting to backend: ' + error.message))
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>PriceWise Setup</h1>
      <hr />
      <h2>Backend Status: {message ? <span style={{color: 'green'}}>{message}</span> : 'Loading...'}</h2>
    </div>
  )
}

export default App