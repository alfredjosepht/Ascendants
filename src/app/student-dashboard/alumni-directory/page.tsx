
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { alumniData as initialAlumniData } from '@/lib/data';
import type { Alumni } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Mail, Linkedin, MessageSquare } from 'lucide-react';

const ALUMNI_STORAGE_KEY = 'alumni-data';

export default function AlumniDirectoryPage() {
  const [alumniList, setAlumniList] = useState<Alumni[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    try {
      const storedAlumni = localStorage.getItem(ALUMNI_STORAGE_KEY);
      if (storedAlumni) {
        setAlumniList(JSON.parse(storedAlumni));
      } else {
        setAlumniList(initialAlumniData);
      }
    } catch (error) {
      console.error("Could not load alumni data from localStorage", error);
      setAlumniList(initialAlumniData);
    }
  }, []);

  const filteredAlumni = alumniList.filter(alumni => 
    alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumni.currentRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumni.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-headline font-bold">Alumni Directory</h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search by name, role, or skill..."
          className="pl-10 text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAlumni.map((alumni) => (
          <Card key={alumni.id}>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                 <Image
                    alt={alumni.name}
                    className="aspect-square rounded-full object-cover mb-4 border-2"
                    height="100"
                    src={alumni.avatarUrl}
                    width="100"
                    data-ai-hint="person portrait"
                  />
                  <h3 className="font-headline text-lg font-semibold">{alumni.name}</h3>
                  <p className="text-sm text-muted-foreground">{alumni.currentRole}</p>
                  <p className="text-xs text-muted-foreground">Class of {alumni.graduationYear}</p>
                  
                  <div className="flex gap-2 mt-3">
                     <Button variant="ghost" size="icon" asChild>
                        <a href={`mailto:${alumni.email}`}><Mail className="h-4 w-4" /></a>
                     </Button>
                     <Button variant="ghost" size="icon" asChild>
                        <a href={alumni.linkedinURL} target="_blank" rel="noopener noreferrer"><Linkedin className="h-4 w-4" /></a>
                     </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/student-dashboard/messaging?recipientId=${alumni.id}`}>
                          <MessageSquare className="h-4 w-4" />
                        </Link>
                      </Button>
                  </div>

                  <p className="text-sm text-muted-foreground mt-3 line-clamp-3 h-[60px]">
                    {alumni.shortBio}
                  </p>
              </div>
                <div className="mt-4 border-t pt-4">
                <h4 className="text-xs font-semibold mb-2 text-center uppercase text-muted-foreground">Top Skills</h4>
                <div className="flex flex-wrap gap-1 justify-center">
                    {alumni.skills.slice(0, 4).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                    </Badge>
                    ))}
                </div>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
