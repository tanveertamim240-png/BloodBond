import React from 'react';
import { Droplets, Heart, AlertTriangle, ShieldCheck, Activity, Users, Search, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ALL_BLOOD_GROUPS, BloodGroup } from '../types';

interface HeroSectionProps {
  stats: {
    totalDonors: number;
    availableDonors: number;
    verifiedDonors: number;
    openRequests: number;
    totalDonationsCount: number;
  };
  onOpenRegister: () => void;
  onOpenCompatibilityModal: () => void;
  onQuickBloodSelect: (bg: BloodGroup) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  stats,
  onOpenRegister,
  onOpenCompatibilityModal,
  onQuickBloodSelect,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-red-600 via-rose-700 to-red-800 text-white pt-10 pb-16 sm:pb-24">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-black/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Main Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold tracking-wide">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Real-Time Life Saving Network &bull; 24/7 Available</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Every Drop Counts. <br className="hidden sm:inline" />
              <span className="text-red-200">Connect with Life Savers</span> in Minutes.
            </h1>

            <p className="text-base sm:text-lg text-red-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Find verified blood donors by blood group and district instantly during critical emergencies, or register as a volunteer donor to save patients in need.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <a
                href="#search-donors"
                className="px-6 py-3.5 bg-white text-red-700 hover:bg-red-50 font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 text-sm sm:text-base group"
              >
                <Search className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
                <span>Search Blood Donors</span>
              </a>

              <button
                onClick={onOpenRegister}
                className="px-6 py-3.5 bg-red-950/40 hover:bg-red-950/60 text-white font-bold rounded-2xl border border-white/30 backdrop-blur-md transition-all flex items-center gap-2 text-sm sm:text-base"
              >
                <Droplets className="w-4 h-4 text-red-300" />
                <span>Register as Donor</span>
              </button>

              <a
                href="#emergency-requests"
                className="px-5 py-3.5 bg-amber-500 hover:bg-amber-400 text-gray-950 font-black rounded-2xl shadow-lg transition-all flex items-center gap-2 text-sm"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Emergency Need Blood</span>
              </a>
            </div>

            {/* Blood Type Quick Jump Bar */}
            <div className="pt-4 border-t border-white/20">
              <div className="flex items-center justify-between text-xs font-semibold text-red-200 mb-2">
                <span>Quick Jump by Required Blood Group:</span>
                <button
                  onClick={onOpenCompatibilityModal}
                  className="text-white hover:underline font-bold"
                >
                  View Compatibility Guide &rarr;
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center lg:justify-start">
                {ALL_BLOOD_GROUPS.map(bg => (
                  <a
                    key={bg}
                    href="#search-donors"
                    onClick={() => onQuickBloodSelect(bg)}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 hover:bg-white hover:text-red-700 text-white font-black text-sm flex items-center justify-center border border-white/20 transition-all hover:scale-110"
                  >
                    {bg}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Floating Stats Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-xl border border-white/25 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
              <div className="flex items-center justify-between pb-6 border-b border-white/15">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg">Live Community Impact</h3>
                    <p className="text-xs text-red-200">Real-time verified donor registry</p>
                  </div>
                </div>
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>

              {/* 4 Key Metrics */}
              <div className="grid grid-cols-2 gap-4 py-6">
                <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                  <div className="text-3xl sm:text-4xl font-black tracking-tight">{stats.availableDonors}</div>
                  <div className="text-xs font-semibold text-red-200 mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                    Available Now
                  </div>
                </div>

                <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                  <div className="text-3xl sm:text-4xl font-black tracking-tight text-amber-300">
                    {stats.openRequests}
                  </div>
                  <div className="text-xs font-semibold text-red-200 mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                    Urgent Appeals
                  </div>
                </div>

                <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                  <div className="text-3xl sm:text-4xl font-black tracking-tight">{stats.verifiedDonors}</div>
                  <div className="text-xs font-semibold text-red-200 mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    Verified Donors
                  </div>
                </div>

                <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                  <div className="text-3xl sm:text-4xl font-black tracking-tight">{stats.totalDonationsCount}+</div>
                  <div className="text-xs font-semibold text-red-200 mt-1 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-pink-300" />
                    Units Donated
                  </div>
                </div>
              </div>

              {/* Verified Security Guarantee */}
              <div className="p-3 bg-red-950/40 rounded-2xl border border-white/10 flex items-center gap-3 text-xs text-red-100">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  Anti-fraud policy: OTP verified contact numbers & authenticated donor profiles protect against spoofing.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
