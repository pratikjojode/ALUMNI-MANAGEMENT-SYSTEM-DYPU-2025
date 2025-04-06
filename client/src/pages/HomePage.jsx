import React from "react";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";
import Navbar from "../components/Navbar";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className="homepage-container">
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-overlay">
            <div className="hero-content">
              <h1>
                Welcome to <strong>Alumni Connect</strong> — Where legacy meets
                opportunity.
              </h1>

              <p>
                Engage with fellow graduates, discover collaborative spaces, and
                unlock endless professional growth. Join a network that grows
                with you — from campus memories to corporate milestones.
              </p>
              <Link to="/explore" className="cta-button">
                Get Started
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <div className="parll">
          <section className="features-section">
            <h2>Why Alumni Connect?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>Global Reach</h3>
                <p>Connect with alumni across the world in real time.</p>
              </div>
              <div className="feature-card">
                <h3>Career Boost</h3>
                <p>Mentorship, referrals, and career opportunities await.</p>
              </div>
              <div className="feature-card">
                <h3>Alumni Directory</h3>
                <p>
                  Search and connect with alumni by batch, location, or
                  industry.
                </p>
              </div>
              <div className="feature-card">
                <h3>Success Stories</h3>
                <p>
                  Be inspired by alumni journeys and get featured in our
                  spotlight.
                </p>
              </div>
            </div>
          </section>

          {/* TESTIMONIALS SECTION */}
          <section className="testimonials-section">
            <h2>What Our Alumni Say</h2>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <p>
                  "Alumni Connect helped me reconnect with my old friends and
                  even land my dream job through referrals!"
                </p>
                <h4>— Aditi Sharma, Class of 2017</h4>
              </div>
              <div className="testimonial-card">
                <p>
                  "The community is vibrant and full of opportunities. It's like
                  being part of campus again, digitally!"
                </p>
                <h4>— Rahul Verma, Class of 2015</h4>
              </div>
              <div className="testimonial-card">
                <p>
                  "I found a mentor through this platform who guided me into the
                  startup world. Forever grateful!"
                </p>
                <h4>— Sneha Desai, Class of 2019</h4>
              </div>
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <footer className="homepage-footer">
          <p>© 2024 Alumni Connect · All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
