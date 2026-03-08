import { Link, useNavigate } from 'react-router';
import { Mail, Lock, User, Chrome } from 'lucide-react';
import Navigation from '../components/layouts/Header';

export default function Signup() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally handle the signup logic
    // For now, we'll just redirect to onboarding
    navigate('/onboarding');
  };

  const handleGoogleSignup = () => {
    // Handle Google signup
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />
      
      <div className="pt-24 pb-16 px-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl tracking-tight mb-3">Create Account</h1>
            <p className="text-sm text-gray-400">
              Join the Korean Art Laboratory
            </p>
          </div>

          {/* Signup Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Name Field */}
              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Create a password"
                    className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Must be at least 8 characters
                </p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                  />
                </div>
              </div>

              {/* Terms & Conditions */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-0.5 rounded border-gray-300"
                  />
                  <span className="text-xs text-gray-600 leading-relaxed">
                    I agree to the{' '}
                    <Link to="/terms" className="text-black hover:underline">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-black hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors"
              >
                Create Account
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white text-gray-400">
                  OR CONTINUE WITH
                </span>
              </div>
            </div>

            {/* Social Signup */}
            <div className="space-y-3">
              <button 
                type="button"
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Chrome className="w-5 h-5" />
                <span className="text-sm">Continue with Google</span>
              </button>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-black hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}