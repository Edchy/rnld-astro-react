import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createWorkout } from '@/lib/services/workoutService';
import { toast } from 'sonner';
import { PlusCircle, X } from 'lucide-react';

// Define the form schema using Zod
const workoutFormSchema = z.object({
  name: z.string().min(1, 'Workout name is required'),
  exercises: z
    .array(
      z.object({
        name: z.string().min(1, 'Exercise name is required'),
        sets: z.coerce.number().min(1, 'Sets must be at least 1'),
        reps: z.coerce.number().min(1, 'Reps must be at least 1'),
        weight: z.coerce.number().min(0, 'Weight cannot be negative'),
      })
    )
    .min(1, 'Add at least one exercise'),
});

type WorkoutFormValues = z.infer<typeof workoutFormSchema>;

interface WorkoutFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWorkoutCreated: () => void;
}

export function WorkoutFormDialog({
  open,
  onOpenChange,
  onWorkoutCreated,
}: WorkoutFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { weightUnit } = useAuth();

  // Initialize the form with default values
  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      name: '',
      exercises: [{ name: '', sets: 3, reps: 10, weight: 0 }],
    },
  });

  // Add a new empty exercise to the form
  const addExercise = () => {
    const exercises = form.getValues('exercises');
    form.setValue('exercises', [...exercises, { name: '', sets: 3, reps: 10, weight: 0 }]);
  };

  // Remove an exercise from the form
  const removeExercise = (index: number) => {
    const exercises = form.getValues('exercises');
    if (exercises.length > 1) {
      form.setValue(
        'exercises',
        exercises.filter((_, i) => i !== index)
      );
    }
  };

  // Handle form submission
  const onSubmit = async (data: WorkoutFormValues) => {
    setIsSubmitting(true);
    try {
      await createWorkout(data);
      toast.success('Workout created successfully!', {
        description: `${data.name} has been added to your workouts.`,
      });
      form.reset(); // Reset form after successful submission
      onOpenChange(false); // Close the dialog
      onWorkoutCreated(); // Refresh the workout list
    } catch (error) {
      console.error('Error creating workout:', error);
      toast.error('Failed to create workout', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Workout</DialogTitle>
          <DialogDescription>
            Enter your workout details below. Add as many exercises as you need.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workout Name</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Upper Body Day" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-medium">Exercises</h3>
                <Button type="button" variant="outline" size="sm" onClick={addExercise}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Exercise
                </Button>
              </div>

              {form.watch('exercises').map((_, index) => (
                <div key={index} className="border rounded-md p-4 space-y-4 relative">
                  {form.watch('exercises').length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2"
                      onClick={() => removeExercise(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}

                  <FormField
                    control={form.control}
                    name={`exercises.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exercise Name</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., Bench Press" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`exercises.${index}.sets`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sets</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" placeholder="3" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`exercises.${index}.reps`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reps</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" placeholder="10" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`exercises.${index}.weight`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight ({weightUnit})</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.5" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Workout'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
