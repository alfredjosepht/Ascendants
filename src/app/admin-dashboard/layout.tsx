
'use client';
import { DashboardLayout } from '@/components/app/dashboard-layout';
import { LayoutDashboard, Users, Calendar, Handshake, MessageSquare, User, GraduationCap } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { href: '/admin-dashboard', label: 'Overview', icon: <LayoutDashboard /> },
  { href: '/admin-dashboard/alumni', label: 'Alumni Management', icon: <Users /> },
  { href: '/admin-dashboard/students', label: 'Student Management', icon: <GraduationCap /> },
  { href: '/admin-dashboard/events', label: 'Event Management', icon: <Calendar /> },
];

const studentNavItems = [
    { href: '/student-dashboard/alumni-directory', label: 'Alumni Directory', icon: <Users /> },
    { href: '/student-dashboard/mentor-matching', label: 'Mentor Matching', icon: <Handshake /> },
    { href: '/student-dashboard/events', label: 'Events View', icon: <Calendar /> },
    { href: '/student-dashboard/messaging', label: 'Student Messaging', icon: <MessageSquare /> },
    { href: '/student-dashboard', label: 'Student Profile', icon: <User /> },
]

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const allNavItems = [
      ...navItems,
      { isSeparator: true },
      ...studentNavItems,
  ];

  return (
    <DashboardLayout navItems={allNavItems} title="Admin Dashboard" userRole="admin">
        {children}
    </DashboardLayout>
  );
}
