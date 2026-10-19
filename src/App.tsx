import React, { useState } from 'react';
import { useBloodStore } from './hooks/useBloodStore';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DonorSearch } from './components/DonorSearch';
import { EmergencyRequestsSection } from './components/EmergencyRequestsSection';
import { AuthModal } from './components/AuthModal';
import { DonorProfileModal } from './components/DonorProfileModal';
import { OtpVerificationModal } from './components/OtpVerificationModal';
import { BloodCompatibilityModal } from './components/BloodCompatibilityModal';
import { AdminPanel } from './components/AdminPanel';
import { BloodGroup } from './types';
import { Heart, Droplets, ShieldCheck, Phone, CheckCircle, AlertTriangle, ArrowUp, Activity } from 'lucide-react';

export default function App() {
  const {
    currentUser,
    myProfile,
    donors,
    bloodRequests,
    stats,
    login,
    register,
    logout,
    saveProfile,
    toggleAvailability,
    sendPhoneOtp,
    verifyPhoneOtp,
    verifyEmail,
    setDonorVerification,
    deleteDonor,
    createBloodRequest,
    updateRequestStatus,
    deleteBloodRequest,
  } = useBloodStore();

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpPhone, setOtpPhone] = useState('');
  const [isCompatibilityOpen, setIsCompatibilityOpen] = useState(false);
  const [compatibilityGroup, setCompatibilityGroup] = useState<BloodGroup>('O+');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Search coordination
  const [searchHighlightGroup, setSearchHighlightGroup] = useState<BloodGroup | null>(null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  const handleLogin = (email: string, pass: string) => {
    try {
      const u = login(email, pass);
      showToast(`Welcome back, ${u.email}!`);
      // If user has no donor profile yet, prompt them to create one
      const existing = donors.find(d => d.userId === u.id);
      if (!existing) {
        setTimeout(() => setIsProfileOpen(true), 600);
      }
    } catch (err: unknown) {
      throw err;
    }
  };

  const handleRegister = (email: string, pass: string) => {
    try {
      const u = register(email, pass);
      showToast(`Account created! Let's complete your donor profile.`);
      setTimeout(() => setIsProfileOpen(true), 600);
    } catch (err: unknown) {
      throw err;
    }
  };

  const handleLogout = () => {
    logout();
    showToast('You have signed out successfully.');
  };

  const handleSaveProfile = (data: Parameters<typeof saveProfile>[0]) => {
    saveProfile(data);
    showToast('Donor profile published successfully!');
  };

  const handleToggleMyAvailability = () => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    const newStatus = toggleAvailability(currentUser.id);
    showToast(`Status updated: You are now marked as ${newStatus ? 'Available' : 'Unavailable'}.`);
  };

  const handleStartOtp = (phone: string) => {
    setOtpPhone(phone);
    setIsOtpOpen(true);
  };

  const handleVerifyOtpSuccess = () => {
    showToast('Mobile number verified! "Verified Donor" badge added to your profile.');
  };

  const handleVerifyEmailClick = () => {
    if (!currentUser) return;
    verifyEmail(currentUser.id);
    showToast('Email verified successfully!');
  };

  const handleCreateRequest = (data: Parameters<typeof createBloodRequest>[0]) => {
    createBloodRequest(data);
    showToast('Emergency blood appeal published! Nearby donors have been notified.');
  };

  const handleUpdateStatus = (id: string, status: 'open' | 'fulfilled') => {
    updateRequestStatus(id, status);
    showToast(status === 'fulfilled' ? 'Request marked as Fulfilled. Thank you!' : 'Request reopened.');
  };

  const handleQuickBloodSelect = (bg: BloodGroup) => {
    setSearchHighlightGroup(bg);
    const elem = document.getElementById('search-donors');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenCompatibilityGuide = (group?: BloodGroup) => {
    if (group) setCompatibilityGroup(group);
    setIsCompatibilityOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Toast notification banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-950 text-white px-5 py-3 rounded-2xl shadow-2xl border border-gray-800 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-slide-up">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-gray-400 hover:text-white text-xs ml-2"
          >
            &times;
          </button>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        currentUser={currentUser}
        myProfile={myProfile}
        openEmergencyCount={stats.openRequests}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenProfileModal={() => setIsProfileOpen(true)}
        onToggleMyAvailability={handleToggleMyAvailability}
        onOpenCompatibilityModal={() => setIsCompatibilityOpen(true)}
        onOpenAdminPanel={() => setIsAdminOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          stats={stats}
          onOpenRegister={() => {
            if (!currentUser) {
              setIsAuthOpen(true);
            } else {
              setIsProfileOpen(true);
            }
          }}
          onOpenCompatibilityModal={() => setIsCompatibilityOpen(true)}
          onQuickBloodSelect={handleQuickBloodSelect}
        />

        {/* Emergency Blood Requests Section (Prominent Section) */}
        <EmergencyRequestsSection
          requests={bloodRequests}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthOpen(true)}
          onCreateRequest={handleCreateRequest}
          onUpdateStatus={handleUpdateStatus}
          onDeleteRequest={deleteBloodRequest}
          highlightBloodGroup={searchHighlightGroup}
        />

        {/* Search Donors Section */}
        <DonorSearch
          donors={donors}
          bloodRequests={bloodRequests}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthOpen(true)}
          onEditProfile={() => setIsProfileOpen(true)}
          onToggleAvailability={handleToggleMyAvailability}
          onSelectBloodGroupForEmergency={(bg) => {
            setSearchHighlightGroup(bg);
            const el = document.getElementById('emergency-requests');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Informative Medical Trust & How it works section */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-red-600 font-black text-xs uppercase tracking-widest">
                Safe & Verified Platform
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-950 mt-1">
                How BloodBond Works in 3 Simple Steps
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-red-50/50 rounded-3xl border border-red-100 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white font-black text-xl flex items-center justify-center shadow-md shadow-red-200">
                  1
                </div>
                <h3 className="font-bold text-lg text-gray-900">Register as a Donor</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Create your private account, specify your blood group and location, and verify your mobile number via OTP to earn the Verified Donor badge.
                </p>
              </div>

              <div className="p-6 bg-red-50/50 rounded-3xl border border-red-100 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white font-black text-xl flex items-center justify-center shadow-md shadow-red-200">
                  2
                </div>
                <h3 className="font-bold text-lg text-gray-900">Search & Emergency Alert</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Patients or hospital attendants can search for available donors by blood group and district, or broadcast an urgent request directly to the community.
                </p>
              </div>

              <div className="p-6 bg-red-50/50 rounded-3xl border border-red-100 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white font-black text-xl flex items-center justify-center shadow-md shadow-red-200">
                  3
                </div>
                <h3 className="font-bold text-lg text-gray-900">Connect & Save a Life</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Reach out immediately via direct phone call or WhatsApp. After transfusion, close the request so other emergency cases get priority.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 text-white pt-12 pb-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-gray-800">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white">
                  <Droplets className="w-4 h-4" />
                </div>
                <span className="text-xl font-black">Blood<span className="text-red-500">Bond</span></span>
              </div>
              <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                A non-profit emergency blood donation initiative dedicated to connecting volunteer donors with patients in urgent need. Built with zero barriers to saving human lives.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-red-400 font-semibold">
                <Activity className="w-4 h-4 animate-pulse" />
                <span>Emergency Hotline: 999 (Police & Ambulance) / +880 1711-BLOOD</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">Quick Navigation</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><a href="#search-donors" className="hover:text-red-400 transition-colors">Find Blood Donors</a></li>
                <li><a href="#emergency-requests" className="hover:text-red-400 transition-colors">Emergency Blood Board</a></li>
                <li><button onClick={() => setIsCompatibilityOpen(true)} className="hover:text-red-400 transition-colors text-left">Compatibility Chart</button></li>
                <li>
                  <button
                    onClick={() => {
                      if (!currentUser) setIsAuthOpen(true);
                      else setIsProfileOpen(true);
                    }}
                    className="hover:text-red-400 transition-colors text-left"
                  >
                    Donor Registration
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">Donor Safety</h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">
                Minimum donation interval is 90 days. Every transfusion must undergo rigorous ABO, Rh factor cross-matching and infectious disease screening at an authorized blood bank.
              </p>
              <button
                onClick={() => setIsAdminOpen(true)}
                className="text-[11px] font-mono text-gray-500 hover:text-gray-300 underline"
              >
                Access Admin Portal
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
            <div>
              &copy; {new Date().getFullYear()} BloodBond Network. Dedicated to the noble cause of voluntary blood donation.
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-emerald-500 flex items-center gap-1 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
                Live Network Active
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      {currentUser && (
        <DonorProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          userId={currentUser.id}
          userEmail={currentUser.email}
          existingProfile={myProfile}
          onSave={handleSaveProfile}
          onStartOtpVerification={handleStartOtp}
          onVerifyEmail={handleVerifyEmailClick}
        />
      )}

      {currentUser && (
        <OtpVerificationModal
          isOpen={isOtpOpen}
          onClose={() => setIsOtpOpen(false)}
          userId={currentUser.id}
          phone={otpPhone || myProfile?.phone || ''}
          onVerifySuccess={handleVerifyOtpSuccess}
          sendOtpFn={sendPhoneOtp}
          verifyOtpFn={verifyPhoneOtp}
        />
      )}

      <BloodCompatibilityModal
        isOpen={isCompatibilityOpen}
        onClose={() => setIsCompatibilityOpen(false)}
        initialGroup={compatibilityGroup}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentUser={currentUser}
        donors={donors}
        bloodRequests={bloodRequests}
        onSetVerification={setDonorVerification}
        onDeleteDonor={deleteDonor}
        onUpdateBloodRequestStatus={updateRequestStatus}
        onDeleteBloodRequest={deleteBloodRequest}
      />
    </div>
  );
}
