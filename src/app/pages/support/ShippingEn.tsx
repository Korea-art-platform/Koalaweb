import { useNavigate } from 'react-router';
import { ArrowLeft, Truck, Clock, MapPin, Package } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD_AMOUNT_TEXT, SHIPPING_FEE_AMOUNT_TEXT } from '@/app/lib/shipping';
import PageMeta from '@/app/components/common/PageMeta';

export default function ShippingEn() {
  const navigate = useNavigate();

  return (
    <div className="flex-1">
      <PageMeta title="Shipping" />
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-6 py-4">
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold tracking-tight text-gray-900">Shipping</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, label: 'Carrier', value: 'CJ Logistics' },
            { icon: Clock, label: 'Dispatch', value: '1-2 business days' },
            { icon: Package, label: 'Free shipping', value: `Over ${FREE_SHIPPING_THRESHOLD_AMOUNT_TEXT} KRW` },
            { icon: MapPin, label: 'Delivers to', value: 'All of Korea' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-gray-50 rounded-2xl p-4 text-center">
              <Icon className="w-5 h-5 mx-auto mb-2 text-gray-400" />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{label}</p>
              <p className="text-sm font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
        <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <h2 className="font-semibold text-gray-900 text-base">Shipping costs</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Order amount</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Shipping</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 text-gray-600">{FREE_SHIPPING_THRESHOLD_AMOUNT_TEXT} KRW and over</td>
                  <td className="px-4 py-3 font-semibold text-black">Free</td>
                  <td className="px-4 py-3 text-gray-400">Islands and remote areas excluded</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-600">Under {FREE_SHIPPING_THRESHOLD_AMOUNT_TEXT} KRW</td>
                  <td className="px-4 py-3 text-gray-600">{SHIPPING_FEE_AMOUNT_TEXT} KRW</td>
                  <td className="px-4 py-3 text-gray-400"></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-600">Jeju, islands and remote areas</td>
                  <td className="px-4 py-3 text-gray-600">+3,000-5,000 KRW</td>
                  <td className="px-4 py-3 text-gray-400">Varies by area</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <h2 className="font-semibold text-gray-900 text-base">Delivery times</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-koala-navy mt-2 flex-shrink-0" />Orders are dispatched within 1 to 2 business days of payment.</li>
            <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-koala-navy mt-2 flex-shrink-0" />After dispatch, CJ Logistics takes 1 to 2 days in the Seoul area and 2 to 3 days elsewhere.</li>
            <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-koala-navy mt-2 flex-shrink-0" />Limited editions and works needing special packing can take up to 5 to 7 business days.</li>
            <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-koala-navy mt-2 flex-shrink-0" />Nothing is dispatched on weekends or public holidays.</li>
          </ul>
        </section>
        <section className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <h2 className="font-semibold text-gray-900 text-base">Tracking</h2>
          <p className="text-gray-600">
            We send the tracking number by email or text once your order is dispatched. You can also
            follow the delivery in My page &gt; Orders.
          </p>
        </section>
        <section className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <h2 className="font-semibold text-gray-900 text-base">How works are packed</h2>
          <p className="text-gray-600">
            Every work is packed with bubble wrap, cushioning and a dedicated box so it arrives
            undamaged. Limited editions come with a certificate of authenticity and an art box.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
            If something arrives damaged, email koala-art@heron.kr within 24 hours of delivery with
            photos of the packaging and the damage.
          </div>
        </section>
        <section className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <h2 className="font-semibold text-gray-900 text-base">International shipping</h2>
          <p className="text-gray-600">
            We currently ship within Korea only. International shipping is being prepared, and we will
            announce it in the notices section when it opens.
          </p>
        </section>
        <div className="pt-4 pb-8 text-xs text-gray-400 text-center border-t border-gray-100">
          For anything else about delivery, please <a href="/contact" className="underline underline-offset-2 hover:text-black transition-colors">contact us</a>.
        </div>
      </div>
    </div>
  );
}
