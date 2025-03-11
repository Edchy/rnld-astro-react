import { AuthProvider } from '@/context/AuthContext';
import { ModeToggle } from './ModeToggle';
import UserMenu from './UserMenu';
import { Toaster } from './ui/sonner';
import { UserDisplay } from "@/components/UserDisplay";


export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
        <header className="muted-foreground p-4 flex justify-between items-center">
          <h1 className="text-2xl">
            <a href="/">RNLD</a>
          </h1>
          <nav className="flex items-center gap-3">
            <ModeToggle />
            <UserMenu />
          </nav>
        </header>
        <UserDisplay />
       
          {children}
      {/* <Toaster richColors /> */}
    </AuthProvider>
  );
}