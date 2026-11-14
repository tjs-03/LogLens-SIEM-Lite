import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ShieldAlert, Upload, Terminal, Skull, Activity } from 'lucide-react';

function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]); // Fixed single file select index reference
    }
  };

  // 1. REAL UPLOAD FUNCTION
  const handleUpload = async () => {
    if (!file) return alert("Pehle ek log file select karo bhai!");
    setLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setData(response.data);
    } catch (error) {
      alert("Backend connect nahi hua! Check karo python app.py chal raha hai.");
    } finally {
      setLoading(false);
    }
  };

  // 2. DEMO BUTTON FUNCTION
  const handleLoadDemo = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0');
      setData(response.data);
    } catch (error) {
      alert("Demo data load nahi ho paya! Check karo app.py active hai na?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0b0f19', color: '#f8fafc', minHeight: '100vh', padding: '30px', fontFamily: 'sans-serif' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '20px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <ShieldAlert size={40} color="#ef4444" />
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: 0 }}>LOGLENS AI <span style={{ fontSize: '12px', background: 'rgba(239,68,68,0.2)', color: '#f87171', padding: '3px 8px', borderRadius: '10px' }}>SOC v1.0</span></h1>
            <p style={{ margin: '5px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>Automated Log Parser & Security Dashboard</p>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        {/* Real File Upload Box */}
        <div style={{ background: '#111827', padding: '25px', borderRadius: '12px', border: '1px dashed #334155', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Scan Real Log File</h3>
          <input type="file" onChange={handleFileChange} style={{ color: '#94a3b8', fontSize: '13px' }} />
          <button onClick={handleUpload} disabled={loading} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginLeft: '10px' }}>
            <Upload size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} /> Run Security Scan
          </button>
        </div>

        {/* Demo Log Trigger Box */}
        <div style={{ background: '#111827', padding: '25px', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#60a5fa' }}>💡 Quick Evaluator Mode</h3>
          <p style={{ margin: '0 0 15px 0', color: '#94a3b8', fontSize: '13px', textAlign: 'center' }}>Bina koi file select kiye instant dashboard data test karein</p>
          <button onClick={handleLoadDemo} disabled={loading} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
            <Terminal size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Load Demo Log
          </button>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
          <p>Analyzing threat vectors and parsing stream data...</p>
        </div>
      )}

      {/* Main Interactive Monitoring Area */}
      {data && !loading && (
        <div>
          {/* Counters Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div style={{ background: '#111827', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #ef4444' }}>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>TOTAL THREAT INCIDENTS DETECTED</p>
              <h2 style={{ margin: '10px 0 0 0', fontSize: '36px', fontWeight: 'bold', fontFamily: 'monospace' }}>{data.total_attacks}</h2>
            </div>
            <div style={{ background: '#111827', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>UNIQUE ATTACKER SOURCE IPs</p>
              <h2 style={{ margin: '10px 0 0 0', fontSize: '36px', fontWeight: 'bold', fontFamily: 'monospace' }}>{Object.keys(data.summary).length}</h2>
            </div>
          </div>

          {/* Charts & Tables Container */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            {/* Recharts Attack Timeline */}
            <div style={{ background: '#111827', padding: '25px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={18} color="#ef4444"/> Attack Timeline (Status Tracking)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data.alerts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1e293b', color: '#fff' }} />
                  <Legend />
                  <Line type="monotone" dataKey="status" stroke="#ef4444" name="HTTP Status Vector" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Attackers Summary Table */}
            <div style={{ background: '#111827', padding: '25px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Skull size={18} color="#ef4444"/> Top Malicious Attackers</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #1e293b', color: '#64748b', fontSize: '12px' }}>
                    <th style={{ padding: '12px' }}>SOURCE IP ADDRESS</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>AGGRESSION COUNT</th>
                  </tr>
                </thead>
                <tbody style={{ fontFamily: 'monospace', fontSize: '14px', color: '#e2e8f0' }}>
                  {Object.entries(data.summary).map(([ip, count]) => (
                    <tr key={ip} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '5px', backgroundColor: '#ef4444' }}></span>{ip}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#f87171', fontWeight: 'bold' }}>{count} Incidents Blocked</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
