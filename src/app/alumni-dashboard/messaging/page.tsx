
// src/app/alumni-dashboard/messaging/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Send, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { alumniData as initialAlumniData } from '@/lib/data';
import { studentData as initialStudentData } from '@/lib/data';
import type { Alumni, Message, Student } from '@/lib/types';
import { cn } from '@/lib/utils';

type ConversationPartner = Alumni | Student;

const ALUMNI_STORAGE_KEY = 'alumni-data';
const STUDENT_STORAGE_KEY = 'student-data';
const MESSAGES_STORAGE_KEY = 'messages-data';
const LOGGED_IN_USER_ID_KEY = 'alumni-user-id';

export default function MessagingPage() {
  const [currentUser, setCurrentUser] = useState<Alumni | null>(null);
  const [searchableUsers, setSearchableUsers] = useState<ConversationPartner[]>([]);
  const [conversations, setConversations] = useState<ConversationPartner[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<ConversationPartner | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load initial data from localStorage
  useEffect(() => {
    try {
      const storedAlumni = localStorage.getItem(ALUMNI_STORAGE_KEY);
      const allAlumni = storedAlumni ? JSON.parse(storedAlumni) : initialAlumniData;
      
      const storedStudents = localStorage.getItem(STUDENT_STORAGE_KEY);
      const allStudents = storedStudents ? JSON.parse(storedStudents) : initialStudentData;

      const loggedInId = localStorage.getItem(LOGGED_IN_USER_ID_KEY) || initialAlumniData[0].id;
      const user = allAlumni.find((a: Alumni) => a.id === loggedInId) || null;
      setCurrentUser(user);

      // Combine other alumni and students into one list for searching
      const allOtherUsers: ConversationPartner[] = [
          ...allAlumni.filter((a: Alumni) => a.id !== loggedInId),
          ...allStudents 
      ];
      setSearchableUsers(allOtherUsers);

      // Simulate existing conversations for the alumnus
      const storedMessages = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '{}');
      const convoPartnerIds = new Set<string>();
      if (loggedInId) {
        Object.keys(storedMessages).forEach(convoId => {
            const [id1, id2] = convoId.split('--');
            if (id1 === loggedInId) convoPartnerIds.add(id2);
            if (id2 === loggedInId) convoPartnerIds.add(id1);
        });
      }
      
      const convoPartners = allOtherUsers.filter((u: ConversationPartner) => convoPartnerIds.has(u.id));
      setConversations(convoPartners);

      // Handle direct message from mentor/directory page
      const recipientId = searchParams.get('recipientId');
      if (recipientId) {
        const recipient = allOtherUsers.find((u: ConversationPartner) => u.id === recipientId);
        if (recipient) {
          handleSelectConvo(recipient, true);
        }
      } else if (convoPartners.length > 0) {
        handleSelectConvo(convoPartners[0]);
      }

    } catch (error) {
      console.error("Failed to load messaging data", error);
    }
  }, [searchParams]);

  const getConversationId = (id1: string, id2: string) => {
    return [id1, id2].sort().join('--');
  };

  const handleSelectConvo = (user: ConversationPartner, isNewFromSearch = false) => {
    setSelectedConvo(user);
    if (!currentUser) return;
    
    if (isNewFromSearch && !conversations.find(c => c.id === user.id)) {
        setConversations(prev => [user, ...prev]);
    }

    const convoId = getConversationId(currentUser.id, user.id);
    const allMessages = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '{}');
    setMessages(allMessages[convoId] || []);
    setSearchTerm('');
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !selectedConvo) return;

    const convoId = getConversationId(currentUser.id, selectedConvo.id);
    const allMessages = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '{}');
    const currentConvoMessages = allMessages[convoId] || [];

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      recipientId: selectedConvo.id,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...currentConvoMessages, message];
    allMessages[convoId] = updatedMessages;
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(allMessages));
    setMessages(updatedMessages);
    setNewMessage('');

    if (!conversations.find(c => c.id === selectedConvo.id)) {
        setConversations(prev => [selectedConvo, ...prev]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const searchResults = searchTerm
    ? searchableUsers.filter(
        (u) => u.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const listToShow = searchTerm ? searchResults : conversations;

  const getUserSubtitle = (user: ConversationPartner) => {
      if ('currentRole' in user) return user.currentRole; // Alumni
      if ('major' in user) return user.major; // Student
      return '';
  }

  return (
    <div className="h-[calc(100vh-100px)]">
      <Card className="h-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        <div className={cn("flex flex-col border-r", selectedConvo ? 'hidden md:flex' : 'flex')}>
          <div className="p-4 border-b">
            <h2 className="text-xl font-headline font-bold">Messages</h2>
            <div className="relative mt-2">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {listToShow.map((user) => (
              <div
                key={user.id}
                onClick={() => handleSelectConvo(user, !!searchTerm)}
                className={cn(
                  'flex items-center gap-3 p-3 cursor-pointer hover:bg-accent',
                  selectedConvo?.id === user.id && 'bg-accent'
                )}
              >
                <Avatar>
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{getUserSubtitle(user)}</p>
                </div>
              </div>
            ))}
             {searchTerm && searchResults.length === 0 && (
                <p className="p-4 text-center text-sm text-muted-foreground">No users found.</p>
            )}
            {!searchTerm && conversations.length === 0 && (
                <p className="p-4 text-center text-sm text-muted-foreground">No conversations. Search for a user to start chatting.</p>
            )}
          </div>
        </div>
        <div className={cn("md:col-span-2 lg:col-span-3 flex flex-col", selectedConvo ? 'flex' : 'hidden md:flex')}>
          {selectedConvo && currentUser ? (
            <>
              <CardHeader className="flex-row items-center gap-3 space-y-0 p-4 border-b">
                 <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedConvo(null)}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <Avatar>
                  <AvatarImage src={selectedConvo.avatarUrl} alt={selectedConvo.name} />
                  <AvatarFallback>{selectedConvo.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedConvo.name}</h3>
                  <p className="text-sm text-muted-foreground">{getUserSubtitle(selectedConvo)}</p>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex items-end gap-2 max-w-xs',
                      msg.senderId === currentUser.id ? 'ml-auto flex-row-reverse' : 'mr-auto'
                    )}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.senderId === currentUser.id ? currentUser.avatarUrl : selectedConvo.avatarUrl} />
                       <AvatarFallback>
                        {msg.senderId === currentUser.id ? currentUser.name.charAt(0) : selectedConvo.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <p
                      className={cn(
                        'rounded-lg px-3 py-2 text-sm',
                        msg.senderId === currentUser.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      {msg.text}
                    </p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </CardContent>
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    autoComplete="off"
                  />
                  <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
              <p>Select a conversation or search for a user to start messaging</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

    