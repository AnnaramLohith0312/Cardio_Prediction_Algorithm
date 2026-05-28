import GenderSelector from "./GenderSelector";
import MetricSlider from "./MetricSlider";
import SegmentedChoice from "./SegmentedChoice";
import ToggleChipGroup from "./ToggleChipGroup";
import { CardioFormInput } from "@/types/cardio";
import { ValidationError } from "@/lib/validation";

interface AssessmentStepperProps {
  form: CardioFormInput;
  errors: ValidationError[];
  onChange: <K extends keyof CardioFormInput>(field: K, value: CardioFormInput[K]) => void;
  onSubmit: () => void;
  loading?: boolean;
  apiError?: string | null;
}

export default function AssessmentStepper({
  form,
  errors,
  onChange,
  onSubmit,
  loading = false,
  apiError = null,
}: AssessmentStepperProps) {
  const findError = (field: keyof CardioFormInput) => {
    return errors.find((err) => err.field === field)?.message;
  };

  return (
    <div className="w-full flex flex-col gap-10">
      {/* Hero Content */}
      <section className="mb-2">
        <h1 className="font-headline-lg text-3xl font-extrabold text-on-surface mb-2">Health Assessment</h1>
        <p className="font-body-lg text-base text-on-surface-variant max-w-2xl leading-relaxed">
          Complete the following sections with your current health data. Our AI model analyzes over 20 cardiovascular markers to provide a precision risk profile.
        </p>
      </section>

      {/* Personal Info Card */}
      <section className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30 shadow-sm" id="personal-info">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary-container/10 p-2 rounded-lg">
            <span className="material-symbols-outlined text-primary">person</span>
          </div>
          <h2 className="font-headline-md text-xl font-bold">Personal Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            <label className="font-label-md text-xs font-semibold text-on-surface-variant">Age (Years)</label>
            <input
              className={`w-full h-12 px-4 rounded-lg border outline-none transition-all text-sm font-medium bg-white ${
                findError("age_years")
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-teal-600 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
              }`}
              placeholder="e.g. 45"
              type="number"
              value={form.age_years || ""}
              onChange={(e) => onChange("age_years", Number(e.target.value))}
              disabled={loading}
            />
            {findError("age_years") ? (
              <p className="text-xs text-red-500 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {findError("age_years")}
              </p>
            ) : (
              <p className="text-xs text-teal-600 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Valid Age
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <label className="font-label-md text-xs font-semibold text-on-surface-variant">Biological Gender</label>
            <GenderSelector value={form.gender} onChange={(val) => onChange("gender", val)} />
          </div>
        </div>
      </section>

      {/* Body Metrics Section */}
      <section className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30 shadow-sm" id="body-metrics">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary-container/10 p-2 rounded-lg">
            <span className="material-symbols-outlined text-primary">straighten</span>
          </div>
          <h2 className="font-headline-md text-xl font-bold">Body Metrics</h2>
        </div>
        <div className="space-y-12">
          <div>
            <MetricSlider
              label="Height"
              unit="cm"
              min={130}
              max={220}
              value={form.height}
              onChange={(val) => onChange("height", val)}
            />
            {findError("height") ? (
              <p className="text-xs text-red-500 font-semibold mt-2 flex items-center gap-1">{findError("height")}</p>
            ) : (
              <p className="text-xs text-teal-600 font-medium mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Valid Height
              </p>
            )}
          </div>

          <div>
            <MetricSlider
              label="Weight"
              unit="kg"
              min={40}
              max={200}
              value={form.weight}
              onChange={(val) => onChange("weight", val)}
            />
            {findError("weight") ? (
              <p className="text-xs text-red-500 font-semibold mt-2 flex items-center gap-1">{findError("weight")}</p>
            ) : (
              <p className="text-xs text-teal-600 font-medium mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Valid Weight
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Blood Pressure Card */}
      <section className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30 shadow-sm" id="blood-pressure">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary-container/10 p-2 rounded-lg">
            <span className="material-symbols-outlined text-primary">monitor_heart</span>
          </div>
          <h2 className="font-headline-md text-xl font-bold">Blood Pressure</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            <label className="font-label-md text-xs font-semibold text-on-surface-variant">Systolic (Top Number)</label>
            <input
              className={`w-full h-12 px-4 rounded-lg border outline-none transition-all text-sm font-medium bg-white ${
                findError("ap_hi")
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-teal-600 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
              }`}
              placeholder="e.g. 120"
              type="number"
              value={form.ap_hi || ""}
              onChange={(e) => onChange("ap_hi", Number(e.target.value))}
              disabled={loading}
            />
            {findError("ap_hi") ? (
              <p className="text-xs text-red-500 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {findError("ap_hi")}
              </p>
            ) : (
              <p className="text-xs text-teal-600 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Valid Systolic Pressure
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <label className="font-label-md text-xs font-semibold text-on-surface-variant">Diastolic (Bottom Number)</label>
            <input
              className={`w-full h-12 px-4 rounded-lg border outline-none transition-all text-sm font-medium bg-white ${
                findError("ap_lo")
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-teal-600 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
              }`}
              placeholder="e.g. 80"
              type="number"
              value={form.ap_lo || ""}
              onChange={(e) => onChange("ap_lo", Number(e.target.value))}
              disabled={loading}
            />
            {findError("ap_lo") ? (
              <p className="text-xs text-red-500 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {findError("ap_lo")}
              </p>
            ) : (
              <p className="text-xs text-teal-600 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Valid Diastolic Pressure
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-on-surface-variant/70 text-xs font-semibold">
          <span className="material-symbols-outlined text-[18px]">info</span>
          Normal range is typically around 120/80 mmHg.
        </div>
      </section>

      {/* Health Indicators Bento */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="health-indicators">
        <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-primary">opacity</span>
            <h3 className="font-label-md text-xs font-semibold text-on-surface">Cholesterol Level</h3>
          </div>
          <SegmentedChoice
            icon="opacity"
            value={form.cholesterol}
            onChange={(val) => onChange("cholesterol", val)}
            options={[
              { label: "Normal", value: 1 },
              { label: "Above Normal", value: 2 },
              { label: "Well Above", value: 3 },
            ]}
          />
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-primary">biotech</span>
            <h3 className="font-label-md text-xs font-semibold text-on-surface">Glucose Level</h3>
          </div>
          <SegmentedChoice
            icon="biotech"
            value={form.gluc}
            onChange={(val) => onChange("gluc", val)}
            options={[
              { label: "Normal", value: 1 },
              { label: "Above Normal", value: 2 },
              { label: "Well Above", value: 3 },
            ]}
          />
        </div>
      </section>

      {/* Lifestyle Habits */}
      <section className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30 shadow-sm" id="lifestyle">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary-container/10 p-2 rounded-lg">
            <span className="material-symbols-outlined text-primary">style</span>
          </div>
          <h2 className="font-headline-md text-xl font-bold">Lifestyle Habits</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ToggleChipGroup
            label="Tobacco Use"
            value={form.smoke}
            onChange={(val) => onChange("smoke", val)}
            options={[
              { label: "Never", value: 0 },
              { label: "Active", value: 1 },
            ]}
          />
          <ToggleChipGroup
            label="Alcohol Intake"
            value={form.alco}
            onChange={(val) => onChange("alco", val)}
            options={[
              { label: "Minimal", value: 0 },
              { label: "Regular", value: 1 },
            ]}
          />
          <ToggleChipGroup
            label="Physical Activity"
            value={form.active}
            onChange={(val) => onChange("active", val)}
            options={[
              { label: "Low", value: 0 },
              { label: "Active", value: 1 },
            ]}
          />
        </div>
      </section>

      {/* API Error Message */}
      {apiError && (
        <div className="flex items-start gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          <span className="material-symbols-outlined text-lg mt-0.5 flex-shrink-0">error</span>
          <div>
            <p className="font-bold">Prediction Request Failed</p>
            <p className="text-xs opacity-90 mt-0.5">{apiError}</p>
          </div>
        </div>
      )}

      {/* Submit button */}
      <div className="flex justify-end pt-4 pb-20">
        <button
          onClick={onSubmit}
          disabled={errors.length > 0 || loading}
          className="bg-secondary text-white px-10 py-4 rounded-xl font-headline-md text-base font-bold hover:shadow-lg hover:translate-y-[-2px] transition-all active:scale-95 flex items-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
              Analyzing Cardiac Profile...
            </>
          ) : (
            <>
              Calculate Risk Profile
              <span className="material-symbols-outlined">trending_flat</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
