import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import styles from '../styles/home.module.css';

const Home = () => {
  const { isAuthenticated, isMentor, isMentee } = useAuth();

  const getStartedLink = () => {
    if (isAuthenticated()) {
      if (isMentor()) return "/mentor/dashboard";
      if (isMentee()) return "/find-mentor";
    }
    return "/signup";
  };

  return (
    <div className={styles.container}>
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Boost Your Skills With <br /> Personalized 1 On 1 Mentorship</h1>
          <p className={styles.heroText}>Unlock your potential with personalized, one-on-one mentorship tailored to your goals. Connect with experts, get actionable insights, and accelerate your growth with Mentorlink.</p>
          <Link to={getStartedLink()} className={styles.getStarted}>
            {isAuthenticated() ? (isMentor() ? "Go to Dashboard" : "Find Mentors") : "Get Started"} →
          </Link>
        </div>
        
        <div className={styles.heroImage}>
          <div className={styles.mentorVideo}>
            <img src="https://img.freepik.com/free-photo/young-woman-teacher-wearing-glasses-sitting-desk-using-laptop-computer-teaching-online-virtual-class_637285-5948.jpg" 
                 alt="Mentor" 
                 className={styles.mentorImage} />
            <div className={styles.videoIcons}>
              <span className={styles.iconWrapper}>💡</span>
              <span className={styles.iconWrapper}>⏳</span>
              <span className={styles.iconWrapper}>🎤</span>
            </div>
            <div className={styles.videoControls}>
              <span className={styles.controlWrapper}>🔴</span>
              <span className={styles.controlWrapper}>🎤</span>
              <span className={styles.controlWrapper}>📹</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.whyChooseUs}>
        <h2 className={styles.sectionTitle}>Why Choose Us?</h2>
        <p className={styles.sectionText}>We have experienced professionals from every field that you can think of.</p>
        
        <div className={styles.features}>
          <div className={styles.featureCard}>
            <img src="https://cdn-icons-png.flaticon.com/512/1535/1535012.png" alt="Expert Mentors" />
            <h3>Expert Mentors</h3>
            <p>Connect with industry-leading professionals</p>
          </div>
          <div className={styles.featureCard}>
            <img src="https://cdn-icons-png.flaticon.com/512/2620/2620669.png" alt="Flexible Schedule" />
            <h3>Flexible Schedule</h3>
            <p>Learn at your own pace and convenience</p>
          </div>
          <div className={styles.featureCard}>
            <img src="https://cdn-icons-png.flaticon.com/512/1534/1534938.png" alt="Personalized Learning" />
            <h3>Personalized Learning</h3>
            <p>Customized guidance for your goals</p>
          </div>
        </div>
      </section>

      <section className={styles.stats}>
        <div className={styles.statItem}>
          <h3>10K+</h3>
          <p>Active Students</p>
        </div>
        <div className={styles.statItem}>
          <h3>500+</h3>
          <p>Expert Mentors</p>
        </div>
        <div className={styles.statItem}>
          <h3>50+</h3>
          <p>Countries</p>
        </div>
        <div className={styles.statItem}>
          <h3>95%</h3>
          <p>Success Rate</p>
        </div>
      </section>

      <section className={styles.testimonials}>
        <h2>What Our Students Say</h2>
        <div className={styles.testimonialCards}>
          <div className={styles.testimonialCard}>
            <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Student" />
            <p>"The mentorship program transformed my career path completely. Highly recommended!"</p>
            <h4>Sarah Johnson</h4>
            <span>Software Developer</span>
          </div>
          <div className={styles.testimonialCard}>
            <img src="https://randomuser.me/api/portraits/men/22.jpg" alt="Student" />
            <p>"Found my perfect mentor who helped me achieve my goals faster than I expected."</p>
            <h4>Michael Chen</h4>
            <span>UX Designer</span>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <h2>Ready to Start Your Journey?</h2>
        <p>Join thousands of successful students who have transformed their careers with Mentorlink</p>
        <div className={styles.ctaButtons}>
          <Link to={getStartedLink()} className={`${styles.btn} ${styles.primaryBtn}`}>
            {isAuthenticated() ? "Go to Dashboard" : "Get Started Now"}
          </Link>
          <Link to="/about" className={`${styles.btn} ${styles.secondaryBtn}`}>Learn More</Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerBottom}>
          <p>&copy; 2024 Mentorlink. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;