
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Student } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const studentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  avatarUrl: z.string().optional().or(z.literal('')),
  major: z.string().min(1, 'Major is required'),
  expectedGraduationYear: z.coerce.number().min(new Date().getFullYear()).max(new Date().getFullYear() + 10),
  interests: z.string().optional(),
});

type StudentFormProps = {
  student?: Student | null;
  onSave: (data: Student) => void;
  onCancel: () => void;
};

export function StudentForm({ student, onSave, onCancel }: StudentFormProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(student?.avatarUrl || null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: student?.name || '',
      email: student?.email || '',
      avatarUrl: student?.avatarUrl || '',
      major: student?.major || '',
      expectedGraduationYear: student?.expectedGraduationYear || new Date().getFullYear() + 4,
      interests: student?.interests?.join(', ') || '',
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setAvatarPreview(dataUrl);
        setValue('avatarUrl', dataUrl, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: z.infer<typeof studentSchema>) => {
    onSave({
      ...student!,
      id: student?.id || `student-${Date.now()}`,
      ...data,
      interests: data.interests?.split(',').map((s) => s.trim()).filter(Boolean) || [],
      avatarUrl: avatarPreview || data.avatarUrl || `https://api.dicebear.com/7.x/initials/json?seed=${data.name}`,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
      </div>

       <div>
        <Label>Profile Photo</Label>
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarPreview || undefined} alt="Profile preview" />
            <AvatarFallback>{student?.name?.charAt(0) || 'S'}</AvatarFallback>
          </Avatar>
          <Input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          <Button type="button" variant="outline" onClick={() => document.getElementById('avatar-upload')?.click()}>
            <Upload className="mr-2 h-4 w-4" /> Upload Image
          </Button>
        </div>
        {errors.avatarUrl && <p className="text-sm text-destructive">{errors.avatarUrl.message}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <Label htmlFor="major">Major</Label>
            <Input id="major" {...register('major')} />
            {errors.major && <p className="text-sm text-destructive">{errors.major.message}</p>}
        </div>
        <div>
            <Label htmlFor="expectedGraduationYear">Expected Graduation Year</Label>
            <Input id="expectedGraduationYear" type="number" {...register('expectedGraduationYear')} />
            {errors.expectedGraduationYear && <p className="text-sm text-destructive">{errors.expectedGraduationYear.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="interests">Interests (comma-separated)</Label>
        <Textarea id="interests" {...register('interests')} placeholder="e.g., AI, Web Development, Marketing" rows={3} />
        {errors.interests && <p className="text-sm text-destructive">{errors.interests.message}</p>}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
