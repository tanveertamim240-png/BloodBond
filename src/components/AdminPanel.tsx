import React, { useState } from 'react';
import { DonorProfile, BloodRequest, User } from '../types';
import { Shield, ShieldCheck, Trash2, CheckCircle2, AlertTriangle, Users, Droplets, X, Search, Phone, ExternalLink, RefreshCw } from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  donors: DonorProfile[];
  bloodRequests: BloodRequest[];
  onSetVerification: (donorId: string, isVerified: boolean) => void;
  onDeleteDonor: (donorId: string) => void;
  onUpdateBloodRequestStatus: (requestId: string, status: 'open' | 'fulfilled') => void;
  onDeleteBloodRequest: (requestId: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  currentUser,
  donors,
  bloodRequests,
  onSetVerification,
  onDeleteDonor,
  onUpdateBloodRequestStatus,
  onDeleteBloodRequest,
}) => {
  const [activeTab, setActiveTab] = useState<'donors' | 'requests'>('donors');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredDonors = donors.filter(d =>
    d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.phone.includes(searchQuery) ||
    d.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.bloodGroup.includes(searchQuery)
  );

  const filteredRequests = bloodRequests.filter(r =>
    r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.bloodGroup.includes(searchQuery)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-6">
        {/* Top Header */}
        <div className="bg-gray-950 px-6 py-5 text-white flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-red-600 rounded-2xl shadow-md">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black">BloodBond Admin Control Center</h3>
                <span className="px-2 py-0.5 rounded-full bg-red-900 text-red-200 text-[10px] font-mono font-bold uppercase">
                  Privileged
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Logged in as <strong className="text-gray-200">{currentUser?.email}</strong> &bull; Manage verified badges, requests, and community integrity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls & Search */}
        <div className="p-5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('donors')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'donors'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Registered Donors ({donors.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'requests'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Emergency Appeals ({bloodRequests.length})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter by name, phone, hospital..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs focus:border-red-600 outline-hidden"
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto">
          {activeTab === 'donors' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider font-bold">
                    <th className="pb-3 px-2">Blood</th>
                    <th className="pb-3 px-2">Donor Name</th>
                    <th className="pb-3 px-2">Location</th>
                    <th className="pb-3 px-2">Contact Number</th>
                    <th className="pb-3 px-2">Verification Status</th>
                    <th className="pb-3 px-2">Availability</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDonors.map(donor => (
                    <tr key={donor.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-2">
                        <span className="w-8 h-8 rounded-lg bg-red-600 text-white font-black text-xs inline-flex items-center justify-center">
                          {donor.bloodGroup}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-bold text-gray-900">
                        <div>{donor.fullName}</div>
                        {donor.facebookUrl && (
                          <a
                            href={donor.facebookUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-blue-600 hover:underline inline-flex items-center gap-0.5 mt-0.5"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                            <span>Facebook</span>
                          </a>
                        )}
                      </td>
                      <td className="py-3 px-2 text-gray-600">
                        {donor.district} &bull; {donor.area}
                      </td>
                      <td className="py-3 px-2 font-mono text-gray-700">
                        {donor.phone}
                      </td>
                      <td className="py-3 px-2">
                        {donor.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          donor.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${donor.isAvailable ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                          {donor.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSetVerification(donor.id, !donor.isVerified)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                              donor.isVerified
                                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700'
                            }`}
                          >
                            {donor.isVerified ? 'Revoke Badge' : 'Grant Verified'}
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete profile for ${donor.fullName}?`)) {
                                onDeleteDonor(donor.id);
                              }
                            }}
                            title="Delete fake or duplicate donor profile"
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider font-bold">
                    <th className="pb-3 px-2">Group</th>
                    <th className="pb-3 px-2">Patient Case</th>
                    <th className="pb-3 px-2">Hospital & Location</th>
                    <th className="pb-3 px-2">Urgency</th>
                    <th className="pb-3 px-2">Contact</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRequests.map(req => (
                    <tr key={req.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-2">
                        <span className="w-8 h-8 rounded-lg bg-red-600 text-white font-black text-xs inline-flex items-center justify-center">
                          {req.bloodGroup}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-bold text-gray-900">
                        <div>{req.patientName}</div>
                        <div className="text-[10px] text-gray-500 font-normal">{req.unitsNeeded} units needed</div>
                      </td>
                      <td className="py-3 px-2 text-gray-700">
                        <div>{req.hospitalName}</div>
                        <div className="text-[10px] text-gray-500">{req.district}</div>
                      </td>
                      <td className="py-3 px-2 uppercase font-bold text-[10px]">
                        <span className={req.urgency === 'immediate' ? 'text-red-600' : 'text-amber-600'}>
                          {req.urgency}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-mono text-gray-700">
                        {req.contactPhone}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          req.status === 'open' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {req.status === 'open' ? 'Open Need' : 'Fulfilled'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onUpdateBloodRequestStatus(req.id, req.status === 'open' ? 'fulfilled' : 'open')}
                            className="px-2.5 py-1 rounded-lg font-bold text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
                          >
                            {req.status === 'open' ? 'Mark Fulfilled' : 'Reopen'}
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Delete this request permanently?')) {
                                onDeleteBloodRequest(req.id);
                              }
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
