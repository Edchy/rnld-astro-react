import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import type { LoginFormValues, RegisterFormValues } from './schemas';

interface AuthTabsProps {
  activeTab: 'login' | 'register';
  onTabChange: (value: string) => void;
  onLoginSubmit: (values: LoginFormValues) => Promise<void>;
  onRegisterSubmit: (values: RegisterFormValues) => Promise<void>;
  isLoading: boolean;
  loginDefaultValues?: Partial<LoginFormValues>;
}

export function AuthTabs({
  activeTab,
  onTabChange,
  onLoginSubmit,
  onRegisterSubmit,
  isLoading,
  loginDefaultValues,
}: AuthTabsProps) {
  return (
    <div className="min-h-[420px]">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full" defaultValue="login">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger
            value="login"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Login
          </TabsTrigger>
          <TabsTrigger
            value="register"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Register
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <LoginForm
            onSubmit={onLoginSubmit}
            isLoading={isLoading}
            defaultValues={loginDefaultValues}
          />
        </TabsContent>

        <TabsContent value="register">
          <RegisterForm onSubmit={onRegisterSubmit} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
