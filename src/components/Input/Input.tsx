import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import styles from './Input.module.css';

interface BaseInputProps {
  label?: string;
  error?: string;
}

type InputFieldProps = BaseInputProps &
  InputHTMLAttributes<HTMLInputElement> & {
    multiline?: false;
  };

type TextareaProps = BaseInputProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    multiline: true;
  };

type InputProps = InputFieldProps | TextareaProps;

export function Input(props: InputProps) {
  const { label, error, multiline, className = '', ...rest } = props;

  const wrapperClasses = [styles.wrapper, error ? styles.error : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClasses}>
      {label && <label className={styles.label}>{label}</label>}
      {multiline ? (
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          className={styles.input}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
