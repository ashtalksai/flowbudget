import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — FlowBudget",
  description: "How FlowBudget collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-snow font-sans">
      {/* Back nav */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-teal-500 hover:text-teal-600 transition-colors font-medium"
          >
            <span aria-hidden="true">←</span>
            Back to FlowBudget
          </Link>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12 pb-20">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-charcoal tracking-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500">Last updated: April 2026</p>
        </header>

        <div className="prose-legal">

          <Section title="1. Introduction">
            <p>
              FlowBudget (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is a personal finance
              SaaS application operated by Ash Hatef. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your personal data when you use FlowBudget, and describes
              your rights under the General Data Protection Regulation (GDPR) and other applicable
              data protection laws.
            </p>
            <p>
              By accessing or using FlowBudget, you agree to the practices described in this policy.
              If you do not agree, please discontinue use of the service.
            </p>
          </Section>

          <Section title="2. Who We Are (Data Controller)">
            <p>
              The data controller responsible for your personal data is:
            </p>
            <address className="not-italic bg-white border border-slate-200 rounded-lg p-4 text-sm text-charcoal leading-relaxed">
              <strong>FlowBudget</strong><br />
              Operated by: Ash Hatef<br />
              Contact: <a href="mailto:support@flowbudget.ashketing.com" className="text-teal-500 hover:text-teal-600 underline">support@flowbudget.ashketing.com</a>
            </address>
            <p>
              If you have any questions about this policy or how we handle your data, please contact
              us at the address above.
            </p>
          </Section>

          <Section title="3. Data We Collect">
            <p>We collect the following categories of personal data:</p>

            <h3>3.1 Account Information</h3>
            <ul>
              <li>Full name and email address (provided during registration)</li>
              <li>Password (stored as a cryptographic hash — never in plaintext)</li>
              <li>Profile preferences and settings</li>
            </ul>

            <h3>3.2 Financial Data</h3>
            <ul>
              <li>Transaction records you import or enter manually</li>
              <li>Budget categories, income sources, and spending limits you configure</li>
              <li>Debt records and repayment schedules</li>
              <li>Notes and labels you attach to financial entries</li>
            </ul>

            <h3>3.3 Technical &amp; Usage Data</h3>
            <ul>
              <li>IP address and approximate geographic location (country/city level)</li>
              <li>Browser type, operating system, and device identifiers</li>
              <li>Pages visited, features used, and session duration</li>
              <li>Error logs and crash reports</li>
            </ul>

            <h3>3.4 Payment Data</h3>
            <p>
              If you subscribe to FlowBudget Pro, payments are processed by our third-party payment
              processor (Stripe). We do not store your full card number, CVV, or bank credentials.
              We retain billing records such as subscription tier, payment date, and invoiced amount
              for legal and tax compliance purposes.
            </p>

            <h3>3.5 Cookies &amp; Tracking Technologies</h3>
            <p>We use the following types of cookies:</p>
            <ul>
              <li>
                <strong>Strictly necessary cookies:</strong> Required for authentication and session
                management. These cannot be disabled without breaking core functionality.
              </li>
              <li>
                <strong>Functional cookies:</strong> Remember your preferences (language, theme,
                currency) across sessions.
              </li>
              <li>
                <strong>Analytics cookies:</strong> Help us understand how the service is used in
                aggregate. We use privacy-respecting analytics that do not build cross-site profiles.
                You may opt out via your browser settings or by contacting us.
              </li>
            </ul>
            <p>
              We do not use advertising cookies or sell your data to advertisers.
            </p>
          </Section>

          <Section title="4. Legal Basis for Processing (GDPR)">
            <p>
              Under the GDPR, we process your personal data on the following legal bases:
            </p>
            <ul>
              <li>
                <strong>Contract performance (Art. 6(1)(b)):</strong> Processing necessary to
                provide the FlowBudget service you have signed up for, including account management
                and feature delivery.
              </li>
              <li>
                <strong>Legitimate interests (Art. 6(1)(f)):</strong> Fraud prevention, security
                monitoring, service improvement, and internal analytics — balanced against your
                rights and interests.
              </li>
              <li>
                <strong>Legal obligation (Art. 6(1)(c)):</strong> Retaining billing and tax records
                as required by applicable law.
              </li>
              <li>
                <strong>Consent (Art. 6(1)(a)):</strong> Optional analytics cookies and marketing
                communications, where you have given explicit consent. You may withdraw consent at
                any time.
              </li>
            </ul>
          </Section>

          <Section title="5. How We Use Your Data">
            <p>We use collected data to:</p>
            <ul>
              <li>Provide, operate, and maintain the FlowBudget service</li>
              <li>Process your transactions and generate financial insights</li>
              <li>Send transactional emails (account confirmation, password reset, invoices)</li>
              <li>Respond to your support requests</li>
              <li>Detect, investigate, and prevent fraud and security incidents</li>
              <li>Comply with legal and regulatory obligations</li>
              <li>Improve and develop new features (using anonymised or aggregated data)</li>
            </ul>
            <p>
              We will never sell, rent, or trade your personal data to third parties for their
              marketing purposes.
            </p>
          </Section>

          <Section title="6. Third-Party Services">
            <p>
              We share data with the following categories of third parties only as necessary to
              operate the service:
            </p>
            <ul>
              <li>
                <strong>Cloud infrastructure:</strong> Servers and databases hosted on providers
                operating within the EU or with appropriate data transfer safeguards in place.
              </li>
              <li>
                <strong>Payment processing:</strong> Stripe, Inc. — to handle subscription billing.
                Stripe&apos;s privacy policy governs their handling of payment data.
              </li>
              <li>
                <strong>Transactional email:</strong> An email delivery provider used solely to send
                account and notification emails on our behalf.
              </li>
              <li>
                <strong>Analytics:</strong> Privacy-first analytics tooling that does not share data
                with advertising networks.
              </li>
            </ul>
            <p>
              All third-party processors are bound by data processing agreements that ensure GDPR
              compliance. International transfers (outside the EEA) rely on Standard Contractual
              Clauses or an adequacy decision.
            </p>
          </Section>

          <Section title="7. Data Retention">
            <p>We retain your personal data for the following periods:</p>
            <ul>
              <li>
                <strong>Active account data:</strong> For as long as your account is active or as
                needed to provide the service.
              </li>
              <li>
                <strong>Financial records &amp; invoices:</strong> Seven (7) years from the date of
                transaction, as required by EU financial regulations.
              </li>
              <li>
                <strong>Analytics &amp; log data:</strong> Up to 12 months, after which it is
                deleted or fully anonymised.
              </li>
              <li>
                <strong>Deleted accounts:</strong> We delete or anonymise all personal data within
                30 days of account deletion, except where we are required to retain data by law.
              </li>
            </ul>
          </Section>

          <Section title="8. Your Rights Under GDPR">
            <p>
              If you are located in the European Economic Area (EEA), you have the following rights
              regarding your personal data:
            </p>
            <ul>
              <li>
                <strong>Right of access (Art. 15):</strong> Request a copy of the personal data we
                hold about you.
              </li>
              <li>
                <strong>Right to rectification (Art. 16):</strong> Request correction of inaccurate
                or incomplete data.
              </li>
              <li>
                <strong>Right to erasure (Art. 17):</strong> Request deletion of your data
                (&ldquo;right to be forgotten&rdquo;), subject to legal retention obligations.
              </li>
              <li>
                <strong>Right to restrict processing (Art. 18):</strong> Request that we limit how
                we use your data in certain circumstances.
              </li>
              <li>
                <strong>Right to data portability (Art. 20):</strong> Receive your data in a
                machine-readable format (CSV or JSON) and transfer it to another service.
              </li>
              <li>
                <strong>Right to object (Art. 21):</strong> Object to processing based on legitimate
                interests, including profiling.
              </li>
              <li>
                <strong>Right to withdraw consent:</strong> Where processing is based on consent,
                you may withdraw it at any time without affecting prior processing.
              </li>
              <li>
                <strong>Right to lodge a complaint:</strong> You have the right to file a complaint
                with your national data protection authority.
              </li>
            </ul>
            <p>
              To exercise any of these rights, email us at{" "}
              <a href="mailto:support@flowbudget.ashketing.com" className="text-teal-500 hover:text-teal-600 underline">
                support@flowbudget.ashketing.com
              </a>
              . We will respond within 30 days.
            </p>
          </Section>

          <Section title="9. Data Security">
            <p>
              We implement industry-standard technical and organisational measures to protect your
              data, including:
            </p>
            <ul>
              <li>Encryption in transit (TLS 1.2+) and at rest (AES-256)</li>
              <li>Password hashing using bcrypt with an appropriate cost factor</li>
              <li>Role-based access controls limiting employee access to personal data</li>
              <li>Regular security reviews and dependency audits</li>
            </ul>
            <p>
              No system is perfectly secure. In the unlikely event of a data breach affecting your
              rights and freedoms, we will notify affected users and the relevant supervisory
              authority within 72 hours as required by GDPR Art. 33–34.
            </p>
          </Section>

          <Section title="10. Children's Privacy">
            <p>
              FlowBudget is not directed at children under the age of 16. We do not knowingly
              collect personal data from children. If you believe a child has provided us with
              personal data, please contact us and we will delete it promptly.
            </p>
          </Section>

          <Section title="11. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. When we make material changes,
              we will notify you by email or via a prominent notice in the application at least 14
              days before the changes take effect. Continued use of the service after the effective
              date constitutes acceptance of the updated policy.
            </p>
          </Section>

          <Section title="12. Contact Us">
            <p>
              For privacy-related questions, data requests, or concerns, contact us at:
            </p>
            <address className="not-italic bg-white border border-slate-200 rounded-lg p-4 text-sm text-charcoal leading-relaxed">
              <strong>FlowBudget — Privacy</strong><br />
              Email:{" "}
              <a href="mailto:support@flowbudget.ashketing.com" className="text-teal-500 hover:text-teal-600 underline">
                support@flowbudget.ashketing.com
              </a>
            </address>
          </Section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-400">
          <span>&copy; {new Date().getFullYear()} FlowBudget. Operated by Ash Hatef.</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-teal-500 hover:text-teal-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-charcoal mb-4 pb-2 border-b border-slate-200">
        {title}
      </h2>
      <div className="space-y-3 text-slate-600 leading-relaxed text-[0.9375rem]">
        {children}
      </div>
    </section>
  );
}
