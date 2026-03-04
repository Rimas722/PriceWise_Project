import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line 
} from 'recharts';

const Analytics = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const { data } = await axios.get('https://pricewise-project.onrender.com/api/prices');
        const approvedPrices = data.filter(p => p.status === 'approved' && p.product);
        setPrices(approvedPrices);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics data', error);
        setLoading(false);
      }
    };
    fetchPrices();
  }, []);

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px', fontSize: '1.2rem'}}>⏳ Loading Market Trends...</div>;

  const categoryData = [];
  const categories = [...new Set(prices.map(p => p.product.category))]; 
  
  categories.forEach(category => {
    const categoryPrices = prices.filter(p => p.product.category === category);
    if (categoryPrices.length > 0) {
      const sum = categoryPrices.reduce((acc, curr) => acc + curr.price, 0);
      const avg = sum / categoryPrices.length;
      categoryData.push({
        name: category,
        AveragePrice: Math.round(avg)
      });
    }
  });

  const productNames = [...new Set(prices.map(p => p.product.name))];
  const productData = productNames.map(name => {
    const prodPrices = prices.filter(p => p.product.name === name);
    const sum = prodPrices.reduce((acc, curr) => acc + curr.price, 0);
    return {
      name: name.length > 15 ? name.substring(0, 15) + '...' : name,
      Price: Math.round(sum / prodPrices.length)
    };
  }).sort((a, b) => b.Price - a.Price).slice(0, 5); 

  return (
    <div style={{ backgroundColor: '#f4f6f7', minHeight: '100vh', padding: '40px 20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#2c3e50', fontSize: '2.5rem', marginBottom: '10px' }}>📊 Market Analytics</h1>
          <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>Live insights and price trends across Sri Lanka.</p>
        </div>

        {prices.length === 0 ? (
           <div style={{ textAlign: 'center', color: '#7f8c8d', fontSize: '1.2rem' }}>Not enough data to display charts yet. Add more prices!</div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
            
            <div style={chartCardStyle}>
              <h3 style={{ textAlign: 'center', color: '#34495e', marginBottom: '20px' }}>Average Price by Category (Rs.)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecf0f1" />
                  <XAxis dataKey="name" tick={{fill: '#7f8c8d'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fill: '#7f8c8d'}} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'}} />
                  <Legend iconType="circle" />
                  <Bar dataKey="AveragePrice" fill="#3498db" radius={[5, 5, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={chartCardStyle}>
              <h3 style={{ textAlign: 'center', color: '#34495e', marginBottom: '20px' }}>Top 5 Most Expensive Items (Rs.)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={productData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecf0f1" />
                  <XAxis dataKey="name" tick={{fill: '#7f8c8d', fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fill: '#7f8c8d'}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'}} />
                  <Legend iconType="circle" />
                  <Line type="monotone" dataKey="Price" stroke="#e74c3c" strokeWidth={4} activeDot={{ r: 8, fill: '#c0392b', stroke: 'white', strokeWidth: 2 }} dot={{ r: 5, fill: '#e74c3c', strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

const chartCardStyle = {
  flex: '1 1 500px', 
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '12px',
  boxShadow: '0 6px 15px rgba(0,0,0,0.05)',
  borderTop: '4px solid #f1c40f'
};

export default Analytics;