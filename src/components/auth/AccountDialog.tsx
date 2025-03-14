import { act, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { login as loginApi, register as registerApi } from '@/lib/services/userService';
import { AuthTabs } from './AuthTabs';
import type { LoginFormValues, RegisterFormValues } from './schemas';

export function AccountDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginDefaultValues, setLoginDefaultValues] = useState<Partial<LoginFormValues>>({});

  // Use auth context
  const { login } = useAuth();

  // Handle login form submission
  const handleLoginSubmit = async (values: LoginFormValues) => {
    setError(null);
    setSuccess(null);

    try {
      setIsLoading(true);
      const data = await loginApi(values);

      setSuccess(data.message);
      toast.success('Welcome!', {
        description: data.message || "You've been logged in successfully.",
      });

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // const userWithToken = { ...data.user, token: data.token };
      // login(userWithToken);

      login(data.user);
      console.log('Logged in user:', data.user);
      console.log('data:', data);

      setTimeout(() => {
        setIsOpen(false);
      }, 1500);
    } catch (error) {
      console.error('Login error:', error);
      // const errorMessage = error instanceof Error ? error.message  : 'Failed to login';
      const errorMessage = 'Network error: Failed to login';
      setError(errorMessage);
      toast.error('Login Failed', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle register form submission
  const handleRegisterSubmit = async (values: RegisterFormValues) => {
    setError(null);
    setSuccess(null);

    try {
      setIsLoading(true);

      // Remove the confirmPassword field before sending to API
      const { confirmPassword, ...registerData } = values;

      const data = await registerApi(registerData);

      setSuccess(data.message || 'Registration successful');
      toast.success('Account Created!', {
        description: 'Your account has been created successfully. You can now log in.',
      });

      // Save username for login form
      setLoginDefaultValues({ username: values.username });
      setActiveTab('login');
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to register';
      setError(errorMessage);
      toast.error('Registration Failed', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset state when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setError(null);
      setSuccess(null);
      setLoginDefaultValues({});
    }
    setIsOpen(open);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'login' | 'register');
    setError(null);
    setSuccess(null);
  };

  const dialogTitle = activeTab === 'login' ? 'Welcome Back' : 'Join Us';
  const dialogDescription =
    activeTab === 'login'
      ? 'Please enter your credentials to access your account.'
      : 'Fill in the details to create a new account.';

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Account</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert variant="default" className="mb-4 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <AuthTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onLoginSubmit={handleLoginSubmit}
          onRegisterSubmit={handleRegisterSubmit}
          isLoading={isLoading}
          loginDefaultValues={loginDefaultValues}
        />
      </DialogContent>
    </Dialog>
  );
}
