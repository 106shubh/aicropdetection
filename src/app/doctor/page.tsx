'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './doctor.module.css';
import { Button } from '@/components/ui/button/Button';
import {
  BrainCircuit, Send, ArrowLeft, Leaf, CloudRain,
  Thermometer, Sprout, FlaskConical, MapPin, Clock
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  hasPrescription?: boolean;
}

const INITIAL_MESSAGES: Message[] = [];

const SUGGESTIONS = [
  { icon: <Leaf size={14} />, text: 'My wheat leaves have yellow stripes. What disease is this?' },
  { icon: <CloudRain size={14} />, text: 'How do I protect my crops before the heavy rain tomorrow?' },
  { icon: <FlaskConical size={14} />, text: 'What is the correct dosage of Tebuconazole for Stripe Rust?' },
  { icon: <Sprout size={14} />, text: 'Is it safe to harvest if my crop shows 20% Blight symptoms?' },
];

const AI_RESPONSES: Record<string, Message> = {
  rust: {
    id: 'r1',
    role: 'ai',
    content: "Based on your description of **yellow stripes parallel to the leaf veins**, this is a high-probability match for <em>Wheat Stripe Rust</em> (Puccinia striiformis).\n\nThis is one of the most damaging wheat diseases in Maharashtra and requires immediate intervention to prevent 40-60% yield loss.",
    hasPrescription: true,
  },
  rain: {
    id: 'r2',
    role: 'ai',
    content: "Excellent question. Given the forecasted 80mm rainfall in your region, **fungal disease risk will spike significantly within 24-48 hours** post-rain due to high humidity and leaf wetness.\n\nHere is a preventative protocol to deploy before the rain hits:",
    hasPrescription: true,
  },
  dosage: {
    id: 'r3',
    role: 'ai',
    content: "For **Stripe Rust (Puccinia striiformis)** on wheat at the tillering stage, the recommended Tebuconazole dosage is as follows:\n\n**Dose:** 250ml of Folicur (Tebuconazole 25.9% EC) per 500L of water per hectare.\n\n**Timing:** Apply at the first sign of infection. A second spray 14 days later if conditions remain humid.\n\n**Important:** Avoid spraying during strong wind (>10 km/h) to prevent drift.",
    hasPrescription: false,
  },
};

function getAIResponse(userMessage: string): Message {
  const lower = userMessage.toLowerCase();
  if (lower.includes('yellow') || lower.includes('stripe') || lower.includes('rust') || lower.includes('disease')) {
    return { ...AI_RESPONSES.rust, id: Date.now().toString() };
  }
  if (lower.includes('rain') || lower.includes('protect') || lower.includes('weather')) {
    return { ...AI_RESPONSES.rain, id: Date.now().toString() };
  }
  if (lower.includes('dosage') || lower.includes('tebuconazole') || lower.includes('dose')) {
    return { ...AI_RESPONSES.dosage, id: Date.now().toString() };
  }
  return {
    id: Date.now().toString(),
    role: 'ai',
    content: "I have analyzed your query in the context of your farm's current conditions. Based on the weather forecast and recent scan data from your region, I recommend scheduling a Crop Scan immediately to get a precise diagnosis. Our AI Vision Engine can identify 48+ diseases from a single photograph in under 10 seconds.",
    hasPrescription: false,
  };
}

export default function DoctorPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiMsg = getAIResponse(text);
      setMessages(prev => [...prev, aiMsg]);
    }, 1800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/<em>(.*?)<\/em>/g, '<em>$1</em>')
      .split('\n\n')
      .map((para, i) => `<p key="${i}" style="margin-bottom:10px;last-of-type:margin-bottom:0">${para}</p>`)
      .join('');
  };

  return (
    <div className={styles.layout}>
      {/* Topbar */}
      <header className={styles.topbar}>
        <div className={styles.topbarTitle}>
          <BrainCircuit size={22} color="var(--color-muted-green)" />
          AI Agronomist Doctor
          <span className={styles.topbarSubtitle}>Context-aware agricultural intelligence</span>
        </div>
        <Link href="/dashboard">
          <Button variant="secondary" size="sm" icon={<ArrowLeft size={14} />}>Dashboard</Button>
        </Link>
      </header>

      {/* Context Sidebar */}
      <aside className={styles.contextSidebar}>
        <div className={styles.contextCard}>
          <div className={styles.contextCardTitle}>Your Farm Context</div>
          <div className={styles.contextItem}>
            <span className={styles.contextLabel}><MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />Location</span>
            <span className={styles.contextValue}>Nashik, MH</span>
          </div>
          <div className={styles.contextItem}>
            <span className={styles.contextLabel}><Leaf size={12} style={{ display: 'inline', marginRight: 4 }} />Crop</span>
            <span className={styles.contextValue}>Wheat (Tillering)</span>
          </div>
          <div className={styles.contextItem}>
            <span className={styles.contextLabel}><Thermometer size={12} style={{ display: 'inline', marginRight: 4 }} />Temp</span>
            <span className={styles.contextValue}>14°C / 25°C</span>
          </div>
          <div className={styles.contextItem}>
            <span className={styles.contextLabel}><CloudRain size={12} style={{ display: 'inline', marginRight: 4 }} />Rain Risk</span>
            <span className={`${styles.contextValue} ${styles.danger}`}>HIGH (80mm)</span>
          </div>
        </div>

        <div className={styles.contextCard}>
          <div className={styles.contextCardTitle}>Recent Scan</div>
          <div className={styles.contextItem}>
            <span className={styles.contextLabel}>Disease</span>
            <span className={`${styles.contextValue} ${styles.danger}`}>Stripe Rust</span>
          </div>
          <div className={styles.contextItem}>
            <span className={styles.contextLabel}>Confidence</span>
            <span className={styles.contextValue}>98.4%</span>
          </div>
          <div className={styles.contextItem}>
            <span className={styles.contextLabel}>Severity</span>
            <span className={`${styles.contextValue} ${styles.danger}`}>Critical</span>
          </div>
        </div>

        <div className={styles.sectionDivider}>Conversation History</div>

        {[
          { text: 'How do I treat Grape Mildew organically?', date: '2 days ago', color: 'var(--color-amber)' },
          { text: 'Pest control options for Bollworm', date: '4 days ago', color: 'var(--color-muted-green)' },
          { text: 'Water schedule during monsoon', date: '1 week ago', color: 'var(--color-charcoal)' },
        ].map((item, i) => (
          <div key={i} className={styles.historyItem}>
            <div className={styles.historyDot} style={{ background: item.color }}></div>
            <div>
              <div className={styles.historyText}>{item.text}</div>
              <div className={styles.historyDate}><Clock size={10} style={{ display: 'inline', marginRight: 3 }} />{item.date}</div>
            </div>
          </div>
        ))}
      </aside>

      {/* Chat Area */}
      <div className={styles.chatArea}>
        <div className={styles.messagesContainer}>
          <AnimatePresence>
            {messages.length === 0 ? (
              <motion.div
                className={styles.welcomeState}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className={styles.welcomeIcon}>
                  <BrainCircuit size={36} />
                </div>
                <h2 className={styles.welcomeTitle}>AI Agronomist Doctor</h2>
                <p className={styles.welcomeSubtitle}>
                  Ask me anything about your crops, diseases, pests, or weather risks.
                  I have full context of your farm profile, recent scans, and local conditions.
                </p>
                <div className={styles.suggestions}>
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      className={styles.suggestionChip}
                      onClick={() => sendMessage(s.text)}
                    >
                      {s.icon}
                      {s.text}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`${styles.messageGroup} ${msg.role === 'user' ? styles.user : ''}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className={`${styles.avatar} ${msg.role === 'ai' ? styles.aiAvatar : styles.userAvatar}`}>
                    {msg.role === 'ai' ? 'AI' : 'You'}
                  </div>
                  <div className={`${styles.bubble} ${msg.role === 'ai' ? styles.aiBubble : styles.userBubble}`}>
                    <div className={styles.bubbleLabel}>
                      {msg.role === 'ai' ? 'AI Agronomist' : 'You'}
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }} />
                    {msg.hasPrescription && (
                      <div className={styles.prescriptionCard}>
                        <div className={styles.prescriptionTitle}>
                          <FlaskConical size={14} /> Recommended Protocol
                        </div>
                        <div className={styles.prescriptionStep}>
                          <div className={styles.stepNum}>1</div>
                          Apply Tebuconazole (250ml/hectare) within 24 hours.
                        </div>
                        <div className={styles.prescriptionStep}>
                          <div className={styles.stepNum}>2</div>
                          Spray during early morning (6–9am) for best absorption.
                        </div>
                        <div className={styles.prescriptionStep}>
                          <div className={styles.stepNum}>3</div>
                          Repeat dose after 14 days if humidity exceeds 85%.
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              className={styles.messageGroup}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className={`${styles.avatar} ${styles.aiAvatar}`}>AI</div>
              <div className={`${styles.bubble} ${styles.aiBubble}`}>
                <div className={styles.typingIndicator}>
                  <div className={styles.typingDot}></div>
                  <div className={styles.typingDot}></div>
                  <div className={styles.typingDot}></div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={styles.inputArea}>
          <div className={styles.inputWrapper}>
            <input
              className={styles.input}
              placeholder="Ask the AI Doctor about your crop, disease, pests or weather..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className={styles.sendBtn} onClick={() => sendMessage(inputValue)}>
              <Send size={16} />
            </button>
          </div>
          <div className={styles.inputHint}>
            AI Doctor is context-aware — it knows your farm location, crop stage, and recent scans.
          </div>
        </div>
      </div>
    </div>
  );
}
