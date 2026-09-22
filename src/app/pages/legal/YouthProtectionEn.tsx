import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import TranslationNotice from '@/app/components/common/TranslationNotice';
import PageMeta from '@/app/components/common/PageMeta';

export default function YouthProtectionEn() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 pt-20">
      <PageMeta title="Youth Protection Policy" description="How KOALA protects minors, and who to contact about it." />
      <div className="sticky top-20 z-10 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-6 py-4">
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold tracking-tight text-gray-900">Youth Protection Policy</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8 text-sm text-gray-700 leading-relaxed">
        <p className="text-xs text-gray-400">Last updated: 10 June 2026</p>
        <TranslationNotice />
        <p>
          KOALA (the "Company") has established and operates this youth protection policy under the
          Juvenile Protection Act and the Act on Promotion of Information and Communications Network
          Utilisation and Information Protection, so that young people can use the Service safely and
          without exposure to harmful material.
        </p>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">Article 1 (Purpose)</h2>
          <p>
            The purpose of this policy is to protect young people from harmful material on KOALA, the
            art trading platform operated by the Company, and to create an environment in which they
            can use the Service safely.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">Article 2 (Protection plan)</h2>
          <p>
            The Company runs the following plan so that young people are not exposed to harmful
            material without restriction.
          </p>
          <ul className="space-y-1 list-disc list-inside text-gray-600">
            <li>Appointing and supporting a youth protection officer and staff</li>
            <li>Restricting and managing young people's access to harmful material</li>
            <li>Providing counselling and handling complaints about harm caused by such material</li>
            <li>Training employees on youth protection</li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">Article 3 (Restricting access to harmful material)</h2>
          <p>
            The Company takes the following measures so that young people cannot reach harmful
            material.
          </p>
          <ul className="space-y-1 list-disc list-inside text-gray-600">
            <li>Children under the age of 14 cannot sign up.</li>
            <li>Where content or items require adult verification, an age check is applied.</li>
            <li>Posts and listed works are monitored, and material harmful to young people is blocked.</li>
            <li>Harmful material is deleted or blocked as soon as it is confirmed.</li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">Article 4 (Counselling and complaints)</h2>
          <p>
            The Company operates a channel for counselling and complaints about harm caused by
            material that is harmful to young people. Reports are investigated promptly, handled, and
            the outcome is communicated to the person who reported it. Where necessary the Company
            works with the relevant authorities, including the Korea Communications Standards
            Commission and youth protection organisations.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">Article 5 (Training)</h2>
          <p>
            The Company regularly trains the employees responsible for youth protection on the
            relevant laws, on how to block and manage harmful material, and on past cases of harm.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">Article 6 (Youth protection officer)</h2>
          <p>
            The Company has appointed the following youth protection officer to oversee this work and
            to protect young people from material that is harmful to them.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600 space-y-1 leading-relaxed mt-2">
            <p className="font-semibold text-gray-800 mb-2">Youth protection officer</p>
            <p><span className="font-medium text-gray-700 w-28 inline-block">Name</span>Jung Dong-hoon</p>
            <p><span className="font-medium text-gray-700 w-28 inline-block">Position</span>Chief Executive Officer</p>
            <p><span className="font-medium text-gray-700 w-28 inline-block">Email</span>koala-art@heron.kr</p>
            <p><span className="font-medium text-gray-700 w-28 inline-block">Phone</span>02-0000-0000</p>
          </div>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">Article 7 (Changes to this policy)</h2>
          <p>
            This policy may be revised as the law or the Company's internal rules change. Any revision
            will be announced in advance through the notices section of the Service.
          </p>
        </section>
        <p className="pt-4 pb-8 text-xs text-gray-400 text-center border-t border-gray-100">
          This youth protection policy takes effect on 10 June 2026.
        </p>
      </div>
    </div>
  );
}
