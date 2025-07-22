import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/navbar.module.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isMentor, isMentee } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header>
      <div className={styles.navbar}>
        <div className={styles.logo}>
          <img src="https://cdn-icons-png.flaticon.com/512/9228/9228765.png" alt="Logo" />
          <Link to="/" className={styles.logoText}>Mentorlink</Link>
        </div>
        <nav>
          <ul className={styles.navList}>
            <li><Link to="/" className={styles.navLink}>Home</Link></li>
            {isAuthenticated() && (
              <>
                {isMentee() && (
                  <>
                    <li><Link to="/mentee/dashboard" className={styles.navLink}>Dashboard</Link></li>
                    <li><Link to="/find-mentor" className={styles.navLink}>Find Mentors</Link></li>
                    <li><Link to="/mentee/chat" className={styles.navLink}>Chat</Link></li>
                  </>
                )}
                {isMentor() && (
                  <>
                    <li><Link to="/mentor/dashboard" className={styles.navLink}>Dashboard</Link></li>
                    <li><Link to="/mentor/students" className={styles.navLink}>My Students</Link></li>
                    <li><Link to="/mentor/chat" className={styles.navLink}>Chat</Link></li>
                  </>
                )}
              </>
            )}
            <li><Link to="/aichat" className={styles.navLink}>AI Assistant</Link></li>
            <li><Link to="/about" className={styles.navLink}>About Us</Link></li>
          </ul>
        </nav>
        <div className={styles.navButtons}>
          {isAuthenticated() ? (
            <div className={styles.userSection}>
              <span className={styles.userName}>Welcome, {user?.fullName}</span>
              <button onClick={handleLogout} className={`${styles.btn} ${styles.logoutBtn}`}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/signup" className={styles.btn}>Sign Up</Link>
              <Link to="/login" className={`${styles.btn} ${styles.loginBtn}`}>Login</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;