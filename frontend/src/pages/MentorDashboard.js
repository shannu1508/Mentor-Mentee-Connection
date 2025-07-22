import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import styles from '../styles/dashboard.module.css';

const MentorDashboard = () => {
  const { user, token } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    pendingRequests: [],
    upcomingSessions: [],
    students: [],
    stats: {
      totalStudents: 0,
      completedSessions: 0,
      averageRating: 0,
      monthlyEarnings: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8001';
      
      // Fetch mentor's requests
      const requestsResponse = await fetch(`${baseUrl}/api/mentor/requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (requestsResponse.ok) {
        const requests = await requestsResponse.json();
        setDashboardData(prev => ({
          ...prev,
          pendingRequests: requests.filter(req => req.status === 'pending'),
          upcomingSessions: requests.filter(req => req.status === 'accepted'),
          stats: {
            ...prev.stats,
            totalStudents: new Set(requests.map(req => req.studentId)).size,
            completedSessions: requests.filter(req => req.status === 'completed').length
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8001';
      const response = await fetch(`${baseUrl}/api/requests/${requestId}/${action}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error(`Error ${action} request:`, error);
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
          <h1>Mentor Dashboard</h1>
          <p>Manage your mentorship sessions and students</p>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statContent}>
              <h3>{dashboardData.stats.totalStudents}</h3>
              <p>Total Students</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statContent}>
              <h3>{dashboardData.stats.completedSessions}</h3>
              <p>Completed Sessions</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>⭐</div>
            <div className={styles.statContent}>
              <h3>{dashboardData.stats.averageRating || 'N/A'}</h3>
              <p>Average Rating</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statContent}>
              <h3>${dashboardData.stats.monthlyEarnings}</h3>
              <p>Monthly Earnings</p>
            </div>
          </div>
        </div>

        <div className={styles.dashboardGrid}>
          {/* Pending Requests */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Pending Requests</h2>
              <span className={styles.badge}>{dashboardData.pendingRequests.length}</span>
            </div>
            <div className={styles.cardContent}>
              {dashboardData.pendingRequests.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No pending requests</p>
                </div>
              ) : (
                dashboardData.pendingRequests.slice(0, 3).map((request, index) => (
                  <div key={index} className={styles.requestItem}>
                    <div className={styles.requestDetails}>
                      <h4>Session Request</h4>
                      <p><strong>Date:</strong> {new Date(request.date).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {request.time}</p>
                      <p><strong>Topic:</strong> {request.doubt}</p>
                      <p><strong>Student:</strong> {request.studentNumber}</p>
                    </div>
                    <div className={styles.requestActions}>
                      <button 
                        className={styles.acceptBtn}
                        onClick={() => handleRequestAction(request._id, 'accept')}
                      >
                        Accept
                      </button>
                      <button 
                        className={styles.rejectBtn}
                        onClick={() => handleRequestAction(request._id, 'reject')}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Upcoming Sessions</h2>
            </div>
            <div className={styles.cardContent}>
              {dashboardData.upcomingSessions.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No upcoming sessions</p>
                </div>
              ) : (
                dashboardData.upcomingSessions.slice(0, 3).map((session, index) => (
                  <div key={index} className={styles.sessionItem}>
                    <div className={styles.sessionDate}>
                      <span>{new Date(session.date).toLocaleDateString()}</span>
                      <span>{session.time}</span>
                    </div>
                    <div className={styles.sessionDetails}>
                      <h4>Session with Student</h4>
                      <p>{session.doubt}</p>
                      <small>Student: {session.studentNumber}</small>
                    </div>
                    <button className={styles.startBtn}>Start Session</button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Student Progress */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Student Progress</h2>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.progressItem}>
                <div className={styles.studentProgress}>
                  <img src="https://via.placeholder.com/40" alt="Student" className={styles.studentAvatar} />
                  <div className={styles.studentInfo}>
                    <h4>John Doe</h4>
                    <p>JavaScript Fundamentals</p>
                  </div>
                  <div className={styles.progressPercentage}>85%</div>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{width: '85%'}}></div>
                </div>
              </div>
              <div className={styles.progressItem}>
                <div className={styles.studentProgress}>
                  <img src="https://via.placeholder.com/40" alt="Student" className={styles.studentAvatar} />
                  <div className={styles.studentInfo}>
                    <h4>Jane Smith</h4>
                    <p>React Development</p>
                  </div>
                  <div className={styles.progressPercentage}>72%</div>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{width: '72%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Reviews */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Recent Reviews</h2>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
                  <span>2 days ago</span>
                </div>
                <p>"Excellent mentor! Very patient and knowledgeable."</p>
                <small>- Anonymous Student</small>
              </div>
              <div className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
                  <span>1 week ago</span>
                </div>
                <p>"Helped me understand React concepts clearly."</p>
                <small>- Anonymous Student</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;