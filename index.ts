// ─────────────────────────────────────────────────────────────────────────────
// types/index.ts — All TypeScript interfaces and shared constants
// ─────────────────────────────────────────────────────────────────────────────

/** Represents one additional teammate (non-captain) */
export interface Teammate {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | '';
  branch: string;
}

/** Full registration form state */
export interface RegistrationFormData {
  teamName: string;
  captainName: string;
  contactNumber: string;
  captainYear: string;
  captainBranch: string;
  captainGender: 'Male' | 'Female' | '';
  teammates: Teammate[];
}

/** A single organizing committee member */
export interface CommitteeMember {
  role: string;
  name: string;
  initial: string;
  color: string;
}

/** Branch options for the form */
export const BRANCHES: string[] = [
  'CSE', 'ECE', 'ME', 'CE', 'EE', 'IT', 'AIDS', 'AIML', 'MBA', 'MCA', 'Other',
];

/** Year options for the form */
export const YEARS: string[] = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

/** Min/max teammate count (excluding captain) */
export const MIN_EXTRA = 5; // total team min = 6 (including captain)
export const MAX_EXTRA = 7; // total team max = 8 (including captain)
