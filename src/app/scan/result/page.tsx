'use client';

import React, { useEffect, useState } from 'react';
import styles from './result.module.css';
import { Button } from '@/components/ui/button/Button';
import { 
  ArrowLeft, FileText, BrainCircuit, CloudLightning, 
  Droplets, Thermometer, Wind, Target, CheckCircle2, FlaskConical
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<{ disease: string, confidence: string, image: string } | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('scanResult');
    if (saved) {
      setResult(JSON.parse(saved));
    } else {
      // If no result found (user navigated here directly), go back to scan
      router.push('/scan');
    }
  }, [router]);

  if (!result) return null; // Avoid hydration flash

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.title}>
          <FileText size={28} color="var(--color-muted-green)" />
          Diagnostic Report
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/dashboard">
            <Button variant="secondary" icon={<ArrowLeft size={16} />}>Back to Dashboard</Button>
          </Link>
          <Button variant="primary">Download PDF</Button>
        </div>
      </header>

      <div className={styles.contentGrid}>
        {/* Left Column: Image and Metadata */}
        <div className={styles.imageSection}>
          <div className={styles.imageWrapper} style={{ padding: 0 }}>
            <img 
              src={result.image} 
              alt="Scanned Leaf" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            <div className={styles.boundingBox}>
              <div className={styles.boundingBoxLabel}>{result.confidence}% Match</div>
            </div>
          </div>

          <div className={styles.scanDetails}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Scan ID</div>
              <div className={styles.detailValue}>SCN-{Math.floor(Math.random() * 10000)}</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Crop Type</div>
              <div className={styles.detailValue}>Auto-detected</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Analyzed At</div>
              <div className={styles.detailValue}>{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>

        {/* Right Column: Diagnosis and Recommendations */}
        <div className={styles.diagnosisSection}>
          
          <div className={styles.severityBanner}>
            <div>
              <h1 className={styles.diagnosisTitle}>{result.disease}</h1>
              <div className={styles.confidenceBadge}>{result.confidence}% AI Confidence</div>
            </div>
            <div className={styles.severityIndicator}>
              <div className={styles.severityLabel}>Severity Level</div>
              <div className={styles.severityValue} style={{ color: result.disease === 'Healthy' ? 'var(--color-muted-green-light)' : 'var(--color-red)' }}>
                {result.disease === 'Healthy' ? 'OPTIMAL' : 'CRITICAL'}
              </div>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <BrainCircuit size={20} /> AI Inference Details
            </div>
            <ul className={styles.aiReasoningList}>
              <li>
                <Target size={16} className={styles.reasonIcon} />
                <span><strong>TensorFlow Inference:</strong> Successfully processed input tensor against proprietary weights.</span>
              </li>
              <li>
                <Target size={16} className={styles.reasonIcon} />
                <span><strong>Pattern Match:</strong> Top classification identified as {result.disease} with {(Number(result.confidence) / 100).toFixed(3)} normalized probability.</span>
              </li>
            </ul>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <CloudLightning size={20} /> Local Weather Context
            </div>
            <div className={styles.envFactors}>
              <div className={styles.envItem}>
                <Thermometer size={24} />
                <div className={styles.envValue}>28°C</div>
                <div className={styles.envLabel}>Avg Temp</div>
              </div>
              <div className={styles.envItem}>
                <Droplets size={24} />
                <div className={styles.envValue}>65%</div>
                <div className={styles.envLabel}>Humidity</div>
              </div>
              <div className={styles.envItem}>
                <Wind size={24} />
                <div className={styles.envLabel}>Spread Risk</div>
                <div className={styles.envValue}>{result.disease === 'Healthy' ? 'Low' : 'High'}</div>
              </div>
            </div>
          </div>

          <div className={styles.recommendation}>
            <FlaskConical size={32} color="var(--color-muted-green-light)" style={{ flexShrink: 0 }} />
            <div className={styles.recContent}>
              <h4>AI Doctor Prescription</h4>
              {result.disease === 'Healthy' ? (
                <p>The crop appears healthy. Maintain current irrigation and fertilization schedules. Continue monitoring weekly.</p>
              ) : (
                <p>Immediate intervention recommended for {result.disease}. Apply appropriate targeted fungicide or pesticide. Ensure thorough coverage and monitor weather conditions to prevent further spread.</p>
              )}
              <div style={{ marginTop: '16px' }}>
                <Button variant="accent" icon={<CheckCircle2 size={16} />}>Acknowledge & Save to Log</Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
