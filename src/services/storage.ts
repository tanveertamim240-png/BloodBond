import { DonorProfile, BloodRequest, User, BloodGroup } from '../types';

const USERS_KEY = 'bloodbond_users_v1';
const CURRENT_USER_KEY = 'bloodbond_current_user_v1';
const PROFILES_KEY = 'bloodbond_profiles_v1';
const REQUESTS_KEY = 'bloodbond_requests_v1';

// Seed initial donors to have an active community ready out-of-the-box
const SEED_PROFILES: DonorProfile[] = [
  {
    id: 'donor-1',
    userId: 'user-seed-1',
    fullName: 'Dr. Rafiqul Islam',
    bloodGroup: 'O+',
    district: 'Dhaka',
    area: 'Dhanmondi, Road 27',
    phone: '+880 1711-234567',
    facebookUrl: 'https://facebook.com/dr.rafiqul.donor',
    isAvailable: true,
    isVerified: true,
    lastDonationDate: '2026-08-15',
    totalDonations: 14,
    bio: 'General Physician & regular voluntary donor. Ready for urgent ICU or emergency cases.',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-09-01T12:00:00Z',
  },
  {
    id: 'donor-2',
    userId: 'user-seed-2',
    fullName: 'Tasnim Ahmed',
    bloodGroup: 'A+',
    district: 'Dhaka',
    area: 'Mirpur-10 & Uttara',
    phone: '+880 1822-987654',
    facebookUrl: 'https://facebook.com/tasnim.ahmed.bd',
    isAvailable: true,
    isVerified: true,
    lastDonationDate: '2026-07-20',
    totalDonations: 8,
    bio: 'Software engineer. Can reach Mirpur/Uttara hospitals within 30 minutes.',
    createdAt: '2026-02-12T14:30:00Z',
    updatedAt: '2026-08-10T09:15:00Z',
  },
  {
    id: 'donor-3',
    userId: 'user-seed-3',
    fullName: 'Nusrat Jahan',
    bloodGroup: 'O-',
    district: 'Chittagong',
    area: 'GEC Circle / Nasirabad',
    phone: '+880 1933-456789',
    facebookUrl: 'https://facebook.com/nusrat.jahan.life',
    isAvailable: true,
    isVerified: true,
    lastDonationDate: '2026-06-10',
    totalDonations: 11,
    bio: 'Universal donor (O-). Committed to pediatric and emergency surgery requests.',
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-09-12T11:00:00Z',
  },
  {
    id: 'donor-4',
    userId: 'user-seed-4',
    fullName: 'Tanvir Hossain',
    bloodGroup: 'B+',
    district: 'Dhaka',
    area: 'Gulshan & Banani',
    phone: '+880 1612-334455',
    facebookUrl: 'https://facebook.com/tanvir.bloodhelp',
    isAvailable: false,
    isVerified: true,
    lastDonationDate: '2026-10-02',
    totalDonations: 6,
    bio: 'Recently donated for a thalassemia child. Next eligible donation in January 2027.',
    createdAt: '2026-03-05T15:20:00Z',
    updatedAt: '2026-10-02T16:00:00Z',
  },
  {
    id: 'donor-5',
    userId: 'user-seed-5',
    fullName: 'Farhana Akter',
    bloodGroup: 'AB+',
    district: 'Sylhet',
    area: 'Zindabazar & Subidbazar',
    phone: '+880 1744-556677',
    facebookUrl: 'https://facebook.com/farhana.akter.sy',
    isAvailable: true,
    isVerified: false,
    lastDonationDate: '2026-05-18',
    totalDonations: 4,
    bio: 'University lecturer. Available on weekends and evenings for emergency patient support.',
    createdAt: '2026-04-10T09:40:00Z',
    updatedAt: '2026-08-25T14:10:00Z',
  },
  {
    id: 'donor-6',
    userId: 'user-seed-6',
    fullName: 'Mahmudul Hasan',
    bloodGroup: 'A-',
    district: 'Rajshahi',
    area: 'Shaheb Bazar / Medical College Area',
    phone: '+880 1555-667788',
    facebookUrl: 'https://facebook.com/mahmud.raj.donor',
    isAvailable: true,
    isVerified: true,
    lastDonationDate: '2026-04-01',
    totalDonations: 9,
    bio: 'Lives near Rajshahi Medical College Hospital (RMCH). Rare blood group donor volunteer.',
    createdAt: '2026-02-28T11:15:00Z',
    updatedAt: '2026-09-18T10:00:00Z',
  },
  {
    id: 'donor-7',
    userId: 'user-seed-7',
    fullName: 'Shahriar Kabir',
    bloodGroup: 'B-',
    district: 'Dhaka',
    area: 'Mohakhali & Tejgaon',
    phone: '+880 1911-889900',
    facebookUrl: 'https://facebook.com/shahriar.kabir.donor',
    isAvailable: true,
    isVerified: true,
    lastDonationDate: '2026-07-05',
    totalDonations: 12,
    bio: 'B- negative rare donor club member. Available 24/7 for life-threatening emergencies.',
    createdAt: '2026-01-15T13:00:00Z',
    updatedAt: '2026-09-30T17:45:00Z',
  },
  {
    id: 'donor-8',
    userId: 'user-seed-8',
    fullName: 'Sadia Chowdhury',
    bloodGroup: 'AB-',
    district: 'Chittagong',
    area: 'Agrabad Commercial Area',
    phone: '+880 1819-223344',
    facebookUrl: 'https://facebook.com/sadia.chowdhury.ctg',
    isAvailable: true,
    isVerified: false,
    lastDonationDate: '2026-03-14',
    totalDonations: 3,
    bio: 'Rare AB- blood donor. Please call directly in emergency.',
    createdAt: '2026-05-02T16:10:00Z',
    updatedAt: '2026-08-14T12:30:00Z',
  }
];

const SEED_REQUESTS: BloodRequest[] = [
  {
    id: 'req-1',
    requesterId: 'user-seed-1',
    requesterName: 'Dr. Rafiqul Islam',
    patientName: 'Tahmina Begum (Age 52)',
    bloodGroup: 'O-',
    unitsNeeded: 2,
    hospitalName: 'Square Hospital, Panthapath',
    district: 'Dhaka',
    contactPhone: '+880 1711-234567',
    urgency: 'immediate',
    notes: 'Urgent open heart bypass surgery scheduled tomorrow morning. 2 bags of fresh O- blood urgently required.',
    status: 'open',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'req-2',
    requesterId: 'user-seed-2',
    requesterName: 'Tasnim Ahmed',
    patientName: 'Arif Chowdhury (Accident Patient)',
    bloodGroup: 'A+',
    unitsNeeded: 3,
    hospitalName: 'Kurmitola General Hospital',
    district: 'Dhaka',
    contactPhone: '+880 1822-987654',
    urgency: 'immediate',
    notes: 'Road traffic accident trauma unit. Heavy blood loss, need 3 units A+ plasma and whole blood immediately.',
    status: 'open',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
  {
    id: 'req-3',
    requesterId: 'user-seed-3',
    requesterName: 'Nusrat Jahan',
    patientName: 'Master Shayan (Thalassemia patient)',
    bloodGroup: 'B+',
    unitsNeeded: 1,
    hospitalName: 'Chittagong Medical College Hospital',
    district: 'Chittagong',
    contactPhone: '+880 1933-456789',
    urgency: 'urgent',
    notes: 'Routine bi-weekly transfusion for 7-year old thalassemia warrior. Hemoglobin dropped to 6.2.',
    status: 'open',
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
  },
  {
    id: 'req-4',
    requesterId: 'user-seed-6',
    requesterName: 'Mahmudul Hasan',
    patientName: 'Fatema Khatun (C-Section)',
    bloodGroup: 'B-',
    unitsNeeded: 1,
    hospitalName: 'Rajshahi Medical College Hospital',
    district: 'Rajshahi',
    contactPhone: '+880 1555-667788',
    urgency: 'urgent',
    notes: 'Emergency cesarean delivery. Patient is stable but requires 1 reserve unit of B-.',
    status: 'fulfilled',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  }
];

const SEED_USERS: User[] = [
  {
    id: 'admin-1',
    email: 'admin@bloodbond.org',
    password: 'admin123password',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'user-seed-1',
    email: 'rafiqul@example.com',
    password: 'password123',
    role: 'user',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'user-seed-2',
    email: 'tasnim@example.com',
    password: 'password123',
    role: 'user',
    createdAt: '2026-02-12T14:30:00Z',
  }
];

// Broadcast channel for sync across browser tabs
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel('bloodbond_sync');
  } catch {
    broadcastChannel = null;
  }
}

function notifySubscribers(type: string, data?: unknown) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('bloodbond:change', { detail: { type, data } }));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type, data });
    }
  }
}

if (broadcastChannel) {
  broadcastChannel.onmessage = (event) => {
    if (typeof window !== 'undefined' && event.data) {
      window.dispatchEvent(new CustomEvent('bloodbond:change', { detail: event.data }));
    }
  };
}

export const StorageService = {
  // Initialize storage with seeds if first load
  init() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(PROFILES_KEY)) {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(SEED_PROFILES));
    }
    if (!localStorage.getItem(REQUESTS_KEY)) {
      localStorage.setItem(REQUESTS_KEY, JSON.stringify(SEED_REQUESTS));
    }
    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
    }
  },

  // Auth Operations
  getUsers(): User[] {
    this.init();
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  },

  getCurrentUser(): User | null {
    this.init();
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  register(email: string, password: string):User {
    const users = this.getUsers();
    const normalizedEmail = email.trim().toLowerCase();

    if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
      throw new Error('An account with this email already exists.');
    }

    const newUser: User = {
      id: 'user-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      email: normalizedEmail,
      password,
      role: normalizedEmail.includes('admin') ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    notifySubscribers('auth_login', newUser);
    return newUser;
  },

  login(email: string, password: string): User {
    const users = this.getUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!found || found.password !== password) {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found));
    notifySubscribers('auth_login', found);
    return found;
  },

  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    notifySubscribers('auth_logout');
  },

  // Donor Profile Operations
  getProfiles(): DonorProfile[] {
    this.init();
    try {
      const data = localStorage.getItem(PROFILES_KEY);
      return data ? JSON.parse(data) : SEED_PROFILES;
    } catch {
      return SEED_PROFILES;
    }
  },

  getProfileByUserId(userId: string): DonorProfile | null {
    const profiles = this.getProfiles();
    return profiles.find(p => p.userId === userId) || null;
  },

  saveProfile(profileData: Omit<DonorProfile, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): DonorProfile {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('You must be signed in to create or edit a donor profile.');
    }

    // Security check: user can only modify their own profile unless admin
    if (profileData.userId !== currentUser.id && currentUser.role !== 'admin') {
      throw new Error('Unauthorized: You can only edit your own donor profile.');
    }

    const profiles = this.getProfiles();
    const now = new Date().toISOString();

    const existingIndex = profiles.findIndex(p => p.userId === profileData.userId);

    let savedProfile: DonorProfile;

    if (existingIndex >= 0) {
      const existing = profiles[existingIndex];
      savedProfile = {
        ...existing,
        ...profileData,
        id: existing.id,
        createdAt: existing.createdAt,
        updatedAt: now,
      };
      profiles[existingIndex] = savedProfile;
    } else {
      savedProfile = {
        ...profileData,
        id: 'donor-' + Date.now(),
        createdAt: now,
        updatedAt: now,
      };
      profiles.unshift(savedProfile);
    }

    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    notifySubscribers('profile_saved', savedProfile);
    return savedProfile;
  },

  toggleAvailability(userId: string, explicitStatus?: boolean): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser || (currentUser.id !== userId && currentUser.role !== 'admin')) {
      throw new Error('Unauthorized to change this profile availability.');
    }

    const profiles = this.getProfiles();
    const target = profiles.find(p => p.userId === userId);
    if (!target) return false;

    target.isAvailable = typeof explicitStatus === 'boolean' ? explicitStatus : !target.isAvailable;
    target.updatedAt = new Date().toISOString();

    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    notifySubscribers('profile_updated', target);
    return target.isAvailable;
  },

  // Mobile OTP Verification System
  activeOtps: {} as Record<string, { code: string; phone: string; expiresAt: number }>,

  sendPhoneOtp(userId: string, phone: string): string {
    // Generate a 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity
    this.activeOtps[userId] = { code, phone, expiresAt };
    
    // Store in session storage so it persists if page reloads
    try {
      sessionStorage.setItem(`otp_${userId}`, JSON.stringify({ code, phone, expiresAt }));
    } catch {}

    return code;
  },

  verifyPhoneOtp(userId: string, enteredCode: string): boolean {
    let otpData = this.activeOtps[userId];
    if (!otpData) {
      try {
        const stored = sessionStorage.getItem(`otp_${userId}`);
        if (stored) otpData = JSON.parse(stored);
      } catch {}
    }

    if (!otpData) {
      throw new Error('No OTP request found. Please request a new OTP code.');
    }

    if (Date.now() > otpData.expiresAt) {
      delete this.activeOtps[userId];
      try { sessionStorage.removeItem(`otp_${userId}`); } catch {}
      throw new Error('The OTP code has expired. Please request a new code.');
    }

    if (otpData.code !== enteredCode.trim()) {
      throw new Error('Invalid verification code. Please check and try again.');
    }

    // Mark as verified in donor profile
    const profiles = this.getProfiles();
    const target = profiles.find(p => p.userId === userId);
    if (target) {
      target.isPhoneVerified = true;
      target.isVerified = true; // Award Verified Donor badge!
      target.updatedAt = new Date().toISOString();
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
      notifySubscribers('profile_updated', target);
    }

    delete this.activeOtps[userId];
    try { sessionStorage.removeItem(`otp_${userId}`); } catch {}
    return true;
  },

  verifyEmail(userId: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.isEmailVerified = true;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      currentUser.isEmailVerified = true;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
      notifySubscribers('auth_login', currentUser);
    }

    const profiles = this.getProfiles();
    const target = profiles.find(p => p.userId === userId);
    if (target) {
      target.isEmailVerified = true;
      target.isVerified = true; // Also awards verification badge
      target.updatedAt = new Date().toISOString();
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
      notifySubscribers('profile_updated', target);
    }

    return true;
  },

  // Admin Verification Toggle
  setDonorVerification(donorId: string, isVerified: boolean): DonorProfile | null {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Admin privileges required to verify donors.');
    }

    const profiles = this.getProfiles();
    const target = profiles.find(p => p.id === donorId);
    if (!target) return null;

    target.isVerified = isVerified;
    target.updatedAt = new Date().toISOString();

    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    notifySubscribers('profile_updated', target);
    return target;
  },

  deleteDonor(donorId: string): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Admin privileges required to delete donors.');
    }

    let profiles = this.getProfiles();
    const initialLen = profiles.length;
    profiles = profiles.filter(p => p.id !== donorId);

    if (profiles.length !== initialLen) {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
      notifySubscribers('donor_deleted', { donorId });
      return true;
    }
    return false;
  },

  // Emergency Blood Requests Operations
  getBloodRequests(): BloodRequest[] {
    this.init();
    try {
      const data = localStorage.getItem(REQUESTS_KEY);
      return data ? JSON.parse(data) : SEED_REQUESTS;
    } catch {
      return SEED_REQUESTS;
    }
  },

  createBloodRequest(requestData: Omit<BloodRequest, 'id' | 'createdAt' | 'status'>): BloodRequest {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('You must be logged in to submit an emergency blood request.');
    }

    const newRequest: BloodRequest = {
      ...requestData,
      id: 'req-' + Date.now(),
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    const requests = this.getBloodRequests();
    requests.unshift(newRequest);

    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
    notifySubscribers('request_created', newRequest);
    return newRequest;
  },

  updateRequestStatus(requestId: string, status: 'open' | 'fulfilled'): BloodRequest | null {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('You must be logged in to modify a blood request.');
    }

    const requests = this.getBloodRequests();
    const target = requests.find(r => r.id === requestId);
    if (!target) return null;

    // Only original requester or admin can close/fulfill
    if (target.requesterId !== currentUser.id && currentUser.role !== 'admin') {
      throw new Error('Only the author or an administrator can update this blood request status.');
    }

    target.status = status;
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
    notifySubscribers('request_updated', target);
    return target;
  },

  deleteBloodRequest(requestId: string): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Must be logged in.');
    }

    let requests = this.getBloodRequests();
    const target = requests.find(r => r.id === requestId);
    if (!target) return false;

    if (target.requesterId !== currentUser.id && currentUser.role !== 'admin') {
      throw new Error('Unauthorized.');
    }

    requests = requests.filter(r => r.id !== requestId);
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
    notifySubscribers('request_deleted', { requestId });
    return true;
  }
};
