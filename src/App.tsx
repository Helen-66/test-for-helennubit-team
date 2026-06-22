import { useState } from 'react';
import {
  Button,
  Input,
  Card,
  CardBody,
  Modal,
  StarRating,
  MovieCard,
  ThemeToggle,
} from './index';
import styles from './App.module.css';

const SAMPLE_MOVIES = [
  { title: 'Spirited Away', year: 2001, rating: 5 },
  { title: 'Parasite', year: 2019, rating: 5 },
  { title: 'In the Mood for Love', year: 2000, rating: 4 },
  { title: 'Cinema Paradiso', year: 1988, rating: 4 },
];

const COLOR_SWATCHES = [
  { name: 'Primary', var: '--color-primary' },
  { name: 'Secondary', var: '--color-secondary' },
  { name: 'Accent', var: '--color-accent' },
  { name: 'Background', var: '--color-bg' },
  { name: 'Surface', var: '--color-surface' },
  { name: 'Text', var: '--color-text-primary' },
];

export function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [rating, setRating] = useState(3);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Design System</h1>
        <ThemeToggle />
      </header>

      {/* Colors */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Colors</h2>
        <div className={styles.colorGrid}>
          {COLOR_SWATCHES.map((swatch) => (
            <div key={swatch.var} className={styles.colorSwatch}>
              <div
                className={styles.swatchColor}
                style={{ backgroundColor: `var(${swatch.var})` }}
              />
              <div className={styles.swatchLabel}>{swatch.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Typography</h2>
        <div className={styles.typographyDemo}>
          <h1>Heading 1 – Display</h1>
          <h2>Heading 2 – Section</h2>
          <h3>Heading 3 – Subsection</h3>
          <h4>Heading 4 – Label</h4>
          <p>
            Body text – The quick brown fox jumps over the lazy dog. A warm evening
            at the cinema, the projector hums softly as the credits roll.
          </p>
          <small>Caption text – Release date, runtime, director</small>
        </div>
      </section>

      {/* Buttons */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Buttons</h2>
        <div className={styles.row}>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="primary" size="lg">Large</Button>
        </div>
        <div className={styles.row} style={{ marginTop: 'var(--space-3)' }}>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      {/* Inputs */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Inputs</h2>
        <div className={styles.column}>
          <Input label="Movie Title" placeholder="Search for a movie..." />
          <Input label="Review" multiline placeholder="Write your thoughts..." />
          <Input label="Email" error="Invalid email address" placeholder="you@example.com" />
        </div>
      </section>

      {/* Cards */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Cards</h2>
        <div className={styles.row}>
          <Card hoverable>
            <CardBody>
              <h4>Basic Card</h4>
              <p style={{ marginBottom: 0 }}>A simple content card with hover effect.</p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Star Rating */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Star Rating</h2>
        <div className={styles.column}>
          <div className={styles.row}>
            <span>Interactive:</span>
            <StarRating value={rating} onChange={setRating} size="lg" />
            <span>{rating}/5</span>
          </div>
          <div className={styles.row}>
            <span>Read-only:</span>
            <StarRating value={4} readonly size="md" />
          </div>
          <div className={styles.row}>
            <span>Small:</span>
            <StarRating value={3} readonly size="sm" />
          </div>
        </div>
      </section>

      {/* Movie Cards */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Movie Cards</h2>
        <div className={styles.movieGrid}>
          {SAMPLE_MOVIES.map((movie) => (
            <MovieCard
              key={movie.title}
              title={movie.title}
              year={movie.year}
              rating={movie.rating}
              onClick={() => setModalOpen(true)}
            />
          ))}
        </div>
      </section>

      {/* Modal */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Modal</h2>
        <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Movie Details"
          footer={
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setModalOpen(false)}>Save</Button>
            </>
          }
        >
          <p>This is a modal dialog for displaying movie details, writing reviews, or editing entries.</p>
          <StarRating value={4} onChange={() => {}} size="lg" />
        </Modal>
      </section>
    </div>
  );
}
