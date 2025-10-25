import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import MainLayout from '../components/MainLayout';
import '../styles/Home.css';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If user is authenticated, wrap in MainLayout for navigation
  if (user) {
    return (
      <MainLayout>
        <HomeContent user={user} navigate={navigate} />
      </MainLayout>
    );
  }

  // If not authenticated, show standalone home page
  return <HomeContent user={user} navigate={navigate} />;
};

const HomeContent = ({ user, navigate }) => {

  const features = [
    {
      icon: '📚',
      title: 'Organize Topics',
      description: 'Create and manage learning topics with cards containing resources, notes, and progress tracking.'
    },
    {
      icon: '👥',
      title: 'Collaborate with Peers',
      description: 'Connect with other learners and share your topics to learn together.'
    },
    {
      icon: '📊',
      title: 'Track Progress',
      description: 'Monitor your learning progress with visual progress bars and completion tracking.'
    },
    {
      icon: '🤝',
      title: 'Share Knowledge',
      description: 'Share your learning resources and topics with your peer network.'
    }
  ];

  const guideSteps = [
    {
      step: 1,
      title: 'Create Your First Topic',
      description: 'Start by creating a learning topic. Topics help you organize related learning materials.',
      icon: '📖'
    },
    {
      step: 2,
      title: 'Add Learning Cards',
      description: 'Add cards to your topics with resources (links, books), notes, and track your progress.',
      icon: '📄'
    },
    {
      step: 3,
      title: 'Connect with Peers',
      description: 'Search for and connect with other learners to build your learning network.',
      icon: '🔗'
    },
    {
      step: 4,
      title: 'Share Your Knowledge',
      description: 'Share your topics with peers to collaborate and learn together.',
      icon: '🌟'
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome to <span className="brand-name">TrackReso</span>
            </h1>
            <p className="hero-subtitle">
              Your personal learning dashboard to organize, track, and share knowledge with peers.
            </p>
            <div className="hero-actions">
              {user ? (
                <button 
                  className="cta-button primary"
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </button>
              ) : (
                <div className="auth-buttons">
                  <Link to="/register" className="cta-button primary">
                    Get Started Free
                  </Link>
                  <Link to="/login" className="cta-button secondary">
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-header">
                <div className="hero-card-title">📚 Machine Learning</div>
                <div className="hero-card-count">5 cards</div>
              </div>
              <div className="hero-card-items">
                <div className="hero-card-item">
                  <span>📄 Deep Learning Fundamentals</span>
                  <div className="hero-progress">
                    <div className="hero-progress-bar">
                      <div className="hero-progress-fill" style={{width: '75%'}}></div>
                    </div>
                    <span>75%</span>
                  </div>
                </div>
                <div className="hero-card-item">
                  <span>📄 Neural Networks</span>
                  <div className="hero-progress">
                    <div className="hero-progress-bar">
                      <div className="hero-progress-fill" style={{width: '45%'}}></div>
                    </div>
                    <span>45%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-content">
          <h2 className="section-title">Why Choose TrackReso?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guide Section */}
      <section className="guide-section">
        <div className="section-content">
          <h2 className="section-title">Getting Started Guide</h2>
          <p className="section-subtitle">
            Follow these simple steps to make the most of your learning journey
          </p>
          <div className="guide-steps">
            {guideSteps.map((step, index) => (
              <div key={index} className="guide-step">
                <div className="step-header">
                  <div className="step-number">{step.step}</div>
                  <div className="step-icon">{step.icon}</div>
                </div>
                <div className="step-content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
                {index < guideSteps.length - 1 && (
                  <div className="step-connector"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-content">
          <h2 className="cta-title">Ready to Start Learning?</h2>
          <p className="cta-subtitle">
            Join thousands of learners who are already organizing and sharing their knowledge.
          </p>
          {user ? (
            <button 
              className="cta-button large primary"
              onClick={() => navigate('/dashboard')}
            >
              Continue Learning
            </button>
          ) : (
            <Link to="/register" className="cta-button large primary">
              Create Your Account
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>TrackReso</h3>
            <p>Organize. Track. Share. Learn.</p>
          </div>
          <div className="footer-links">
            <div className="footer-section">
              <h4>Product</h4>
              <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/profile">Profile</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Account</h4>
              <ul>
                <li><Link to="/login">Sign In</Link></li>
                <li><Link to="/register">Sign Up</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 TrackReso. Built for learners, by learners.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
