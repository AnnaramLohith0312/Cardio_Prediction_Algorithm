import { useState } from "react";
import { CardioFormInput } from "@/types/cardio";
import { validateCardioForm, ValidationError } from "@/lib/validation";

const initialFormState: CardioFormInput = {
  age_years: 45,
  gender: 2, // 2 = Male
  height: 175,
  weight: 75,
  ap_hi: 120,
  ap_lo: 80,
  cholesterol: 1, // 1 = Normal
  gluc: 1, // 1 = Normal
  smoke: 0,
  alco: 0,
  active: 1,
};

export function useCardioForm() {
  const [form, setForm] = useState<CardioFormInput>(initialFormState);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const updateField = <K extends keyof CardioFormInput>(field: K, value: CardioFormInput[K]) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      const validationErrors = validateCardioForm(next);
      setErrors(validationErrors);
      return next;
    });
  };

  const getCompletionPercentage = () => {
    // Basic calculation for fields completed (everything has defaults, but let's count populated fields)
    let filled = 0;
    const totalFields = Object.keys(initialFormState).length;
    
    for (const key of Object.keys(form) as Array<keyof CardioFormInput>) {
      if (form[key] !== undefined && form[key] !== null) {
        filled++;
      }
    }
    return Math.round((filled / totalFields) * 100);
  };

  return {
    form,
    errors,
    updateField,
    completionPercentage: getCompletionPercentage(),
  };
}
