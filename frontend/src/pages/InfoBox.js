import React, { useState } from 'react';
import styles from '../styles/InfoBox.module.css';
import { Link } from 'react-router-dom';

const InfoBox = () => {
    const [input, setInput] = useState('');
    const [information, setInformation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            getInformation();
        }
    };

    const getInformation = async () => {
        if (!input.trim()) return;

        setLoading(true);
        setError('');

        // Update API endpoint to use port 5000
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8001';
        console.log('Attempting to fetch from:', apiUrl);

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message: input 
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Server error: ${response.status}`);
            }

            const data = await response.json();
            setInformation(data.response || data.text || data.message);
        } catch (err) {
            setError(`Failed to get information: ${err.message}`);
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

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
                            <li><Link to="#" className={styles.navLink}>Contact Us</Link></li>
                            <li><Link to="/about" className={styles.navLink}>About Us</Link></li>
                        </ul>
                    </nav>
                    <div className={styles.navButtons}>
                        <Link to="/signup" className={styles.btn}>Sign Up</Link>
                        <Link to="/login" className={`${styles.btn} ${styles.loginBtn}`}>Login</Link>
                    </div>
                </div>
            </header>
            
            <div className={styles['info-box-container']}>
                <div className={styles['info-box']}>
                    <h2>Knowledge Explorer</h2>
                    <div className={styles['input-section']}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter a topic to learn about..."
                            className={styles['info-input']}
                        />
                        <button 
                            onClick={getInformation}
                            disabled={loading}
                            className={styles['info-button']}
                        >
                            {loading ? 'Getting Info...' : 'Get Information'}
                        </button>
                    </div>
                    {error && (
                        <div className={styles['error-message']}>
                            {error}
                        </div>
                    )}
                    {loading && (
                        <div className={styles['loading-spinner']}>
                            <div className={styles.spinner}></div>
                            <p>Fetching information...</p>
                        </div>
                    )}
                    {information && !loading && (
                        <div className={styles['info-content']}>
                            <h3>Information About: {input}</h3>
                            <div className={styles['info-text']}>
                                {information.split('\n').map((line, index) => (
                                    <p key={index}>{line}</p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InfoBox;