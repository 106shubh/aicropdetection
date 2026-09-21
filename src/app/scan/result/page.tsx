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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<{ disease: string, confidence: string, image: string, heatmap?: string, severity?: string, severityScore?: number } | null>(null);
  const [prescription, setPrescription] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    try {
      const element = document.getElementById('pdf-report-container');
      if (!element) return;
      
      // Briefly show the hidden element for capturing
      element.style.display = 'block';
      
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`CropGuard_Report_${new Date().getTime()}.pdf`);
      
      // Hide it again
      element.style.display = 'none';
    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem('scanResult');
    if (saved) {
      const parsed = JSON.parse(saved);
      setResult(parsed);
      
      if (parsed.disease && !parsed.disease.toLowerCase().includes('healthy') && !parsed.disease.toLowerCase().includes('rejected') && !parsed.disease.toLowerCase().includes('not a plant')) {
         fetch('/api/prescription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ disease: parsed.disease })
         })
         .then(res => res.json())
         .then(data => {
            if (data.prescription) setPrescription(data.prescription);
         })
         .catch(err => console.error("Failed to load prescription", err));
      }
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
          <Button variant="primary" onClick={handleDownloadPDF} disabled={isGeneratingPdf}>
            {isGeneratingPdf ? 'Generating...' : 'Download PDF'}
          </Button>
        </div>
      </header>

      <div className={styles.contentGrid}>
        {/* Left Column: Image and Metadata */}
        <div className={styles.imageSection}>
          <div className={styles.imageWrapper} style={{ padding: 0 }}>
            <img 
              src={result.heatmap ? `data:image/jpeg;base64,${result.heatmap}` : result.image} 
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
              <div className={styles.severityValue} style={{ color: result.disease.toLowerCase().includes('healthy') ? 'var(--color-muted-green-light)' : 'var(--color-red)' }}>
                {result.severity ? result.severity.toUpperCase() : (result.disease.toLowerCase().includes('healthy') ? 'OPTIMAL' : 'CRITICAL')}
              </div>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <BrainCircuit size={20} /> AI Inference Details
            </div>
            <ul className={styles.aiReasoningList}>
              {result.disease.toLowerCase().includes('rejected') || result.disease.toLowerCase().includes('not a plant') ? (
                <>
                  <li>
                    <Target size={16} className={styles.reasonIcon} />
                    <span><strong>Pre-Flight Check Failed:</strong> Gemini Vision Gatekeeper analyzed the image and found no plant matter.</span>
                  </li>
                  <li>
                    <Target size={16} className={styles.reasonIcon} />
                    <span><strong>Action Taken:</strong> Dropped request before routing to PyTorch inference engine to save compute.</span>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Target size={16} className={styles.reasonIcon} />
                    <span><strong>PyTorch Inference:</strong> Successfully processed image tensor through EfficientNetV2 vision backbone.</span>
                  </li>
                  <li>
                    <Target size={16} className={styles.reasonIcon} />
                    <span><strong>Explainability:</strong> {result.heatmap ? `Grad-CAM active. Heatmap generated from final conv layer, determining severity score of ${result.severityScore}.` : `Top classification identified as ${result.disease} with ${(Number(result.confidence) / 100).toFixed(3)} normalized probability.`}</span>
                  </li>
                </>
              )}
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
              {result.disease.toLowerCase().includes('rejected') || result.disease.toLowerCase().includes('not a plant') ? (
                <p>The uploaded image does not appear to be a valid plant leaf or crop. Please take a clear, close-up photo of the affected plant and try again.</p>
              ) : result.disease.toLowerCase().includes('healthy') ? (
                <p>The crop appears healthy. Maintain current irrigation and fertilization schedules. Continue monitoring weekly.</p>
              ) : (
                <p>{prescription ? prescription : `Analyzing ${result.disease} to generate an immediate treatment plan with specific pesticide recommendations...`}</p>
              )}
              <div style={{ marginTop: '16px' }}>
                <Button variant="accent" icon={<CheckCircle2 size={16} />}>Acknowledge & Save to Log</Button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Hidden PDF Report Layout */}
      <div id="pdf-report-container" style={{
        display: 'none',
        width: '800px',
        padding: '40px',
        backgroundColor: '#fff',
        color: '#000',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #2B5E3C', paddingBottom: '10px' }}>
          <h1 style={{ margin: 0, color: '#2B5E3C', fontSize: '28px' }}>KrishiRakshak Diagnostic Report</h1>
          <p style={{ margin: '5px 0 0', color: '#666' }}>Scan ID: SCN-{Math.floor(Math.random() * 10000)} | Date: {new Date().toLocaleDateString()}</p>
        </div>

        <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
          {/* Left Side: Photo */}
          <div style={{ flex: '1' }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Crop Image</h3>
            <img 
              src={result.heatmap ? `data:image/jpeg;base64,${result.heatmap}` : result.image} 
              alt="Scanned Crop" 
              style={{ width: '100%', borderRadius: '8px', border: '1px solid #ccc' }} 
            />
          </div>

          {/* Right Side: Problem Occurred */}
          <div style={{ flex: '1' }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', color: '#d32f2f' }}>Problem Detected</h3>
            <div style={{ marginBottom: '15px' }}>
              <strong>Disease / Status:</strong> {result.disease}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>AI Confidence:</strong> {result.confidence}%
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Severity Level:</strong> <span style={{ color: result.disease.toLowerCase().includes('healthy') ? 'green' : 'red', fontWeight: 'bold' }}>{result.severity || 'N/A'}</span>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#444' }}>
                {result.heatmap ? "Explainability: Heatmap highlights the symptomatic regions found by our AI model." : "Visual pattern matched against known pathogen profiles."}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom: How to Fix It */}
        <div>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', color: '#2B5E3C' }}>How To Fix It (Prescription)</h3>
          <div style={{ padding: '20px', backgroundColor: '#eaf4eb', borderRadius: '8px', border: '1px solid #c8e1cc' }}>
            <p style={{ margin: 0, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {result.disease.toLowerCase().includes('healthy') 
                ? "The crop appears healthy. Maintain current irrigation and fertilization schedules. Continue monitoring weekly."
                : (prescription ? prescription : "No automated prescription available for this result. Please consult an agronomist.")}
            </p>
          </div>
        </div>
        
        <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '12px', color: '#888' }}>
          <p>Generated by KrishiRakshak AI. For informational purposes only.</p>
        </div>
      </div>
    </div>
  );
}
