import React from "react";
import Seo from "../components/common/Seo";
import { FileText, ShieldAlert, CheckCircle, Scale } from "lucide-react";
import "./TermsPage.css";

export default function TermsPage() {
  return (
    <div className="terms-container">
      <Seo
        title="Terms of Service | Playntric"
        description="Review Playntric's Terms of Service governing website usage, content policies, and service agreements."
        path="/terms"
      />

      <div className="terms-header">
        <div className="terms-icon-wrap">
          <Scale size={36} />
        </div>
        <h1>Terms of Service</h1>
        <p className="terms-subtitle">Effective Date: August 6, 2026</p>
      </div>

      <div className="terms-card">
        <section className="terms-section">
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing or using <strong>Playntric</strong> (
            <a href="https://playntric.vercel.app">https://playntric.vercel.app</a>),
            you agree to be bound by these Terms of Service. If you disagree with
            any part of these terms, you may not access the website or use any of our
            browser games.
          </p>
        </section>

        <section className="terms-section">
          <h2>2. Intellectual Property Rights</h2>
          <p>
            Unless otherwise indicated, Playntric and/or its licensors own the
            intellectual property rights for all material on Playntric. All
            intellectual property rights are reserved. You may access this from
            Playntric for your own personal use subject to restrictions set in these
            terms and conditions.
          </p>
        </section>

        <section className="terms-section">
          <h2>3. User Restrictions</h2>
          <p>You are specifically restricted from all of the following:</p>
          <ul>
            <li>Republishing material from Playntric in any media without attribution;</li>
            <li>Selling, sublicensing, or commercializing any website material;</li>
            <li>Using this website in any way that is or may be damaging to this website;</li>
            <li>Engaging in automated scraping, data mining, or bots targeting game APIs;</li>
            <li>Using this website contrary to applicable laws and regulations.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>4. Disclaimer of Warranties</h2>
          <p>
            Playntric is provided "as is," with all faults, and Playntric makes no
            express or implied representations or warranties of any kind related to
            this website or the materials contained on this website.
          </p>
        </section>

        <section className="terms-section">
          <h2>5. Limitation of Liability</h2>
          <p>
            In no event shall Playntric, nor any of its officers, directors, and
            employees, be held liable for anything arising out of or in any way
            connected with your use of this website.
          </p>
        </section>

        <section className="terms-section">
          <h2>6. Governing Law</h2>
          <p>
            These Terms will be governed by and interpreted in accordance with the laws
            of your jurisdiction, and you submit to the non-exclusive jurisdiction of
            the state and federal courts located for the resolution of any disputes.
          </p>
        </section>
      </div>
    </div>
  );
}
