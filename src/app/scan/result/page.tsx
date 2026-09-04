'use client';

import React from 'react';
import styles from './result.module.css';
import { Button } from '@/components/ui/button/Button';
import { 
  ArrowLeft, FileText, BrainCircuit, CloudLightning, 
  Droplets, Thermometer, Wind, Target, CheckCircle2, FlaskConical
} from 'lucide-react';
import Link from 'next/link';

export default function ResultPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.title}>
          <FileText size={28} color="var(--color-muted-green)" />
          Diagnostic Report
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="secondary" icon={<ArrowLeft size={16} />}>Back to Dashboard</Button>
          <Button variant="primary">Download PDF</Button>
        </div>
      </header>

      <div className={styles.contentGrid}>
        {/* Left Column: Image and Metadata */}
        <div className={styles.imageSection}>
          <div className={styles.imageWrapper}>
            {/* Mock diseased leaf background */}
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #2A4535, #1A2F24)' }}></div>
            
            <div className={styles.boundingBox}>
              <div className={styles.boundingBoxLabel}>98.4% Match</div>
            </div>
          </div>

          <div className={styles.scanDetails}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Scan ID</div>
              <div className={styles.detailValue}>SCN-8924-A</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Crop Type</div>
              <div className={styles.detailValue}>Wheat (Triticum)</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Growth Stage</div>
              <div className={styles.detailValue}>Tillering</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Analyzed At</div>
              <div className={styles.detailValue}>Today, 14:32</div>
            </div>
          </div>
        </div>

        {/* Right Column: Diagnosis and Recommendations */}
        <div className={styles.diagnosisSection}>
          
          <div className={styles.severityBanner}>
            <div>
              <h1 className={styles.diagnosisTitle}>Wheat Stripe Rust</h1>
              <div className={styles.confidenceBadge}>98.4% AI Confidence</div>
            </div>
            <div className={styles.severityIndicator}>
              <div className={styles.severityLabel}>Severity Level</div>
              <div className={styles.severityValue}>CRITICAL</div>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <BrainCircuit size={20} /> Explainable AI Reasoning
            </div>
            <ul className={styles.aiReasoningList}>
              <li>
                <Target size={16} className={styles.reasonIcon} />
                <span><strong>Visual Signature:</strong> Detected distinct yellow-orange pustules arranged in linear stripes parallel to leaf veins.</span>
              </li>
              <li>
                <Target size={16} className={styles.reasonIcon} />
                <span><strong>Pattern Recognition:</strong> Lesion density is highest on upper leaves, matching the progression pattern of Puccinia striiformis.</span>
              </li>
              <li>
                <Target size={16} className={styles.reasonIcon} />
                <span><strong>Contextual Validation:</strong> Discarded Leaf Rust (Puccinia triticina) due to lack of scattered, circular spore arrangements.</span>
              </li>
            </ul>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <CloudLightning size={20} /> Correlated Environmental Factors
            </div>
            <div className={styles.envFactors}>
              <div className={styles.envItem}>
                <Thermometer size={24} />
                <div className={styles.envValue}>12°C - 15°C</div>
                <div className={styles.envLabel}>Optimal for Rust</div>
              </div>
              <div className={styles.envItem}>
                <Droplets size={24} />
                <div className={styles.envValue}>85%</div>
                <div className={styles.envLabel}>High Humidity</div>
              </div>
              <div className={styles.envItem}>
                <Wind size={24} />
                <div className={styles.envLabel}>Wind Spread Risk</div>
                <div className={styles.envValue}>High</div>
              </div>
            </div>
          </div>

          <div className={styles.recommendation}>
            <FlaskConical size={32} color="var(--color-muted-green-light)" style={{ flexShrink: 0 }} />
            <div className={styles.recContent}>
              <h4>AI Doctor Prescription</h4>
              <p>Immediate intervention required to prevent 40-60% yield loss. Apply a systemic fungicide containing <strong>Tebuconazole</strong> or <strong>Propiconazole</strong> within 48 hours. Ensure thorough coverage of the upper canopy. Do not delay, as current weather conditions are highly conducive to rapid spread.</p>
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
