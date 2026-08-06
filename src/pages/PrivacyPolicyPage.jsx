import React from "react";
import Seo from "../components/common/Seo";
import { ShieldCheck, Cookie, Eye, Lock, FileText } from "lucide-react";
import "./PrivacyPolicyPage.css";

export default function PrivacyPolicyPage() {
  return (
    <div className="policy-container">
      <Seo
        title="Privacy Policy | Playntric - Google AdSense Compliant"
        description="Read Playntric's Privacy Policy explaining our data practices, cookie usage, Google AdSense, and DART cookie disclosures."
        path="/privacy-policy"
      />

      <div className="policy-header">
        <div className="policy-icon-wrap">
          <ShieldCheck size={36} />
        </div>
        <h1>Privacy Policy</h1>
        <p className="policy-subtitle">Last updated: August 6, 2026</p>
      </div>

      <div className="policy-card">
        <section className="policy-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to <strong>Playntric</strong> (accessible from{" "}
            <a href="https://playntric.vercel.app">https://playntric.vercel.app</a>).
            Your privacy is of utmost importance to us. This Privacy Policy document
            outlines the types of information collected and recorded by Playntric and
            how we use it.
          </p>
        </section>

        <section className="policy-section">
          <h2><Cookie size={20} className="section-icon" /> 2. Log Files & Analytics</h2>
          <p>
            Playntric follows a standard procedure of using log files. These files
            log visitors when they visit websites. The information collected by log
            files includes internet protocol (IP) addresses, browser type, Internet
            Service Provider (ISP), date and time stamp, referring/exit pages, and
            possibly the number of clicks. These are not linked to any information that
            is personally identifiable.
          </p>
        </section>

        <section className="policy-section Highlight-box">
          <h2><Eye size={20} className="section-icon" /> 3. Google DoubleClick DART Cookie & Third-Party Advertising</h2>
          <p>
            Google is one of a third-party vendor on our site. It also uses cookies,
            known as DART cookies, to serve ads to our site visitors based upon their
            visit to <code>playntric.vercel.app</code> and other sites on the internet.
          </p>
          <ul>
            <li>
              Third party vendors, including <strong>Google</strong>, use cookies to
              serve ads based on a user's prior visits to your website or other
              websites.
            </li>
            <li>
              Google's use of advertising cookies enables it and its partners to serve
              ads to your users based on their visit to your sites and/or other sites
              on the Internet.
            </li>
            <li>
              Users may opt out of personalized advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Ads Settings
              </a>.
            </li>
            <li>
              Alternatively, users can opt out of a third-party vendor's use of cookies
              for personalized advertising by visiting{" "}
              <a
                href="https://www.aboutads.info"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.aboutads.info
              </a>.
            </li>
          </ul>
        </section>

        <section className="policy-section">
          <h2><Lock size={20} className="section-icon" /> 4. Privacy Policies of Advertising Partners</h2>
          <p>
            Third-party ad servers or ad networks use technologies like cookies,
            JavaScript, or Web Beacons that are used in their respective
            advertisements and links that appear on Playntric. They automatically
            receive your IP address when this occurs. These technologies are used to
            measure the effectiveness of their advertising campaigns and/or to
            personalize the advertising content that you see on websites that you visit.
          </p>
          <p>
            Note that Playntric has no access to or control over these cookies that are
            used by third-party advertisers.
          </p>
        </section>

        <section className="policy-section">
          <h2>5. GDPR & CCPA Data Protection Rights</h2>
          <p>
            We would like to make sure you are fully aware of all of your data
            protection rights:
          </p>
          <ul>
            <li><strong>The right to access</strong> - You have the right to request copies of your personal data.</li>
            <li><strong>The right to rectification</strong> - You have the right to request that we correct any information you believe is inaccurate.</li>
            <li><strong>The right to erasure</strong> - You have the right to request that we erase your personal data.</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>6. Contact Us</h2>
          <p>
            If you have additional questions or require more information about our
            Privacy Policy, do not hesitate to contact us at{" "}
            <a href="mailto:support@playntric.com">support@playntric.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
