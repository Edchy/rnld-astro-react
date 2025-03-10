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
import { login as loginApi } from '@/lib/services/userService';


// Define form schema with validation
const USERNAME_MIN_LENGTH = 2;
const USERNAME_MAX_LENGTH = 15;
const PASSWORD_MIN_LENGTH = 6;

const formSchema = z.object({
  username: z.string()
    .min(USERNAME_MIN_LENGTH, { message: `Username must be at least ${USERNAME_MIN_LENGTH} characters` })
    .max(USERNAME_MAX_LENGTH, { message: `Username cannot be more than ${USERNAME_MAX_LENGTH} characters` })
    .transform(val => val.toLowerCase()),
  password: z.string()
    .min(PASSWORD_MIN_LENGTH, { message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` })
});

export function LoginDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);
  
  // Use auth context instead of props
  const { login } = useAuth();

  // Initialize form with validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Reset messages
    setLoginError(null);
    setLoginSuccess(null);
    
    try {
      setIsLoading(true);
      
      // const response = await fetch('http://localhost:3000/users/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(values),
      // });
      
      // const data = await response.json();
      // console.log("Login response:", data);
      
      // if (!response.ok) {
      //   throw new Error(data.message || 'Failed to login');
      // }

      const data = await loginApi(values);

      // Success handling
      setLoginSuccess(data.message); // "Login successful"
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
      setLoginError(errorMessage);
      toast.error("Login Failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setLoginError(null);
      setLoginSuccess(null);
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Account</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Enter your credentials to access your account.
          </DialogDescription>
        </DialogHeader>

        {/* Display error message from backend */}
        {loginError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{loginError}</AlertDescription>
          </Alert>
        )}
        
        {/* Display success message from backend */}
        {loginSuccess && (
          <Alert variant="default" className="mb-4 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>{loginSuccess}</AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
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
              control={form.control}
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
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}