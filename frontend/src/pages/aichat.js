import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiRefreshCw } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import styles from '../styles/aichat.module.css';

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': 'YOUR_API_KEY_HERE'  // Replace with your actual API key
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: input
            }]
          }]
        })
      });

      const data = await response.json();
      // Add AI response
      const aiResponse = data.candidates[0].content.parts[0].text;
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
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

      <div className={styles.chatPage}>
        <div className={styles.mainContainer}>
          <div className={styles.chatContainer}>
            {/* Chat Header */}
            <div className={styles.chatHeader}>
              <h1>AI Chat Assistant</h1>
              <p>Get instant help with your questions</p>
            </div>

            {/* Chat Messages */}
            <div className={styles.chatMessages}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`${styles.messageWrapper} ${
                    message.role === 'user' ? styles.userMessageWrapper : styles.botMessageWrapper
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className={styles.botAvatar}>
                      <img src="https://cdn-icons-png.flaticon.com/512/9228/9228765.png" alt="AI" />
                    </div>
                  )}
                  <div className={`${styles.message} ${
                    message.role === 'user' ? styles.userMessage : styles.botMessage
                  }`}>
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className={styles.loadingWrapper}>
                  <div className={styles.loadingBubble}>
                    <div className={styles.loadingDot}></div>
                    <div className={styles.loadingDot}></div>
                    <div className={styles.loadingDot}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className={styles.inputContainer}>
              <div className={styles.inputWrapper}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message here..."
                  className={styles.chatInput}
                  rows="1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className={styles.sendButton}
                >
                  {isLoading ? (
                    <FiRefreshCw className={styles.loadingIcon} />
                  ) : (
                    <FiSend />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;