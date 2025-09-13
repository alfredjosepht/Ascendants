import type { Alumni, Event, Student } from './types';

export const alumniData: Alumni[] = [
  {
    id: '1',
    name: 'Dr. Evelyn Reed',
    email: 'evelyn.reed@example.com',
    graduationYear: 2012,
    currentRole: 'Senior AI Researcher at Google',
    skills: ['Machine Learning', 'Python', 'TensorFlow', 'NLP', 'Computer Vision'],
    linkedinURL: 'https://linkedin.com/in/evelynreed',
    shortBio: 'Pioneering AI researcher with a focus on natural language processing and its applications in healthcare. Passionate about mentoring the next generation of tech leaders.',
    avatarUrl: 'https://picsum.photos/seed/101/200/200',
  },
  {
    id: '2',
    name: 'Marcus Chen',
    email: 'marcus.chen@example.com',
    graduationYear: 2015,
    currentRole: 'Product Manager at Spotify',
    skills: ['Product Management', 'Agile Methodologies', 'User Experience', 'Data Analysis', 'JIRA'],
    linkedinURL: 'https://linkedin.com/in/marcuschen',
    shortBio: 'Data-driven Product Manager with a track record of launching successful features for millions of users. Interested in the intersection of music, tech, and user psychology.',
    avatarUrl: 'https://picsum.photos/seed/102/200/200',
  },
  {
    id: '3',
    name: 'Sophia Rodriguez',
    email: 'sophia.rodriguez@example.com',
    graduationYear: 2018,
    currentRole: 'UX/UI Designer at Airbnb',
    skills: ['UI Design', 'UX Research', 'Figma', 'Prototyping', 'Design Systems'],
    linkedinURL: 'https://linkedin.com/in/sophiarodriguez',
    shortBio: 'Creative UX/UI designer dedicated to crafting intuitive and beautiful user experiences. Believes in human-centered design to solve complex problems.',
    avatarUrl: 'https://picsum.photos/seed/103/200/200',
  },
  {
    id: '4',
    name: 'Ben Carter',
    email: 'ben.carter@example.com',
    graduationYear: 2010,
    currentRole: 'Founder & CEO at EcoSolutions',
    skills: ['Entrepreneurship', 'Venture Capital', 'Sustainability', 'Business Strategy', 'Public Speaking'],
    linkedinURL: 'https://linkedin.com/in/bencarter',
    shortBio: 'Serial entrepreneur focused on building sustainable businesses that make a positive impact on the planet. Actively investing in green technology startups.',
    avatarUrl: 'https://picsum.photos/seed/104/200/200',
  },
  {
    id: '5',
    name: 'Aisha Khan',
    email: 'aisha.khan@example.com',
    graduationYear: 2020,
    currentRole: 'Software Engineer at Microsoft',
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Azure'],
    linkedinURL: 'https://linkedin.com/in/aishakhan',
    shortBio: 'Full-stack developer working on cloud-native applications. Eager to share knowledge about breaking into the tech industry and modern web development practices.',
    avatarUrl: 'https://picsum.photos/seed/105/200/200',
  },
];

export const studentData: Student[] = [
    {
        id: 'student-1',
        name: 'Alex Johnson',
        email: 'alex.j@university.edu',
        major: 'Computer Science',
        expectedGraduationYear: 2025,
        interests: ['Artificial Intelligence', 'Web Development', 'Startups'],
        avatarUrl: 'https://picsum.photos/seed/401/200/200'
    },
    {
        id: 'student-2',
        name: 'Brenda Smith',
        email: 'brenda.s@university.edu',
        major: 'Business Administration',
        expectedGraduationYear: 2026,
        interests: ['Marketing', 'Finance', 'Entrepreneurship'],
        avatarUrl: 'https://picsum.photos/seed/402/200/200'
    }
];

export const eventData: Event[] = [
  {
    id: '1',
    title: 'Annual Alumni Networking Night',
    date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15).toISOString(),
    location: 'University Grand Hall',
    description: 'Our biggest event of the year! Reconnect with old friends, make new connections, and hear from our keynote speaker on the future of innovation. Drinks and appetizers will be served.',
    imageUrl: 'https://picsum.photos/seed/201/800/400',
    rsvps: 128,
  },
  {
    id: '2',
    title: 'Tech Talk: AI in Modern Business',
    date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 28).toISOString(),
    location: 'Virtual / Zoom',
    description: 'Join a panel of industry-leading alumni as they discuss how Artificial Intelligence is transforming their fields. A Q&A session will follow the panel discussion.',
    imageUrl: 'https://picsum.photos/seed/202/800/400',
    rsvps: 250,
  },
  {
    id: '3',
    title: 'Founder\'s Pitch & Mentorship Mixer',
    date: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 10).toISOString(),
    location: 'Innovation Hub, Downtown Campus',
    description: 'Aspiring entrepreneurs are invited to pitch their startup ideas to a panel of alumni investors and VCs. A mentorship mixer will follow, connecting students with experienced founders.',
    imageUrl: 'https://picsum.photos/seed/203/800/400',
    rsvps: 75,
  },
];
