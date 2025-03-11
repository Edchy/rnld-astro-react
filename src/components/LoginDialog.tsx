import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { login as loginApi, register as registerApi } from '@/lib/services/userService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define form schema with validation
const USERNAME_MIN_LENGTH = 2;
const USERNAME_MAX_LENGTH = 15;
const PASSWORD_MIN_LENGTH = 6;

const loginFormSchema = z.object({
  username: z.string()
    .min(USERNAME_MIN_LENGTH, { message: `Username must be at least ${USERNAME_MIN_LENGTH} characters` })
    .max(USERNAME_MAX_LENGTH, { message: `Username cannot be more than ${USERNAME_MAX_LENGTH} characters` })
    .transform(val => val.toLowerCase()),
  password: z.string()
    .min(PASSWORD_MIN_LENGTH, { message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` })
});

const registerFormSchema = z.object({
  username: z.string()
    .min(USERNAME_MIN_LENGTH, { message: `Username must be at least ${USERNAME_MIN_LENGTH} characters` })
    .max(USERNAME_MAX_LENGTH, { message: `Username cannot be more than ${USERNAME_MAX_LENGTH} characters` })
    .transform(val => val.toLowerCase()),
  password: z.string()
    .min(PASSWORD_MIN_LENGTH, { message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` }),
  confirmPassword: z.string()
    .min(PASSWORD_MIN_LENGTH, { message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function LoginDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  
  // Use auth context
  const { login } = useAuth();

  // Initialize login form with validation
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Initialize register form with validation
  const registerForm = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle login form submission
  const onLoginSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    // Reset messages
    setError(null);
    setSuccess(null);
    
    try {
      setIsLoading(true);
      
      const data = await loginApi(values);

      // Success handling
      setSuccess(data.message); 
      toast.success("Welcome!", {
        description: data.message || "You've been logged in successfully.",
      });
      
      // Store the token if needed
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      // Use the login function from Auth context
      login(data.user);
      
      // Close the dialog after a brief delay to show success message
      setTimeout(() => {
        setIsOpen(false);
      }, 1500);
      
    } catch (error) {
      // Error handling - display the message from backend
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to login";
      setError(errorMessage);
      toast.error("Login Failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle register form submission
  const onRegisterSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    // Reset messages
    setError(null);
    setSuccess(null);
    
    try {
      setIsLoading(true);
      
      // Remove the confirmPassword field before sending to API
      const { confirmPassword, ...registerData } = values;
      
      const data = await registerApi(registerData);

      // Success handling
      setSuccess(data.message || "Registration successful"); 
      toast.success("Account Created!", {
        description: "Your account has been created successfully. You can now log in.",
      });
      
      // Switch to login tab after successful registration
      setActiveTab("login");
      loginForm.setValue("username", values.username);
      
    } catch (error) {
      // Error handling - display the message from backend
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to register";
      setError(errorMessage);
      toast.error("Registration Failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset forms when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      loginForm.reset();
      registerForm.reset();
      setError(null);
      setSuccess(null);
    }
    setIsOpen(open);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as "login" | "register");
    setError(null);
    setSuccess(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Account</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Account Access</DialogTitle>
          <DialogDescription>
            Login to your account or create a new one.
          </DialogDescription>
        </DialogHeader>

        {/* Display error message from backend */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Display success message from backend */}
        {success && (
          <Alert variant="default" className="mb-4 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
          <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange} 
          className="w-full"
          defaultValue="login" // Add a default value
          >
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
          
          {/* Login Form */}
          <TabsContent value="login">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 py-4">
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="your_username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          {/* Register Form */}
          <TabsContent value="register">
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4 py-4">
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="choose_username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Register"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}