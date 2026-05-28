import { CardioFormInput } from "@/types/cardio";

export interface ValidationError {
  field: keyof CardioFormInput | "global";
  message: string;
}

export function validateCardioForm(data: Partial<CardioFormInput>): ValidationError[] {
  const errors: ValidationError[] = [];

  // 1. age_years: required, 1 to 100
  if (data.age_years === undefined || data.age_years === null || isNaN(data.age_years)) {
    errors.push({ field: "age_years", message: "Age is required." });
  } else if (data.age_years < 1 || data.age_years > 100) {
    errors.push({ field: "age_years", message: "Age must be between 1 and 100 years." });
  }

  // 2. gender: required, must be 1 or 2
  if (data.gender === undefined || data.gender === null) {
    errors.push({ field: "gender", message: "Gender is required." });
  } else if (data.gender !== 1 && data.gender !== 2) {
    errors.push({ field: "gender", message: "Please select a valid gender option." });
  }

  // 3. height: required, 130 to 220
  if (data.height === undefined || data.height === null || isNaN(data.height)) {
    errors.push({ field: "height", message: "Height is required." });
  } else if (data.height < 130 || data.height > 220) {
    errors.push({ field: "height", message: "Height must be between 130 and 220 cm." });
  }

  // 4. weight: required, 40 to 200
  if (data.weight === undefined || data.weight === null || isNaN(data.weight)) {
    errors.push({ field: "weight", message: "Weight is required." });
  } else if (data.weight < 40 || data.weight > 200) {
    errors.push({ field: "weight", message: "Weight must be between 40 and 200 kg." });
  }

  // 5. ap_hi: required, 60 to 250
  if (data.ap_hi === undefined || data.ap_hi === null || isNaN(data.ap_hi)) {
    errors.push({ field: "ap_hi", message: "Systolic blood pressure is required." });
  } else if (data.ap_hi < 60 || data.ap_hi > 250) {
    errors.push({ field: "ap_hi", message: "Systolic pressure must be between 60 and 250 mmHg." });
  }

  // 6. ap_lo: required, 40 to 200
  if (data.ap_lo === undefined || data.ap_lo === null || isNaN(data.ap_lo)) {
    errors.push({ field: "ap_lo", message: "Diastolic blood pressure is required." });
  } else if (data.ap_lo < 40 || data.ap_lo > 200) {
    errors.push({ field: "ap_lo", message: "Diastolic pressure must be between 40 and 200 mmHg." });
  }

  // 7. cholesterol: required, 1, 2, or 3
  if (data.cholesterol === undefined || data.cholesterol === null) {
    errors.push({ field: "cholesterol", message: "Cholesterol level selection is required." });
  } else if (data.cholesterol !== 1 && data.cholesterol !== 2 && data.cholesterol !== 3) {
    errors.push({ field: "cholesterol", message: "Invalid cholesterol selection." });
  }

  // 8. gluc: required, 1, 2, or 3
  if (data.gluc === undefined || data.gluc === null) {
    errors.push({ field: "gluc", message: "Glucose level selection is required." });
  } else if (data.gluc !== 1 && data.gluc !== 2 && data.gluc !== 3) {
    errors.push({ field: "gluc", message: "Invalid glucose selection." });
  }

  // 9. smoke: required, 0 or 1
  if (data.smoke === undefined || data.smoke === null) {
    errors.push({ field: "smoke", message: "Smoking status is required." });
  } else if (data.smoke !== 0 && data.smoke !== 1) {
    errors.push({ field: "smoke", message: "Invalid smoking status selection." });
  }

  // 10. alco: required, 0 or 1
  if (data.alco === undefined || data.alco === null) {
    errors.push({ field: "alco", message: "Alcohol consumption status is required." });
  } else if (data.alco !== 0 && data.alco !== 1) {
    errors.push({ field: "alco", message: "Invalid alcohol status selection." });
  }

  // 11. active: required, 0 or 1
  if (data.active === undefined || data.active === null) {
    errors.push({ field: "active", message: "Physical activity status is required." });
  } else if (data.active !== 0 && data.active !== 1) {
    errors.push({ field: "active", message: "Invalid physical activity selection." });
  }

  // Special rule: Block submission if ap_hi <= ap_lo
  if (
    data.ap_hi !== undefined && 
    data.ap_lo !== undefined && 
    data.ap_hi !== null && 
    data.ap_lo !== null && 
    !isNaN(data.ap_hi) && 
    !isNaN(data.ap_lo) && 
    data.ap_hi <= data.ap_lo
  ) {
    errors.push({ 
      field: "ap_hi", 
      message: "Systolic pressure must be higher than diastolic pressure." 
    });
  }

  return errors;
}

