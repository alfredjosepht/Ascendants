
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Mail, GraduationCap, Sparkles, Pencil, BookOpen, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { studentData as initialStudentData } from '@/lib/data';
import type { Student } from '@/lib/types';
import { StudentForm } from '@/components/app/student-form';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const STUDENT_STORAGE_KEY = 'student-data';
const LOGGED_IN_USER_ID_KEY = 'student-user-id';

export default function StudentProfilePage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
        const storedStudents = localStorage.getItem(STUDENT_STORAGE_KEY);
        const loggedInId = localStorage.getItem(LOGGED_IN_USER_ID_KEY);
        
        let studentList: Student[] = initialStudentData;
        if (storedStudents) {
            studentList = JSON.parse(storedStudents);
        } else {
            localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(initialStudentData));
        }

        let currentUser: Student | undefined;
        if (loggedInId) {
            currentUser = studentList.find(s => s.id === loggedInId);
        }

        if (!currentUser) {
            currentUser = studentList.length > 0 ? studentList[0] : undefined;
            if(currentUser) {
              localStorage.setItem(LOGGED_IN_USER_ID_KEY, currentUser.id);
            }
        }
        
        setStudent(currentUser || null);

    } catch (error) {
        console.error("Failed to load profile data", error);
        setStudent(initialStudentData[0] || null);
    }
  }, []);

  const handleSaveProfile = (savedStudent: Student) => {
    setStudent(savedStudent);
    try {
        const storedStudents = localStorage.getItem(STUDENT_STORAGE_KEY);
        let studentList: Student[] = storedStudents ? JSON.parse(storedStudents) : [];
        const userIndex = studentList.findIndex(s => s.id === savedStudent.id);
        if (userIndex > -1) {
            studentList[userIndex] = savedStudent;
        } else {
            studentList.push(savedStudent);
        }
        localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(studentList));
    } catch (error) {
        console.error("Failed to save profile to master list", error);
    }

    setIsDialogOpen(false);
    toast({ title: 'Profile Updated', description: "Your profile has been successfully updated."});
  };

  if (!student) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-2">
                 <Skeleton className="h-9 w-48" />
                 <Skeleton className="h-10 w-32" />
            </div>
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <Skeleton className="h-[150px] w-[150px] rounded-full" />
                        <div className="flex-grow space-y-4">
                            <Skeleton className="h-9 w-1/2" />
                            <Skeleton className="h-6 w-1/3" />
                             <div className="mt-4 flex flex-wrap gap-4">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-5 w-40" />
                             </div>
                        </div>
                    </div>
                     <div className="mt-6 border-t pt-6 space-y-2">
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-2">
            <h2 className="text-3xl font-headline font-bold">My Student Profile</h2>
            <Button onClick={() => setIsDialogOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0">
                <Image
                  src={student.avatarUrl}
                  alt={student.name}
                  width={150}
                  height={150}
                  className="rounded-full border-4 border-primary/20 object-cover"
                  data-ai-hint="person portrait"
                />
              </div>
              <div className="flex-grow">
                <h1 className="text-3xl font-headline font-bold">{student.name}</h1>
                <p className="text-lg text-muted-foreground">{student.major}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>Graduating in {student.expectedGraduationYear}</span>
                  </div>
                  <a href={`mailto:${student.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Mail className="h-4 w-4" />
                    <span>{student.email}</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t pt-6">
              <h3 className="text-xl font-headline font-semibold mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {student.interests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="text-sm px-3 py-1">
                    {interest}
                  </Badge>
                ))}
                {student.interests.length === 0 && (
                    <p className="text-sm text-muted-foreground">No interests listed. Add some to get better mentor matches!</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="font-headline">Edit Your Profile</DialogTitle>
            <DialogDescription>Update your personal and academic information.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto p-1 pr-4">
            <StudentForm
              student={student}
              onSave={handleSaveProfile}
              onCancel={() => setIsDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
