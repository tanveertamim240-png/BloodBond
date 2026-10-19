import { useState, useEffect, useCallback, useMemo } from 'react';
import { StorageService } from '../services/storage';
import { User, DonorProfile, BloodRequest, BloodGroup } from '../types';

export function useBloodStore() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => StorageService.getCurrentUser());
  const [donors, setDonors] = useState<DonorProfile[]>(() => StorageService.getProfiles());
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>(() => StorageService.getBloodRequests());
  const [users, setUsers] = useState<User[]>(() => StorageService.getUsers());

  // Reload state from storage
  const refresh = useCallback(() => {
    setCurrentUser(StorageService.getCurrentUser());
    setDonors(StorageService.getProfiles());
    setBloodRequests(StorageService.getBloodRequests());
    setUsers(StorageService.getUsers());
  }, []);

  useEffect(() => {
    StorageService.init();
    refresh();

    const handleStorageChange = () => {
      refresh();
    };

    window.addEventListener('bloodbond:change', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('bloodbond:change', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refresh]);

  // Current user's donor profile
  const myProfile = useMemo(() => {
    if (!currentUser) return null;
    return donors.find(d => d.userId === currentUser.id) || null;
  }, [currentUser, donors]);

  // App-wide stats
  const stats = useMemo(() => {
    const totalDonors = donors.length;
    const availableDonors = donors.filter(d => d.isAvailable).length;
    const verifiedDonors = donors.filter(d => d.isVerified).length;
    const openRequests = bloodRequests.filter(r => r.status === 'open').length;
    const totalDonationsCount = donors.reduce((acc, d) => acc + (d.totalDonations || 0), 0);

    return {
      totalDonors,
      availableDonors,
      verifiedDonors,
      openRequests,
      totalDonationsCount,
    };
  }, [donors, bloodRequests]);

  // Actions
  const login = useCallback((email: string, pass: string) => {
    const u = StorageService.login(email, pass);
    setCurrentUser(u);
    refresh();
    return u;
  }, [refresh]);

  const register = useCallback((email: string, pass: string) => {
    const u = StorageService.register(email, pass);
    setCurrentUser(u);
    refresh();
    return u;
  }, [refresh]);

  const logout = useCallback(() => {
    StorageService.logout();
    setCurrentUser(null);
    refresh();
  }, [refresh]);

  const saveProfile = useCallback((profileData: Omit<DonorProfile, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    const saved = StorageService.saveProfile(profileData);
    refresh();
    return saved;
  }, [refresh]);

  const toggleAvailability = useCallback((userId: string, explicitStatus?: boolean) => {
    const res = StorageService.toggleAvailability(userId, explicitStatus);
    refresh();
    return res;
  }, [refresh]);

  const sendPhoneOtp = useCallback((userId: string, phone: string) => {
    return StorageService.sendPhoneOtp(userId, phone);
  }, []);

  const verifyPhoneOtp = useCallback((userId: string, code: string) => {
    const res = StorageService.verifyPhoneOtp(userId, code);
    refresh();
    return res;
  }, [refresh]);

  const verifyEmail = useCallback((userId: string) => {
    const res = StorageService.verifyEmail(userId);
    refresh();
    return res;
  }, [refresh]);

  const setDonorVerification = useCallback((donorId: string, isVerified: boolean) => {
    const res = StorageService.setDonorVerification(donorId, isVerified);
    refresh();
    return res;
  }, [refresh]);

  const deleteDonor = useCallback((donorId: string) => {
    const res = StorageService.deleteDonor(donorId);
    refresh();
    return res;
  }, [refresh]);

  const createBloodRequest = useCallback((requestData: Omit<BloodRequest, 'id' | 'createdAt' | 'status'>) => {
    const res = StorageService.createBloodRequest(requestData);
    refresh();
    return res;
  }, [refresh]);

  const updateRequestStatus = useCallback((requestId: string, status: 'open' | 'fulfilled') => {
    const res = StorageService.updateRequestStatus(requestId, status);
    refresh();
    return res;
  }, [refresh]);

  const deleteBloodRequest = useCallback((requestId: string) => {
    const res = StorageService.deleteBloodRequest(requestId);
    refresh();
    return res;
  }, [refresh]);

  return {
    currentUser,
    myProfile,
    donors,
    bloodRequests,
    users,
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
    refresh,
  };
}
