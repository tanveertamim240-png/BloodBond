import React, { useState } from 'react';
import { BloodGroup, ALL_BLOOD_GROUPS, BLOOD_COMPATIBILITY } from '../types';
import { Droplets, X, Check, ArrowRight, ShieldCheck, Info, Heart } from 'lucide-react';

interface BloodCompatibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGroup?: BloodGroup;
}

export const BloodCompatibilityModal: React.FC<BloodCompatibilityModalProps> = ({
  isOpen,
  onClose,
  initialGroup = 'O+',
}) => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>(initialGroup);

  if (!isOpen) return null;

  const info = BLOOD_COMPATIBILITY[selectedGroup];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-red-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-xs">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">Blood Compatibility Guide</h3>
              <p className="text-xs text-red-100">Transfusion matching matrix & rules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Blood Group Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 text-center">
              Select Blood Group to Check Matching
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {ALL_BLOOD_GROUPS.map((bg) => {
                const isSelected = selectedGroup === bg;
                return (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setSelectedGroup(bg)}
                    className={`py-3 rounded-2xl text-center font-black transition-all border-2 ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-700 shadow-md scale-105 ring-2 ring-red-200'
                        : 'bg-white text-gray-800 border-gray-200 hover:border-red-300 hover:bg-red-50/50'
                    }`}
                  >
                    <span className="text-lg leading-none">{bg}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Group Highlight Banner */}
          <div className="p-5 bg-gradient-to-br from-red-50 to-rose-100/60 rounded-3xl border border-red-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-red-600 text-white font-black text-2xl flex flex-col items-center justify-center shadow-md shadow-red-200">
                <span>{selectedGroup}</span>
                <span className="text-[9px] uppercase tracking-wider text-red-200">Type</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">
                  {selectedGroup === 'O-' && 'Universal Red Blood Cell Donor'}
                  {selectedGroup === 'AB+' && 'Universal Recipient'}
                  {selectedGroup !== 'O-' && selectedGroup !== 'AB+' && `Blood Group ${selectedGroup}`}
                </h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  {selectedGroup === 'O-' && 'Can be transfused to anyone safely in emergency situations.'}
                  {selectedGroup === 'AB+' && 'Can receive red blood cells from any blood type.'}
                  {selectedGroup !== 'O-' && selectedGroup !== 'AB+' && 'Can donate and receive from specific compatible antigen groups.'}
                </p>
              </div>
            </div>
          </div>

          {/* Give To vs Receive From Panels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Can Give Blood To */}
            <div className="p-5 bg-gray-50 rounded-3xl border border-gray-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-700">
                <Heart className="w-4 h-4 text-red-600" />
                <span>Can Give Blood To ({info.canGiveTo.length})</span>
              </div>
              <p className="text-xs text-gray-500">
                Patients with these blood groups can safely accept {selectedGroup} blood:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {info.canGiveTo.map(g => (
                  <span
                    key={g}
                    className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-black text-sm shadow-xs"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Can Receive Blood From */}
            <div className="p-5 bg-gray-50 rounded-3xl border border-gray-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Can Receive Blood From ({info.canReceiveFrom.length})</span>
              </div>
              <p className="text-xs text-gray-500">
                A person with {selectedGroup} can safely receive transfusions from:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {info.canReceiveFrom.map(g => (
                  <span
                    key={g}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-black text-sm shadow-xs"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Facts */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-3 text-xs text-blue-900">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Donor Safety Rules:</span>
              <p className="text-blue-800 text-[11px]">
                Healthy adults aged 18–60 weighing at least 50 kg can donate every 3 to 4 months. Always verify cross-matching at the hospital blood bank prior to transfusion.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
