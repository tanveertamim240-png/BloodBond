export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

export type UrgencyLevel = 'immediate' | 'urgent' | 'standard';

export interface User {
  id: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  isEmailVerified?: boolean;
  createdAt: string;
}

export interface DonorProfile {
  id: string;
  userId: string;
  fullName: string;
  bloodGroup: BloodGroup;
  district: string;
  area: string;
  phone: string;
  facebookUrl: string;
  isAvailable: boolean;
  isVerified: boolean;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  lastDonationDate?: string;
  totalDonations?: number;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BloodRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  hospitalName: string;
  district: string;
  contactPhone: string;
  urgency: UrgencyLevel;
  notes?: string;
  status: 'open' | 'fulfilled';
  createdAt: string;
}

export const ALL_BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const BANGLADESH_DISTRICTS = [
  'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh',
  'Comilla', 'Gazipur', 'Narayanganj', 'Bogra', 'Jessore', 'Cox\'s Bazar', 'Feni', 'Kushtia',
  'Noakhali', 'Tangail', 'Pabna', 'Faridpur', 'Other'
];

export const BLOOD_COMPATIBILITY: Record<BloodGroup, { canGiveTo: BloodGroup[]; canReceiveFrom: BloodGroup[] }> = {
  'O-': {
    canGiveTo: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    canReceiveFrom: ['O-']
  },
  'O+': {
    canGiveTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O+', 'O-']
  },
  'A-': {
    canGiveTo: ['A+', 'A-', 'AB+', 'AB-'],
    canReceiveFrom: ['A-', 'O-']
  },
  'A+': {
    canGiveTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-']
  },
  'B-': {
    canGiveTo: ['B+', 'B-', 'AB+', 'AB-'],
    canReceiveFrom: ['B-', 'O-']
  },
  'B+': {
    canGiveTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-']
  },
  'AB-': {
    canGiveTo: ['AB+', 'AB-'],
    canReceiveFrom: ['AB-', 'A-', 'B-', 'O-']
  },
  'AB+': {
    canGiveTo: ['AB+'],
    canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
  }
};
