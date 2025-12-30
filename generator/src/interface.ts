export interface UserData {
  name: string;
  years: number;
  currentRole: string;
  topSkills: string;
  keyAchievement?: string;
  portfolioUrl?: string;
  location?: string;
}

export interface ProfileData {
  fullName: string;
  role: string;
  company: string;
  skills: string[];
  url: string;
}

export interface GenerateRequest {
  user: UserData;
  profile: ProfileData;
}
