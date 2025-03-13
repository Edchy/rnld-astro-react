import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { getUserWorkouts, deleteWorkout } from '@/lib/services/workoutService';
import { WorkoutFormDialog } from './WorkoutFormDialog';

import type { Workout, Exercise } from '@/lib/services/workoutService';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrashIcon } from 'lucide-react';
import { Button } from './ui/button';

export function DisplayUserWorkouts() {
  const { user, isLoggedIn } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isNewWorkoutDialogOpen, setIsNewWorkoutDialogOpen] = useState(false);

  const { logout } = useAuth();
  const { weightUnit } = useAuth();

  // Fetch workouts when the component mounts or user changes
  const fetchWorkouts = async () => {
    if (!isLoggedIn || !user) return;

    setIsLoading(true);
    setError(null);

    try {
      const workoutData = await getUserWorkouts(user.username);
      console.log('Workout data:', workoutData);
      setWorkouts(workoutData);
      // localStorage.setItem('workouts', JSON.stringify(workoutData));
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch workouts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [user, isLoggedIn]);

  // Handle opening the workout form
  const handleNewWorkoutClick = () => {
    setIsNewWorkoutDialogOpen(true);
  };

  // Handle workout deletion
  const handleDeleteWorkout = async (workoutId: string, workoutName: string) => {
    setIsDeleting(true);
    try {
      // call to backend
      await deleteWorkout(workoutId);

      // Update local state after successful deletion
      setWorkouts((prevWorkouts) => prevWorkouts.filter((w) => w._id !== workoutId));

      toast.success(`Workout deleted`, {
        description: `"${workoutName}" was successfully removed.`,
        action: {
          label: 'Undo',
          onClick: () => alert('You cant! 😈'),
        },
      });
    } catch (error) {
      console.log((error as Error).message);

      if (
        (error as Error).message.includes('Unauthorized') ||
        (error as Error).message.includes('403')
      ) {
        console.log('Unauthorized logging out...');
        logout(); // useAuth
      }
      console.error('Error deleting workout:', error);
      toast.error(`Failed to delete workout`, {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // If not logged in, show nothing or a message
  if (!isLoggedIn || !user) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        {/* <Button>Register</Button> */}
        <p>hey...</p>
      </div>
    );
  }

  /// kanske....
  // if(error) {
  //   logout();
  // }

  return (
    <>
      <div className="text-l mt-10">
        Hello{' '}
        <span className="font-bold text-pretty">
          {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
        </span>
        , you absolute beast! You look fucking good today!
      </div>
      <div className="flex justify-between items-center py-2 mt-10">
        <p className="sm:text-sm text-xs">
          {workouts.length === 0
            ? 'Add some workouts and start tracking 💪🏋️'
            : 'Here are your workouts:'}
        </p>
        <Button variant={'outline'} onClick={handleNewWorkoutClick}>
          Add workout
        </Button>
      </div>
      <Card>
        {/* <CardHeader>
        <CardTitle>Your Workouts</CardTitle>
        <CardDescription>Track your progress and stay motivated!</CardDescription>  
      </CardHeader> */}
        <CardContent className="px-2 md:px-6">
          {isLoading && <p className="text-muted-foreground ">Loading your workouts...</p>}

          {error && <p className="text-red-500">Error: {error}</p>}

          {!isLoading && !error && workouts.length === 0 && (
            <Button className="mt-4">Create a new workout</Button>
          )}

          {!isLoading && !error && workouts.length > 0 && (
            <Accordion type="single" collapsible className="w-full">
              {workouts.map((workout) => (
                <AccordionItem value={workout._id} key={workout._id}>
                  <div className="flex items-center justify-between">
                    <AccordionTrigger className="hover:no-underline cursor-pointer sm:w-96">
                      <div className="flex items-center sm:w-56">
                        <span className="font-medium sm:w-[100px]">{workout.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {workout.exercises?.length || 0}{' '}
                          {workout.exercises?.length === 1 ? 'exercise' : 'exercises'}
                        </Badge>
                      </div>
                    </AccordionTrigger>

                    {/* Delete workout button with confirmation */}
                    <Button variant={'link'}>Go</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          disabled={isDeleting}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Workout</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{workout.name}"? This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteWorkout(workout._id, workout.name)}
                            className="bg-destructive text-white hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <AccordionContent>
                    {workout.exercises && workout.exercises.length > 0 ? (
                      <div className="space-y-3 pt-2">
                        {workout.exercises.map((exercise, index) => (
                          <div key={index || index} className="bg-muted/50 p-3 rounded-md">
                            <h4 className="text-sm uppercase font-bold">{exercise.name}</h4>
                            <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-muted-foreground">
                              <div className="flex flex-col">
                                <span className="font-bold uppercase text-xs">Sets</span>
                                <span>{exercise.sets}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold uppercase text-xs">Reps</span>
                                <span className="">{exercise.reps}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold uppercase text-xs">Weight</span>
                                <span className="">
                                  {exercise.weight} {weightUnit}
                                </span>
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
      <WorkoutFormDialog
        open={isNewWorkoutDialogOpen}
        onOpenChange={setIsNewWorkoutDialogOpen}
        onWorkoutCreated={fetchWorkouts} // Refresh workouts after creation
      />
    </>
  );
}
