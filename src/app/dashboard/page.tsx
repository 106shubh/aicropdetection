'use client';

import React, { useState } from 'react';
import styles from './dashboard.module.css';
import { Button } from '@/components/ui/button/Button';
import { 
  LayoutDashboard, Map, Scan, BrainCircuit, Bell, Settings, 
  TrendingUp, TrendingDown, CloudRain, ShieldAlert, Activity, Bug
} from 'lucide-react';
import Link from 'next/link';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

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

  return (
    <div className={styles.dashboardLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <span className={styles.logoText}>KrishiRakshak</span>
          </div>
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
          <div className={styles.navItem}>
            <Bell size={20} />
            <span>Alerts</span>
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
          <Button variant="primary" icon={<Settings size={16} />}>Settings</Button>
        </header>

        {mode === 'farmer' ? (
          /* FARMER MODE DASHBOARD */
          <>
            <div className={styles.actionCenter}>
              <div className={styles.actionText}>
                <h3>Immediate Action Required</h3>
                <p>Heavy rainfall is predicted tomorrow. Risk of fungal blight is increasing. We recommend applying preventative fungicide within 12 hours.</p>
              </div>
              <div className={styles.actionButtons}>
                <Link href="/scan">
                  <Button variant="accent" icon={<Scan size={16} />}>Scan Leaves Now</Button>
                </Link>
              </div>
            </div>

            <div className={styles.kpiGrid}>
              <div className={styles.kpiCard}>
                <div className={`${styles.kpiIcon} ${styles.green}`}><Activity size={24} /></div>
                <div className={styles.kpiInfo}>
                  <h4>Overall Crop Health</h4>
                  <p>82%</p>
                  <span className={`${styles.kpiTrend} ${styles.trendDown}`}><TrendingDown size={14}/> -4% from last week</span>
                </div>
              </div>
              <div className={styles.kpiCard}>
                <div className={`${styles.kpiIcon} ${styles.amber}`}><CloudRain size={24} /></div>
                <div className={styles.kpiInfo}>
                  <h4>Weather Risk (Next 48h)</h4>
                  <p>High</p>
                  <span className={`${styles.kpiTrend} ${styles.trendUp}`}><TrendingUp size={14}/> 80mm Rain Expected</span>
                </div>
              </div>
              <div className={styles.kpiCard}>
                <div className={`${styles.kpiIcon} ${styles.red}`}><Bug size={24} /></div>
                <div className={styles.kpiInfo}>
                  <h4>Local Pest Threat</h4>
                  <p>Armyworm</p>
                  <span className={`${styles.kpiTrend} ${styles.trendUp}`}><TrendingUp size={14}/> Spotted 2km away</span>
                </div>
              </div>
            </div>

            <div className={styles.chartsGrid} style={{ gridTemplateColumns: '1fr' }}>
              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <h3 className={styles.chartTitle}>Weather-Disease Correlation</h3>
                  <p className={styles.chartSubtitle}>How upcoming rain affects fungal risk on your farm</p>
                </div>
                <div className={styles.chartBody}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={diseaseData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-red)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="var(--color-red)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip />
                      <Area type="monotone" dataKey="risk" stroke="var(--color-red)" fillOpacity={1} fill="url(#colorRisk)" name="Disease Risk %" />
                    </AreaChart>
                  </ResponsiveContainer>
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
