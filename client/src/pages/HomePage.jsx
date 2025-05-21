import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import "../styles/HomePage.css";
import Navbar from "../components/Navbar";
const HomePage = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      multiplier: 1,
      class: "is-reveal",
    });

    return () => {
      if (scroll) scroll.destroy();
    };
  }, []);

  const features = [
    {
      title: "Global Reach",
      desc: "Connect with alumni across the world in real time.",
    },
    {
      title: "Career Boost",
      desc: "Mentorship, referrals, and career opportunities await.",
    },
    {
      title: "Alumni Directory",
      desc: "Search and connect with alumni by batch, location, or industry.",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="homepage-container" data-scroll-container ref={scrollRef}>
        <section className="hero-section" data-scroll-section>
          <div className="hero-overlay">
            <div className="hero-content" data-scroll data-scroll-speed="6">
              <h1>
                <span className="highlight">Reconnect. Grow. Inspire.</span>
                <br />
                Welcome to <strong>Alumni Connect</strong>
              </h1>
              <p>
                Discover meaningful connections, unlock new opportunities, and
                be part of a thriving alumni network. Engage with fellow
                graduates, discover collaborative spaces, and unlock endless
                professional growth.
              </p>
              <Link to="/explore" className="cta-button">
                Get Started
              </Link>
            </div>
          </div>
        </section>

        <section className="features-section" data-scroll-section>
          <h2
            data-scroll
            data-scroll-speed="1"
            data-scroll-direction="horizontal"
          >
            Why Alumni Connect?
          </h2>
          <div className="features-grid" role="list">
            {features.map((feature, index) => (
              <article
                key={index}
                className="feature-card"
                role="listitem"
                data-scroll
                data-scroll-call="fadeIn"
                data-scroll-repeat={false}
                data-scroll-delay={index * 0.2}
              >
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="testimonials-section" data-scroll-section>
          <h2 data-scroll data-scroll-speed="1">
            What Our Alumni Say
          </h2>
          <div
            className="testimonials-grid"
            data-scroll
            data-scroll-speed="1"
            role="list"
            aria-label="Alumni testimonials"
          >
            <article
              className="testimonial-card"
              role="listitem"
              data-scroll
              data-scroll-speed="3"
            >
              <p>
                "Alumni Connect helped me reconnect with my old friends and even
                land my dream job through referrals!"
              </p>
              <h4>— Aditi Sharma, Class of 2017</h4>
            </article>
            <article
              className="testimonial-card"
              role="listitem"
              data-scroll
              data-scroll-speed="1"
            >
              <p>
                "The community is vibrant and full of opportunities. It's like
                being part of campus again, digitally!"
              </p>
              <h4>— Rahul Verma, Class of 2015</h4>
            </article>
            <article
              className="testimonial-card"
              role="listitem"
              data-scroll
              data-scroll-speed="2"
            >
              <p>
                "I found a mentor through this platform who guided me into the
                startup world. Forever grateful!"
              </p>
              <h4>— Sneha Desai, Class of 2019</h4>
            </article>
          </div>
        </section>

        <footer className="homepage-footer" data-scroll-section>
          <div className="footer-content">
            <div className="footer-links">
              <Link to="/about">About</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <p>© 2024 Alumni Connect · All rights reserved.</p>
            <div className="footer-social">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
