import type { ReactNode, HTMLAttributes } from 'react';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: 'default' | 'compact' | 'none';
  children: ReactNode;
}

export function Card({
  hoverable = false,
  padding = 'default',
  className = '',
  children,
  ...props
}: CardProps) {
  const paddingClass = padding === 'none' ? styles.noPadding : padding === 'compact' ? styles.compact : '';
  const classes = [
    styles.card,
    hoverable ? styles.hoverable : '',
    paddingClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export function CardImage({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img className={styles.cardImage} src={src} alt={alt} {...props} />;
}

export function CardBody({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${styles.cardBody} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className={styles.cardTitle}>{children}</h3>;
}

export function CardFooter({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${styles.cardFooter} ${className}`} {...props}>
      {children}
    </div>
  );
}
