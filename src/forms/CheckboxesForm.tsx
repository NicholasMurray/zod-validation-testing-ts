import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  checkboxes: z.array(z.string()).optional(),
}).refine(
  (data) => data.checkboxes && data.checkboxes.length > 0,
  {
    message: "At least one option must be selected",
    path: ["checkboxes"],
  }
);

type FormData = z.infer<typeof schema>;

export const CheckboxesForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      checkboxes: ['option1'], // Your preselected values from context
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  const options = ['option1', 'option2', 'option3'];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        {options.map((option) => (
          <Controller
            key={option}
            name="checkboxes"
            control={control}
            render={({ field }) => (
              <label>
                <input
                  type="checkbox"
                  value={option}
                  checked={field.value?.includes(option) || false}
                  onChange={(e) => {
                    const values = field.value || [];
                    if (e.target.checked) {
                      field.onChange([...values, option]);
                    } else {
                      field.onChange(values.filter((val) => val !== option));
                    }
                  }}
                />
                {option}
              </label>
            )}
          />
        ))}
      </div>
      {errors.checkboxes && (
        <p className="error">{errors.checkboxes.message}</p>
      )}
      <button type="submit">Submit</button>
    </form>
  );
}