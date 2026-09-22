import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import TranslationNotice from '@/app/components/common/TranslationNotice';
import PageMeta from '@/app/components/common/PageMeta';

export default function CookiesEn() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 pt-20">
      <PageMeta title="Cookie Policy" description="The cookies KOALA uses, what they are for, and how to refuse them." />
      <div className="sticky top-20 z-10 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-6 py-4">
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold tracking-tight text-gray-900">Cookie Policy</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8 text-sm text-gray-700 leading-relaxed">
        <p className="text-xs text-gray-400">Last updated: 10 September 2026</p>
        <TranslationNotice />
        <p>
          KOALA, operated by Heron (the "Company"), uses cookies to run the Service, keep it secure
          and improve your experience. This policy explains the cookies we use, why we use them, and
          how you can manage them.
        </p>
        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">1. What is a cookie?</h2>
          <p>
            A cookie is a small data file stored in your browser when you visit a website. Cookies
            let a server recognise your browser, and are used to keep you signed in, remember your
            settings, and analyse how the Service is used.
          </p>
        </section>
        <section className="space-y-4">
          <h2 className="font-semibold text-gray-900">2. Cookies we use</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Purpose</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Kept for</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-800">Essential</td>
                  <td className="px-4 py-3 text-gray-600">Sign-in token (HttpOnly), secure session management</td>
                  <td className="px-4 py-3 text-gray-600">End of session / up to 30 days</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-800">Functional</td>
                  <td className="px-4 py-3 text-gray-600">Remembering your language and theme settings</td>
                  <td className="px-4 py-3 text-gray-600">1 year</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-800">Analytics</td>
                  <td className="px-4 py-3 text-gray-600">Anonymous usage statistics through Google Tag Manager</td>
                  <td className="px-4 py-3 text-gray-600">Up to 2 years</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
            <span className="font-semibold text-gray-700">Essential cookies</span> are required to run the Service. If you refuse them, signing in and paying will not work.
            Analytics cookies collect anonymous statistics only and do not identify you.
          </div>
        </section>
        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">3. Security of sign-in cookies</h2>
          <p>
            KOALA stores its sign-in token in an <strong>HttpOnly</strong> cookie. JavaScript cannot
            read an HttpOnly cookie, which protects it from cross-site scripting attacks. In
            production the <strong>Secure</strong> attribute is also applied, so the cookie is only
            sent over HTTPS.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">4. Managing cookies</h2>
          <p>
            Most browsers let you decide whether to accept cookies. Here is where to find the setting.
          </p>
          <ul className="space-y-2 text-gray-600 list-disc list-inside">
            <li><strong>Chrome:</strong> Settings &gt; Privacy and security &gt; Third-party cookies</li>
            <li><strong>Safari:</strong> Settings &gt; Privacy &gt; Cookies and website data</li>
            <li><strong>Edge:</strong> Settings &gt; Cookies and site permissions &gt; Cookies and site data</li>
            <li><strong>Firefox:</strong> Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data</li>
          </ul>
          <p className="text-gray-500 text-xs">
            If you block essential cookies, staying signed in, the cart and payment may not work.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">5. Third-party cookies</h2>
          <p>
            Google Tag Manager uses cookies to analyse how the Service is used. For how Google
            collects and handles data, see the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-black transition-colors">Google Privacy Policy</a>.
            During checkout, the payment provider's payment window may set its own cookies, which are
            covered by that provider's privacy policy.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">6. Contact</h2>
          <div className="bg-gray-50 rounded-xl p-4 text-xs space-y-1">
            <p><span className="font-medium text-gray-800">Email:</span> koala-art@heron.kr</p>
            <p><span className="font-medium text-gray-800">Response time:</span> within 3 business days of receipt</p>
          </div>
        </section>
        <p className="pt-4 pb-8 text-xs text-gray-400 text-center border-t border-gray-100">
          This cookie policy takes effect on 10 September 2026.
        </p>
      </div>
    </div>
  );
}
