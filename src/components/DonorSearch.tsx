import React, { useState, useMemo } from 'react';
import { DonorProfile, BloodGroup, ALL_BLOOD_GROUPS, BANGLADESH_DISTRICTS, User, BloodRequest } from '../types';
import { DonorCard } from './DonorCard';
import { Search, MapPin, Filter, ShieldCheck, CheckCircle2, AlertTriangle, Droplets, Users, PhoneCall, Sparkles, Lock } from 'lucide-react';

interface DonorSearchProps {
  donors: DonorProfile[];
  bloodRequests: BloodRequest[];
  currentUser: User | null;
  onOpenAuth: () => void;
  onEditProfile?: () => void;
  onToggleAvailability?: (status: boolean) => void;
  onSelectBloodGroupForEmergency?: (bg: BloodGroup) => void;
}

export const DonorSearch: React.FC<DonorSearchProps> = ({
  donors,
  bloodRequests,
  currentUser,
  onOpenAuth,
  onEditProfile,
  onToggleAvailability,
  onSelectBloodGroupForEmergency,
}) => {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);

  // Calculate counts per blood group
  const bloodGroupCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: donors.length };
    ALL_BLOOD_GROUPS.forEach(bg => {
      counts[bg] = donors.filter(d => d.bloodGroup === bg).length;
    });
    return counts;
  }, [donors]);

  // Filter donors
  const filteredDonors = useMemo(() => {
    return donors.filter(donor => {
      // Blood Group filter
      if (selectedBloodGroup !== 'ALL' && donor.bloodGroup !== selectedBloodGroup) {
        return false;
      }

      // District filter
      if (selectedDistrict !== 'ALL' && donor.district !== selectedDistrict) {
        return false;
      }

      // Availability filter
      if (onlyAvailable && !donor.isAvailable) {
        return false;
      }

      // Verified filter
      if (onlyVerified && !donor.isVerified) {
        return false;
      }

      // Search query (matches name, area, district, or bio)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = donor.fullName.toLowerCase().includes(q);
        const matchesArea = donor.area.toLowerCase().includes(q);
        const matchesDistrict = donor.district.toLowerCase().includes(q);
        const matchesBio = donor.bio ? donor.bio.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesArea && !matchesDistrict && !matchesBio) {
          return false;
        }
      }

      return true;
    });
  }, [donors, selectedBloodGroup, selectedDistrict, onlyAvailable, onlyVerified, searchQuery]);

  // Check if there are active emergency requests matching current search blood group and/or district!
  const matchingEmergencyRequests = useMemo(() => {
    return bloodRequests.filter(req => {
      if (req.status !== 'open') return false;
      const matchBg = selectedBloodGroup === 'ALL' || req.bloodGroup === selectedBloodGroup;
      const matchDist = selectedDistrict === 'ALL' || req.district === selectedDistrict;
      return matchBg && matchDist;
    });
  }, [bloodRequests, selectedBloodGroup, selectedDistrict]);

  return (
    <section id="search-donors" className="py-12 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title and stats bar */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Droplets className="w-3.5 h-3.5 text-red-600" />
            <span>Search Volunteer Donors</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
            Find Blood Donors by Group & Area
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Connect directly with verified volunteer donors ready for urgent transfusions. Search by blood group, division, or local area.
          </p>
        </div>

        {/* Search Controls Container */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xl shadow-red-950/5 border border-red-100 mb-8 space-y-6">
          {/* 1. Blood Group Visual Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-red-600" />
                <span>Filter by Blood Group</span>
              </label>
              <span className="text-xs text-gray-500 font-medium">
                {selectedBloodGroup === 'ALL' ? 'Showing all blood types' : `Selected: ${selectedBloodGroup}`}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-9 gap-2 sm:gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedBloodGroup('ALL')}
                className={`py-3 px-2 rounded-2xl font-black text-center transition-all border-2 flex flex-col items-center justify-center ${
                  selectedBloodGroup === 'ALL'
                    ? 'bg-red-600 text-white border-red-700 shadow-md scale-102 ring-2 ring-red-200'
                    : 'bg-white text-gray-800 border-gray-200 hover:border-red-300 hover:bg-red-50/40'
                }`}
              >
                <span className="text-base sm:text-lg leading-none">ALL</span>
                <span className={`text-[10px] mt-1 font-bold ${selectedBloodGroup === 'ALL' ? 'text-red-100' : 'text-gray-400'}`}>
                  {bloodGroupCounts['ALL'] || 0} Donors
                </span>
              </button>

              {ALL_BLOOD_GROUPS.map(bg => {
                const isSelected = selectedBloodGroup === bg;
                const count = bloodGroupCounts[bg] || 0;
                return (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setSelectedBloodGroup(bg)}
                    className={`py-3 px-2 rounded-2xl font-black text-center transition-all border-2 flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-700 shadow-md scale-102 ring-2 ring-red-200'
                        : 'bg-white text-gray-800 border-gray-200 hover:border-red-300 hover:bg-red-50/40'
                    }`}
                  >
                    <span className="text-lg leading-none">{bg}</span>
                    <span className={`text-[10px] mt-1 font-bold ${isSelected ? 'text-red-100' : 'text-gray-400'}`}>
                      {count} {count === 1 ? 'Donor' : 'Donors'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Text Search & District Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
            <div className="sm:col-span-7 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by donor name, area (e.g. Dhanmondi, Mirpur), or keywords..."
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-red-600 outline-hidden transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-xs text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="sm:col-span-5 relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-red-600 outline-hidden appearance-none font-medium text-gray-800"
              >
                <option value="ALL">All Districts / Divisions</option>
                {BANGLADESH_DISTRICTS.map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Toggles: Available Only & Verified Only */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={e => setOnlyAvailable(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded-sm border-gray-300 focus:ring-red-500"
                />
                <span className="font-semibold text-gray-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Show Available Donors Only
                </span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={e => setOnlyVerified(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded-sm border-gray-300 focus:ring-red-500"
                />
                <span className="font-semibold text-gray-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline-block" />
                  Verified Donors Only
                </span>
              </label>
            </div>

            <div className="text-gray-500 font-medium">
              Found <strong className="text-gray-900">{filteredDonors.length}</strong> matching donors
            </div>
          </div>
        </div>

        {/* 4. Highlighted Matching Emergency Blood Appeal (Cross-Linking feature!) */}
        {matchingEmergencyRequests.length > 0 && (
          <div className="mb-8 p-4 sm:p-5 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-3xl shadow-lg border border-red-500 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-xs">
                <AlertTriangle className="w-6 h-6 text-white animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-white text-red-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Emergency Match Alert
                  </span>
                  <span className="text-xs text-red-100">
                    {matchingEmergencyRequests.length} patient{matchingEmergencyRequests.length > 1 ? 's' : ''} urgently need blood!
                  </span>
                </div>
                <h4 className="font-bold text-base sm:text-lg mt-0.5">
                  Critical Request for {selectedBloodGroup !== 'ALL' ? selectedBloodGroup : 'Emergency'} Blood in {selectedDistrict !== 'ALL' ? selectedDistrict : 'hospital'}
                </h4>
              </div>
            </div>

            <a
              href="#emergency-requests"
              className="px-5 py-2.5 bg-white text-red-700 hover:bg-red-50 font-bold text-xs rounded-xl shadow-md transition-colors whitespace-nowrap"
            >
              View Emergency Case & Respond &rarr;
            </a>
          </div>
        )}

        {/* 5. Donor Cards Grid */}
        {filteredDonors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonors.map(donor => (
              <DonorCard
                key={donor.id}
                donor={donor}
                currentUser={currentUser}
                onOpenAuth={onOpenAuth}
                onEditProfile={onEditProfile}
                onToggleAvailability={onToggleAvailability}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-14 bg-white rounded-3xl border border-gray-200 p-8 shadow-xs">
            <Droplets className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">No matching donors found</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 mb-5">
              We couldn't find any donors matching your selected filters ({selectedBloodGroup !== 'ALL' ? selectedBloodGroup : 'Any Blood Group'} in {selectedDistrict !== 'ALL' ? selectedDistrict : 'Any District'}).
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSelectedBloodGroup('ALL');
                  setSelectedDistrict('ALL');
                  setOnlyAvailable(false);
                  setOnlyVerified(false);
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs transition-colors"
              >
                Reset All Filters
              </button>
              <a
                href="#emergency-requests"
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
              >
                Post an Emergency Need
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
