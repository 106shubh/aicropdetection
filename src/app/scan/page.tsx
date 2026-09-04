'use client';

import React, { useState, useEffect } from 'react';
import styles from './scan.module.css';
import { Button } from '@/components/ui/button/Button';
import { UploadCloud, X, Scan as ScanIcon, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const ANALYSIS_STEPS = [
  "Initializing neural networks...",
  "Isolating leaf cellular structure...",
  "Enhancing contrast for pathogen signatures...",
  "Cross-referencing global disease database...",
  "Calculating confidence intervals...",
  "Analysis complete. Redirecting..."
];

export default function ScanPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'scanning' | 'complete'>('idle');
  const [stepIndex, setStepIndex] = useState(0);

  const startScan = () => {
    setStatus('scanning');
  };

  useEffect(() => {
    if (status === 'scanning') {
      const interval = setInterval(() => {
        setStepIndex(prev => {
          if (prev >= ANALYSIS_STEPS.length - 1) {
            clearInterval(interval);
            setStatus('complete');
            setTimeout(() => {
               router.push('/scan/result');
            }, 800);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [status, router]);

  return (
    <div className={styles.scanLayout}>
      <header className={styles.header}>
        <div className={styles.title}>
          <ScanIcon size={24} color="var(--color-muted-green)" />
          KrishiRakshak Vision Engine
        </div>
        <Link href="/dashboard">
          <Button variant="secondary" icon={<X size={16} />}>Cancel</Button>
        </Link>
      </header>

      <main className={styles.main}>
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div 
              key="upload"
              className={styles.uploadContainer}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className={styles.uploadIcon}>
                <UploadCloud size={40} />
              </div>
              <h2 className={styles.uploadTitle}>Upload Crop Image</h2>
              <p className={styles.uploadSubtitle}>Ensure the leaf is well-lit and in focus for highest accuracy.</p>
              
              <div className={styles.uploadArea} onClick={startScan}>
                <p style={{ fontWeight: 500, marginBottom: '8px' }}>Drag and drop your image here</p>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>Supports JPG, PNG (Max 5MB)</p>
                <Button variant="accent">Browse Files</Button>
              </div>
            </motion.div>
          )}

          {status !== 'idle' && (
            <motion.div 
              key="scan"
              className={styles.scanStage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.imageWrapper}>
                {/* Mock image placeholder simulating an uploaded leaf */}
                <div style={{width:'100%', height:'100%', background:'linear-gradient(45deg, #1A2F24, #2A4535)'}}></div>
                
                {/* Scanning Laser Animation */}
                <motion.div 
                  className={styles.scanLine}
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                />
                <motion.div 
                  className={styles.scanOverlay}
                  animate={{ height: ['0%', '100%', '0%'] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                />

                {/* Bounding boxes appear towards the end */}
                {stepIndex >= 3 && (
                  <motion.div className={styles.boundingBoxes} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className={styles.box} style={{ top: '20%', left: '30%', width: '100px', height: '100px' }}></div>
                    <div className={styles.box} style={{ top: '50%', left: '60%', width: '80px', height: '120px' }}></div>
                  </motion.div>
                )}
              </div>

              <div className={styles.analysisConsole}>
                {ANALYSIS_STEPS.slice(0, stepIndex + 1).map((step, idx) => (
                  <motion.div 
                    key={idx} 
                    className={`${styles.consoleLine} ${idx === stepIndex ? styles.active : ''}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {idx === stepIndex && status !== 'complete' ? <span className={styles.loader}></span> : <CheckCircle2 size={12} color="var(--color-muted-green)" />}
                    {step}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
