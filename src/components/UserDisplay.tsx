import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Define a type for the workout data
interface Workout {
  _id: string;
  name: string;
  exercises: any[];
  // Add any other fields your workout has
}

export function UserDisplay() {
  const { user, isLoggedIn } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch workouts when the component mounts or user changes
  useEffect(() => {
    const fetchWorkouts = async () => {
      // Only fetch if user is logged in
      if (!isLoggedIn || !user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Make the request to your API endpoint
        const response = await fetch(`http://localhost:3000/users/${user.username}/workouts`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        
        // Check if request was successful
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch workouts');
        }
        
        // Parse and store the workout data
        const workoutData = await response.json();
        console.log(workoutData)
        setWorkouts(workoutData);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch workouts');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWorkouts();
  }, [user, isLoggedIn]);
  
  // If not logged in, show nothing or a message
  if (!isLoggedIn || !user) {
    return <p>Please log in to see your workouts</p>;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          Hello, <span className="font-bold">{user.username}</span>!
        </CardTitle>
        <CardDescription>Welcome to Arnold. Here are your workouts:</CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading && <p className="text-muted-foreground">Loading your workouts...</p>}
        
        {error && (
          <p className="text-red-500">
            Error: {error}
          </p>
        )}
        
        {!isLoading && !error && workouts.length === 0 && (
          <p className="text-muted-foreground">You don't have any workouts yet.</p>
        )}
        
        {!isLoading && !error && workouts.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            {workouts.map((workout) => (
              <AccordionItem value={workout._id} key={workout._id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <span className="font-medium">{workout.name}</span>
                    <Badge variant="outline" className="ml-2">
                      {workout.exercises?.length || 0} exercises
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {workout.exercises && workout.exercises.length > 0 ? (
                    <div className="space-y-3 pt-2">
                      {workout.exercises.map((exercise, index) => (
                        <div key={exercise._id || index} className="bg-muted/50 p-3 rounded-md">
                          <h4 className="font-medium text-sm">{exercise.name}</h4>
                          <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-muted-foreground">
                            <div className="flex flex-col">
                              <span className="font-semibold">Sets</span>
                              <span>{exercise.sets}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold">Reps</span>
                              <span>{exercise.reps}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold">Weight</span>
                              <span>{exercise.weight} kg</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No exercises in this workout.</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}