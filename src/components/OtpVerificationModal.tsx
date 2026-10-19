import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Phone, CheckCircle, AlertTriangle, ArrowRight, RotateCw, X, MessageSquare } from 'lucide-react';

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  phone: string;
  onVerifySuccess: () => void;
  sendOtpFn: (userId: string, phone: string) => string;
  verifyOtpFn: (userId: string, code: string) => boolean;
}

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  isOpen,
  onClose,
  userId,
  phone,
  onVerifySuccess,
  sendOtpFn,
  verifyOtpFn,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [resendCountdown, setResendCountdown] = useState<number>(45);
  const [smsSimulatedNotice, setSmsSimulatedNotice] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Trigger OTP sending when modal opens
  useEffect(() => {
    if (isOpen) {
      setDigits(['', '', '', '', '', '']);
      setError('');
      setIsSuccess(false);
      setResendCountdown(45);

      try {
        const code = sendOtpFn(userId, phone);
        setGeneratedCode(code);
        setSmsSimulatedNotice(`[SMS Simulation] BloodBond Security: Your 6-digit verification code is ${code}. Do not share this code with anyone.`);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to send OTP code');
      }
    }
  }, [isOpen, userId, phone, sendOtpFn]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || resendCountdown <= 0) return;
    const interval = setInterval(() => {
      setResendCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, resendCountdown]);

  if (!isOpen) return null;

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric characters
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal) {
      const nextDigits = [...digits];
      nextDigits[index] = '';
      setDigits(nextDigits);
      return;
    }

    // If user pasted multi digits
    if (cleanVal.length > 1) {
      const chars = cleanVal.slice(0, 6).split('');
      const nextDigits = [...digits];
      chars.forEach((c, i) => {
        if (i < 6) nextDigits[i] = c;
      });
      setDigits(nextDigits);
      const targetFocus = Math.min(chars.length, 5);
      inputRefs.current[targetFocus]?.focus();
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = cleanVal.slice(-1);
    setDigits(nextDigits);
    setError('');

    // Auto-advance
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (resendCountdown > 0) return;
    setError('');
    try {
      const code = sendOtpFn(userId, phone);
      setGeneratedCode(code);
      setResendCountdown(45);
      setSmsSimulatedNotice(`[SMS Simulation] BloodBond Security: Your new 6-digit code is ${code}. Valid for 5 minutes.`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to resend OTP');
    }
  };

  const handleAutoFill = () => {
    if (generatedCode && generatedCode.length === 6) {
      setDigits(generatedCode.split(''));
      setError('');
    }
  };

  const handleVerify = () => {
    const fullCode = digits.join('');
    if (fullCode.length < 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }

    try {
      verifyOtpFn(userId, fullCode);
      setIsSuccess(true);
      setTimeout(() => {
        onVerifySuccess();
        onClose();
      }, 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid verification code');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-red-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Verify Mobile Number</h3>
              <p className="text-xs text-red-100">Earn your official Verified Donor badge</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Phone Verified!</h4>
              <p className="text-sm text-gray-600 max-w-xs mx-auto">
                Congratulations! Your number is confirmed and you have earned the official <strong className="text-emerald-700">Verified Donor</strong> badge.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <p className="text-sm text-gray-600">
                  We sent a 6-digit one-time verification password (OTP) to:
                </p>
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-50 border border-red-200 text-red-700 rounded-full font-semibold text-sm">
                  <Phone className="w-4 h-4" />
                  <span>{phone || 'Your Mobile Number'}</span>
                </div>
              </div>

              {/* Simulated SMS notification card */}
              {smsSimulatedNotice && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-amber-950">Simulated SMS Delivery</span>
                      <p className="text-amber-800 text-[11px] mt-0.5">{smsSimulatedNotice}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    className="self-end px-2.5 py-1 text-[11px] font-medium bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-md transition-colors"
                  >
                    Auto-fill Code ({generatedCode})
                  </button>
                </div>
              )}

              {/* 6 Digit Inputs */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 text-center">
                  Enter 6-Digit Code
                </label>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {digits.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleDigitChange(i, e.target.value)}
                      onKeyDown={e => handleKeyDown(i, e)}
                      className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-hidden transition-all bg-gray-50 focus:bg-white text-gray-900"
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleVerify}
                  className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <span>Confirm & Verify Donor</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-xs text-gray-500 px-1">
                  <span>Didn't receive the code?</span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCountdown > 0}
                    className={`font-semibold inline-flex items-center gap-1 ${
                      resendCountdown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-700 hover:underline'
                    }`}
                  >
                    <RotateCw className={`w-3 h-3 ${resendCountdown > 0 ? 'animate-spin' : ''}`} />
                    {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Code'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
