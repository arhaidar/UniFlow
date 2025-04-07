import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Error404.module.css'; // Importing CSS module

export const Error404 = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className={styles.homeLink}>
        Go Back Home
      </Link>
    </div>
  );
};
