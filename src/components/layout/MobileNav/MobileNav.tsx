'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './MobileNav.module.css';
import { LayoutDashboard, Scan, Map, BrainCircuit, TrendingUp } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', icon: <LayoutDashboard size={22} />, label: 'Home' },
  { href: '/scan', icon: <Scan size={22} />, label: 'Scan', primary: true },
  { href: '/risk', icon: <TrendingUp size={22} />, label: 'Risk' },
  { href: '/map', icon: <Map size={22} />, label: 'Map' },
  { href: '/doctor', icon: <BrainCircuit size={22} />, label: 'Doctor' },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.mobileNav}>
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${isActive ? styles.active : ''} ${item.primary ? styles.primary : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
