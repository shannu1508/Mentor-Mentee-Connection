import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/AboutUs.module.css';

const AboutUs = () => {
    return (
        <div className={styles.container}>
            <header>
                <div className={styles.navbar}>
                    <div className={styles.logo}>
                        <img src="https://cdn-icons-png.flaticon.com/512/9228/9228765.png" alt="Logo" />
                        Mentorlink
                    </div>
                    <nav>
                        <ul className={styles.navList}>
                            <li><Link to="/" className={styles.navLink}>Home</Link></li>
                            <li><Link to="/aichat" className={styles.navLink}>AI Assistant</Link></li>
                            <li><Link to="/find-mentor" className={styles.navLink}>Find Mentors</Link></li>
                            <li><Link to="/about" className={styles.navLink}>About Us</Link></li>
                            <li><Link to="#" className={styles.navLink}>Contact Us</Link></li>
                        </ul>
                    </nav>
                    <div className={styles.navButtons}>
                        <Link to="/signup" className={styles.btn}>Sign Up</Link>
                        <Link to="/login" className={`${styles.btn} ${styles.loginBtn}`}>Login</Link>
                    </div>
                </div>
            </header>

            <main className={styles.mainContent}>
                <section className={styles.hero}>
                    <h1>About Mentorlink</h1>
                    <p className={styles.tagline}>Connecting Minds, Building Futures</p>
                </section>

                <section className={styles.mission}>
                    <h2>Our Mission</h2>
                    <p>At Mentorlink, we believe in the power of mentorship to transform lives and careers. Our platform bridges the gap between aspiring professionals and experienced mentors, creating meaningful connections that foster growth and success.</p>
                </section>

                <section className={styles.features}>
                    <h2>What We Offer</h2>
                    <div className={styles.featureGrid}>
                        <div className={styles.featureCard}>
                            <h3>AI-Powered Assistant</h3>
                            <p>Get instant answers to your questions with our advanced AI assistant, powered by cutting-edge technology.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <h3>Mentor Matching</h3>
                            <p>Find the perfect mentor based on your industry, goals, and preferences through our intelligent matching system.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <h3>Knowledge Explorer</h3>
                            <p>Access a vast database of resources and information to support your learning journey.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <h3>Community Support</h3>
                            <p>Join a thriving community of learners and professionals sharing experiences and insights.</p>
                        </div>
                    </div>
                </section>

                <section className={styles.values}>
                    <h2>Our Values</h2>
                    <div className={styles.valuesList}>
                        <div className={styles.valueItem}>
                            <h3>Innovation</h3>
                            <p>Embracing cutting-edge technology to enhance the mentorship experience.</p>
                        </div>
                        <div className={styles.valueItem}>
                            <h3>Accessibility</h3>
                            <p>Making quality mentorship available to everyone, everywhere.</p>
                        </div>
                        <div className={styles.valueItem}>
                            <h3>Growth</h3>
                            <p>Fostering continuous learning and professional development.</p>
                        </div>
                    </div>
                </section>

                <section className={styles.team}>
                    <h2>Join Our Community</h2>
                    <p>Whether you're looking to grow your career or share your expertise, Mentorlink is your platform for success.</p>
                    <div className={styles.cta}>
                        <Link to="/signup" className={styles.ctaButton}>Get Started Today</Link>
                    </div>
                </section>
            </main>

            <footer className={styles.footer}>
                <p>&copy; 2024 Mentorlink. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AboutUs; 