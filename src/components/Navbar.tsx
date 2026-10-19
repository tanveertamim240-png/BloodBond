import React, { useState } from 'react';
import { User, DonorProfile } from '../types';
import { Droplets, Heart, ShieldCheck, UserCheck, LogIn, LogOut, Menu, X, AlertTriangle, Shield, User as UserIcon, ToggleLeft, ToggleRight } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  myProfile: DonorProfile | null;
  openEmergencyCount: number;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenProfileModal: () => void;
  onToggleMyAvailability: () => void;
  onOpenCompatibilityModal: () => void;
  onOpenAdminPanel: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  myProfile,
  openEmergencyCount,
  onOpenAuth,
  onLogout,
  onOpenProfileModal,
  onToggleMyAvailability,
  onOpenCompatibilityModal,
  onOpenAdminPanel,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-red-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-red-500/25 group-hover:scale-105 transition-transform">
                <Droplets className="w-6 h-6 animate-pulse" />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-emerald-200" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-950 font-sans">
                    Blood<span className="text-red-600">Bond</span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-red-100 text-red-700">
                    Network
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 font-medium tracking-wide -mt-0.5">
                  Emergency Life Support System
                </p>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3 text-xs sm:text-sm font-bold text-gray-700">
            <a
              href="#search-donors"
              className="px-3 py-2 rounded-xl hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              Find Donors
            </a>

            <a
              href="#emergency-requests"
              className="px-3 py-2 rounded-xl hover:text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5"
            >
              <span>Emergency Requests</span>
              {openEmergencyCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white animate-pulse">
                  {openEmergencyCount} Urgent
                </span>
              )}
            </a>

            <button
              onClick={onOpenCompatibilityModal}
              className="px-3 py-2 rounded-xl hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              Compatibility Guide
            </button>

            {currentUser?.role === 'admin' && (
              <button
                onClick={onOpenAdminPanel}
                className="px-3 py-1.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black transition-colors flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Panel</span>
              </button>
            )}
          </nav>

          {/* User Status / Quick Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {/* Instant Availability Quick Switch */}
                {myProfile && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-gray-50 border border-gray-200">
                    <span className="text-xs text-gray-600 font-medium">Availability:</span>
                    <button
                      onClick={onToggleMyAvailability}
                      title="Click to toggle your donor availability instantly"
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-bold transition-all ${
                        myProfile.isAvailable
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${myProfile.isAvailable ? 'bg-emerald-500 animate-ping' : 'bg-gray-400'}`} />
                      <span>{myProfile.isAvailable ? 'Available' : 'Unavailable'}</span>
                    </button>
                  </div>
                )}

                {/* Profile Pill */}
                {myProfile ? (
                  <button
                    onClick={onOpenProfileModal}
                    className="flex items-center gap-2 p-1.5 pr-3 bg-red-50 hover:bg-red-100 rounded-2xl border border-red-200 text-gray-900 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-xl bg-red-600 text-white font-black text-xs flex items-center justify-center">
                      {myProfile.bloodGroup}
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold flex items-center gap-1">
                        <span className="max-w-[100px] truncate">{myProfile.fullName}</span>
                        {myProfile.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={onOpenProfileModal}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Droplets className="w-3.5 h-3.5" />
                    <span>Complete Donor Profile</span>
                  </button>
                )}

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a
                  href="#emergency-requests"
                  className="px-3.5 py-2 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                >
                  Need Blood?
                </a>
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-red-500/25 transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In / Register</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {currentUser && myProfile && (
              <button
                onClick={onToggleMyAvailability}
                className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                  myProfile.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {myProfile.isAvailable ? 'Available' : 'Unavailable'}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-red-600 rounded-xl hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-3 bg-white">
            <div className="flex flex-col space-y-1 text-sm font-bold text-gray-800">
              <a
                href="#search-donors"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-red-50 hover:text-red-600"
              >
                Find Donors
              </a>
              <a
                href="#emergency-requests"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-red-50 hover:text-red-600 flex items-center justify-between"
              >
                <span>Emergency Blood Requests</span>
                {openEmergencyCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white">
                    {openEmergencyCount} Urgent
                  </span>
                )}
              </a>
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenCompatibilityModal(); }}
                className="text-left px-3 py-2 rounded-xl hover:bg-red-50 hover:text-red-600"
              >
                Blood Compatibility Matrix
              </button>

              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAdminPanel(); }}
                  className="text-left px-3 py-2 rounded-xl bg-gray-900 text-white flex items-center gap-2"
                >
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Admin Panel</span>
                </button>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="px-3 text-xs text-gray-500">
                    Signed in as <strong className="text-gray-900">{currentUser.email}</strong>
                  </div>
                  {myProfile ? (
                    <button
                      onClick={() => { setMobileMenuOpen(false); onOpenProfileModal(); }}
                      className="w-full py-2.5 px-3 bg-red-50 text-red-700 font-bold rounded-xl text-xs flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-red-600 text-white rounded-md text-[10px]">
                          {myProfile.bloodGroup}
                        </span>
                        <span>Edit Donor Profile</span>
                      </span>
                      {myProfile.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                    </button>
                  ) : (
                    <button
                      onClick={() => { setMobileMenuOpen(false); onOpenProfileModal(); }}
                      className="w-full py-2.5 px-3 bg-red-600 text-white font-bold rounded-xl text-xs"
                    >
                      Create Donor Profile
                    </button>
                  )}

                  <button
                    onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                    className="w-full py-2 px-3 text-gray-600 hover:text-red-600 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                  className="w-full py-3 bg-red-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In or Register</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
