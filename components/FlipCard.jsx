// components/FlipCard.jsx
import { useState } from 'react';
import styles from '../styles/FlipCard.module.css';

export default function FlipCard({ front, back }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`${styles['flip-card']} ${flipped ? styles.flipped : ''}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className={styles['flip-card-inner']}>
        <div className={styles['flip-card-front']}>{front}</div>
        <div className={styles['flip-card-back']}>{back}</div>
      </div>
    </div>
  );
}
