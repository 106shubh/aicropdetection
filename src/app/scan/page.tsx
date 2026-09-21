'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './scan.module.css';
import { Button } from '@/components/ui/button/Button';
import { UploadCloud, X, Scan as ScanIcon, Camera, StopCircle, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScanPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'live' | 'processing'>('idle');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [analysisText, setAnalysisText] = useState('Initializing Gemini Vision...');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopLiveCamera();
    };
  }, []);

  const stopLiveCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // --- API CALL TO GEMINI ---
  const analyzeWithGemini = async (base64Image: string) => {
    try {
      setAnalysisText('Uploading high-res frame to cloud...');
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      });
      
      if (!res.ok) throw new Error('API request failed');
      
      setAnalysisText('Extracting pathogen patterns...');
      const data = await res.json();
      const prediction = data.predictions[0];
      
      sessionStorage.setItem('scanResult', JSON.stringify({
        disease: prediction.className,
        confidence: (prediction.probability * 100).toFixed(1),
        image: base64Image,
        heatmap: prediction.heatmap,
        severity: prediction.severity,
        severityScore: prediction.severityScore
      }));
      
      // Log to recent activity for Dashboard
      const existingHistory = JSON.parse(localStorage.getItem('recentScans') || '[]');
      const newScan = {
        date: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        crop: prediction.className.split('-')[0]?.trim() || 'Plant',
        diagnosis: prediction.className.split('-')[1]?.trim() || prediction.className,
        confidence: (prediction.probability * 100).toFixed(1) + '%',
        status: prediction.className.toLowerCase().includes('healthy') ? 'Healthy' : 'Action Needed'
      };
      localStorage.setItem('recentScans', JSON.stringify([newScan, ...existingHistory].slice(0, 5)));

      
      router.push('/scan/result');
    } catch (error) {
      console.error(error);
      alert("Failed to analyze image with Gemini API.");
      setStatus('idle');
    }
  };

  // --- UPLOAD MODE ---
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Read file as base64 data url
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setImageSrc(url);
      setStatus('processing');
      analyzeWithGemini(url);
    };
    reader.readAsDataURL(file);
  };

  // --- LIVE CAMERA MODE ---
  const startLiveCamera = async () => {
    try {
      setStatus('live');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera access denied or unavailable.");
      setStatus('idle');
    }
  };

  const captureAndAnalyze = () => {
    if (!videoRef.current) return;
    
    // Capture frame from video to canvas
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

    stopLiveCamera();
    setImageSrc(dataUrl);
    setStatus('processing');
    
    analyzeWithGemini(dataUrl);
  };

  return (
    <div className={styles.scanLayout}>
      <header className={styles.header}>
        <div className={styles.title}>
          <ScanIcon size={24} color="var(--color-muted-green)" />
          KrishiRakshak Deep Vision
        </div>
        <Link href="/dashboard" onClick={stopLiveCamera} className={styles.cancelLink} style={{textDecoration: 'none'}}>
          <Button variant="secondary" icon={<X size={16} />}>Cancel</Button>
        </Link>
      </header>

      <main className={styles.main}>
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div 
              key="select"
              className={styles.uploadContainer}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className={styles.uploadIcon} style={{marginBottom: '2rem'}}>
                <ScanIcon size={48} />
              </div>
              <h2 className={styles.uploadTitle}>Scan Crop Disease</h2>
              <p className={styles.uploadSubtitle}>Powered by proprietary KrishiRakshak Vision AI for ultra-accurate detection.</p>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button variant="accent" icon={<Camera size={18} />} onClick={startLiveCamera} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                  Open Live Camera
                </Button>
                
                <div onClick={handleUploadClick}>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                  <Button variant="secondary" icon={<UploadCloud size={18} />} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                    Upload Photo
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {status === 'live' && (
            <motion.div 
              key="live"
              className={styles.scanStage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className={styles.imageWrapper}>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                {/* Live Scanning UI Overlay */}
                <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ background: 'rgba(0,0,0,0.6)', color: 'white', padding: '8px 16px', borderRadius: '100px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', background: 'var(--color-red)', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
                    CAMERA ACTIVE
                  </div>
                </div>

                <div className={styles.scanOverlay} style={{ height: '30%', top: '35%', background: 'linear-gradient(to bottom, transparent, rgba(78, 110, 88, 0.4), transparent)' }} />
              </div>

              <div className={styles.analysisConsole} style={{ textAlign: 'center', padding: '2rem', height: 'auto' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'white' }}>
                  Point at the affected leaf
                </h3>
                <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '1rem', marginBottom: '2rem' }}>
                  Ensure good lighting. Click below when the crop is clearly visible to run deep analysis.
                </p>
                <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
                  <Button variant="accent" icon={<Zap size={16}/>} onClick={captureAndAnalyze}>
                    Analyze Crop
                  </Button>
                  <Button variant="secondary" icon={<StopCircle size={16}/>} onClick={() => { stopLiveCamera(); setStatus('idle'); }}>
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {status === 'processing' && (
            <motion.div 
              key="processing"
              className={styles.scanStage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
               <div className={styles.imageWrapper}>
                  {imageSrc && <img ref={imageRef} src={imageSrc} alt="Captured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  <motion.div className={styles.scanLine} animate={{ top: ['0%', '100%', '0%'] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} />
               </div>
               <div className={styles.analysisConsole}>
                  <div className={styles.consoleLine} style={{ opacity: 1 }}>
                     <span className={styles.loader}></span>
                     {analysisText}
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
