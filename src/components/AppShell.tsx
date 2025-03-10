import { AuthProvider } from '@/context/AuthContext';
import { ModeToggle } from './ModeToggle';
import UserMenu from './UserMenu';
import { Toaster } from './ui/sonner';
import { UserDisplay } from "@/components/UserDisplay";


export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="container mx-auto">
        <header className="muted-foreground py-4 flex justify-between items-center border-b-2">
          <h1 className="text-2xl">
            <a href="/">Arnold</a>
          </h1>
          <nav className="flex items-center gap-3">
            <ModeToggle />
            <UserMenu />
          </nav>
        </header>
        <UserDisplay />
        <main>
          {children}
        </main>
      </div>
      <Toaster richColors />
    </AuthProvider>
  );
}