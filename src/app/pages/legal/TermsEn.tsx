import { useNavigate } from 'react-router';
import { PG_DISPLAY_NAME, PAY_METHOD_SENTENCE } from '@/app/lib/pgInfo';
import { ArrowLeft } from 'lucide-react';
import TranslationNotice from '@/app/components/common/TranslationNotice';

export default function TermsEn() {
  const navigate = useNavigate();

  return (
    <div className="flex-1">
      <div className="sticky top-20 z-10 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-6 py-4">
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold tracking-tight text-gray-900">Terms of Service</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8 text-sm text-gray-700 leading-relaxed">
        <p className="text-xs text-gray-400">Last updated: 10 September 2026</p>
        <TranslationNotice />
        <p>
          Thank you for using KOALA (the "Service"). These Terms set out the conditions and
          procedures for using every service KOALA provides, along with the rights, obligations and
          responsibilities of members and the company.
        </p>
        <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600 space-y-1 leading-relaxed">
          <p className="font-semibold text-gray-800 mb-2">Business information</p>
          <p><span className="font-medium text-gray-700 w-28 inline-block">Company</span>Heron</p>
          <p><span className="font-medium text-gray-700 w-28 inline-block">Service name</span>KOALA-ART</p>
          <p><span className="font-medium text-gray-700 w-28 inline-block">Business no.</span>203-87-01972</p>
          <p><span className="font-medium text-gray-700 w-28 inline-block">E-commerce reg.</span>2024-Seoul Seocho-3956</p>
          <p><span className="font-medium text-gray-700 w-28 inline-block">Representative</span>Jung Dong-hoon</p>
          <p><span className="font-medium text-gray-700 w-28 inline-block">Address</span>Room 4482, 4F, 26 Seoun-ro 6-gil, Seocho-gu, Seoul, Republic of Korea</p>
          <p><span className="font-medium text-gray-700 w-28 inline-block">Support</span>1833-2817</p>
          <p><span className="font-medium text-gray-700 w-28 inline-block">Email</span>koala-art@heron.kr</p>
          <p><span className="font-medium text-gray-700 w-28 inline-block">Website</span>https://koala-art.co.kr</p>
        </div>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">Article 1 (Purpose)</h2>
          <p>
            These Terms set out the rights, obligations and responsibilities between Heron (the
            "Company") and users in relation to the use of KOALA, the art trading platform operated
            by the Company.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">Article 2 (Definitions)</h2>
          <ul className="space-y-1 list-disc list-inside text-gray-600">
            <li>"Service" means all services provided by the Company, including art trading, the artist platform and the resale market.</li>
            <li>"Member" means a person who has agreed to these Terms and completed sign-up.</li>
            <li>"Non-member" means a person who uses the Service without signing up.</li>
            <li>"Artist" means a creator who lists and sells work through the KOALA platform.</li>
            <li>"Content" means the work images, descriptions, price information and similar material posted on the Service.</li>
            <li>"SKU" means an individual item listed for sale by an artist.</li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">Article 3 (Effect and amendment of these Terms)</h2>
          <p>
            These Terms apply to every member who wishes to use the Service. The Company may amend
            these Terms within the limits of applicable law, and will give notice in advance through
            the notices section of the Service.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">Article 4 (Membership)</h2>
          <p>
            Membership is formed when a user agrees to these Terms, applies to join, and the Company
            accepts the application. Children under the age of 14 may not sign up.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">Article 5 (Using the Service)</h2>
          <ul className="space-y-1 list-disc list-inside text-gray-600">
            <li>The Service is in principle available 24 hours a day, every day of the year.</li>
            <li>The Service may be suspended temporarily for system maintenance or in the event of a failure.</li>
            <li>Members may not use another person's account without authorisation.</li>
            <li>Posting unlawful content and infringing copyright are prohibited.</li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">Article 6 (Purchases and payment)</h2>
          <p>
            Members may select items on the Service and buy them using a payment method. Payments
            are processed through the payment provider {PG_DISPLAY_NAME}, and under Article 17 of the
            Act on Consumer Protection in Electronic Commerce you may withdraw your purchase within
            7 days of the purchase date.
          </p>
          <ul className="space-y-1 list-disc list-inside text-gray-600 mt-2">
            <li>Payment methods: {PAY_METHOD_SENTENCE}</li>
            <li>Item prices include VAT.</li>
            <li>Shipping is shown separately at checkout.</li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">Article 7 (Withdrawal and refunds)</h2>
          <ul className="space-y-1 list-disc list-inside text-gray-600">
            <li>You may withdraw your purchase (return the item) within 7 days of receiving it.</li>
            <li>A refund may be restricted if the work is damaged, shows signs of use, or the packaging has been opened in a way that affects the value of the work.</li>
            <li>For returns because you changed your mind, you pay the round-trip shipping cost.</li>
            <li>For defective or incorrectly shipped items, the Company pays the full shipping cost and refunds you.</li>
            <li>Refunds are processed within 3 to 5 business days after the returned item is checked.</li>
            <li>Digital content, such as downloadable files, cannot be withdrawn once it has been delivered.</li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">Article 8 (Intellectual property)</h2>
          <p>
            Intellectual property rights in all content on the Service belong to the Company or to
            the relevant artist. Members may not copy or distribute that content for commercial
            purposes without permission.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">Article 9 (Limitation of liability)</h2>
          <p>
            The Company is not liable for interruptions to the Service caused by natural disasters or
            other events beyond its control. The Company is not liable for profits a member expected
            to gain through the Service but did not, except where the loss results from the Company's
            intent or gross negligence.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">Article 10 (Personal data)</h2>
          <p>
            The Company protects members' personal data as required by applicable law. The collection,
            use and processing of personal data is set out separately in the Privacy Policy.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">Article 11 (Disputes)</h2>
          <p>
            Disputes arising in connection with these Terms are governed by the laws of the Republic
            of Korea, and the competent court is the court with jurisdiction over the Company's
            address. You may also apply for dispute mediation through the Korea Consumer Agency
            (https://www.kca.go.kr) or the Electronic Commerce Mediation Committee.
          </p>
        </section>
        <p className="pt-4 pb-8 text-xs text-gray-400 text-center border-t border-gray-100">
          These Terms take effect on 10 September 2026.
        </p>
      </div>
    </div>
  );
}
