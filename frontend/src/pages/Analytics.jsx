import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line 
} from 'recharts';

const Analytics = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      name: name.length > (isMobile ? 10 : 15) ? name.substring(0, (isMobile ? 10 : 15)) + '...' : name,
      Price: Math.round(sum / prodPrices.length)
    };
  }).sort((a, b) => b.Price - a.Price).slice(0, 5); 

  return (
    <div style={{ backgroundColor: '#f4f6f7', minHeight: '100vh', padding: isMobile ? '20px 10px' : '40px 20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: isMobile ? '20px' : '40px' }}>
          <h1 style={{ color: '#2c3e50', fontSize: isMobile ? '2rem' : '2.5rem', marginBottom: '10px' }}>📊 Market Analytics</h1>
          <p style={{ color: '#7f8c8d', fontSize: isMobile ? '1rem' : '1.1rem' }}>Live insights and price trends across Sri Lanka.</p>
        </div>

        {prices.length === 0 ? (
           <div style={{ textAlign: 'center', color: '#7f8c8d', fontSize: '1.2rem', padding: '0 20px' }}>Not enough data to display charts yet. Add more prices!</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flexWrap: 'wrap', gap: isMobile ? '20px' : '30px' }}>
            
            <div style={{ ...chartCardStyle, padding: isMobile ? '20px 10px' : '30px' }}>
              <h3 style={{ textAlign: 'center', color: '#34495e', marginBottom: '20px', fontSize: isMobile ? '1.1rem' : '1.3rem' }}>Average Price by Category (Rs.)</h3>
              <div style={{ paddingBottom: isMobile ? '30px' : '0' }}>
                  <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                    <BarChart data={categoryData} margin={{ top: 5, right: isMobile ? 10 : 30, left: isMobile ? -20 : 20, bottom: isMobile ? 30 : 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecf0f1" />
                      <XAxis dataKey="name" tick={{fill: '#7f8c8d', fontSize: isMobile ? 10 : 12}} angle={isMobile ? -45 : 0} textAnchor={isMobile ? "end" : "middle"} axisLine={false} tickLine={false} />
                      <YAxis tick={{fill: '#7f8c8d', fontSize: isMobile ? 10 : 12}} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'}} />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: isMobile ? '20px' : '0' }} />
                      <Bar dataKey="AveragePrice" fill="#3498db" radius={[5, 5, 0, 0]} barSize={isMobile ? 30 : 40} />
                    </BarChart>
                  </ResponsiveContainer>
              </div>
            </div>

            <div style={{ ...chartCardStyle, padding: isMobile ? '20px 10px' : '30px' }}>
              <h3 style={{ textAlign: 'center', color: '#34495e', marginBottom: '20px', fontSize: isMobile ? '1.1rem' : '1.3rem' }}>Top 5 Most Expensive Items (Rs.)</h3>
               <div style={{ paddingBottom: isMobile ? '30px' : '0' }}>
                  <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                    <LineChart data={productData} margin={{ top: 5, right: isMobile ? 10 : 30, left: isMobile ? -20 : 20, bottom: isMobile ? 30 : 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecf0f1" />
                      <XAxis dataKey="name" tick={{fill: '#7f8c8d', fontSize: isMobile ? 10 : 12}} angle={isMobile ? -45 : 0} textAnchor={isMobile ? "end" : "middle"} axisLine={false} tickLine={false} />
                      <YAxis tick={{fill: '#7f8c8d', fontSize: isMobile ? 10 : 12}} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'}} />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: isMobile ? '20px' : '0' }}/>
                      <Line type="monotone" dataKey="Price" stroke="#e74c3c" strokeWidth={isMobile ? 3 : 4} activeDot={{ r: isMobile ? 6 : 8, fill: '#c0392b', stroke: 'white', strokeWidth: 2 }} dot={{ r: isMobile ? 4 : 5, fill: '#e74c3c', strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
              </div>
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
  borderRadius: '12px',
  boxShadow: '0 6px 15px rgba(0,0,0,0.05)',
  borderTop: '4px solid #f1c40f',
  boxSizing: 'border-box'
};

export default Analytics;