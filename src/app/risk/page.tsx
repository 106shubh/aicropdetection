'use client';

import React from 'react';
import styles from './risk.module.css';
import { Button } from '@/components/ui/button/Button';
import { 
  ArrowLeft, CloudRain, ThermometerSun, Leaf, Target, 
  BrainCircuit, TrendingUp, CalendarDays, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { 
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// Predicting future risk (Days +1 to +14)
const forecastData = [
  { day: 'Today', riskScore: 25, rainMm: 0, temp: 28 },
  { day: 'Day +1', riskScore: 28, rainMm: 0, temp: 29 },
  { day: 'Day +2', riskScore: 30, rainMm: 5, temp: 28 },
  { day: 'Day +3', riskScore: 45, rainMm: 25, temp: 25 },
  { day: 'Day +4', riskScore: 65, rainMm: 45, temp: 24 }, // Heavy rain spikes risk
  { day: 'Day +5', riskScore: 82, rainMm: 30, temp: 23 }, // Post-rain humidity peaks risk
  { day: 'Day +6', riskScore: 88, rainMm: 10, temp: 24 },
  { day: 'Day +7', riskScore: 92, rainMm: 0, temp: 26 },  // Critical Outbreak Window
  { day: 'Day +8', riskScore: 85, rainMm: 0, temp: 27 },
  { day: 'Day +9', riskScore: 75, rainMm: 0, temp: 28 },
  { day: 'Day +10', riskScore: 60, rainMm: 0, temp: 29 },
];

export default function RiskIntelligencePage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <BrainCircuit color="var(--color-muted-green)" size={28} style={{ marginRight: '12px' }} />
            Risk Forecast Intelligence
          </h1>
          <p className={styles.subtitle}>Predictive modeling of pathogen probability based on future environmental variables.</p>
        </div>
        <Link href="/dashboard">
          <Button variant="secondary" icon={<ArrowLeft size={16} />}>Back to Dashboard</Button>
        </Link>
      </header>

      {/* Top Metrics */}
      <div className={styles.topMetrics}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span>Peak Risk Probability</span>
            <AlertTriangle size={16} color="var(--color-red)" />
          </div>
          <div className={`${styles.metricValue} ${styles.danger}`}>92%</div>
          <div className={styles.metricSubtext}>Target date: Day +7 (Oct 12)</div>
        </div>
        
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span>Primary Threat</span>
            <Target size={16} color="var(--color-amber)" />
          </div>
          <div className={`${styles.metricValue} ${styles.warning}`} style={{ fontSize: '1.75rem' }}>Fungal Blight</div>
          <div className={styles.metricSubtext}>High confidence prediction</div>
        </div>
        
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span>Precipitation Forecast</span>
            <CloudRain size={16} color="var(--color-charcoal)" />
          </div>
          <div className={styles.metricValue}>115mm</div>
          <div className={styles.metricSubtext}>Cumulative over next 14 days</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span>Intervention Window</span>
            <CalendarDays size={16} color="var(--color-muted-green)" />
          </div>
          <div className={`${styles.metricValue} ${styles.safe}`} style={{ fontSize: '1.75rem' }}>Days +2 to +4</div>
          <div className={styles.metricSubtext}>Apply preventative spray here</div>
        </div>
      </div>

      {/* Forecast Area */}
      <div className={styles.forecastGrid}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>10-Day Predictive Risk Model</h3>
            <div className={styles.chartLegend}>
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ background: 'var(--color-red)' }}></div> Risk Probability (%)
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ background: '#3b82f6' }}></div> Rainfall (mm)
              </div>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={forecastData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                />
                {/* Rainfall as Bars (Right Axis) */}
                <Bar yAxisId="right" dataKey="rainMm" name="Rainfall (mm)" fill="rgba(59, 130, 246, 0.2)" radius={[4, 4, 0, 0]} />
                {/* Risk Score as Line (Left Axis) */}
                <Line yAxisId="left" type="monotone" dataKey="riskScore" name="Risk Probability" stroke="var(--color-red)" strokeWidth={3} dot={{ r: 4, fill: 'var(--color-red)' }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.factorCard}>
          <h3 className={styles.factorTitle}>Prediction Factors</h3>
          <div className={styles.factorList}>
            <div className={styles.factorItem}>
              <div className={`${styles.factorIcon} ${styles.red}`}><CloudRain size={20} /></div>
              <div className={styles.factorContent}>
                <h4>Severe Weather Front</h4>
                <p>Heavy rainfall projected for Days +3 and +4 will create ideal conditions for fungal spore germination.</p>
              </div>
            </div>
            <div className={styles.factorItem}>
              <div className={`${styles.factorIcon} ${styles.red}`}><Leaf size={20} /></div>
              <div className={styles.factorContent}>
                <h4>Vulnerable Crop Stage</h4>
                <p>Crops are currently in the Tillering stage, which is historically highly susceptible to Blight.</p>
              </div>
            </div>
            <div className={styles.factorItem}>
              <div className={`${styles.factorIcon} ${styles.red}`}><TrendingUp size={20} /></div>
              <div className={styles.factorContent}>
                <h4>Regional Spread</h4>
                <p>Similar weather patterns caused a 40% outbreak in neighboring districts 3 days ago.</p>
              </div>
            </div>
            <div className={styles.factorItem}>
              <div className={`${styles.factorIcon} ${styles.green}`}><ThermometerSun size={20} /></div>
              <div className={styles.factorContent}>
                <h4>Mitigating Factor</h4>
                <p>Temperatures will rise by Day +8, which usually slows the secondary spread of the pathogen.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Detail Table */}
      <div className={styles.predictionTable}>
        <div className={styles.tableHeader}>Threat Analysis Breakdown</div>
        <div className={`${styles.tableRow} ${styles.tableHead}`}>
          <div>Pathogen Threat</div>
          <div>Peak Date</div>
          <div>Trigger Factors</div>
          <div>AI Confidence</div>
          <div>Risk Level</div>
        </div>
        
        <div className={styles.tableRow}>
          <div style={{ fontWeight: 600 }}>Fungal Blight (Phytophthora)</div>
          <div>Oct 12 (Day +7)</div>
          <div style={{ color: '#666' }}>Heavy Rain, High Humidity</div>
          <div>94.2%</div>
          <div><span className={`${styles.riskBadge} ${styles.riskHigh}`}>CRITICAL</span></div>
        </div>
        
        <div className={styles.tableRow}>
          <div style={{ fontWeight: 600 }}>Fall Armyworm</div>
          <div>Oct 08 (Day +3)</div>
          <div style={{ color: '#666' }}>Neighboring District Spread</div>
          <div>78.5%</div>
          <div><span className={`${styles.riskBadge} ${styles.riskMed}`}>ELEVATED</span></div>
        </div>

        <div className={styles.tableRow}>
          <div style={{ fontWeight: 600 }}>Leaf Rust</div>
          <div>Oct 14 (Day +9)</div>
          <div style={{ color: '#666' }}>Rising Temperatures</div>
          <div>42.1%</div>
          <div><span className={`${styles.riskBadge} ${styles.riskLow}`}>LOW RISK</span></div>
        </div>
      </div>
      
    </div>
  );
}
