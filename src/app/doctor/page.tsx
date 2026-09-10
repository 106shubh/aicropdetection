'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './doctor.module.css';
import { Button } from '@/components/ui/button/Button';
import {
  BrainCircuit, Send, ArrowLeft, Leaf, CloudRain,
  Thermometer, Sprout, FlaskConical, MapPin, Clock, User, Sparkles
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

export default function DoctorPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages,
          context: {
            location: 'Nashik, MH',
            crop: 'Wheat (Tillering)',
            weather: '14°C / 25°C, High Rain Risk (80mm)',
            recentScan: 'Stripe Rust (Critical)'
          }
        })
      });

      if (!response.ok) throw new Error('API Error');

      setIsTyping(false);
      
      const aiMsgId = Date.now().toString();
      setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', content: '' }]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (reader) {
        let aiText = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          aiText += decoder.decode(value, { stream: true });
          
          setMessages(prev => prev.map(m => 
            m.id === aiMsgId ? { ...m, content: aiText } : m
          ));
        }
      }

    } catch (error) {
      console.error(error);
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: 'An error occurred. Please make sure your GEMINI_API_KEY is configured in the .env.local file.' }]);
    }
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

        <div className={styles.sectionDivider}>Recent Queries</div>

        {messages.filter(m => m.role === 'user').slice(-4).reverse().map((msg, i) => (
          <div key={i} className={styles.historyItem}>
            <div className={styles.historyDot} style={{ background: 'var(--color-muted-green)' }}></div>
            <div>
              <div className={styles.historyText} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{msg.content}</div>
              <div className={styles.historyDate}><Clock size={10} style={{ display: 'inline', marginRight: 3 }} />Just now</div>
            </div>
          </div>
        ))}
        {messages.filter(m => m.role === 'user').length === 0 && (
          <div className={styles.historyText} style={{ fontStyle: 'italic', color: '#aaa', padding: '0 12px' }}>No queries yet.</div>
        )}
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
                  <div className={`${styles.avatar} ${msg.role === 'user' ? styles.userAvatar : styles.aiAvatar}`}>
                    {msg.role === 'user' ? <User size={20} strokeWidth={2.5} /> : <Sparkles size={20} strokeWidth={2.5} />}
                  </div>
                  <div className={styles.messageContent}>
                    <div className={styles.bubbleLabel}>
                      {msg.role === 'user' ? 'You' : 'AI Agronomist'}
                    </div>
                    <div className={`${styles.bubble} ${msg.role === 'user' ? styles.userBubble : styles.aiBubble}`}>
                      <div dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }} />
                    </div>
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
