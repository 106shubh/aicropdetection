'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Plus, Minus } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Parallax Hooks
  const { scrollY } = useScroll();
  const heroImgY = useTransform(scrollY, [0, 1000], [0, 200]);

  const bannerRef = useRef(null);
  const { scrollYProgress: bannerProgress } = useScroll({
    target: bannerRef,
    offset: ["start end", "end start"]
  });
  
  // The image moves much slower than the scroll, creating depth
  const bannerImgY = useTransform(bannerProgress, [0, 1], ["-20%", "20%"]);
  
  // The text fades in exactly at the center (0.5), and fades out when scrolling up or down
  const bannerTextOpacity = useTransform(bannerProgress, [0.3, 0.5, 0.7], [0, 1, 0]);
  const bannerTextY = useTransform(bannerProgress, [0.3, 0.5, 0.7], [50, 0, -50]);

  const faqs = [
    { q: "How accurate is the Vision Engine?", a: "Our models achieve over 98% diagnostic accuracy by analyzing cellular-level pathogen signatures across 48 distinct crop diseases." },
    { q: "Do I need an internet connection?", a: "No. The AI engine runs locally on your device via TensorFlow.js, allowing you to scan crops perfectly even in remote fields with zero signal." },
    { q: "How does Predictive Risk work?", a: "We aggregate live meteorological data (humidity, rainfall, temp) with geospatial heatmaps to forecast disease spread velocity up to 10 days in advance." }
  ];

  return (
    <main className={styles.main}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>KrishiRakshak.</div>
        <div className={styles.navLinks}>
          <Link href="#features">Platform</Link>
          <Link href="#metrics">Impact</Link>
          <Link href="#research">Research</Link>
          <Link href="#faq">FAQ</Link>
        </div>
        <Link href="/scan" className={styles.navBtn}>Start Scan</Link>
      </nav>

      {/* 1. HERO SECTION */}
      <section className={styles.hero}>
        <h1 className={styles.title}>Shaping the Future of Agriculture<br/>Through AI Guidance.</h1>
        <p className={styles.subtitle}>AI-driven crop diagnostics, predictive risk intelligence, and multilingual agronomy support running completely offline on your device.</p>
        
        <div className={styles.heroImageContainer} style={{ overflow: 'hidden' }}>
          <motion.img 
            src="/images/hero_moss_log.jpg" 
            alt="Hero Log" 
            style={{ y: heroImgY, scale: 1.1 }} // Scale up slightly so parallax doesn't show edges
          />
          <div className={styles.floatingTag} style={{ top: '20%', left: '10%' }}>🌿 Scan</div>
          <div className={styles.floatingTag} style={{ bottom: '30%', right: '15%' }}>🔬 Predict</div>
        </div>
      </section>

      {/* 2. SPLIT SECTION 1 */}
      <section className={styles.splitSection}>
        <div className={styles.splitText}>
          <h2>Transforming Farming<br/>Into Data-Driven Impact</h2>
          <p>We leverage cutting-edge computer vision to identify diseases instantly. By running natively on your device, KrishiRakshak ensures you have world-class agronomy support even in areas with zero cellular connectivity.</p>
          <Link href="/scan" className={styles.navBtn} style={{ display: 'inline-block' }}>Learn more</Link>
        </div>
        <div className={styles.splitImage}>
          <img src="/images/moss_roots.jpg" alt="Leaf analysis" />
        </div>
      </section>

      {/* 3. MASONRY BENTO GRID */}
      <section id="features" className={styles.bentoSection}>
        <div className={styles.sectionHeader}>
          <h2>Technology Designed to Make an Impact.</h2>
        </div>

        <div className={styles.masonryGrid}>
          {/* Top Left */}
          <div className={styles.masonryCard}>
            <div className={styles.cardIcon}>🔬</div>
            <h3>Pioneering Vision</h3>
            <p>Our TensorFlow engine detects up to 48 distinct pathogens.</p>
          </div>
          
          {/* Top Mid */}
          <div className={styles.masonryCard}>
            <div className={styles.cardIcon}>📊</div>
            <h3>Predictive Risk</h3>
            <p>Forecast disease spread probability up to 10 days in advance.</p>
          </div>
          
          {/* Large Image Right */}
          <div className={styles.masonryImageCard}>
            <img src="/images/bento_moss_ring.jpg" alt="Abstract organic" />
          </div>

          {/* Bottom Left */}
          <div className={styles.masonryCard}>
            <div className={styles.cardIcon}>🌍</div>
            <h3>Geospatial Maps</h3>
            <p>Monitor district-level threat heatmaps across regions in real-time.</p>
          </div>

          {/* Bottom Mid */}
          <div className={styles.masonryCard}>
            <div className={styles.cardIcon}>💬</div>
            <h3>AI Agronomist</h3>
            <p>Multilingual contextual chat support in Hindi, Marathi, & English.</p>
          </div>
        </div>
      </section>

      {/* 4. DARK STATS */}
      <section id="metrics" className={styles.statsBanner}>
        <div className={styles.statsText}>
          <h2>Leading Agriculture into New Horizons</h2>
          <Link href="/scan" className={styles.navBtn} style={{ display: 'inline-block' }}>Learn more</Link>
        </div>
        
        <div className={styles.statsGrid}>
          <div className={styles.statBox}>
            <h3>98%</h3>
            <p>Diagnostic Accuracy</p>
          </div>
          <div className={styles.statBox}>
            <h3>12M+</h3>
            <p>Hectares Monitored</p>
          </div>
          <div className={styles.statBox}>
            <h3>450K</h3>
            <p>Threats Neutralized</p>
          </div>
          <div className={styles.statBox}>
            <h3>10d</h3>
            <p>Prediction Window</p>
          </div>
        </div>
      </section>

      {/* 5. FULL BANNER (WITH PARALLAX) */}
      <section ref={bannerRef} className={styles.fullBanner} style={{ overflow: 'hidden' }}>
        <motion.img 
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop" 
          alt="Full banner" 
          className={styles.fullBannerImg} 
          style={{ y: bannerImgY, scale: 1.2 }} 
        />
        <div className={styles.fullBannerOverlay} style={{ background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.6))', position: 'absolute', inset: 0, zIndex: 1 }}></div>
        <motion.div 
          className={styles.bannerContent}
          style={{ 
            opacity: bannerTextOpacity, 
            y: bannerTextY,
            position: 'relative',
            zIndex: 2
          }}
        >
          <h2>Engineering a Smarter Agricultural Future</h2>
          <p>Protecting the global food supply by merging biological sciences with artificial intelligence.</p>
          <Link href="/dashboard" className={styles.navBtn} style={{background:'white', color:'black', display: 'inline-block'}}>View Dashboard</Link>
        </motion.div>
      </section>

      {/* 6. SPHERES SECTION */}
      <section id="research" className={styles.spheresSection}>
        <h2 className={styles.spheresHeader}>Science Built Around<br/>Possibility</h2>
        <div className={styles.spheresGrid}>
          <div className={styles.sphereCard}>
            <img src="/images/blue_cell_sphere.jpg" className={styles.sphereImg} alt="Sphere 1" />
            <h3>Advanced Models</h3>
          </div>
          <div className={styles.sphereCard}>
            <img src="/images/purple_cell_sphere.jpg" className={styles.sphereImg} alt="Sphere 2" />
            <h3>Proven Science</h3>
          </div>
          <div className={`${styles.sphereCard} ${styles.textCard}`}>
            <p style={{color:'#666', lineHeight:1.6}}>Every algorithm is rigorously tested against real-world crop data to ensure maximum accuracy in the field. We bring lab-grade precision to the farmer's pocket.</p>
            <button className={styles.navBtn} style={{marginTop:'1rem'}}>Learn more</button>
          </div>
          <div className={styles.sphereCard}>
            <img src="/images/teal_cell_sphere.jpg" className={styles.sphereImg} alt="Sphere 3" />
            <h3>Offline Tech</h3>
          </div>
        </div>
      </section>

      {/* 7. SPLIT SECTION 2 */}
      <section className={styles.splitSection}>
        <div className={styles.splitImage} style={{height: '500px'}}>
          <img src="/images/moss_roots.jpg" alt="Roots" />
        </div>
        <div className={styles.splitText}>
          <h2>Creating a Healthier,<br/>Smarter, More<br/>Sustainable Future</h2>
          <p>By preventing chemical overuse through targeted, AI-driven interventions, we reduce ecological runoff and promote sustainable farming practices globally.</p>
          <button className={styles.navBtn}>Learn more</button>
        </div>
      </section>

      {/* 8. HOW IT WORKS (FRUITFUL VIBE) */}
      <section className={styles.howItWorksSection} style={{ padding: '10rem 2rem', background: '#F9F8F6' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '5rem', maxWidth: '600px' }}>
            <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '3.5rem', color: '#1A1A1A', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
              Intelligence that works<br/>in the field.
            </h2>
            <p style={{ color: '#666', fontSize: '1.125rem', lineHeight: 1.6 }}>
              A seamless pipeline powered by local deep learning. We've removed the complexity so you can focus on what matters—your harvest.
            </p>
          </div>

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '4rem', 
            position: 'relative',
            paddingBottom: '10vh'
          }}>
            {/* STEP 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'sticky', top: '15vh', background: 'white', borderRadius: '32px', padding: '4rem 3rem', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap', zIndex: 1 }}
            >
              <div style={{ position: 'absolute', top: '-10%', right: '-5%', fontSize: '20rem', fontWeight: 800, color: '#F4F4F2', zIndex: 0, lineHeight: 1 }}>1</div>
              <div style={{ position: 'relative', zIndex: 1, flex: '1 1 300px' }}>
                <div style={{ width: '64px', height: '64px', background: '#1A1A1A', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                </div>
                <h3 style={{ fontSize: '2rem', color: '#1A1A1A', marginBottom: '1rem', fontFamily: 'var(--font-outfit)' }}>Capture Leaf</h3>
                <p style={{ color: '#666', lineHeight: 1.6, fontSize: '1.1rem', maxWidth: '400px' }}>Snap a photo of the affected crop directly in the app. The models are loaded entirely on your phone, meaning you can do this deep in the field with absolutely no internet connection.</p>
              </div>
              <div style={{ position: 'relative', zIndex: 1, flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
                 <img src="/images/hero_moss_log.jpg" style={{ width: '100%', maxWidth: '350px', borderRadius: '24px', aspectRatio: '1/1', objectFit: 'cover' }} alt="Capture" />
              </div>
            </motion.div>

            {/* STEP 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'sticky', top: '18vh', background: '#F0F4F1', borderRadius: '32px', padding: '4rem 3rem', overflow: 'hidden', boxShadow: '0 -10px 40px rgba(0,0,0,0.05), 0 20px 40px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap', zIndex: 2 }}
            >
              <div style={{ position: 'absolute', top: '-10%', right: '-5%', fontSize: '20rem', fontWeight: 800, color: 'white', zIndex: 0, lineHeight: 1 }}>2</div>
              <div style={{ position: 'relative', zIndex: 1, flex: '1 1 300px' }}>
                <div style={{ width: '64px', height: '64px', background: 'var(--color-muted-green)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <h3 style={{ fontSize: '2rem', color: '#1A1A1A', marginBottom: '1rem', fontFamily: 'var(--font-outfit)' }}>AI Analysis</h3>
                <p style={{ color: '#666', lineHeight: 1.6, fontSize: '1.1rem', maxWidth: '400px' }}>Our advanced Gemini Vision models instantly extract pathogen signatures to identify diseases with 98% diagnostic accuracy, mimicking a human agronomist.</p>
              </div>
              <div style={{ position: 'relative', zIndex: 1, flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
                 <img src="/images/bento_moss_ring.jpg" style={{ width: '100%', maxWidth: '350px', borderRadius: '24px', aspectRatio: '1/1', objectFit: 'cover' }} alt="Analysis" />
              </div>
            </motion.div>

            {/* STEP 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'sticky', top: '21vh', background: '#2B3B31', color: 'white', borderRadius: '32px', padding: '4rem 3rem', overflow: 'hidden', boxShadow: '0 -10px 40px rgba(0,0,0,0.05), 0 20px 40px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap', zIndex: 3 }}
            >
              <div style={{ position: 'absolute', top: '-10%', right: '-5%', fontSize: '20rem', fontWeight: 800, color: 'rgba(255,255,255,0.05)', zIndex: 0, lineHeight: 1 }}>3</div>
              <div style={{ position: 'relative', zIndex: 1, flex: '1 1 300px' }}>
                <div style={{ width: '64px', height: '64px', background: '#D4A373', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <h3 style={{ fontSize: '2rem', color: 'white', marginBottom: '1rem', fontFamily: 'var(--font-outfit)' }}>Get Protocol</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, fontSize: '1.1rem', maxWidth: '400px' }}>Receive instant actionable treatments, highly precise chemical dosages, and agronomy advice tailored to your exact crop and region in your local language.</p>
              </div>
              <div style={{ position: 'relative', zIndex: 1, flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
                 <img src="/images/teal_cell_sphere.jpg" style={{ width: '100%', maxWidth: '350px', borderRadius: '24px', aspectRatio: '1/1', objectFit: 'cover' }} alt="Protocol" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <section id="faq" className={styles.faqSection}>
        <div className={styles.faqHeader}>
          <h2>Got Questions?<br/>We've Got Answers.</h2>
        </div>
        <div className={styles.faqList}>
          {faqs.map((faq, idx) => (
            <div key={idx} className={styles.accordionItem} onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
              <div className={styles.accordionHeader}>
                <span>{faq.q}</span>
                {openFaq === idx ? <Minus size={18} /> : <Plus size={18} />}
              </div>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                    <p style={{ marginTop: '1rem', color: '#666', lineHeight: 1.6 }}>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className={styles.footer}>
        <h2>Let's Build What AI Makes Possible.</h2>
        <Link href="/scan" className={styles.navBtn} style={{background:'white', color:'black', padding:'1rem 3rem', display: 'inline-block'}}>Launch Platform</Link>
        <div className={styles.footerLinks}>
          <div>KrishiRakshak AI © 2026</div>
          <div style={{display:'flex', gap:'2rem'}}>
            <span>Twitter</span>
            <span>LinkedIn</span>
            <span>GitHub</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
