import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import TranslationNotice from '@/app/components/common/TranslationNotice';

export default function AccountDeletionEn() {
  const navigate = useNavigate();

  return (
    <div className="flex-1">
      <div className="sticky top-20 z-10 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-6 py-4">
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold tracking-tight text-gray-900">Deleting your account and data</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8 text-sm text-gray-700 leading-relaxed">
        <p className="text-xs text-gray-400">Last updated: 10 June 2026</p>
        <TranslationNotice />
        <p>
          This page explains how to delete your KOALA account and the data connected to it. You can
          ask for deletion in either of the two ways below, whether or not you have the app installed.
        </p>
        <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600 space-y-1 leading-relaxed">
          <p className="font-semibold text-gray-800 mb-2">Service information</p>
          <p><span className="font-medium text-gray-700 w-28 inline-block">App name</span>KOALA</p>
          <p><span className="font-medium text-gray-700 w-28 inline-block">Developer</span>Heron</p>
          <p><span className="font-medium text-gray-700 w-28 inline-block">Contact</span>koala-art@heron.kr</p>
        </div>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">Option 1. Delete from the app or website</h2>
          <ol className="space-y-1 list-decimal list-inside text-gray-600">
            <li>Sign in to the KOALA app or website.</li>
            <li>Go to My page → <span className="font-medium text-gray-700">Settings</span>.</li>
            <li>Choose <span className="font-medium text-gray-700">Close account</span> and follow the steps.</li>
          </ol>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">Option 2. Ask by email, without the app</h2>
          <p>
            If you have not installed the app or cannot sign in, email us the address you signed up
            with and ask for deletion. We will verify who you are and then handle it.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600 space-y-1 leading-relaxed mt-1">
            <p><span className="font-medium text-gray-700 w-28 inline-block">Send to</span>koala-art@heron.kr</p>
            <p><span className="font-medium text-gray-700 w-28 inline-block">Subject</span>[Account deletion request]</p>
            <p><span className="font-medium text-gray-700 w-28 inline-block">Include</span>your sign-up email and your request to delete</p>
          </div>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">What gets deleted</h2>
          <ul className="space-y-1 list-disc list-inside text-gray-600">
            <li>Account details: name, email, phone number, password</li>
            <li>Delivery addresses, wishlist, cart, push notification token</li>
            <li>Profile and other personal data stored to run the Service</li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">What the law requires us to keep for a while</h2>
          <p>
            Under the Act on Consumer Protection in Electronic Commerce and other applicable laws,
            the transaction records below are kept for the statutory period after you close your
            account, and are then destroyed.
          </p>
          <ul className="space-y-1 list-disc list-inside text-gray-600">
            <li>Records of contracts and withdrawals: 5 years</li>
            <li>Records of payment and delivery of goods: 5 years</li>
            <li>Records of consumer complaints or disputes: 3 years</li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">How long it takes</h2>
          <p>
            Deletion requests are handled within 3 business days of receipt, and we let you know once
            it is done. A closed account cannot be restored; you would need to sign up again.
          </p>
        </section>
        <p className="pt-4 pb-8 text-xs text-gray-400 text-center border-t border-gray-100">
          Questions: koala-art@heron.kr
        </p>
      </div>
    </div>
  );
}
