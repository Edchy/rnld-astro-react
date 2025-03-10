
import { useEffect, useState } from 'react';
import { LoginDialog } from './LoginDialog';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from 'sonner';
import { SquareUserRound} from "lucide-react"


export default function UserMenu() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");



  const handleLoginSuccess = (userData: any) => {
  setIsLoggedIn(true);
  setUsername(userData.username);
  localStorage.setItem('userData', JSON.stringify(userData));

 
};
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userData');
  setIsLoggedIn(false);
  setUsername("");
  toast.success("Logged out successfully");
};
  
  useEffect(() => {
    // Check if user is logged in on component mount
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    if (token && userData) {
      setIsLoggedIn(true);
      setUsername(JSON.parse(userData).username);
    }
  }, []);
  
  if (!isLoggedIn) {
    return <LoginDialog onLoginSuccess={handleLoginSuccess} />;
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Avatar>
            <AvatarImage src="" alt={username} />
            <AvatarFallback>
              {/* <SquareUserRound className='h-12 w-12'/> */}
              {username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}