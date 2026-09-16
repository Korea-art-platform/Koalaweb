import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import PageMeta from '@/app/components/common/PageMeta';
import TranslationNotice from '@/app/components/common/TranslationNotice';

export default function ReturnsEn() {
  const navigate = useNavigate();

  return (
    <div className="flex-1">
      <PageMeta title="Returns and exchanges" />
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-6 py-4">
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold tracking-tight text-gray-900">Returns, exchanges and refunds</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8 text-sm text-gray-700 leading-relaxed">
        <p className="text-xs text-gray-400">Last updated: 18 August 2026</p>
        <TranslationNotice />
        <div className="bg-gray-50 rounded-2xl p-5 space-y-1 text-xs leading-relaxed text-gray-600">
          <p className="font-semibold text-gray-900 text-sm mb-2">In short</p>
          <p>· Request a return or exchange <strong>within 7 days</strong> of receiving your order</p>
          <p>· Refunds are processed within <strong>3 to 5 business days</strong> after we check the returned item</p>
          <p>· How to ask: My page &gt; Orders, or koala-art@heron.kr</p>
        </div>
        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">1. When you can ask</h2>
          <p>
            Under the Framework Act on Consumers and the Act on Consumer Protection in Electronic
            Commerce, you may request an exchange or return <strong>within 7 days</strong> of
            receiving your order. If you are returning an item because you changed your mind, you pay
            the round-trip shipping cost (6,000 KRW).
          </p>
          <p>
            If the item <strong>differs from how it was described or advertised, or the contract was
            performed differently</strong>, you may withdraw your purchase within <strong>3 months</strong> of
            receiving it, and within <strong>30 days</strong> of the day you knew or could have known
            about it.
          </p>
          <p className="text-gray-600">
            Limited editions can be withdrawn <strong>on the same terms as any other item</strong>.
            Being a limited run is not by itself a reason to refuse an exchange or return.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">2. How to ask</h2>
          <ol className="space-y-2 text-gray-600 list-decimal list-inside">
            <li>Open the order in My page &gt; Orders and request an exchange or return</li>
            <li>Or email koala-art@heron.kr with your order number and the reason</li>
            <li>We check it and explain how to send the item back within 1 to 2 business days</li>
            <li>Once the returned item arrives and is inspected, we process the refund or exchange</li>
          </ol>
          <div className="bg-gray-50 rounded-xl p-5 space-y-1 text-xs leading-relaxed">
            <p className="font-semibold text-gray-800">Return address</p>
            <p className="text-gray-700">54, Tongil-ro 1552beon-gil, Paju-eup, Paju-si, Gyeonggi-do, Republic of Korea</p>
            <p className="text-gray-500">
              Please request the return or exchange before sending anything back. Items sent without a
              request may be delayed or may not be processed.
            </p>
          </div>
        </section>
        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">3. Refund timing</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Payment method</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Refund timing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 text-gray-600">Credit or debit card</td>
                  <td className="px-4 py-3 text-gray-600">3 to 5 business days after the return is checked (varies by card issuer)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-600">Toss Pay / Kakao Pay / Naver Pay</td>
                  <td className="px-4 py-3 text-gray-600">3 to 5 business days after the return is checked</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-600">Bank transfer</td>
                  <td className="px-4 py-3 text-gray-600">3 to 5 business days after your account details are confirmed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">4. When an exchange or return is possible</h2>
          <ul className="space-y-1 list-disc list-inside text-gray-600">
            <li>You changed your mind, within 7 days of delivery (you pay shipping)</li>
            <li>The item is significantly different from its description</li>
            <li>The item arrived damaged or defective (send photos within 24 hours of delivery)</li>
            <li>The wrong item was delivered</li>
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">5. When it is not possible</h2>
          <ul className="space-y-1 list-disc list-inside text-gray-600">
            <li>More than 7 days have passed since delivery</li>
            <li>The item was damaged or soiled through your own handling</li>
            <li>The packaging was opened and the item shows signs of use</li>
            <li>The edition number, certificate of authenticity or art box is damaged or missing</li>
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">6. Who pays for shipping</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Reason</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Paid by</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 text-gray-600">You changed your mind</td>
                  <td className="px-4 py-3 text-gray-600">You (6,000 KRW round trip)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-600">Defective, wrong item or damaged</td>
                  <td className="px-4 py-3 text-gray-600">KOALA</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">7. Purchases by minors</h2>
          <p>
            If a minor paid without the consent of their legal guardian, either the minor or the
            guardian may cancel the contract. Please contact us if you would like to cancel.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">8. Seller information</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse border border-gray-200 rounded-lg overflow-hidden">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 w-32">Company</td>
                  <td className="px-4 py-3 text-gray-600">Heron (service name: KOALA-ART)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50">Representative</td>
                  <td className="px-4 py-3 text-gray-600">Jung Dong-hoon</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50">Business address</td>
                  <td className="px-4 py-3 text-gray-600">Room 4482, 4F, 26 Seoun-ro 6-gil, Seocho-gu, Seoul</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50">Return address</td>
                  <td className="px-4 py-3 text-gray-600">54, Tongil-ro 1552beon-gil, Paju-eup, Paju-si, Gyeonggi-do</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50">Business no.</td>
                  <td className="px-4 py-3 text-gray-600">203-87-01972</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50">E-commerce reg.</td>
                  <td className="px-4 py-3 text-gray-600">2024-Seoul Seocho-3956</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50">Support</td>
                  <td className="px-4 py-3 text-gray-600">1833-2817 · koala-art@heron.kr</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500">
            The business address and the return address are different. <strong>Send returns to the Paju
            return address.</strong>
          </p>
        </section>

        <div className="bg-gray-50 rounded-xl p-5 text-xs text-gray-500 leading-relaxed space-y-1">
          <p className="font-semibold text-gray-800">Returns and exchanges</p>
          <p>Email: koala-art@heron.kr</p>
          <p>Phone: 1833-2817</p>
          <p>Hours: weekdays 10:00-18:00 (closed weekends and public holidays)</p>
        </div>
        <p className="pt-4 pb-8 text-xs text-gray-400 text-center border-t border-gray-100">
          This policy does not limit the consumer rights protected by the Framework Act on Consumers,
          the Act on Consumer Protection in Electronic Commerce and other applicable laws.
        </p>
      </div>
    </div>
  );
}
