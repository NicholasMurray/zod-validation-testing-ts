import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ✅ Date validation schema
const validDateSchema = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  });

// ✅ Main form schema
const schema = z
  .object({
    radio: z.enum(["yes", "no"], { required_error: "Please select Yes or No" }),
    date: validDateSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.radio !== "yes") return;

    if (typeof data.date !== "string" || data.date.trim() === "") {
      ctx.addIssue({
        path: ["date"],
        code: z.ZodIssueCode.custom,
        message: "Date is required when 'Yes' is selected",
      });
      return;
    }

    const result = validDateSchema.safeParse(data.date);
    if (!result.success) {
      ctx.addIssue({
        path: ["date"],
        code: z.ZodIssueCode.custom,
        message: result.error.errors[0].message,
      });
    }
  });

export default function ConditionalForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    shouldUnregister: false,
  });

  const radioValue = watch("radio");

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* 🔍 Error Summary */}
      {Object.keys(errors).length > 0 && (
        <div style={{ border: "1px solid red", padding: "1rem", marginBottom: "1rem" }}>
          <h4 style={{ color: "red" }}>Please fix the following errors:</h4>
          <ul>
            {Object.entries(errors).map(([field, error]) => (
              <li key={field} style={{ color: "red" }}>
                {error?.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Radio Buttons */}
      <div>
        <label>
          <input type="radio" value="yes" {...register("radio")} />
          Yes
        </label>
        <label>
          <input type="radio" value="no" {...register("radio")} />
          No
        </label>
        {errors.radio && <p style={{ color: "red" }}>{errors.radio.message}</p>}
      </div>

      {/* Date Field (conditionally shown) */}
      <div style={{ display: radioValue === "yes" ? "block" : "none" }}>
        <label>
          Date:
          <input type="date" {...register("date")} />
        </label>
        {errors.date && <p style={{ color: "red" }}>{errors.date.message}</p>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
