import { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { AlertTriangle, CheckCircle, TrendingDown, TrendingUp, Loader } from 'lucide-react';

export default function Performance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/performance', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const resData = await res.json();
          setData(resData);
        }
      } catch (err) {
        console.error("Failed to fetch performance", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Loader className="animate-spin text-primary" size={48} /></div>;

  const analysis = data?.analysis || { risk: "LOW", goodPoints: [], badPoints: [], suggestions: [] };
  const strengthData = data?.mastery || [];
  const progressData = data?.trend || [];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Performance Analysis</h1>
        <p style={{ color: 'var(--text-muted)' }}>Detailed breakdown of your academic strengths and areas for improvement. (Predicted Risk: <strong style={{ color: analysis.risk === 'HIGH' ? 'var(--danger)' : analysis.risk === 'MEDIUM' ? 'var(--warning)' : 'var(--success)' }}>{analysis.risk}</strong>)</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Radar Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem', height: '350px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem' }}>Subject Mastery (Radar)</h3>
          <div style={{ flex: 1, width: '100%', position: 'relative' }}>
            {strengthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" debounce={100}>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={strengthData}>
                  <PolarGrid stroke="var(--glass-border)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                  <Radar name="Student" dataKey="A" stroke="var(--secondary)" fill="var(--secondary)" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            ) : <p>No mastery data available</p>}
          </div>
        </div>

        {/* Progress Line Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem', height: '350px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem' }}>Overall Progress Trend</h3>
          <div style={{ flex: 1, width: '100%', position: 'relative' }}>
            {progressData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" debounce={100}>
                <LineChart data={progressData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                  <XAxis dataKey="month" stroke="var(--text-muted)" />
                  <YAxis domain={[50, 100]} stroke="var(--text-muted)" />
                  <Tooltip contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="score" stroke="var(--primary-light)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <p>No progress data available</p>}
          </div>
        </div>
      </div>

      {/* Detailed Analysis Section */}
      <h2 style={{ fontSize: '1.5rem', marginTop: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Detailed Analysis</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Good Points */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--success)' }}>
            <CheckCircle size={24} />
            <h3 style={{ margin: 0 }}>Strengths & Good Points</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)' }}>
            {analysis.goodPoints.length > 0 ? (
              analysis.goodPoints.map((point, index) => <li key={index}>• {point}</li>)
            ) : (
              <li>• Not enough data to determine strengths yet.</li>
            )}
          </ul>
        </div>

        {/* Bad Points */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--danger)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--danger)' }}>
            <AlertTriangle size={24} />
            <h3 style={{ margin: 0 }}>Areas for Improvement</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)' }}>
            {analysis.badPoints.length > 0 ? (
              analysis.badPoints.map((point, index) => <li key={index}>• {point}</li>)
            ) : (
              <li>• Excellent work, no major issues detected!</li>
            )}
          </ul>
        </div>

        {/* Suggestions / Interventions */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--secondary)', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--secondary)' }}>
            <TrendingUp size={24} />
            <h3 style={{ margin: 0 }}>Suggested Interventions & Study Plan</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Based on the analysis, here is what the system recommends:
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {analysis.suggestions.length > 0 ? (
              analysis.suggestions.map((sug, i) => <li key={i}>🧠 {sug}</li>)
            ) : (
              <li>Keep up the current momentum!</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
