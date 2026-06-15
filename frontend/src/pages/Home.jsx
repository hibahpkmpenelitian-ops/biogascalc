import { useState, useEffect } from 'react';
import api from '../api/axios';
import './Home.css';

function Home() {
  const [apiStatus, setApiStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await api.get('/example');
        setApiStatus({ connected: true, data: res.data });
      } catch {
        setApiStatus({ connected: false });
      } finally {
        setLoading(false);
      }
    };
    checkApi();
  }, []);

  return (
    <main className="home" id="home-page">
      <section className="hero" id="hero-section">
        <div className="hero-bg-orb hero-bg-orb--1" aria-hidden="true" />
        <div className="hero-bg-orb hero-bg-orb--2" aria-hidden="true" />
        <div className="hero-bg-orb hero-bg-orb--3" aria-hidden="true" />

        <div className="container hero-content">
          <span className="hero-badge animate-fade-in-up">
            MERN Stack Application
          </span>
          <h1 className="hero-title animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Welcome to <span className="gradient-text">BiogasCalc</span>
          </h1>
          <p className="hero-subtitle animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Biogas Calculator Application — built with MongoDB, Express.js, React, and Node.js
          </p>
        </div>
      </section>

      <section className="stack-section container" id="stack-section">
        <h2 className="section-title">Tech Stack</h2>
        <div className="stack-grid">
          {techStack.map((tech, i) => (
            <div
              key={tech.name}
              className="stack-card glass animate-fade-in-up"
              style={{ animationDelay: `${0.1 * (i + 1)}s` }}
              id={`stack-card-${tech.name.toLowerCase()}`}
            >
              <span className="stack-card-icon">{tech.icon}</span>
              <h3 className="stack-card-name">{tech.name}</h3>
              <p className="stack-card-desc">{tech.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="status-section container" id="status-section">
        <h2 className="section-title">API Status</h2>
        <div className="status-card glass animate-fade-in-up">
          {loading ? (
            <div className="status-loading">
              <div className="status-spinner" />
              <p>Connecting to backend...</p>
            </div>
          ) : apiStatus?.connected ? (
            <div className="status-connected">
              <span className="status-dot status-dot--online" />
              <div>
                <p className="status-label">Backend Connected</p>
                <p className="status-detail">
                  {apiStatus.data?.count ?? 0} records in database
                </p>
              </div>
            </div>
          ) : (
            <div className="status-disconnected">
              <span className="status-dot status-dot--offline" />
              <div>
                <p className="status-label">Backend Offline</p>
                <p className="status-detail">
                  Start the backend server with <code>npm run dev:backend</code>
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

const techStack = [
  {
    name: 'MongoDB',
    description: 'NoSQL document database for flexible data storage',
  },
  {
    name: 'Express',
    description: 'Fast, minimalist web framework for Node.js',
  },
  {
    name: 'React',
    description: 'Component-based UI library for building interfaces',
  },
  {
    name: 'Node.js',
    description: 'JavaScript runtime for server-side development',
  },
];

export default Home;
