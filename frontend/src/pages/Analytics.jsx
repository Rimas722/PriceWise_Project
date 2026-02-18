import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/prices/analytics');
        const formattedData = data.map(item => ({
          name: item._id,
          Average: Math.round(item.averagePrice),
          Lowest: item.minPrice,
          Highest: item.maxPrice
        }));
        setData(formattedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>📊 Market Insights</h1>
      
      <div style={{ height: '400px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
        <h3 style={{ textAlign: 'center' }}>Price Variation (Low vs High vs Avg)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Lowest" fill="#82ca9d" name="Lowest Price (LKR)" />
            <Bar dataKey="Average" fill="#8884d8" name="Average Price (LKR)" />
            <Bar dataKey="Highest" fill="#ff7300" name="Highest Price (LKR)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <p>This chart helps you spot which products have the biggest price differences.</p>
      </div>
    </div>
  );
};

export default Analytics;