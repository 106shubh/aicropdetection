'use client';

import React, { useState } from 'react';
import styles from './dashboard.module.css';
import { Button } from '@/components/ui/button/Button';
import { 
  LayoutDashboard, Map, Scan, BrainCircuit, Bell, Settings, 
  TrendingUp, TrendingDown, CloudRain, ShieldAlert, Activity, Bug, Thermometer
} from 'lucide-react';
import Link from 'next/link';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const diseaseData = [
  { name: 'Mon', risk: 20, rain: 5 },
  { name: 'Tue', risk: 25, rain: 10 },
  { name: 'Wed', risk: 35, rain: 40 },
  { name: 'Thu', risk: 65, rain: 80 }, // Rain spikes, risk spikes
  { name: 'Fri', risk: 80, rain: 20 },
  { name: 'Sat', risk: 85, rain: 5 },
  { name: 'Sun', risk: 60, rain: 0 },
];

const radarData = [
  { subject: 'Leaf Rust', A: 80, fullMark: 100 },
  { subject: 'Blight', A: 45, fullMark: 100 },
  { subject: 'Fall Armyworm', A: 90, fullMark: 100 },
  { subject: 'Locust', A: 20, fullMark: 100 },
  { subject: 'Aphids', A: 60, fullMark: 100 },
];

export default function Dashboard() {
  const [mode, setMode] = useState<'farmer' | 'gov'>('farmer');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  
  // Dynamic Real-time Data
  const [liveWeather, setLiveWeather] = useState({ temp: 25, humidity: 60, rain: 0 });
  const [pestThreat, setPestThreat] = useState('Scanning...');
  const [cropHealth, setCropHealth] = useState(82);
  const [riskLevel, setRiskLevel] = useState('Medium');

  const [recentScans, setRecentScans] = useState<any[]>([]);

  useEffect(() => {
    // Load Real Recent Scans History
    const savedScans = JSON.parse(localStorage.getItem('recentScans') || '[]');
    if (savedScans.length > 0) {
      setRecentScans(savedScans);
    } else {
      // Fallback dummy data if they haven't scanned anything yet
      setRecentScans([
        { date: 'Today, 10:45 AM', crop: 'Tomato Leaf', diagnosis: 'Early Blight', confidence: '97.5%', status: 'Action Needed' },
        { date: 'Yesterday, 4:20 PM', crop: 'Wheat', diagnosis: 'Healthy', confidence: '99.1%', status: 'Healthy' }
      ]);
    }

    // Fetch real weather for Nashik
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=19.9975&longitude=73.7898&current=temperature_2m,relative_humidity_2m,precipitation&timezone=auto');
        const data = await res.json();
        
        const temp = data.current.temperature_2m;
        const humidity = data.current.relative_humidity_2m;
        const rain = data.current.precipitation || 0;
        
        setLiveWeather({ temp, humidity, rain });

        // Dynamic intelligence based on REAL weather
        if (rain > 5 || humidity > 80) {
          setRiskLevel('High');
          setPestThreat('Fungal Blight Risk');
          setCropHealth(68);
        } else if (temp > 35) {
          setRiskLevel('High');
          setPestThreat('Locust Swarm Alert');
          setCropHealth(72);
        } else if (humidity > 60) {
          setRiskLevel('Medium');
          setPestThreat('Fall Armyworm');
          setCropHealth(85);
        } else {
          setRiskLevel('Low');
          setPestThreat('No Immediate Threat');
          setCropHealth(94);
        }
      } catch (err) {
        console.error('Weather fetch error', err);
      }
    };
    fetchWeather();
  }, []);

  return (
    <div className={styles.dashboardLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" style={{textDecoration:'none'}}>
            <div className={styles.logo}>
              <span className={styles.logoText}>KrishiRakshak</span>
            </div>
          </Link>
        </div>
        
        <div className={styles.modeToggle}>
          <button 
            className={`${styles.toggleBtn} ${mode === 'farmer' ? styles.active : ''}`}
            onClick={() => setMode('farmer')}
          >
            Farmer Mode
          </button>
          <button 
            className={`${styles.toggleBtn} ${mode === 'gov' ? styles.active : ''}`}
            onClick={() => setMode('gov')}
          >
            Gov Mode
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          <div className={`${styles.navItem} ${styles.active}`}>
            <LayoutDashboard size={20} />
            <span>Command Center</span>
          </div>
          <Link href="/scan" style={{textDecoration:'none'}}>
            <div className={styles.navItem}>
              <Scan size={20} />
              <span>Crop Scan</span>
            </div>
          </Link>
          <Link href="/map" style={{textDecoration:'none'}}>
            <div className={styles.navItem}>
              <Map size={20} />
              <span>Risk Map</span>
            </div>
          </Link>
          <Link href="/doctor" style={{textDecoration:'none'}}>
            <div className={styles.navItem}>
              <BrainCircuit size={20} />
              <span>AI Doctor</span>
            </div>
          </Link>
          <div className={styles.navItem} onClick={() => setIsAlertsOpen(true)}>
            <Bell size={20} />
            <span>Alerts</span>
            {riskLevel === 'High' && <div style={{width: 8, height: 8, borderRadius: '50%', background: 'red', marginLeft: 'auto', animation: 'pulse 1s infinite'}} />}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>
              {mode === 'farmer' ? 'My Farm Intelligence' : 'District Intelligence Overview'}
            </h1>
            <p className={styles.pageSubtitle}>
              {mode === 'farmer' ? 'Real-time health and risk assessment for your registered plots.' : 'Macro-level analytics for Maharashtra State agricultural defense.'}
            </p>
          </div>
          <Button variant="primary" icon={<Settings size={16} />} onClick={() => setIsSettingsOpen(true)}>Settings</Button>
        </header>

        {/* SETTINGS MODAL */}
        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
                backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', 
                alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
              }}
              onClick={() => setIsSettingsOpen(false)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                style={{
                  background: 'white', borderRadius: '24px', padding: '2rem', width: '90%', 
                  maxWidth: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative'
                }}
                onClick={e => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.5rem', color: '#1a1a1a', fontFamily: 'var(--font-outfit)' }}>System Settings</h2>
                  <button onClick={() => setIsSettingsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>✕</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Language Settings */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#444' }}>Interface Language</label>
                    <select style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' }}>
                      <option value="en">English</option>
                      <option value="hi">हिंदी (Hindi)</option>
                      <option value="mr">मराठी (Marathi)</option>
                    </select>
                  </div>

                  {/* Notification Toggles */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 500, color: '#444' }}>Alert Preferences</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--color-muted-green)' }} />
                        <span>SMS Weather Warnings</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--color-muted-green)' }} />
                        <span>WhatsApp AI Protocols</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: 'var(--color-muted-green)' }} />
                        <span>Government Subsidy Alerts</span>
                      </label>
                    </div>
                  </div>

                  {/* Region */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#444' }}>Primary Farm Region</label>
                    <input type="text" defaultValue="Nashik, Maharashtra" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <Button variant="secondary" onClick={() => setIsSettingsOpen(false)}>Cancel</Button>
                  <Button variant="primary" onClick={() => {
                    setIsSettingsOpen(false);
                    // Could add a toast here, but simple closing is fine for mockup
                  }}>Save Preferences</Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ALERTS SLIDE-OVER */}
        <AnimatePresence>
          {isAlertsOpen && (
            <>
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsAlertsOpen(false)}
                style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 9998, backdropFilter: 'blur(2px)' }}
              />
              {/* Panel */}
              <motion.div
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                style={{ position: 'fixed', top: 0, right: 0, height: '100vh', width: '400px', maxWidth: '100vw', backgroundColor: 'white', zIndex: 9999, boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-outfit)' }}>
                    <Bell size={20} /> Priority Alerts
                  </h2>
                  <button onClick={() => setIsAlertsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#666' }}>✕</button>
                </div>
                
                <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {riskLevel === 'High' && (
                    <div style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: '12px', padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-red)', fontWeight: 600, marginBottom: '0.5rem' }}>
                        <ShieldAlert size={18} /> CRITICAL WARNING
                      </div>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#444' }}>Our models predict a high risk of <b>{pestThreat}</b> in your region within the next 48 hours due to current humidity ({liveWeather.humidity}%). Apply fungicide immediately.</p>
                      <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: '#888' }}>Just Now • Automated AI Alert</p>
                    </div>
                  )}

                  <div style={{ background: 'rgba(243,156,18,0.1)', border: '1px solid rgba(243,156,18,0.3)', borderRadius: '12px', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-amber)', fontWeight: 600, marginBottom: '0.5rem' }}>
                      <CloudRain size={18} /> Weather Advisory
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#444' }}>Current rainfall is {liveWeather.rain}mm. Adjust your irrigation schedule via the AI Yield Predictor to prevent waterlogging.</p>
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: '#888' }}>2 hours ago • Local Station</p>
                  </div>
                  
                  <div style={{ background: '#f8f9fa', border: '1px solid #eee', borderRadius: '12px', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#555', fontWeight: 600, marginBottom: '0.5rem' }}>
                      <Activity size={18} /> System Scan Complete
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#444' }}>Your most recent crop scan for '{recentScans[0]?.crop || 'Wheat'}' was logged successfully.</p>
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: '#888' }}>{recentScans[0]?.date || 'Earlier'} • System</p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {mode === 'farmer' ? (
          /* FARMER MODE DASHBOARD */
          <>
            <div className={styles.actionCenter} style={{
              background: riskLevel === 'High' ? 'rgba(231, 76, 60, 0.1)' : riskLevel === 'Medium' ? 'rgba(243, 156, 18, 0.1)' : 'rgba(46, 204, 113, 0.1)',
              borderLeft: `4px solid ${riskLevel === 'High' ? 'var(--color-red)' : riskLevel === 'Medium' ? 'var(--color-amber)' : 'var(--color-muted-green)'}`
            }}>
              <div className={styles.actionText}>
                <h3>{riskLevel === 'Low' ? 'All Clear' : 'Action Required'}</h3>
                <p>
                  {riskLevel === 'High' 
                    ? `Critical risk of ${pestThreat}. Immediate action required.` 
                    : riskLevel === 'Medium' 
                    ? `Monitoring ${pestThreat} conditions. Current humidity is ${liveWeather.humidity}%.` 
                    : `Your farm conditions are stable. No imminent pest or disease threats detected.`}
                </p>
              </div>
              <div className={styles.actionButtons}>
                <Button variant="accent" icon={<Scan size={16} />} onClick={() => window.location.href = '/scan'}>Scan Leaves Now</Button>
              </div>
            </div>

            {/* INTERACTIVE SMART SPRAYING SCHEDULER */}
            <div className={styles.yieldPredictorContainer} style={{ background: '#fff', borderRadius: '24px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-outfit)', fontSize: '1.4rem' }}>Smart Treatment Scheduler (Open-Meteo AI)</h3>
                <span style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--color-muted-green)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>Real-time Risk Engine</span>
              </div>
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2rem' }}>Select a day to schedule pesticide or fungicide spraying. Our AI evaluates wash-off risk and wind drift based on live weather data.</p>
              
              <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                {[
                  { day: 'Today', temp: 28, rain: 0, wind: 12, safe: true },
                  { day: 'Tomorrow', temp: 26, rain: 80, wind: 18, safe: false, reason: 'High Wash-off Risk (Rain)' },
                  { day: 'Wed', temp: 29, rain: 10, wind: 35, safe: false, reason: 'High Drift Risk (Wind)' },
                  { day: 'Thu', temp: 31, rain: 0, wind: 14, safe: true },
                  { day: 'Fri', temp: 30, rain: 0, wind: 10, safe: true },
                ].map((forecast, i) => (
                  <div 
                    key={i} 
                    onClick={() => {
                      if (!forecast.safe) {
                        alert(`❌ AI Warning: Do not spray on ${forecast.day}!\nReason: ${forecast.reason}\nChemicals will be wasted or drift to nearby crops.`);
                      } else {
                        alert(`✅ AI Confirmation: ${forecast.day} is optimal for spraying.\nLow wind drift and no rain expected.`);
                      }
                    }}
                    style={{ 
                      flex: '1 0 140px', 
                      background: forecast.safe ? 'rgba(46,204,113,0.05)' : 'rgba(231,76,60,0.05)', 
                      border: `1px solid ${forecast.safe ? 'rgba(46,204,113,0.2)' : 'rgba(231,76,60,0.2)'}`,
                      borderRadius: '16px', padding: '1.5rem 1rem', textAlign: 'center', cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{ fontWeight: 600, color: '#444', marginBottom: '0.5rem' }}>{forecast.day}</div>
                    {forecast.rain > 50 ? <CloudRain size={32} color="var(--color-blue)" style={{ margin: '0.5rem auto' }} /> : <Thermometer size={32} color="var(--color-amber)" style={{ margin: '0.5rem auto' }} />}
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#222' }}>{forecast.temp}°C</div>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>Rain: {forecast.rain}%</div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>Wind: {forecast.wind}km/h</div>
                    
                    <div style={{ 
                      marginTop: '1rem', padding: '6px 0', fontSize: '0.75rem', fontWeight: 600, borderRadius: '6px',
                      background: forecast.safe ? 'var(--color-muted-green)' : 'var(--color-red)', color: '#fff' 
                    }}>
                      {forecast.safe ? 'SPRAY SAFE' : 'DO NOT SPRAY'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.chartsGrid} style={{ gridTemplateColumns: '1fr' }}>
              <div className={styles.chartCard} style={{ padding: '0' }}>
                <div className={styles.chartHeader} style={{ padding: '1.5rem 1.5rem 0' }}>
                  <h3 className={styles.chartTitle}>Recent Scan Activity</h3>
                  <p className={styles.chartSubtitle}>Log of crops analyzed by KrishiRakshak AI</p>
                </div>
                <div style={{ padding: '1.5rem', overflowX: 'auto' }}>
                  <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #eee', color: '#888', fontSize: '0.9rem' }}>
                        <th style={{ padding: '1rem 0', fontWeight: 500 }}>Date</th>
                        <th style={{ padding: '1rem 0', fontWeight: 500 }}>Crop Analyzed</th>
                        <th style={{ padding: '1rem 0', fontWeight: 500 }}>Diagnosis</th>
                        <th style={{ padding: '1rem 0', fontWeight: 500 }}>Confidence</th>
                        <th style={{ padding: '1rem 0', fontWeight: 500 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentScans.map((scan, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                          <td style={{ padding: '1rem 0', color: '#555' }}>{scan.date}</td>
                          <td style={{ padding: '1rem 0', fontWeight: 500 }}>{scan.crop}</td>
                          <td style={{ padding: '1rem 0' }}>{scan.diagnosis}</td>
                          <td style={{ padding: '1rem 0' }}>{scan.confidence}</td>
                          <td style={{ padding: '1rem 0' }}>
                            <span style={{ 
                              background: scan.status === 'Healthy' ? 'rgba(46,204,113,0.1)' : 'rgba(231,76,60,0.1)', 
                              color: scan.status === 'Healthy' ? 'var(--color-muted-green)' : 'var(--color-red)', 
                              padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600 
                            }}>
                              {scan.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <Button variant="secondary" onClick={() => window.location.href = '/scan'}>+ New AI Scan</Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* GOVERNMENT MODE DASHBOARD */
          <>
            <div className={styles.kpiGrid}>
              <div className={styles.kpiCard}>
                <div className={`${styles.kpiIcon} ${styles.green}`}><Map size={24} /></div>
                <div className={styles.kpiInfo}>
                  <h4>Monitored Hectares</h4>
                  <p>12.4M</p>
                  <span className={`${styles.kpiTrend} ${styles.trendUp}`}><TrendingUp size={14}/> +1.2M this month</span>
                </div>
              </div>
              <div className={styles.kpiCard}>
                <div className={`${styles.kpiIcon} ${styles.amber}`}><ShieldAlert size={24} /></div>
                <div className={styles.kpiInfo}>
                  <h4>Districts at Risk</h4>
                  <p>14</p>
                  <span className={`${styles.kpiTrend} ${styles.trendUp}`}><TrendingUp size={14}/> +3 since yesterday</span>
                </div>
              </div>
              <div className={styles.kpiCard}>
                <div className={`${styles.kpiIcon} ${styles.red}`}><Bug size={24} /></div>
                <div className={styles.kpiInfo}>
                  <h4>Critical Outbreaks</h4>
                  <p>2</p>
                  <span className={`${styles.kpiTrend} ${styles.trendUp}`}><TrendingUp size={14}/> Pune, Nashik</span>
                </div>
              </div>
            </div>

            <div className={styles.chartsGrid}>
              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <h3 className={styles.chartTitle}>Statewide Disease Trends</h3>
                  <p className={styles.chartSubtitle}>Predictive modeling of pathogen spread (Next 7 days)</p>
                </div>
                <div className={styles.chartBody}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={diseaseData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRiskGov" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-muted-green)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="var(--color-muted-green)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="risk" stroke="var(--color-muted-green)" fillOpacity={1} fill="url(#colorRiskGov)" name="Severity Index" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <h3 className={styles.chartTitle}>Threat Radar</h3>
                  <p className={styles.chartSubtitle}>Active pathogens by severity</p>
                </div>
                <div className={styles.chartBody}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="rgba(0,0,0,0.1)" />
                      <PolarAngleAxis dataKey="subject" tick={{fill: '#666', fontSize: 12}} />
                      <Radar name="Severity" dataKey="A" stroke="var(--color-amber)" fill="var(--color-amber)" fillOpacity={0.5} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className={styles.chartCard} style={{ height: 'auto' }}>
               <div className={styles.chartHeader}>
                  <h3 className={styles.chartTitle}>Active Interventions</h3>
               </div>
               <div className={styles.alertsList}>
                 <div className={`${styles.alertItem} ${styles.critical}`}>
                    <ShieldAlert size={20} color="var(--color-red)" />
                    <div className={styles.alertContent}>
                      <h5>Deploy Fall Armyworm protocol to Nashik District</h5>
                      <p>Probability of outbreak has exceeded 90%. SMS alerts queued for 45,000 registered farmers.</p>
                    </div>
                 </div>
                 <div className={styles.alertItem}>
                    <CloudRain size={20} color="var(--color-amber)" />
                    <div className={styles.alertContent}>
                      <h5>Fungal Blight advisory in Pune</h5>
                      <p>Unseasonal rainfall triggering high humidity models. Preventative spraying recommended.</p>
                    </div>
                 </div>
               </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
