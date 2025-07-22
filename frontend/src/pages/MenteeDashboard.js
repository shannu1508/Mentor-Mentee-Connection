import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import styles from '../styles/dashboard.module.css';

const MenteeDashboard = () => {
  const { user, token } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    upcomingSessions: [],
    activeMentors: [],
    recentChats: [],
    stats: {
      totalSessions: 0,
      activeMentorships: 0,
      completedGoals: 0,
      averageRating: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8001';
      
      // Fetch user's requests and sessions
      const requestsResponse = await fetch(`${baseUrl}/api/mentee/requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (requestsResponse.ok) {
        const requests = await requestsResponse.json();
        setDashboardData(prev => ({
          ...prev,
          upcomingSessions: requests.filter(req => req.status === 'accepted'),
          stats: {
            ...prev.stats,
            totalSessions: requests.length,
            activeMentorships: requests.filter(req => req.status === 'accepted').length
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.dashboardContainer}>
        <div className={styles.header}>
          <h1>Welcome back, {user?.fullName}!</h1>
          <p>Here's your learning journey overview</p>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📚</div>
            <div className={styles.statContent}>
              <h3>{dashboardData.stats.totalSessions}</h3>
              <p>Total Sessions</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👨‍🏫</div>
            <div className={styles.statContent}>
              <h3>{dashboardData.stats.activeMentorships}</h3>
              <p>Active Mentorships</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🎯</div>
            <div className={styles.statContent}>
              <h3>{dashboardData.stats.completedGoals}</h3>
              <p>Goals Achieved</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>⭐</div>
            <div className={styles.statContent}>
              <h3>{dashboardData.stats.averageRating || 'N/A'}</h3>
              <p>Avg Rating Given</p>
            </div>
          </div>
        </div>

        <div className={styles.dashboardGrid}>
          {/* Upcoming Sessions */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Upcoming Sessions</h2>
              <span className={styles.badge}>{dashboardData.upcomingSessions.length}</span>
            </div>
            <div className={styles.cardContent}>
              {dashboardData.upcomingSessions.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No upcoming sessions</p>
                  <button className={styles.primaryBtn} onClick={() => window.location.href = '/find-mentor'}>
                    Find a Mentor
                  </button>
                </div>
              ) : (
                dashboardData.upcomingSessions.slice(0, 3).map((session, index) => (
                  <div key={index} className={styles.sessionItem}>
                    <div className={styles.sessionDate}>
                      <span>{new Date(session.date).toLocaleDateString()}</span>
                      <span>{session.time}</span>
                    </div>
                    <div className={styles.sessionDetails}>
                      <h4>Session with Mentor</h4>
                      <p>{session.doubt}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Mentors */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Your Mentors</h2>
            </div>
            <div className={styles.cardContent}>
              {dashboardData.activeMentors.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>Connect with mentors to start your journey</p>
                  <button className={styles.secondaryBtn} onClick={() => window.location.href = '/find-mentor'}>
                    Browse Mentors
                  </button>
                </div>
              ) : (
                dashboardData.activeMentors.map((mentor, index) => (
                  <div key={index} className={styles.mentorItem}>
                    <img src="https://via.placeholder.com/40" alt="Mentor" className={styles.mentorAvatar} />
                    <div className={styles.mentorInfo}>
                      <h4>{mentor.name}</h4>
                      <p>{mentor.expertise}</p>
                    </div>
                    <button className={styles.chatBtn}>Chat</button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Learning Progress */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Learning Progress</h2>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.progressItem}>
                <div className={styles.progressHeader}>
                  <span>JavaScript Fundamentals</span>
                  <span>75%</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{width: '75%'}}></div>
                </div>
              </div>
              <div className={styles.progressItem}>
                <div className={styles.progressHeader}>
                  <span>React Development</span>
                  <span>60%</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{width: '60%'}}></div>
                </div>
              </div>
              <div className={styles.progressItem}>
                <div className={styles.progressHeader}>
                  <span>Node.js Backend</span>
                  <span>30%</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{width: '30%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Recent Activity</h2>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>💬</div>
                <div className={styles.activityContent}>
                  <p>New message from mentor</p>
                  <span>2 hours ago</span>
                </div>
              </div>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>📝</div>
                <div className={styles.activityContent}>
                  <p>Completed React basics assignment</p>
                  <span>1 day ago</span>
                </div>
              </div>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>⭐</div>
                <div className={styles.activityContent}>
                  <p>Rated mentor 5 stars</p>
                  <span>3 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenteeDashboard;