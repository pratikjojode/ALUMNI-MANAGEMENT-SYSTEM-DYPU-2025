import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { FiClock, FiUser, FiArrowRight } from "react-icons/fi";
import "../styles/AlumniStoriesHome.css";

const AlumniStoriesHome = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch("/api/v1/success-stories/outstanding");
        if (!response.ok) throw new Error("Failed to fetch stories");
        const data = await response.json();
        setStories(data.stories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return (
    <div className="alumni-stories">
      <Navbar />

      <section className="stories-hero">
        <div className="hero-content">
          <h1 className="hero-title">Meet Our Outstanding Alumni</h1>
          <p className="hero-subtitle">
            Discover how our exceptional alumni have made an impact in their
            fields and communities.
          </p>
        </div>
      </section>

      <div className="stories-container">
        {loading ? (
          <div className="loading-spinner"></div>
        ) : error ? (
          <div className="error-message">⚠️ Error: {error}</div>
        ) : stories.length === 0 ? (
          <div className="no-stories">
            No outstanding success stories available at the moment.
          </div>
        ) : (
          <div className="stories-grid">
            {stories.map((story) => (
              <article key={story._id} className="story-card">
                <div className="card-image">
                  {story.image && (
                    <img src={story.image} alt={`${story.name}'s story`} />
                  )}
                </div>
                <div className="card-content">
                  <h3 className="card-title">{story.name}</h3>
                  <div className="card-meta">
                    <span className="meta-item">
                      <FiUser className="meta-icon" />
                      {story.alumni?.name || "Anonymous"}
                    </span>
                    <span className="meta-item">
                      <FiClock className="meta-icon" />
                      {new Date(story.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="card-excerpt">{story.shortDescription}</p>
                  <button className="card-button">
                    Read More
                    <FiArrowRight className="button-icon" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniStoriesHome;
