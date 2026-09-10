'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from './map.module.css';
import { Button } from '@/components/ui/button/Button';
import { 
  ArrowLeft, Map as MapIcon, ShieldAlert, Bug, CloudRain, 
  TrendingUp, Activity, Crosshair, AlertCircle, Wind, Thermometer
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const OPEN_WEATHER_KEY = '788fc44b7ec6aa9e28907132a060dc5f';

type RiskLevel = 'safe' | 'warning' | 'critical';

export interface District {
  id: string;
  name: string;
  lat: number;
  lng: number;
  risk: RiskLevel;
  disease: string;
  pest: string;
  weather: string;
  temp?: number;
  humidity?: number;
  wind?: number;
  description?: string;
  trendData: { risk: number }[];
}

const INITIAL_DISTRICTS: District[] = [
  { id: 'nashik', name: 'Nashik', lat: 19.9975, lng: 73.7898, risk: 'warning', disease: 'Grape Downy Mildew', pest: 'Thrips', weather: 'Loading...', trendData: [{risk: 20}, {risk: 40}, {risk: 65}, {risk: 90}] },
  { id: 'pune', name: 'Pune', lat: 18.5204, lng: 73.8567, risk: 'warning', disease: 'Onion Blight', pest: 'Armyworm', weather: 'Loading...', trendData: [{risk: 10}, {risk: 15}, {risk: 30}, {risk: 60}] },
  { id: 'nagpur', name: 'Nagpur', lat: 21.1458, lng: 79.0882, risk: 'safe', disease: 'Citrus Canker (Low)', pest: 'Whitefly (Low)', weather: 'Loading...', trendData: [{risk: 30}, {risk: 25}, {risk: 20}, {risk: 15}] },
  { id: 'aurangabad', name: 'Aurangabad', lat: 19.8762, lng: 75.3433, risk: 'warning', disease: 'Cotton Wilt', pest: 'Bollworm', weather: 'Loading...', trendData: [{risk: 40}, {risk: 45}, {risk: 50}, {risk: 55}] },
  { id: 'solapur', name: 'Solapur', lat: 17.6599, lng: 75.9064, risk: 'safe', disease: 'None Detected', pest: 'Minor Aphids', weather: 'Loading...', trendData: [{risk: 15}, {risk: 10}, {risk: 12}, {risk: 10}] },
  { id: 'kolhapur', name: 'Kolhapur', lat: 16.7050, lng: 74.2433, risk: 'warning', disease: 'Sugarcane Smut', pest: 'Early Shoot Borer', weather: 'Loading...', trendData: [{risk: 30}, {risk: 50}, {risk: 70}, {risk: 85}] },
  { id: 'amravati', name: 'Amravati', lat: 20.9320, lng: 77.7523, risk: 'safe', disease: 'None Detected', pest: 'None', weather: 'Loading...', trendData: [{risk: 5}, {risk: 5}, {risk: 8}, {risk: 5}] },
];

const DetailedMap = dynamic(() => import('@/components/ui/map/DetailedMap'), {
  ssr: false,
  loading: () => <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-muted-green)' }}>Initializing Geospatial Engine...</div>
});

export default function MapPage() {
  const [districts, setDistricts] = useState<District[]>(INITIAL_DISTRICTS);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      const updatedDistricts = await Promise.all(
        districts.map(async (d) => {
          try {
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${d.lat}&longitude=${d.lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`);
            const data = await res.json();
            
            const temp = Math.round(data.current.temperature_2m);
            const humidity = data.current.relative_humidity_2m;
            const wind = Math.round(data.current.wind_speed_10m);
            const code = data.current.weather_code;
            
            let desc = 'Clear';
            if (code >= 1 && code <= 3) desc = 'Cloudy';
            if (code >= 45 && code <= 48) desc = 'Fog';
            if (code >= 51 && code <= 67) desc = 'Rain';
            if (code >= 95) desc = 'Thunderstorm';

            // DYNAMIC RISK CALCULATION BASED ON REAL WEATHER
            // Fungal diseases thrive in high humidity and moderate temps
            let newRisk = d.risk;
            if (humidity > 80 && desc === 'Rain') {
              newRisk = 'critical';
            } else if (humidity > 70) {
              newRisk = 'warning';
            } else {
              newRisk = 'safe';
            }

            return {
              ...d,
              risk: newRisk,
              temp,
              humidity,
              wind,
              description: desc,
              weather: `${desc}, ${humidity}% Hum`
            };
          } catch (e) {
            console.error('Weather API Error:', e);
            return d;
          }
        })
      );
      setDistricts(updatedDistricts);
      setIsLive(true);
      
      // If a district is already selected, update its reference to the new live data
      if (selectedDistrict) {
        const liveD = updatedDistricts.find(u => u.id === selectedDistrict.id);
        if (liveD) setSelectedDistrict(liveD);
      }
    };

    fetchWeather();
    // Refresh weather every 10 mins
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <MapIcon color="var(--color-muted-green)" size={32} />
            Geospatial Intelligence
            {isLive && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className={styles.liveBadge}
                style={{ fontSize: '10px', background: 'var(--color-amber)', color: 'white', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <div style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
                LIVE WEATHER
              </motion.div>
            )}
          </h1>
          <p className={styles.subtitle}>Real-time meteorological monitoring & disease topology map.</p>
        </div>
        <Link href="/dashboard" style={{textDecoration: 'none'}}>
          <Button variant="secondary" icon={<ArrowLeft size={16} />}>Back to Dashboard</Button>
        </Link>
      </header>

      <div className={styles.mapLayout}>
        {/* Real Detailed Geographic Map Area */}
        <motion.div 
          className={styles.mapArea} 
          style={{ padding: 0 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.mapNetwork}>
            <DetailedMap 
              districts={districts} 
              selectedDistrict={selectedDistrict} 
              onSelectDistrict={setSelectedDistrict} 
            />
          </div>
        </motion.div>

        {/* Side Panel */}
        <div className={styles.sidePanel}>
          <AnimatePresence mode="wait">
            {!selectedDistrict ? (
              <motion.div 
                key="empty" 
                className={styles.emptyState}
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Crosshair size={64} color="rgba(78, 110, 88, 0.2)" style={{ marginBottom: '24px' }} />
                </motion.div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--color-deep-forest)' }}>Target Node</h3>
                <p style={{ color: '#666', lineHeight: 1.6 }}>Click any radar node on the map to triangulate live atmospheric pressure, humidity algorithms, and active pathogen threats.</p>
              </motion.div>
            ) : (
              <motion.div 
                key={selectedDistrict.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <div className={styles.panelHeader} style={{
                  backgroundColor: selectedDistrict.risk === 'critical' ? 'var(--color-red)' : 
                                  selectedDistrict.risk === 'warning' ? 'var(--color-amber)' : 
                                  'var(--color-deep-forest)',
                  transition: 'background-color 0.5s ease'
                }}>
                  <h2 className={styles.panelTitle}>{selectedDistrict.name} Grid</h2>
                  <div className={styles.panelSubtitle}>Live Satellite Telemetry</div>
                </div>

                <div className={styles.panelContent}>
                  
                  {/* LIVE WEATHER WIDGET */}
                  <motion.div 
                    className={styles.weatherWidget}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{
                      display: 'flex', gap: '1rem', marginBottom: '1.5rem', 
                      background: 'white', padding: '1.2rem', borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)'
                    }}
                  >
                     <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #eee' }}>
                        <Thermometer size={24} color="#666" style={{ margin: '0 auto 8px' }} />
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-outfit)', color: '#1a1a1a' }}>{selectedDistrict.temp || '--'}°C</div>
                        <div style={{ fontSize: '0.75rem', color: '#888' }}>TEMP</div>
                     </div>
                     <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #eee' }}>
                        <CloudRain size={24} color="#3b82f6" style={{ margin: '0 auto 8px' }} />
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-outfit)', color: '#1a1a1a' }}>{selectedDistrict.humidity || '--'}%</div>
                        <div style={{ fontSize: '0.75rem', color: '#888' }}>HUMIDITY</div>
                     </div>
                     <div style={{ flex: 1, textAlign: 'center' }}>
                        <Wind size={24} color="#64748b" style={{ margin: '0 auto 8px' }} />
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-outfit)', color: '#1a1a1a' }}>{selectedDistrict.wind || '--'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#888' }}>KM/H</div>
                     </div>
                  </motion.div>

                  <motion.div 
                    className={`${styles.statusBanner} ${styles[selectedDistrict.risk]}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {selectedDistrict.risk === 'critical' ? <ShieldAlert size={20} /> : 
                     selectedDistrict.risk === 'warning' ? <AlertCircle size={20} /> : 
                     <Activity size={20} />}
                    {selectedDistrict.risk === 'critical' ? 'CRITICAL OUTBREAK DETECTED' : 
                     selectedDistrict.risk === 'warning' ? 'ELEVATED RISK LEVEL' : 
                     'CONDITIONS OPTIMAL (SAFE)'}
                  </motion.div>

                  <div className={styles.dataGroup}>
                    <div className={styles.dataGroupTitle}>Threat Vectors</div>
                    <motion.div className={styles.dataItem} initial={{x: 20, opacity:0}} animate={{x:0, opacity:1}} transition={{delay: 0.3}}>
                      <div className={styles.dataItemLabel}><Activity size={16} /> Predicted Disease</div>
                      <div className={styles.dataItemValue}>{selectedDistrict.disease}</div>
                    </motion.div>
                    <motion.div className={styles.dataItem} initial={{x: 20, opacity:0}} animate={{x:0, opacity:1}} transition={{delay: 0.4}}>
                      <div className={styles.dataItemLabel}><Bug size={16} /> Active Pests</div>
                      <div className={styles.dataItemValue}>{selectedDistrict.pest}</div>
                    </motion.div>
                    <motion.div className={styles.dataItem} initial={{x: 20, opacity:0}} animate={{x:0, opacity:1}} transition={{delay: 0.5}}>
                      <div className={styles.dataItemLabel}><CloudRain size={16} /> Status</div>
                      <div className={styles.dataItemValue} style={{ textTransform: 'capitalize' }}>{selectedDistrict.description || 'Loading...'}</div>
                    </motion.div>
                  </div>

                  <div className={styles.dataGroup} style={{ flex: 1 }}>
                    <div className={styles.dataGroupTitle}>Pathogen Spread Trajectory</div>
                    <div style={{ height: '140px', marginTop: '16px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={selectedDistrict.trendData}>
                          <defs>
                            <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={selectedDistrict.risk === 'critical' ? '#B34E4E' : selectedDistrict.risk === 'warning' ? '#D99A45' : '#4E6E58'} stopOpacity={0.4}/>
                              <stop offset="95%" stopColor={selectedDistrict.risk === 'critical' ? '#B34E4E' : selectedDistrict.risk === 'warning' ? '#D99A45' : '#4E6E58'} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Area 
                            type="monotone" 
                            dataKey="risk" 
                            stroke={selectedDistrict.risk === 'critical' ? 'var(--color-red)' : 
                                    selectedDistrict.risk === 'warning' ? 'var(--color-amber)' : 
                                    'var(--color-muted-green)'} 
                            strokeWidth={3}
                            fill="url(#colorRisk)"
                            animationDuration={1500}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <motion.div className={styles.dataGroup} style={{ marginTop: 'auto' }} initial={{y: 20, opacity:0}} animate={{y:0, opacity:1}} transition={{delay: 0.6}}>
                    <Button 
                      variant={selectedDistrict.risk === 'safe' ? 'secondary' : 'primary'} 
                      style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
                    >
                      {selectedDistrict.risk === 'safe' ? 'System Stable' : 'Deploy SMS Interventions'}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
