import React, { useState } from 'react';
import { DonorProfile, User } from '../types';
import { Phone, MapPin, ExternalLink, ShieldCheck, Check, Copy, MessageCircle, Calendar, Heart, Lock } from 'lucide-react';

interface DonorCardProps {
  donor: DonorProfile;
  currentUser: User | null;
  onOpenAuth: () => void;
  onEditProfile?: () => void;
  onToggleAvailability?: (status: boolean) => void;
}

export const DonorCard: React.FC<DonorCardProps> = ({
  donor,
  currentUser,
  onOpenAuth,
  onEditProfile,
  onToggleAvailability,
}) => {
  const [copied, setCopied] = useState(false);
  const isOwnProfile = currentUser && currentUser.id === donor.userId;

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    navigator.clipboard.writeText(donor.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    window.location.href = `tel:${donor.phone.replace(/[^0-9+]/g, '')}`;
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    const cleanNum = donor.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNum}?text=Hello%20${encodeURIComponent(donor.fullName)},%20I%20found%20your%20profile%20on%20BloodBond.%20Are%20you%20available%20for%20an%20urgent%20blood%20donation?`, '_blank');
  };

  return (
    <div className={`relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden flex flex-col justify-between ${
      donor.isAvailable ? 'border-red-100 shadow-sm' : 'border-gray-200 opacity-90 bg-gray-50/60'
    }`}>
      {/* Top Banner Accent */}
      <div className={`h-2 w-full ${donor.isAvailable ? 'bg-gradient-to-r from-red-600 to-rose-500' : 'bg-gray-300'}`} />

      <div className="p-5 flex-1 flex flex-col justify-between">
        {/* Header with Blood Group & Status */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            {/* Blood Drop & Group Badge */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex flex-col items-center justify-center font-black shadow-md shadow-red-200 ring-2 ring-red-100">
                <span className="text-xl tracking-tight leading-none">{donor.bloodGroup}</span>
                <span className="text-[10px] font-bold text-red-200 uppercase tracking-widest mt-0.5">Blood</span>
              </div>

              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-tight">
                    {donor.fullName}
                  </h3>
                  {donor.isVerified && (
                    <span
                      title="Verified Donor (Confirmed Identity & Contact)"
                      className="inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500 mr-1 shrink-0" />
                  <span className="truncate max-w-[180px] sm:max-w-[210px]">{donor.district} &bull; {donor.area}</span>
                </div>
              </div>
            </div>

            {/* Availability Pill */}
            <div className="shrink-0">
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                donor.isAvailable
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-gray-100 border-gray-200 text-gray-600'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  donor.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                }`} />
                <span>{donor.isAvailable ? 'Available' : 'Unavailable'}</span>
              </div>
            </div>
          </div>

          {/* Bio / Note if available */}
          {donor.bio && (
            <p className="text-xs text-gray-600 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100 italic line-clamp-2 mb-3">
              "{donor.bio}"
            </p>
          )}

          {/* Secondary stats: Last donation & total donations */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 py-2 border-y border-gray-100 mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>Last: <strong className="text-gray-800">{donor.lastDonationDate || 'Not specified'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              <Heart className="w-3.5 h-3.5 text-red-500" />
              <span>Donations: <strong className="text-gray-800">{donor.totalDonations || 0} times</strong></span>
            </div>
          </div>
        </div>

        {/* Contact section */}
        <div>
          {currentUser ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 text-xs font-mono font-medium text-gray-800">
                  <Phone className="w-4 h-4 text-red-600" />
                  <span>{donor.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCopyPhone}
                    title="Copy Phone Number"
                    className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors text-xs inline-flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    title="Message on WhatsApp"
                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleCall}
                  className="py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Donor</span>
                </button>

                {donor.facebookUrl ? (
                  <a
                    href={donor.facebookUrl.startsWith('http') ? donor.facebookUrl : `https://${donor.facebookUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 border border-blue-200 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Facebook</span>
                  </a>
                ) : (
                  <button
                    disabled
                    className="py-2.5 px-3 bg-gray-100 text-gray-400 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed"
                  >
                    <span>No Social Link</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-red-50/80 rounded-xl border border-red-100 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-red-900 mb-2">
                <Lock className="w-3.5 h-3.5 text-red-600" />
                <span>Sign in to view direct phone & social link</span>
              </div>
              <button
                onClick={onOpenAuth}
                className="w-full py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                Sign In to View Contact
              </button>
            </div>
          )}

          {/* If own profile, allow quick edit or toggle */}
          {isOwnProfile && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Your Profile</span>
              <div className="flex items-center gap-2">
                {onToggleAvailability && (
                  <button
                    onClick={() => onToggleAvailability(!donor.isAvailable)}
                    className="text-gray-700 hover:text-red-600 font-semibold underline text-xs"
                  >
                    Toggle Status
                  </button>
                )}
                {onEditProfile && (
                  <button
                    onClick={onEditProfile}
                    className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold text-xs transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
