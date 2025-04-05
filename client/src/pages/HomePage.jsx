import React from "react";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";
import Navbar from "../components/Navbar";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className="homepage-container">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Welcome to Alumni Connect</h1>
            <p>Bridging past, present, and future students</p>

            <Link to="/explore" className="cta-button">
              Explore Now
            </Link>
          </div>
        </section>

        <section className="features-section">
          <h2>Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Networking</h3>
              <p>Connect with alumni worldwide</p>

              <Link to="/networking" className="feature-link">
                Learn More
              </Link>
            </div>
            <div className="feature-card">
              <h3>Opportunities</h3>
              <p>Find career and mentorship opportunities</p>

              <Link to="/opportunities" className="feature-link">
                Learn More
              </Link>
            </div>
            <div className="feature-card">
              <h3>Community</h3>
              <p>Join our thriving community</p>

              <Link to="/community" className="feature-link">
                Learn More
              </Link>
            </div>
          </div>
        </section>

        <footer className="homepage-footer">
          <p>© 2024 Alumni Connect. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
