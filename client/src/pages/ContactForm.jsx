import React from "react";
import "../styles/contact.css";

const ContactForm = () => {
  return (
    <div className="contact-section">
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>

      <div className="contact-container">
        <div className="contact-details">
          <p className="contact-link">Contact Us</p>
          <h2 className="contact-heading">GET IN TOUCH WITH US</h2>
          <p className="contact-description">
            For inquiries, feel free to reach out or find us at the location
            below.
          </p>
          <div className="contact-info">
            <div>
              <h4>Our Location</h4>
              <p>
                D. Y. Patil Technical Campus, Sr. No. 124 & 126, A/p Ambi,
                <br />
                MIDC Road, Tal Maval, Talegaon Dabhade, Maharashtra 410507
              </p>
            </div>
            <div>
              <h4>Phone Number</h4>
              <p>+918448444230</p>
            </div>
            <div>
              <h4>Email Address</h4>
              <p>admissions@dypatiluniversitypune.edu.in</p>
            </div>
          </div>
        </div>

        <div className="map-section">
          <iframe
            title="D Y Patil Technical Campus Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3777.930331946949!2d73.664992774969!3d18.756648682383336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b21042c4bb05%3A0x520021c08d263b1e!2sDY%20PATIL%20UNIVERSITY%20PUNE%2C%20AMBI!5e0!3m2!1sen!2sin!4v1715342555971!5m2!1sen!2sin"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
