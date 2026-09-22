import { useNavigate } from 'react-router';
import { PG_DISPLAY_NAME } from '@/app/lib/pgInfo';
import { ArrowLeft } from 'lucide-react';
import TranslationNotice from '@/app/components/common/TranslationNotice';
import PageMeta from '@/app/components/common/PageMeta';

export default function PrivacyEn() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 pt-20">
      <PageMeta title="Privacy Policy" description="What personal data KOALA collects, how long it is kept, who processes it, and your rights." />
      <div className="sticky top-20 z-10 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-6 py-4">
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold tracking-tight text-gray-900">Privacy Policy</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8 text-sm text-gray-700 leading-relaxed">
        <p className="text-xs text-gray-400">Last updated: 10 September 2026</p>
        <TranslationNotice />
        <p>
          KOALA, operated by Heron (the "Company"), complies with the Personal Information Protection
          Act, the Act on Promotion of Information and Communications Network Utilisation and
          Information Protection, and other applicable laws, and protects your personal data. This
          policy explains what personal data the Company collects, why it is collected, how long it
          is kept, and how it is handled.
        </p>
        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">1. Personal data we collect</h2>
          <div className="space-y-2">
            <p className="font-medium text-gray-800">Required when you sign up</p>
            <ul className="space-y-1 list-disc list-inside text-gray-600">
              <li>Name, email address, mobile number</li>
              <li>Password (stored with one-way encryption; the original is never kept)</li>
            </ul>
            <p className="font-medium text-gray-800 mt-2">Collected when you order and pay</p>
            <ul className="space-y-1 list-disc list-inside text-gray-600">
              <li>Delivery details (recipient name, address, contact number)</li>
              <li>Payment details such as card numbers are handled directly by our payment provider {PG_DISPLAY_NAME} and are not stored by us</li>
            </ul>
            <p className="font-medium text-gray-800 mt-2">Collected with social sign-in</p>
            <ul className="space-y-1 list-disc list-inside text-gray-600">
              <li>Kakao: nickname, email</li>
              <li>Naver: name, email</li>
            </ul>
            <p className="font-medium text-gray-800 mt-2">Collected automatically as you use the Service</p>
            <ul className="space-y-1 list-disc list-inside text-gray-600">
              <li>IP address, cookies, browser information, service usage records</li>
              <li>Push notification token (FCM registration token)</li>
              <li>App diagnostics and error logs (error messages, device information, time of the event)</li>
            </ul>
          </div>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">2. Why we collect and use it</h2>
          <ul className="space-y-1 list-disc list-inside text-gray-600">
            <li>Membership sign-up and identity verification</li>
            <li>Processing orders, payments and delivery</li>
            <li>Handling enquiries and disputes</li>
            <li>Sending push notifications (order and delivery updates, service notices)</li>
            <li>Keeping the Service stable and diagnosing and fixing errors</li>
            <li>Improving the Service and offering tailored content</li>
            <li>Meeting obligations under applicable law</li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">3. How long we keep it</h2>
          <ul className="space-y-1 list-disc list-inside text-gray-600">
            <li>Member information: until you close your account</li>
            <li>Transaction records: 5 years (Act on Consumer Protection in Electronic Commerce)</li>
            <li>Consumer complaint records: 3 years (Act on Consumer Protection in Electronic Commerce)</li>
            <li>Access logs: 3 months (Protection of Communications Secrets Act)</li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">4. Sharing with third parties</h2>
          <p>
            As a rule the Company does not provide your personal data to third parties. The following
            are exceptions.
          </p>
          <ul className="space-y-1 list-disc list-inside text-gray-600 mt-2">
            <li>You have agreed in advance</li>
            <li>The law requires it</li>
            <li>Delivery details are shared with the courier (recipient information only)</li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">5. Processing entrusted to others</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-2 font-medium text-gray-700 border-b border-gray-200">Provider</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-700 border-b border-gray-200">Work entrusted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-2 text-gray-600">{PG_DISPLAY_NAME}</td>
                  <td className="px-4 py-2 text-gray-600">Payment processing</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-gray-600">Amazon Web Services</td>
                  <td className="px-4 py-2 text-gray-600">Server infrastructure</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-gray-600">Google (Firebase)</td>
                  <td className="px-4 py-2 text-gray-600">Sending push notifications</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-gray-600">Sentry</td>
                  <td className="px-4 py-2 text-gray-600">App error diagnostics and monitoring</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">6. Your rights</h2>
          <p>You may exercise the following rights at any time.</p>
          <ul className="space-y-1 list-disc list-inside text-gray-600 mt-2">
            <li>Ask to see your personal data</li>
            <li>Ask us to correct or delete it</li>
            <li>Ask us to stop processing it</li>
            <li>Close your account (available in My page)</li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">7. Cookies</h2>
          <p>
            The Company uses cookies to make the Service work. Authentication tokens are stored in
            HttpOnly cookies, which protects them from cross-site scripting attacks. You can refuse
            cookies in your browser settings, though some parts of the Service may then be limited.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">8. Data protection officer</h2>
          <p>You can contact the officer below with questions about your personal data, or to ask to see, correct, delete or stop processing it.</p>
          <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-xs">
            <p><span className="font-medium text-gray-800">Company:</span> Heron</p>
            <p><span className="font-medium text-gray-800">Officer:</span> KOALA data protection team</p>
            <p><span className="font-medium text-gray-800">Email:</span> koala-art@heron.kr</p>
            <p><span className="font-medium text-gray-800">Response time:</span> within 3 business days of receipt</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            You can also report privacy concerns to the following organisations.<br />
            • Personal Information Protection Commission, privacy report centre: <a href="https://www.privacy.go.kr" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-black">privacy.go.kr</a> / 182 (from Korea)<br />
            • Korean National Police Agency, cyber bureau: <a href="https://ecrm.cyber.go.kr" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-black">ecrm.cyber.go.kr</a> / 182 (from Korea)
          </p>
        </section>
        <p className="pt-4 pb-8 text-xs text-gray-400 text-center border-t border-gray-100">
          This policy takes effect on 10 September 2026.
        </p>
      </div>
    </div>
  );
}
