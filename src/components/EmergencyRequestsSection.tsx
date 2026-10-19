import React, { useState } from 'react';
import { BloodRequest, BloodGroup, ALL_BLOOD_GROUPS, BANGLADESH_DISTRICTS, User, UrgencyLevel } from '../types';
import { AlertTriangle, Clock, MapPin, Phone, CheckCircle2, Plus, Filter, Building2, Droplets, X, MessageSquare, AlertCircle, Share2, Check } from 'lucide-react';

interface EmergencyRequestsSectionProps {
  requests: BloodRequest[];
  currentUser: User | null;
  onOpenAuth: () => void;
  onCreateRequest: (data: Omit<BloodRequest, 'id' | 'createdAt' | 'status'>) => void;
  onUpdateStatus: (requestId: string, status: 'open' | 'fulfilled') => void;
  onDeleteRequest?: (requestId: string) => void;
  highlightBloodGroup?: BloodGroup | null;
  highlightDistrict?: string | null;
}

export const EmergencyRequestsSection: React.FC<EmergencyRequestsSectionProps> = ({
  requests,
  currentUser,
  onOpenAuth,
  onCreateRequest,
  onUpdateStatus,
  onDeleteRequest,
  highlightBloodGroup,
  highlightDistrict,
}) => {
  const [filterBloodGroup, setFilterBloodGroup] = useState<string>(highlightBloodGroup || 'ALL');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'fulfilled'>('open');
  const [filterDistrict, setFilterDistrict] = useState<string>(highlightDistrict || 'ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(highlightBloodGroup || 'O+');
  const [unitsNeeded, setUnitsNeeded] = useState<number>(1);
  const [hospitalName, setHospitalName] = useState('');
  const [district, setDistrict] = useState(highlightDistrict || 'Dhaka');
  const [contactPhone, setContactPhone] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('immediate');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter requests
  const filteredRequests = requests.filter(req => {
    if (filterStatus !== 'all' && req.status !== filterStatus) return false;
    if (filterBloodGroup !== 'ALL' && req.bloodGroup !== filterBloodGroup) return false;
    if (filterDistrict !== 'ALL' && req.district !== filterDistrict) return false;
    return true;
  });

  const openCount = requests.filter(r => r.status === 'open').length;

  const handleOpenCreateModal = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setFormError('');
    setIsCreateModalOpen(true);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setFormError('Please enter patient or case name.');
      return;
    }
    if (!hospitalName.trim()) {
      setFormError('Please provide the hospital or medical center name.');
      return;
    }
    if (!contactPhone.trim()) {
      setFormError('Please provide an emergency contact phone number.');
      return;
    }

    try {
      onCreateRequest({
        requesterId: currentUser!.id,
        requesterName: currentUser!.email.split('@')[0],
        patientName: patientName.trim(),
        bloodGroup,
        unitsNeeded: Number(unitsNeeded) || 1,
        hospitalName: hospitalName.trim(),
        district,
        contactPhone: contactPhone.trim(),
        urgency,
        notes: notes.trim() || undefined,
      });

      setIsCreateModalOpen(false);
      // Reset form
      setPatientName('');
      setHospitalName('');
      setContactPhone('');
      setNotes('');
      setUnitsNeeded(1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to post blood request');
    }
  };

  const copyShareText = (req: BloodRequest) => {
    const text = `🚨 EMERGENCY BLOOD NEEDED (${req.bloodGroup}) 🚨\nPatient: ${req.patientName}\nHospital: ${req.hospitalName}, ${req.district}\nUnits Needed: ${req.unitsNeeded}\nUrgency: ${req.urgency.toUpperCase()}\nEmergency Contact: ${req.contactPhone}\nNotes: ${req.notes || 'Immediate help required.'}\nPlease share & donate via BloodBond!`;
    navigator.clipboard.writeText(text);
    setCopiedId(req.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="emergency-requests" className="py-12 bg-gradient-to-b from-red-50/50 via-white to-gray-50/60 border-t border-b border-red-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-black uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              Live Emergency Board &bull; {openCount} Active Needs
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight flex items-center gap-2">
              <span>Emergency Blood Requests</span>
              <AlertTriangle className="w-7 h-7 text-red-600 shrink-0" />
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mt-1">
              Critical hospital cases requiring urgent transfusions. Browse requests or submit an emergency appeal to alert nearby matching donors.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="self-start md:self-auto px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-red-500/20 transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Post Emergency Request</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <span className="font-bold text-gray-600 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-gray-400" /> Filter:
            </span>

            {/* Blood group pills */}
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setFilterBloodGroup('ALL')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  filterBloodGroup === 'ALL'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Groups
              </button>
              {ALL_BLOOD_GROUPS.map(bg => (
                <button
                  key={bg}
                  onClick={() => setFilterBloodGroup(bg)}
                  className={`px-2 py-1 rounded-lg font-bold transition-colors ${
                    filterBloodGroup === bg
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* District select */}
            <select
              value={filterDistrict}
              onChange={e => setFilterDistrict(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 font-medium outline-hidden"
            >
              <option value="ALL">All Districts</option>
              {BANGLADESH_DISTRICTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Status select */}
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as any)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 font-medium outline-hidden"
            >
              <option value="open">Open Needs Only</option>
              <option value="all">All Requests</option>
              <option value="fulfilled">Fulfilled Cases</option>
            </select>
          </div>
        </div>

        {/* Requests Grid */}
        {filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRequests.map(req => {
              const isOwner = currentUser && currentUser.id === req.requesterId;
              const isAdmin = currentUser?.role === 'admin';
              const isOpen = req.status === 'open';

              const urgencyBadge = {
                immediate: { label: 'CRITICAL / IMMEDIATE', bg: 'bg-red-600 text-white animate-pulse' },
                urgent: { label: 'URGENT (2-6 HRS)', bg: 'bg-amber-600 text-white' },
                standard: { label: 'STANDARD (24 HRS)', bg: 'bg-blue-600 text-white' },
              }[req.urgency];

              return (
                <div
                  key={req.id}
                  className={`relative bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md ${
                    isOpen ? 'border-red-200 ring-1 ring-red-100' : 'border-gray-200 bg-gray-50/70 opacity-80'
                  }`}
                >
                  {/* Top Urgency Header */}
                  <div className="px-4 py-2.5 bg-gray-900 text-white flex items-center justify-between text-[11px] font-bold">
                    <span className={`px-2 py-0.5 rounded-full ${urgencyBadge.bg} text-[10px] tracking-wide`}>
                      {urgencyBadge.label}
                    </span>
                    <span className="text-gray-300 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-red-400" />
                      {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Blood Group and Units Highlight */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex flex-col items-center justify-center font-black shadow-md shadow-red-200">
                            <span className="text-2xl leading-none">{req.bloodGroup}</span>
                            <span className="text-[9px] uppercase tracking-wider text-red-200 mt-0.5">Need</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-950 text-base leading-tight">
                              {req.patientName}
                            </h4>
                            <p className="text-xs text-red-600 font-semibold mt-0.5">
                              {req.unitsNeeded} {req.unitsNeeded === 1 ? 'Unit / Bag' : 'Units / Bags'} Needed
                            </p>
                          </div>
                        </div>

                        {/* Status Tag */}
                        <div>
                          {isOpen ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-800 border border-red-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                              Active Appeal
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Fulfilled
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Location Details */}
                      <div className="space-y-1.5 text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 mb-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-red-600 shrink-0" />
                          <span className="font-semibold text-gray-900">{req.hospitalName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                          <span>District: <strong className="text-gray-800">{req.district}</strong></span>
                        </div>
                      </div>

                      {/* Clinical situation note */}
                      {req.notes && (
                        <p className="text-xs text-gray-600 bg-amber-50/60 border border-amber-100 p-2.5 rounded-xl mb-4 italic">
                          "{req.notes}"
                        </p>
                      )}
                    </div>

                    {/* Bottom Action Section */}
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      {currentUser ? (
                        <div className="flex items-center gap-2">
                          {isOpen ? (
                            <a
                              href={`tel:${req.contactPhone.replace(/[^0-9+]/g, '')}`}
                              className="flex-1 py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Call Attendant ({req.contactPhone})</span>
                            </a>
                          ) : (
                            <div className="flex-1 py-2 px-3 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-xl text-center border border-emerald-200">
                              Donation Received &bull; Closed
                            </div>
                          )}

                          <button
                            onClick={() => copyShareText(req)}
                            title="Copy emergency alert to clipboard"
                            className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors shrink-0 text-xs flex items-center gap-1 font-semibold"
                          >
                            {copiedId === req.id ? (
                              <>
                                <Check className="w-4 h-4 text-emerald-600" />
                                <span className="hidden sm:inline text-emerald-600">Copied</span>
                              </>
                            ) : (
                              <>
                                <Share2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Share</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={onOpenAuth}
                          className="w-full py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Sign In to View Contact & Respond</span>
                        </button>
                      )}

                      {/* Owner / Admin Management: Mark as Fulfilled / Closed */}
                      {(isOwner || isAdmin) && (
                        <div className="pt-2 flex items-center justify-between text-xs border-t border-gray-100">
                          <span className="text-gray-500 font-medium">Your Request</span>
                          <div className="flex items-center gap-2">
                            {isOpen ? (
                              <button
                                onClick={() => onUpdateStatus(req.id, 'fulfilled')}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1 shadow-xs"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Mark as Fulfilled</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => onUpdateStatus(req.id, 'open')}
                                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-colors"
                              >
                                Reopen Request
                              </button>
                            )}

                            {onDeleteRequest && (
                              <button
                                onClick={() => onDeleteRequest(req.id)}
                                className="p-1 text-gray-400 hover:text-red-600 rounded-md transition-colors"
                                title="Delete Request"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-gray-200 p-8 shadow-xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900">No matching open emergency requests</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 mb-4">
              Currently there are no unfulfilled requests for the selected filter criteria. If someone you know is in urgent need, post a request now!
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Post Emergency Request</span>
            </button>
          </div>
        )}
      </div>

      {/* Post Emergency Blood Request Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-red-100 overflow-hidden my-6">
            <div className="bg-gradient-to-r from-red-600 to-rose-700 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black">Submit Emergency Blood Request</h3>
                  <p className="text-xs text-red-100">Broadcast your appeal to all registered donors</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Required Blood Group */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Required Blood Group <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {ALL_BLOOD_GROUPS.map(bg => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setBloodGroup(bg)}
                      className={`py-2 rounded-xl text-center font-black text-sm border-2 transition-all ${
                        bloodGroup === bg
                          ? 'bg-red-600 text-white border-red-700 shadow-md scale-105'
                          : 'bg-white text-gray-800 border-gray-200 hover:border-red-300'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Patient Name & Units */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Patient Name / Case <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    placeholder="e.g. Karim Ullah (Surgery Patient)"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-red-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Units (Bags) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={unitsNeeded}
                    onChange={e => setUnitsNeeded(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-red-600 outline-hidden"
                  />
                </div>
              </div>

              {/* Hospital & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Hospital / Medical Center <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={hospitalName}
                    onChange={e => setHospitalName(e.target.value)}
                    placeholder="e.g. Dhaka Medical College Hospital"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-red-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    District <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-red-600 outline-hidden"
                  >
                    {BANGLADESH_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact Phone & Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Emergency Contact Phone <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    placeholder="+880 1711-000000"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-red-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Urgency Level <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={urgency}
                    onChange={e => setUrgency(e.target.value as UrgencyLevel)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-red-600 outline-hidden"
                  >
                    <option value="immediate">Immediate / Critical (Now)</option>
                    <option value="urgent">Urgent (Within 6 Hours)</option>
                    <option value="standard">Standard (Within 24 Hours)</option>
                  </select>
                </div>
              </div>

              {/* Brief Description / Situation */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Brief Description of the Situation
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Scheduled for heart surgery tomorrow at 8 AM. Need fresh blood on stand-by."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-red-600 outline-hidden resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Publish Emergency Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
