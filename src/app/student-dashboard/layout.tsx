'use client';
import { DashboardLayout } from '@/components/app/dashboard-layout';
import { User, Calendar, Handshake, Users, MessageSquare } from 'lucide-react';

const navItems = [
  { href: '/student-dashboard', label: 'My Profile', icon: <User /> },
  { href: '/student-dashboard/alumni-directory', label: 'Alumni Directory', icon: <Users /> },
  { href: '/student-dashboard/mentor-matching', label: 'Mentor Matching', icon: <Handshake /> },
  { href: '/student-dashboard/events', label: 'Events', icon: <Calendar /> },
  { href: '/student-dashboard/messaging', label: 'Messages', icon: <MessageSquare /> },
];

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout navItems={navItems} title="Student Portal" userRole="student">{children}</DashboardLayout>;
}
