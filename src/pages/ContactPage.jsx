import React, { useState } from "react";
import Seo from "../components/common/Seo";
import { Mail, MessageSquare, Send, CheckCircle2, Info } from "lucide-react";
import "./ContactPage.css";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.message) return;
    setSubmitted(true);
  };

  return (
    <div className="contact-container">
      <Seo
        title="Contact Us & About | Playntric"
        description="Get in touch with the Playntric team for publisher support, inquiries, or feedback."
        path="/contact"
      />

      <div className="contact-header">
        <div className="contact-icon-wrap">
          <Mail size={36} />
        </div>
        <h1>Contact & About Us</h1>
        <p className="contact-subtitle">We would love to hear from our players & partners</p>
      </div>

      <div className="contact-grid">
        {/* About Info */}
        <div className="info-card">
          <h2><Info size={20} className="info-icon" /> About Playntric</h2>
          <p>
            Playntric is a premier online browser gaming platform offering high-quality,
            instant-play games including Sudoku, Chess, Wordle, Tic Tac Toe, and Math Speed Challenge.
          </p>
          <p>
            Our mission is to provide fast, accessible, and beautifully designed web games
            accessible across desktop and modern mobile devices without requiring downloads or installations.
          </p>

          <div className="contact-direct">
            <h3>Direct Inquiries</h3>
            <p><strong>Email Support:</strong> <a href="mailto:support@playntric.com">support@playntric.com</a></p>
            <p><strong>Publisher / Ads:</strong> <a href="mailto:ads@playntric.com">ads@playntric.com</a></p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="form-card">
          <h2><MessageSquare size={20} className="info-icon" /> Send Us a Message</h2>

          {submitted ? (
            <div className="contact-success">
              <CheckCircle2 size={40} />
              <h3>Thank You!</h3>
              <p>Your message has been sent successfully. We will reply shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="contact-name">Your Name</label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-email">Email Address</label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  placeholder="Feedback / Question"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  rows="4"
                  placeholder="Type your message here..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                ></textarea>
              </div>

              <button type="submit" className="contact-submit-btn">
                <Send size={16} /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
