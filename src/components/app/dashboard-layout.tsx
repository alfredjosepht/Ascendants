
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Link as LinkIcon, Menu } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const LOGGED_IN_ALUMNI_KEY = 'alumni-user-id';
const LOGGED_IN_STUDENT_KEY = 'student-user-id';

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
};

type NavItemWithSeparator = NavItem | { isSeparator: true };

type DashboardLayoutProps = {
  children: React.ReactNode;
  navItems: NavItemWithSeparator[];
  title: string;
  userRole: 'alumni' | 'admin' | 'student';
};

export function DashboardLayout({ children, navItems, title, userRole }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, you would call an authentication service to log out.
    // For this demo, we'll clear the simulated logged-in user from localStorage.
    try {
        if (userRole === 'alumni') {
            localStorage.removeItem(LOGGED_IN_ALUMNI_KEY);
        } else if (userRole === 'student') {
            localStorage.removeItem(LOGGED_IN_STUDENT_KEY);
        }
    } catch (error) {
        console.error("Could not log out:", error);
    }
    router.push('/');
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <LinkIcon className="text-primary-foreground h-6 w-6" />
            </div>
            <h1 className="text-2xl font-headline font-bold text-primary group-data-[collapsible=icon]:hidden">
              AlumniLink
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item, index) => {
              if ('isSeparator' in item) {
                return <SidebarSeparator key={`sep-${index}`} className="my-2" />;
              }
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith(item.href) && (item.href !== '/student-dashboard' && item.href !== '/alumni-dashboard' || pathname === item.href)}
                      tooltip={item.label}
                  >
                      <Link href={item.href}>
                          {item.icon}
                          <span>{item.label}</span>
                      </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </SidebarTrigger>
          <div className="w-full flex-1">
            <h1 className="text-lg font-headline font-semibold">{title}</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Log Out
          </Button>
        </header>
        <main className="flex-1 p-4 sm:p-6 bg-background/80">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
