/**
 * Load profile data for different customer types based on POD number
 */

export interface LoadProfileDataPoint {
  hour: string;
  solar: number;
  wind: number;
  battery: number;
  consumption: number;
}

// POD ending with 1: Family profile
const familyProfileData: LoadProfileDataPoint[] = [
  { hour: "0",  solar: 0.0, wind: 0.5, battery: 0.2, consumption: 0.6 },
  { hour: "1",  solar: 0.0, wind: 0.5, battery: 0.2, consumption: 0.5 },
  { hour: "2",  solar: 0.0, wind: 0.5, battery: 0.1, consumption: 0.5 },
  { hour: "3",  solar: 0.0, wind: 0.5, battery: 0.0, consumption: 0.4 },
  { hour: "4",  solar: 0.0, wind: 0.5, battery: 0.0, consumption: 0.4 },
  { hour: "5",  solar: 0.0, wind: 0.5, battery: 0.0, consumption: 0.5 },
  { hour: "6",  solar: 0.1, wind: 0.5, battery: 0.0, consumption: 0.8 },
  { hour: "7",  solar: 0.3, wind: 0.4, battery: 0.0, consumption: 0.9 },
  { hour: "8",  solar: 0.6, wind: 0.4, battery: 0.0, consumption: 0.9 },
  { hour: "9",  solar: 0.9, wind: 0.4, battery: 0.0, consumption: 0.8 },
  { hour: "10", solar: 1.2, wind: 0.4, battery: 0.0, consumption: 0.8 },
  { hour: "11", solar: 1.4, wind: 0.4, battery: 0.0, consumption: 0.8 },
  { hour: "12", solar: 1.5, wind: 0.4, battery: 0.0, consumption: 0.8 },
  { hour: "13", solar: 1.4, wind: 0.4, battery: 0.0, consumption: 0.8 },
  { hour: "14", solar: 1.2, wind: 0.4, battery: 0.0, consumption: 0.8 },
  { hour: "15", solar: 1.0, wind: 0.5, battery: 0.0, consumption: 0.9 },
  { hour: "16", solar: 0.7, wind: 0.5, battery: 0.1, consumption: 1.0 },
  { hour: "17", solar: 0.4, wind: 0.6, battery: 0.3, consumption: 1.3 },
  { hour: "18", solar: 0.2, wind: 0.6, battery: 0.4, consumption: 1.5 },
  { hour: "19", solar: 0.0, wind: 0.6, battery: 0.5, consumption: 1.4 },
  { hour: "20", solar: 0.0, wind: 0.6, battery: 0.4, consumption: 1.2 },
  { hour: "21", solar: 0.0, wind: 0.6, battery: 0.3, consumption: 1.0 },
  { hour: "22", solar: 0.0, wind: 0.6, battery: 0.2, consumption: 0.9 },
  { hour: "23", solar: 0.0, wind: 0.5, battery: 0.2, consumption: 0.7 },
];

// POD ending with 2: Single mom profile
const singleMomProfileData: LoadProfileDataPoint[] = [
  { hour: "0",  solar: 0.0, wind: 0.4, battery: 0.1, consumption: 0.3 },
  { hour: "1",  solar: 0.0, wind: 0.4, battery: 0.1, consumption: 0.3 },
  { hour: "2",  solar: 0.0, wind: 0.4, battery: 0.0, consumption: 0.3 },
  { hour: "3",  solar: 0.0, wind: 0.4, battery: 0.0, consumption: 0.3 },
  { hour: "4",  solar: 0.0, wind: 0.4, battery: 0.0, consumption: 0.3 },
  { hour: "5",  solar: 0.0, wind: 0.4, battery: 0.0, consumption: 0.4 },
  { hour: "6",  solar: 0.1, wind: 0.4, battery: 0.0, consumption: 0.7 },
  { hour: "7",  solar: 0.3, wind: 0.3, battery: 0.0, consumption: 0.9 },
  { hour: "8",  solar: 0.5, wind: 0.3, battery: 0.0, consumption: 0.8 },
  { hour: "9",  solar: 0.8, wind: 0.3, battery: 0.0, consumption: 0.7 },
  { hour: "10", solar: 1.0, wind: 0.3, battery: 0.0, consumption: 0.7 },
  { hour: "11", solar: 1.2, wind: 0.3, battery: 0.0, consumption: 0.6 },
  { hour: "12", solar: 1.3, wind: 0.3, battery: 0.0, consumption: 0.6 },
  { hour: "13", solar: 1.2, wind: 0.3, battery: 0.0, consumption: 0.6 },
  { hour: "14", solar: 1.0, wind: 0.3, battery: 0.0, consumption: 0.6 },
  { hour: "15", solar: 0.8, wind: 0.4, battery: 0.1, consumption: 0.7 },
  { hour: "16", solar: 0.5, wind: 0.4, battery: 0.2, consumption: 0.8 },
  { hour: "17", solar: 0.3, wind: 0.5, battery: 0.3, consumption: 1.0 },
  { hour: "18", solar: 0.1, wind: 0.5, battery: 0.4, consumption: 1.1 },
  { hour: "19", solar: 0.0, wind: 0.5, battery: 0.4, consumption: 1.0 },
  { hour: "20", solar: 0.0, wind: 0.5, battery: 0.3, consumption: 0.9 },
  { hour: "21", solar: 0.0, wind: 0.4, battery: 0.2, consumption: 0.8 },
  { hour: "22", solar: 0.0, wind: 0.4, battery: 0.1, consumption: 0.6 },
  { hour: "23", solar: 0.0, wind: 0.4, battery: 0.1, consumption: 0.4 },
];

// POD ending with 3: Garage/business profile
const garageProfileData: LoadProfileDataPoint[] = [
  { hour: "0",  solar: 0.0, wind: 0.5, battery: 0.0, consumption: 0.2 },
  { hour: "1",  solar: 0.0, wind: 0.5, battery: 0.0, consumption: 0.2 },
  { hour: "2",  solar: 0.0, wind: 0.5, battery: 0.0, consumption: 0.2 },
  { hour: "3",  solar: 0.0, wind: 0.5, battery: 0.0, consumption: 0.2 },
  { hour: "4",  solar: 0.0, wind: 0.5, battery: 0.0, consumption: 0.2 },
  { hour: "5",  solar: 0.0, wind: 0.5, battery: 0.0, consumption: 0.2 },
  { hour: "6",  solar: 0.2, wind: 0.5, battery: 0.0, consumption: 0.6 },
  { hour: "7",  solar: 0.5, wind: 0.5, battery: 0.0, consumption: 1.0 },
  { hour: "8",  solar: 0.9, wind: 0.5, battery: 0.0, consumption: 1.3 },
  { hour: "9",  solar: 1.3, wind: 0.5, battery: 0.0, consumption: 1.6 },
  { hour: "10", solar: 1.6, wind: 0.5, battery: 0.0, consumption: 1.7 },
  { hour: "11", solar: 1.8, wind: 0.5, battery: 0.0, consumption: 1.8 },
  { hour: "12", solar: 1.9, wind: 0.5, battery: 0.0, consumption: 1.8 },
  { hour: "13", solar: 1.8, wind: 0.5, battery: 0.0, consumption: 1.8 },
  { hour: "14", solar: 1.6, wind: 0.5, battery: 0.0, consumption: 1.7 },
  { hour: "15", solar: 1.2, wind: 0.5, battery: 0.0, consumption: 1.6 },
  { hour: "16", solar: 0.8, wind: 0.5, battery: 0.1, consumption: 1.4 },
  { hour: "17", solar: 0.4, wind: 0.5, battery: 0.2, consumption: 1.2 },
  { hour: "18", solar: 0.1, wind: 0.5, battery: 0.2, consumption: 0.8 },
  { hour: "19", solar: 0.0, wind: 0.5, battery: 0.1, consumption: 0.4 },
  { hour: "20", solar: 0.0, wind: 0.5, battery: 0.1, consumption: 0.3 },
  { hour: "21", solar: 0.0, wind: 0.5, battery: 0.0, consumption: 0.3 },
  { hour: "22", solar: 0.0, wind: 0.5, battery: 0.0, consumption: 0.2 },
  { hour: "23", solar: 0.0, wind: 0.5, battery: 0.0, consumption: 0.2 },
];

// POD ending with 4: Single man profile
const singleManProfileData: LoadProfileDataPoint[] = [
  { hour: "0",  solar: 0.0, wind: 0.6, battery: 0.3, consumption: 0.7 },
  { hour: "1",  solar: 0.0, wind: 0.6, battery: 0.3, consumption: 0.7 },
  { hour: "2",  solar: 0.0, wind: 0.6, battery: 0.2, consumption: 0.6 },
  { hour: "3",  solar: 0.0, wind: 0.6, battery: 0.1, consumption: 0.5 },
  { hour: "4",  solar: 0.0, wind: 0.5, battery: 0.1, consumption: 0.4 },
  { hour: "5",  solar: 0.0, wind: 0.5, battery: 0.0, consumption: 0.4 },
  { hour: "6",  solar: 0.1, wind: 0.5, battery: 0.0, consumption: 0.5 },
  { hour: "7",  solar: 0.3, wind: 0.4, battery: 0.0, consumption: 0.5 },
  { hour: "8",  solar: 0.6, wind: 0.4, battery: 0.0, consumption: 0.6 },
  { hour: "9",  solar: 0.9, wind: 0.4, battery: 0.0, consumption: 0.6 },
  { hour: "10", solar: 1.2, wind: 0.4, battery: 0.0, consumption: 0.6 },
  { hour: "11", solar: 1.4, wind: 0.4, battery: 0.0, consumption: 0.6 },
  { hour: "12", solar: 1.5, wind: 0.4, battery: 0.0, consumption: 0.6 },
  { hour: "13", solar: 1.4, wind: 0.4, battery: 0.0, consumption: 0.6 },
  { hour: "14", solar: 1.2, wind: 0.4, battery: 0.0, consumption: 0.6 },
  { hour: "15", solar: 0.9, wind: 0.5, battery: 0.1, consumption: 0.7 },
  { hour: "16", solar: 0.6, wind: 0.5, battery: 0.2, consumption: 0.8 },
  { hour: "17", solar: 0.3, wind: 0.6, battery: 0.3, consumption: 0.9 },
  { hour: "18", solar: 0.2, wind: 0.7, battery: 0.4, consumption: 1.0 },
  { hour: "19", solar: 0.0, wind: 0.7, battery: 0.5, consumption: 1.1 },
  { hour: "20", solar: 0.0, wind: 0.7, battery: 0.5, consumption: 1.1 },
  { hour: "21", solar: 0.0, wind: 0.6, battery: 0.4, consumption: 1.0 },
  { hour: "22", solar: 0.0, wind: 0.6, battery: 0.3, consumption: 0.8 },
  { hour: "23", solar: 0.0, wind: 0.6, battery: 0.2, consumption: 0.7 },
];

/**
 * Load profiles mapped by type
 */
export const loadProfiles = {
  family: familyProfileData,
  singleMom: singleMomProfileData,
  garage: garageProfileData,
  singleMan: singleManProfileData,
};

/**
 * Get load profile based on POD number's last digit
 */
export function getLoadProfileByPod(podNumber: string): LoadProfileDataPoint[] {
  if (!podNumber || podNumber.length === 0) {
    return familyProfileData; // Default fallback
  }

  const lastDigit = podNumber.charAt(podNumber.length - 1);
  
  switch (lastDigit) {
    case '1':
      return familyProfileData;
    case '2':
      return singleMomProfileData;
    case '3':
      return garageProfileData;
    case '4':
      return singleManProfileData;
    default:
      // For digits 5-9 and 0, cycle through profiles
      const digitNum = parseInt(lastDigit) || 0;
      const profileIndex = digitNum % 4;
      return [familyProfileData, singleMomProfileData, garageProfileData, singleManProfileData][profileIndex];
  }
}

/**
 * Get profile type name based on POD number
 */
export function getProfileTypeName(podNumber: string): string {
  if (!podNumber || podNumber.length === 0) {
    return "Family";
  }

  const lastDigit = podNumber.charAt(podNumber.length - 1);
  
  switch (lastDigit) {
    case '1':
      return "Family";
    case '2':
      return "Single Parent";
    case '3':
      return "Business";
    case '4':
      return "Single Person";
    default:
      const digitNum = parseInt(lastDigit) || 0;
      const profileIndex = digitNum % 4;
      return ["Family", "Single Parent", "Business", "Single Person"][profileIndex];
  }
}
