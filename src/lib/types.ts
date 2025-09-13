
export type Alumni = {
  id: string;
  name: string;
  email: string;
  graduationYear: number;
  currentRole: string;
  skills: string[];
  linkedinURL: string;
  shortBio: string;
  avatarUrl: string;
  matchScore?: number;
};

export type Student = {
    id: string;
    name: string;
    email: string;
    major: string;
    expectedGraduationYear: number;
    interests: string[];
    avatarUrl: string;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
  rsvps: number;
};

export type Message = {
    id: string;
    senderId: string;
    recipientId: string;
    text: string;
    timestamp: string;
}
