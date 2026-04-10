import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — FlowBudget",
  description: "Terms and conditions governing your use of FlowBudget.",
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-sm text-slate-500">Last updated: April 2026</p>
        </header>

        <div className="prose-legal">

          <Section title="1. Acceptance of Terms">
            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement
              between you (&ldquo;User&rdquo;, &ldquo;you&rdquo;) and Ash Hatef, operating
              FlowBudget (&ldquo;FlowBudget&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By
              creating an account, accessing, or using the FlowBudget service, you confirm that you
              have read, understood, and agree to be bound by these Terms and our{" "}
              <Link href="/privacy" className="text-teal-500 hover:text-teal-600 underline">
                Privacy Policy
              </Link>
              .
            </p>
            <p>
              If you do not agree to these Terms, you must not use the service. You must be at
              least 16 years of age to create an account. If you are using FlowBudget on behalf of
              a business, you represent that you have authority to bind that entity to these Terms.
            </p>
          </Section>

          <Section title="2. Description of Service">
            <p>
              FlowBudget is a personal finance management application that allows users to track
              income and expenses, categorise transactions, manage budgets, monitor debt repayment,
              and review financial summaries. The service is primarily designed for freelancers,
              independent contractors, and self-employed individuals.
            </p>
            <p>
              FlowBudget is a financial tracking and organisation tool only. It does not provide
              financial advice, investment recommendations, tax advice, or accounting services. Any
              financial decisions you make based on information within the application are solely
              your responsibility. We recommend consulting a qualified financial professional for
              advice specific to your circumstances.
            </p>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of the service at
              any time with reasonable notice where possible. We will endeavour to provide at least
              30 days&apos; notice of any discontinuation that would result in loss of your data.
            </p>
          </Section>

          <Section title="3. Account Registration">
            <p>
              To use FlowBudget you must register an account. You agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete registration information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your password confidential and not share access with third parties</li>
              <li>
                Notify us immediately at{" "}
                <a href="mailto:support@flowbudget.ashketing.com" className="text-teal-500 hover:text-teal-600 underline">
                  support@flowbudget.ashketing.com
                </a>{" "}
                if you suspect unauthorised access to your account
              </li>
              <li>Accept responsibility for all activity that occurs under your account</li>
            </ul>
            <p>
              You may not create an account using a false identity, create multiple accounts for
              the purpose of circumventing limits or restrictions, or transfer your account to
              another person without our written consent.
            </p>
          </Section>

          <Section title="4. Subscription Plans &amp; Payments">
            <h3>4.1 Free Plan</h3>
            <p>
              FlowBudget offers a free tier with access to core features at no charge. Free plan
              limitations (such as transaction history limits or restricted features) are described
              within the application and may change with reasonable notice.
            </p>

            <h3>4.2 Pro Plan</h3>
            <p>
              FlowBudget Pro is a paid subscription at <strong>&euro;6.99 per month</strong>{" "}
              (or such other amount as displayed at the time of purchase). Pro subscriptions provide
              access to advanced features including unlimited transaction history, detailed reporting,
              data export, and priority support.
            </p>

            <h3>4.3 Billing &amp; Renewal</h3>
            <p>
              Subscriptions are billed monthly in advance. Your subscription automatically renews at
              the end of each billing period unless cancelled. By providing payment details you
              authorise us to charge your payment method on a recurring basis. All amounts are
              inclusive of applicable VAT where required by law.
            </p>

            <h3>4.4 Cancellation</h3>
            <p>
              You may cancel your Pro subscription at any time from your account settings. Upon
              cancellation, you retain Pro access until the end of the current billing period. We
              do not provide pro-rated refunds for partial months, except where required by
              applicable consumer protection law.
            </p>

            <h3>4.5 Right of Withdrawal (EU Consumers)</h3>
            <p>
              If you are a consumer in the European Union, you have the right to withdraw from your
              subscription within 14 days of purchase without giving any reason. To exercise this
              right, contact us at{" "}
              <a href="mailto:support@flowbudget.ashketing.com" className="text-teal-500 hover:text-teal-600 underline">
                support@flowbudget.ashketing.com
              </a>{" "}
              before the 14-day period expires. If you have already used the service during this
              period, you acknowledge that the right of withdrawal may be limited in accordance with
              applicable law.
            </p>

            <h3>4.6 Price Changes</h3>
            <p>
              We reserve the right to change subscription prices. We will provide at least 30
              days&apos; advance notice of any price increase via email. Continued use of the Pro
              plan after the effective date constitutes acceptance of the new pricing.
            </p>

            <h3>4.7 Failed Payments</h3>
            <p>
              If a payment fails, we will attempt to collect payment and notify you by email. If
              payment cannot be collected, your account may be downgraded to the free tier.
            </p>
          </Section>

          <Section title="5. Acceptable Use">
            <p>You agree not to use FlowBudget to:</p>
            <ul>
              <li>Violate any applicable local, national, or international law or regulation</li>
              <li>Upload, transmit, or store malicious code, malware, or harmful content</li>
              <li>Attempt to gain unauthorised access to any part of the service or its infrastructure</li>
              <li>Reverse-engineer, decompile, or disassemble the application</li>
              <li>Use automated tools (bots, scrapers) to access the service without our written consent</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Resell, sublicense, or commercially exploit the service without prior written approval</li>
              <li>Transmit or process data belonging to third parties without their authorisation</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate accounts that violate these terms without
              notice.
            </p>
          </Section>

          <Section title="6. Intellectual Property">
            <h3>6.1 Our Content</h3>
            <p>
              The FlowBudget application, including its design, code, graphics, user interface,
              trademarks, and all other content created by us, is owned by or licensed to Ash Hatef
              and is protected by copyright, trademark, and other applicable intellectual property
              laws. These Terms do not transfer any intellectual property rights to you.
            </p>

            <h3>6.2 Your Data</h3>
            <p>
              You retain full ownership of all personal financial data you enter into or import into
              FlowBudget. You grant us a limited, non-exclusive, royalty-free licence to store,
              process, and display your data solely for the purpose of providing the service to you.
              We will never use your personal financial data for advertising or sell it to third
              parties.
            </p>

            <h3>6.3 Feedback</h3>
            <p>
              If you provide feedback, suggestions, or ideas about FlowBudget, you grant us a
              perpetual, irrevocable, royalty-free licence to use such feedback for any purpose
              without obligation to you.
            </p>
          </Section>

          <Section title="7. Disclaimer of Warranties">
            <p>
              FlowBudget is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis
              without warranties of any kind, either express or implied, including but not limited
              to implied warranties of merchantability, fitness for a particular purpose,
              non-infringement, or uninterrupted availability.
            </p>
            <p>
              We do not warrant that: (a) the service will be error-free or uninterrupted; (b) any
              financial data or calculations will be accurate or suitable for any particular purpose;
              (c) the service will meet your specific requirements. You use FlowBudget entirely at
              your own risk.
            </p>
            <p>
              Nothing in these Terms limits or excludes liability that cannot be excluded under
              applicable mandatory consumer protection law in your jurisdiction.
            </p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>
              To the maximum extent permitted by applicable law, FlowBudget and Ash Hatef shall not
              be liable for any indirect, incidental, special, consequential, or punitive damages,
              including but not limited to loss of profits, data, goodwill, or business
              opportunities, arising out of or in connection with your use of or inability to use
              the service.
            </p>
            <p>
              Our total aggregate liability for any claims arising under or in connection with these
              Terms — regardless of the form of action — shall not exceed the greater of (a) the
              total amount you paid us in the 12 months preceding the claim, or (b) &euro;50.
            </p>
            <p>
              Some jurisdictions do not allow the exclusion or limitation of certain categories of
              damages. In those jurisdictions, our liability is limited to the greatest extent
              permitted by law.
            </p>
          </Section>

          <Section title="9. Indemnification">
            <p>
              You agree to indemnify, defend, and hold harmless FlowBudget and Ash Hatef from and
              against any claims, liabilities, damages, losses, and expenses (including reasonable
              legal fees) arising out of or in any way connected with: (a) your access to or use of
              the service; (b) your violation of these Terms; or (c) your infringement of any
              third-party rights.
            </p>
          </Section>

          <Section title="10. Termination">
            <h3>10.1 Termination by You</h3>
            <p>
              You may terminate your account at any time by deleting it from your account settings
              or by contacting us. Upon termination, your data will be deleted in accordance with
              our{" "}
              <Link href="/privacy" className="text-teal-500 hover:text-teal-600 underline">
                Privacy Policy
              </Link>
              .
            </p>

            <h3>10.2 Termination by Us</h3>
            <p>
              We may suspend or terminate your account immediately if: (a) you breach these Terms;
              (b) we are required to do so by law; (c) we reasonably suspect fraud or abuse. In
              non-urgent cases we will provide 14 days&apos; written notice and an opportunity to
              remedy any breach before termination.
            </p>

            <h3>10.3 Effect of Termination</h3>
            <p>
              Upon termination, your right to access the service ceases immediately. Provisions of
              these Terms that by their nature should survive termination shall survive, including
              intellectual property, disclaimer of warranties, limitation of liability, and governing
              law.
            </p>
          </Section>

          <Section title="11. Governing Law &amp; Dispute Resolution">
            <p>
              These Terms are governed by and construed in accordance with the laws of the
              Netherlands, without regard to its conflict of law principles. Any dispute arising
              out of or in connection with these Terms that cannot be resolved amicably within 30
              days shall be submitted to the exclusive jurisdiction of the courts of the Netherlands.
            </p>
            <p>
              If you are a consumer in the EU, you may also be entitled to bring a claim in the
              courts of the EU member state in which you reside, and to use the EU Online Dispute
              Resolution platform at{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-500 hover:text-teal-600 underline"
              >
                ec.europa.eu/consumers/odr
              </a>
              .
            </p>
          </Section>

          <Section title="12. Changes to These Terms">
            <p>
              We may update these Terms from time to time to reflect changes in our service,
              applicable law, or business practices. We will notify you of material changes via
              email at least 14 days before they take effect. Your continued use of FlowBudget after
              the effective date of revised Terms constitutes your acceptance of the changes.
            </p>
            <p>
              If you do not agree to the revised Terms, you must stop using the service before the
              effective date and may request account deletion.
            </p>
          </Section>

          <Section title="13. Miscellaneous">
            <p>
              <strong>Entire agreement:</strong> These Terms and our Privacy Policy constitute the
              entire agreement between you and FlowBudget regarding the service and supersede all
              prior agreements.
            </p>
            <p>
              <strong>Severability:</strong> If any provision of these Terms is found to be
              unenforceable, the remaining provisions continue in full force and effect.
            </p>
            <p>
              <strong>Waiver:</strong> Our failure to enforce any right or provision of these Terms
              does not constitute a waiver of that right or provision.
            </p>
            <p>
              <strong>Assignment:</strong> You may not assign or transfer your rights under these
              Terms without our prior written consent. We may assign our rights and obligations
              without restriction.
            </p>
            <p>
              <strong>Language:</strong> These Terms are written in English. In the event of any
              discrepancy between a translation and the English version, the English version prevails.
            </p>
          </Section>

          <Section title="14. Contact Us">
            <p>
              If you have questions about these Terms or need support, contact us at:
            </p>
            <address className="not-italic bg-white border border-slate-200 rounded-lg p-4 text-sm text-charcoal leading-relaxed">
              <strong>FlowBudget — Support</strong><br />
              Operated by: Ash Hatef<br />
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
            <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-teal-500 hover:text-teal-600 transition-colors">Terms</Link>
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
