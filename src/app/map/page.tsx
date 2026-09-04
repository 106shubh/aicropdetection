'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './map.module.css';
import { Button } from '@/components/ui/button/Button';
import { 
  ArrowLeft, Map as MapIcon, ShieldAlert, Bug, CloudRain, 
  TrendingUp, Activity, Crosshair, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

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
  trendData: { risk: number }[];
}

const DISTRICTS: District[] = [
  { id: 'nashik', name: 'Nashik', lat: 19.9975, lng: 73.7898, risk: 'critical', disease: 'Grape Downy Mildew', pest: 'Thrips', weather: 'High Humidity (88%)', trendData: [{risk: 20}, {risk: 40}, {risk: 65}, {risk: 90}] },
  { id: 'pune', name: 'Pune', lat: 18.5204, lng: 73.8567, risk: 'warning', disease: 'Onion Blight', pest: 'Armyworm', weather: 'Unseasonal Rain (25mm)', trendData: [{risk: 10}, {risk: 15}, {risk: 30}, {risk: 60}] },
  { id: 'nagpur', name: 'Nagpur', lat: 21.1458, lng: 79.0882, risk: 'safe', disease: 'Citrus Canker (Low)', pest: 'Whitefly (Low)', weather: 'Clear / Optimal', trendData: [{risk: 30}, {risk: 25}, {risk: 20}, {risk: 15}] },
  { id: 'aurangabad', name: 'Aurangabad', lat: 19.8762, lng: 75.3433, risk: 'warning', disease: 'Cotton Wilt', pest: 'Bollworm', weather: 'Dry Spell', trendData: [{risk: 40}, {risk: 45}, {risk: 50}, {risk: 55}] },
  { id: 'solapur', name: 'Solapur', lat: 17.6599, lng: 75.9064, risk: 'safe', disease: 'None Detected', pest: 'Minor Aphids', weather: 'Normal', trendData: [{risk: 15}, {risk: 10}, {risk: 12}, {risk: 10}] },
  { id: 'kolhapur', name: 'Kolhapur', lat: 16.7050, lng: 74.2433, risk: 'critical', disease: 'Sugarcane Smut', pest: 'Early Shoot Borer', weather: 'Heavy Rain (45mm)', trendData: [{risk: 30}, {risk: 50}, {risk: 70}, {risk: 85}] },
  { id: 'amravati', name: 'Amravati', lat: 20.9320, lng: 77.7523, risk: 'safe', disease: 'None Detected', pest: 'None', weather: 'Clear', trendData: [{risk: 5}, {risk: 5}, {risk: 8}, {risk: 5}] },
];

const DetailedMap = dynamic(() => import('@/components/ui/map/DetailedMap'), {
  ssr: false,
  loading: () => <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>Loading Maps...</div>
});

export default function MapPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <MapIcon color="var(--color-muted-green)" size={28} />
            Geospatial Intelligence
          </h1>
          <p className={styles.subtitle}>District-level risk mapping and outbreak topology for Maharashtra.</p>
        </div>
        <Link href="/dashboard">
          <Button variant="secondary" icon={<ArrowLeft size={16} />}>Back to Dashboard</Button>
        </Link>
      </header>

      <div className={styles.mapLayout}>
        {/* Real Detailed Geographic Map Area */}
        <div className={styles.mapArea} style={{ padding: 0 }}>
          <div className={styles.mapNetwork}>
            <DetailedMap 
              districts={DISTRICTS} 
              selectedDistrict={selectedDistrict} 
              onSelectDistrict={setSelectedDistrict} 
            />
          </div>
        </div>

        {/* Side Panel */}
        <div className={styles.sidePanel}>
          <AnimatePresence mode="wait">
            {!selectedDistrict ? (
              <motion.div 
                key="empty" 
                className={styles.emptyState}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <Crosshair size={48} color="var(--color-muted-green)" style={{ marginBottom: '16px', opacity: 0.5 }} />
                <h3>Select a District</h3>
                <p>Click on any node in the map to reveal localized threat intelligence and outbreak topologies.</p>
              </motion.div>
            ) : (
              <motion.div 
                key={selectedDistrict.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <div className={styles.panelHeader} style={{
                  backgroundColor: selectedDistrict.risk === 'critical' ? 'var(--color-red)' : 
                                  selectedDistrict.risk === 'warning' ? 'var(--color-amber)' : 
                                  'var(--color-deep-forest)'
                }}>
                  <h2 className={styles.panelTitle}>{selectedDistrict.name}</h2>
                  <div className={styles.panelSubtitle}>District Intelligence Report</div>
                </div>

                <div className={styles.panelContent}>
                  <div className={`${styles.statusBanner} ${styles[selectedDistrict.risk]}`}>
                    {selectedDistrict.risk === 'critical' ? <ShieldAlert size={20} /> : 
                     selectedDistrict.risk === 'warning' ? <AlertCircle size={20} /> : 
                     <Activity size={20} />}
                    {selectedDistrict.risk === 'critical' ? 'CRITICAL OUTBREAK DETECTED' : 
                     selectedDistrict.risk === 'warning' ? 'ELEVATED RISK LEVEL' : 
                     'CONDITIONS OPTIMAL (SAFE)'}
                  </div>

                  <div className={styles.dataGroup}>
                    <div className={styles.dataGroupTitle}>Threat Vectors</div>
                    <div className={styles.dataItem}>
                      <div className={styles.dataItemLabel}><Activity size={16} /> Primary Disease</div>
                      <div className={styles.dataItemValue}>{selectedDistrict.disease}</div>
                    </div>
                    <div className={styles.dataItem}>
                      <div className={styles.dataItemLabel}><Bug size={16} /> Active Pests</div>
                      <div className={styles.dataItemValue}>{selectedDistrict.pest}</div>
                    </div>
                    <div className={styles.dataItem}>
                      <div className={styles.dataItemLabel}><CloudRain size={16} /> Local Weather</div>
                      <div className={styles.dataItemValue}>{selectedDistrict.weather}</div>
                    </div>
                  </div>

                  <div className={styles.dataGroup}>
                    <div className={styles.dataGroupTitle}>Outbreak Trend (Last 7 Days)</div>
                    <div style={{ height: '100px', marginTop: '8px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={selectedDistrict.trendData}>
                          <Area 
                            type="monotone" 
                            dataKey="risk" 
                            stroke={selectedDistrict.risk === 'critical' ? 'var(--color-red)' : 
                                    selectedDistrict.risk === 'warning' ? 'var(--color-amber)' : 
                                    'var(--color-muted-green)'} 
                            fill={selectedDistrict.risk === 'critical' ? 'rgba(179, 78, 78, 0.2)' : 
                                  selectedDistrict.risk === 'warning' ? 'rgba(217, 154, 69, 0.2)' : 
                                  'rgba(78, 110, 88, 0.2)'} 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className={styles.dataGroup} style={{ marginTop: 'auto' }}>
                    <Button 
                      variant={selectedDistrict.risk === 'safe' ? 'secondary' : 'primary'} 
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      {selectedDistrict.risk === 'safe' ? 'View Regional Log' : 'Deploy SMS Intervention Protocol'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
