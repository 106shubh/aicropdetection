'use client';

import React from 'react';
import styles from './page.module.css';
import { Button } from '@/components/ui/button/Button';
import { ArrowRight, Scan, LineChart, ShieldCheck, Map, BrainCircuit, Leaf } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

export default function LandingPage() {
  return (
    <div className={styles.pageContainer}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <span>KrishiRakshak</span>
          <span className={styles.logoBadge}>AI</span>
        </div>
        <div className={styles.navLinks}>
          <Link href="/dashboard" className={styles.navLink}>Command Center</Link>
          <Link href="/map" className={styles.navLink}>Risk Map</Link>
          <Link href="/scan">
            <Button variant="primary" size="sm">Launch Scan</Button>
          </Link>
        </div>
        {/* Mobile: one-tap scan */}
        <div className={styles.mobileNavCta}>
          <Link href="/scan">
            <Button variant="accent" size="sm" icon={<Scan size={16} />}>Scan Now</Button>
          </Link>
        </div>
      </nav>

      <main>
        {/* HERO */}
        <section className={styles.heroSection}>
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className={styles.badge}>Precision Agriculture Intelligence</div>
            <h1 className={styles.heroTitle}>
              Securing tomorrow's harvest,<br />
              <span className={styles.highlight}>today.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Advanced computer vision and predictive modeling for national agricultural security.
              Identify threats instantly and deploy interventions before outbreaks occur.
            </p>
            <div className={styles.heroActions}>
              <Link href="/scan">
                <Button variant="accent" size="lg" icon={<Scan size={20} />}>
                  Initialize Crop Scan
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="secondary" size="lg">
                  Access Command Center
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Dashboard Mockup */}
          <motion.div
            className={styles.heroVisual}
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className={styles.dashboardMockup}>
              <div className={styles.mockupHeader}>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
              </div>
              <div className={styles.mockupBody}>
                <div className={styles.mockupSidebar}></div>
                <div className={styles.mockupMain}>
                  <div className={styles.mockupCards}>
                    <div className={styles.mockupCard}></div>
                    <div className={styles.mockupCard}></div>
                  </div>
                  <div className={styles.mockupChart}></div>
                </div>
              </div>
            </div>

            <motion.div
              className={styles.floatingScan}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              <div className={styles.scanIcon}><Leaf size={24} /></div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>Rust Detected</p>
                <p style={{ color: 'var(--color-muted-green)', fontSize: '0.75rem', fontWeight: 600 }}>
                  98.4% Confidence
                </p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* STATS BANNER */}
        <section className={styles.statsBanner}>
          <div className={styles.statItem}>
            <h4><AnimatedCounter value={12} suffix="M+" /></h4>
            <p>Hectares Monitored</p>
          </div>
          <div className={styles.statItem}>
            <h4><AnimatedCounter value={98} suffix=".4%" /></h4>
            <p>Diagnostic Accuracy</p>
          </div>
          <div className={styles.statItem}>
            <h4><AnimatedCounter value={48} suffix="h" /></h4>
            <p>Early Warning Window</p>
          </div>
        </section>

        {/* BENTO GRID */}
        <section className={styles.featuresSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>The Intelligence Protocol</h2>
            <p className={styles.sectionSubtitle}>A systematic, data-driven approach to agricultural risk management.</p>
          </div>

          <div className={styles.bentoGrid}>
            <motion.div className={`${styles.bentoCard} ${styles.bentoLarge}`} whileHover={{ y: -5 }}>
              <div className={styles.bentoIcon} style={{ color: 'var(--color-muted-green)' }}><Scan size={28} /></div>
              <h3>Computer Vision Diagnosis</h3>
              <p>Upload a photo of your crop. Our proprietary neural networks analyze leaf cellular damage and pathogen signatures in milliseconds, providing an instant diagnosis with military-grade accuracy.</p>
            </motion.div>

            <motion.div className={styles.bentoCard} whileHover={{ y: -5 }}>
              <div className={styles.bentoIcon} style={{ color: 'var(--color-amber)' }}><LineChart size={28} /></div>
              <h3>Predictive Risk Radar</h3>
              <p>Algorithmic forecasting models combine meteorological data and outbreak history to map future risk zones before infection occurs.</p>
            </motion.div>

            <motion.div className={styles.bentoCard} whileHover={{ y: -5 }}>
              <div className={styles.bentoIcon} style={{ color: 'var(--color-red)' }}><Map size={28} /></div>
              <h3>Geospatial Intelligence</h3>
              <p>District-level heatmaps isolate active outbreaks. Government agencies can view the exact spread of pests across Maharashtra in real-time.</p>
            </motion.div>

            <motion.div className={`${styles.bentoCard} ${styles.bentoLarge}`} whileHover={{ y: -5 }}>
              <div className={styles.bentoIcon} style={{ color: 'var(--color-deep-forest)' }}><BrainCircuit size={28} /></div>
              <h3>AI Agronomist Doctor</h3>
              <p>Get actionable, hyper-localized intervention strategies. The AI Doctor considers your specific crop stage, local weather, and soil type to recommend precise pesticide dosage and organic mitigation steps.</p>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaBox}>
            <div className={styles.ctaBg}></div>
            <h2>Ready to secure your harvest?</h2>
            <p>Deploy the most advanced AgriTech intelligence platform for your farm or district today.</p>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <Link href="/scan">
                <Button variant="accent" size="lg" icon={<ArrowRight size={20} />}>
                  Run Free Crop Scan
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.logo}>KrishiRakshak AI</div>
          <p className={styles.footerText}>
            © 2026 KrishiRakshak Intelligence Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
