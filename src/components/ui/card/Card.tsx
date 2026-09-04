import React from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ className, hoverable = false, children, ...props }: CardProps) {
  return (
    <div className={clsx(styles.card, hoverable && styles.hoverable, className)} {...props}>
      {children}
    </div>
  );
}

interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: string;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
}

export function CardHeader({ className, title, subtitle, description, children, ...props }: CardHeaderProps) {
  return (
    <div className={clsx(styles.header, className)} {...props}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {subtitle && <h4 className={styles.subtitle}>{subtitle}</h4>}
      {description && <p className={styles.description}>{description}</p>}
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx(styles.content, className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx(styles.footer, className)} {...props}>
      {children}
    </div>
  );
}
