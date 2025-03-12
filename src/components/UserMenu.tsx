import { useAuth } from '@/context/AuthContext';
// import { LoginDialog } from './LoginDialog';
import { AccountDialog } from '@/components/auth/AccountDialog';
import { SettingsDialog } from '@/components/SettingsDialog';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { useState } from 'react';

export default function UserMenu() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Get authentication state and functions from context
  const { user, isLoggedIn, logout } = useAuth();
  
  // Handle logout
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };
  
  // When not logged in, show login dialog component directly
  if (!isLoggedIn) {
    return <AccountDialog />;
  }
  
  // When logged in, show user avatar and dropdown
  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Avatar>
            <AvatarImage src="" alt={user?.username} />
            <AvatarFallback>
              {user?.username?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="font-medium">
          Signed in as {user?.username}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
         <DropdownMenuItem onClick={(e) => {
            e.preventDefault();
            setIsSettingsOpen(true);
          }}>
            Settings
          </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
        {/* Settings Dialog */}
      <SettingsDialog 
        open={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen} 
      />
    </>
  );
}