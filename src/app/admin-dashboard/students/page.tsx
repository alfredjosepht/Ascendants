
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { studentData as initialStudentData } from '@/lib/data';
import type { Student } from '@/lib/types';
import { StudentTableActions } from '@/components/app/student-table-actions';
import { StudentForm } from '@/components/app/student-form';
import { useToast } from '@/hooks/use-toast';

const STUDENT_STORAGE_KEY = 'student-data';

export default function StudentManagementPage() {
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedStudents = localStorage.getItem(STUDENT_STORAGE_KEY);
      if (storedStudents) {
        setStudentList(JSON.parse(storedStudents));
      } else {
        setStudentList(initialStudentData);
        localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(initialStudentData));
      }
    } catch (error) {
      console.error("Could not load student data from localStorage", error);
      setStudentList(initialStudentData);
    }
  }, []);

  const updateStudentList = (newList: Student[]) => {
    setStudentList(newList);
    try {
      localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(newList));
    } catch (error) {
       console.error("Could not save student data to localStorage", error);
    }
  };
  
  const handleDeleteStudent = (studentToDelete: Student) => {
    updateStudentList(studentList.filter(s => s.id !== studentToDelete.id));
    toast({ title: 'Student Deleted', description: `${studentToDelete.name} has been deleted.`, variant: 'destructive'});
  }

  const handleAddStudent = () => {
    setEditingStudent(null);
    setIsDialogOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsDialogOpen(true);
  };

  const handleSaveStudent = (savedStudent: Student) => {
    if (editingStudent) {
      updateStudentList(studentList.map((s) => (s.id === savedStudent.id ? savedStudent : s)));
      toast({ title: 'Student Updated', description: `${savedStudent.name}'s profile has been updated.` });
    } else {
      const newStudentWithId = { ...savedStudent, id: `student-${Date.now()}` };
      updateStudentList([newStudentWithId, ...studentList]);
      toast({ title: 'Student Added', description: `${savedStudent.name} has been added to the database.` });
    }
    setIsDialogOpen(false);
    setEditingStudent(null);
  };

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-headline font-bold">Student Management</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleAddStudent}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Student
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Student Database</CardTitle>
          <CardDescription>View, edit, and manage all student profiles.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Major</TableHead>
                <TableHead className="hidden md:table-cell">Grad Year</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentList.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt="Student avatar"
                      className="aspect-square rounded-full object-cover"
                      height="64"
                      src={student.avatarUrl}
                      width="64"
                      data-ai-hint="person portrait"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>{student.name}</div>
                    <div className="text-sm text-muted-foreground md:hidden">{student.expectedGraduationYear}</div>
                  </TableCell>
                  <TableCell>
                    <div className="line-clamp-2">{student.major}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{student.expectedGraduationYear}</TableCell>
                  <TableCell>
                    <StudentTableActions student={student} onEdit={handleEditStudent} onDelete={handleDeleteStudent} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingStudent ? 'Edit Student Profile' : 'Add New Student'}</DialogTitle>
            <DialogDescription>
              {editingStudent ? `Update the profile for ${editingStudent.name}.` : 'Fill in the details for the new student.'}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto p-1 pr-4">
            <StudentForm
                student={editingStudent}
                onSave={handleSaveStudent}
                onCancel={() => setIsDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
