import { useAuth } from '@/context/AuthContext';

export function UserDisplay() {
  const { user, isLoggedIn } = useAuth();
  
  if (!isLoggedIn || !user) {
    return <p>nothing</p>
  }
  
   return (
    <p className="text-lg">
      Hello, <span className="font-bold">{user.username}</span>! Welcome to Arnold.
    </p>
  );
}