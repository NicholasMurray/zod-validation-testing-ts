import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Zod schema with detailed validation (mimics signOffDatesSchemaDetailed)
const signOffDatesSchema = z.object({
  technicalSignOffDate: z.string().min(1, "Technical sign-off date is required"),
  regulatorySignOffDate: z.string().min(1, "Regulatory sign-off date is required"),
  executiveSignOffDate: z.string().min(1, "Executive sign-off date is required")
}).superRefine((data, ctx) => {
  const technicalDate = new Date(data.technicalSignOffDate);
  const regulatoryDate = new Date(data.regulatorySignOffDate);
  const executiveDate = new Date(data.executiveSignOffDate);
  
  // Check if dates are valid
  if (isNaN(technicalDate.getTime())) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_date,
      path: ["technicalSignOffDate"],
      message: "Invalid technical sign-off date"
    });
  }
  
  if (isNaN(regulatoryDate.getTime())) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_date,
      path: ["regulatorySignOffDate"],
      message: "Invalid regulatory sign-off date"
    });
  }
  
  if (isNaN(executiveDate.getTime())) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_date,
      path: ["executiveSignOffDate"],
      message: "Invalid executive sign-off date"
    });
  }
  
  // Only check sequence if all dates are valid
  if (!isNaN(technicalDate.getTime()) && !isNaN(regulatoryDate.getTime()) && !isNaN(executiveDate.getTime())) {
    if (regulatoryDate < technicalDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["regulatorySignOffDate"],
        message: "Regulatory sign-off date cannot be before technical sign-off date"
      });
    }
    
    if (executiveDate < regulatoryDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["executiveSignOffDate"],
        message: "Executive sign-off date cannot be before regulatory sign-off date"
      });
    }
  }
});

type SignOffDatesFormData = z.infer<typeof signOffDatesSchema>;

const DateForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted }
  } = useForm<SignOffDatesFormData>({
    resolver: zodResolver(signOffDatesSchema),
    mode: 'onSubmit',
    defaultValues: {
      technicalSignOffDate: '',
      regulatorySignOffDate: '',
      executiveSignOffDate: ''
    }
  });

  const onSubmit = (data: SignOffDatesFormData) => {
    console.log('Valid form data:', data);
  };

  // Watch all fields to see current values (for debug only)
  // const watchedValues = watch();

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Sign-Off Dates</h2>

      <div className="space-y-4">
        {/* Technical Sign-Off Date */}
        <div>
          <label htmlFor="technical" className="block text-sm font-medium mb-1">
            Technical Sign-Off Date
          </label>
          <input
            {...register('technicalSignOffDate')}
            id="technical"
            type="date"
            className="w-full px-3 py-2 border rounded"
            placeholder=""
          />
          {isSubmitted && errors.technicalSignOffDate && (
            <div className="text-red-600 text-sm mt-1">
              {errors.technicalSignOffDate.message}
            </div>
          )}
        </div>

        {/* Regulatory Sign-Off Date */}
        <div>
          <label htmlFor="regulatory" className="block text-sm font-medium mb-1">
            Regulatory Sign-Off Date
          </label>
          <input
            {...register('regulatorySignOffDate')}
            id="regulatory"
            type="date"
            className="w-full px-3 py-2 border rounded"
            placeholder=""
          />
          {isSubmitted && errors.regulatorySignOffDate && (
            <div className="text-red-600 text-sm mt-1">
              {errors.regulatorySignOffDate.message}
            </div>
          )}
        </div>

        {/* Executive Sign-Off Date */}
        <div>
          <label htmlFor="executive" className="block text-sm font-medium mb-1">
            Executive Sign-Off Date
          </label>
          <input
            {...register('executiveSignOffDate')}
            id="executive"
            type="date"
            className="w-full px-3 py-2 border rounded"
            placeholder=""
          />
          {isSubmitted && errors.executiveSignOffDate && (
            <div className="text-red-600 text-sm mt-1">
              {errors.executiveSignOffDate.message}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit(onSubmit)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Submit
        </button>

        {/* Debug info - remove in production */}
        {isSubmitted && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
            <p><strong>Form Submitted:</strong> Yes</p>
            <p><strong>Has Errors:</strong> {Object.keys(errors).length > 0 ? 'Yes' : 'No'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateForm;