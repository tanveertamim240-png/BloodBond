import React, { useState, useEffect } from 'react';
import { DonorProfile, BloodGroup, ALL_BLOOD_GROUPS, BANGLADESH_DISTRICTS } from '../types';
import { User, Droplets, MapPin, Phone, ExternalLink, ShieldCheck, Check, Heart, Calendar, X, AlertCircle } from 'lucide-react';

interface DonorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userEmail: string;
  existingProfile: DonorProfile | null;
  onSave: (data: Omit<DonorProfile, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  onStartOtpVerification: (phone: string) => void;
  onVerifyEmail: () => void;
}

export const DonorProfileModal: React.FC<DonorProfileModalProps> = ({
  isOpen,
  onClose,
  userId,
  userEmail,
  existingProfile,
  onSave,
  onStartOtpVerification,
  onVerifyEmail,
}) => {
  const [fullName, setFullName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [district, setDistrict] = useState('Dhaka');
  const [area, setArea] = useState('');
  const [phone, setPhone] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [totalDonations, setTotalDonations] = useState<number>(0);
  const [bio, setBio] = useState('');
  const [formError, setFormError] = useState('');

  // Sync state with existing profile
  useEffect(() => {
    if (existingProfile) {
      setFullName(existingProfile.fullName || '');
      setBloodGroup(existingProfile.bloodGroup || 'O+');
      setDistrict(existingProfile.district || 'Dhaka');
      setArea(existingProfile.area || '');
      setPhone(existingProfile.phone || '');
      setFacebookUrl(existingProfile.facebookUrl || '');
      setIsAvailable(existingProfile.isAvailable ?? true);
      setLastDonationDate(existingProfile.lastDonationDate || '');
      setTotalDonations(existingProfile.totalDonations || 0);
      setBio(existingProfile.bio || '');
    } else {
      setFullName('');
      setBloodGroup('O+');
      setDistrict('Dhaka');
      setArea('');
      setPhone('');
      setFacebookUrl('');
      setIsAvailable(true);
      setLastDonationDate('');
      setTotalDonations(0);
      setBio('');
    }
    setFormError('');
  }, [existingProfile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Please provide a valid mobile number for emergencies.');
      return;
    }
    if (!area.trim()) {
      setFormError('Please specify your area or sub-district.');
      return;
    }

    try {
      onSave({
        userId,
        fullName: fullName.trim(),
        bloodGroup,
        district,
        area: area.trim(),
        phone: phone.trim(),
        facebookUrl: facebookUrl.trim(),
        isAvailable,
        isVerified: existingProfile?.isVerified || false,
        isPhoneVerified: existingProfile?.isPhoneVerified || false,
        isEmailVerified: existingProfile?.isEmailVerified || false,
        lastDonationDate: lastDonationDate || undefined,
        totalDonations: Number(totalDonations) || 0,
        bio: bio.trim() || undefined,
      });
      onClose();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Error saving donor profile.');
    }
  };

  const isPhoneVerified = existingProfile?.isPhoneVerified || false;
  const isEmailVerified = existingProfile?.isEmailVerified || false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-red-100 overflow-hidden my-6">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-xs">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">
                {existingProfile ? 'Edit Donor Profile' : 'Register as Blood Donor'}
              </h3>
              <p className="text-xs text-red-100">
                Join the verified life-saving network &bull; Be reachable for critical emergency transfusions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Status Banner if profile exists */}
        {existingProfile && (
          <div className="px-6 py-3 bg-red-50/70 border-b border-red-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">Verification Status:</span>
              {existingProfile.isVerified ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Verified Donor
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-100 px-2.5 py-0.5 rounded-full">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Unverified Profile
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isPhoneVerified && phone && (
                <button
                  type="button"
                  onClick={() => onStartOtpVerification(phone)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-[11px] shadow-xs transition-colors flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  Verify Mobile via OTP
                </button>
              )}
              {!isEmailVerified && (
                <button
                  type="button"
                  onClick={onVerifyEmail}
                  className="px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg font-medium text-[11px] transition-colors"
                >
                  Verify Email
                </button>
              )}
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Availability Toggle Switch (Prominent Feature) */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-sm">Donation Availability Status</span>
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                  isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                }`}>
                  {isAvailable ? 'Available Now' : 'Not Available'}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {isAvailable
                  ? 'Patients & hospitals can contact you for urgent donations.'
                  : 'Turn off when recovering, travelling, or currently unable to donate.'}
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={e => setIsAvailable(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Blood Group Selector (Large visual tiles) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Select Your Blood Group <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {ALL_BLOOD_GROUPS.map((group) => {
                const isSelected = bloodGroup === group;
                return (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setBloodGroup(group)}
                    className={`py-3 px-1 rounded-xl text-center font-black transition-all flex flex-col items-center justify-center border-2 ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-700 shadow-md scale-105'
                        : 'bg-white text-gray-800 border-gray-200 hover:border-red-300 hover:bg-red-50/50'
                    }`}
                  >
                    <span className="text-lg leading-none">{group}</span>
                    <span className={`text-[9px] uppercase tracking-wider mt-0.5 ${isSelected ? 'text-red-100' : 'text-gray-400'}`}>
                      Group
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Full Legal Name <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Tanveer Tamim"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-hidden"
              />
            </div>
          </div>

          {/* Location: District and Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                District / Division <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-hidden appearance-none"
                >
                  {BANGLADESH_DISTRICTS.map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Area / Thana / Road <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={area}
                onChange={e => setArea(e.target.value)}
                placeholder="e.g. Dhanmondi, Road 27"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-hidden"
              />
            </div>
          </div>

          {/* Contact: Mobile & Facebook */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Mobile Number <span className="text-red-600">*</span>
                </label>
                {isPhoneVerified && (
                  <span className="text-[11px] text-emerald-600 font-bold inline-flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+880 1711-000000"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Facebook Profile Link
              </label>
              <div className="relative">
                <ExternalLink className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="url"
                  value={facebookUrl}
                  onChange={e => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/your.username"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Donation History Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Last Donation Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="date"
                  value={lastDonationDate}
                  onChange={e => setLastDonationDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Total Lifetime Donations
              </label>
              <div className="relative">
                <Heart className="w-4 h-4 text-red-500 absolute left-3 top-3.5" />
                <input
                  type="number"
                  min="0"
                  value={totalDonations}
                  onChange={e => setTotalDonations(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Bio / Emergency Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Bio / Availability Notes
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="e.g. Available after 5 PM on weekdays. Can reach Dhaka Medical College or Square Hospital quickly."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-hidden resize-none"
            />
          </div>

          {/* Footer Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{existingProfile ? 'Update Donor Profile' : 'Save & Publish Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
