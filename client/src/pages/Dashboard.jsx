import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import { getDashboard } from '../api';

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const result = await getDashboard();
      setData({
        ...result,
        byStatus: result.byStatus.map((row) => ({
          status: row.status,
          count: Number(row.count),
        })),
        byMonth: result.byMonth.map((row) => ({
          month: row.month,
          earnings: Number(row.earnings),
        })),
      });
    }
    load();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Dashboard</h2>

     <div className="cards">
  <div className="card">
    <p>Total clients</p>
    <strong>{data.clients}</strong>
  </div>
  <div className="card">
    <p>Total projects</p>
    <strong>{data.projects}</strong>
  </div>
  <div className="card">
    <p>Earnings (completed projects)</p>
    <strong>{data.totalEarnings.toFixed(2)}</strong>
  </div>
</div>

      <h3>Projects by status</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data.byStatus}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#2980b9" />
        </BarChart>
      </ResponsiveContainer>

      <h3>Earnings over time</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data.byMonth}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="earnings" stroke="#27ae60" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Dashboard;