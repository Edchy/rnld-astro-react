import { AuthProvider } from '@/context/AuthContext';
import { ModeToggle } from './ModeToggle';
import UserMenu from './UserMenu';
import { Toaster } from './ui/sonner';
import { DisplayUserWorkouts } from '@/components/DisplayUserWorkouts';

export function AppShell({
  children,
  showWorkouts,
}: {
  children: React.ReactNode;
  showWorkouts?: boolean;
}) {
  console.log(showWorkouts);
  return (
    <AuthProvider>
      <header className="muted-foreground py-4 flex justify-between items-center">
        <h1 className="text-2xl brand-text">
          <a href="#">ARNOLD</a>
        </h1>
        <nav className="flex items-center gap-3">
          <ModeToggle />
          <UserMenu />
        </nav>
      </header>
      {showWorkouts && <DisplayUserWorkouts />}

      {children}
      {/* <Toaster richColors /> */}
    </AuthProvider>
  );
}
