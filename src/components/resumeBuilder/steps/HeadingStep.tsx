"use client";
import { Plus, X, ChevronRight } from "lucide-react";
import { useResumeBuilderV2Store } from "@/store/resumeBuilderV2Store";
import type { HeadingFormData } from "@/types/resumeBuilder";

interface HeadingStepProps {
  onNext: () => void;
}

const FIELDS: {
  key: keyof HeadingFormData;
  label: string;
  placeholder: string;
  required?: boolean;
  type?: string;
  col: 1 | 2 | 3;
}[] = [
  { key: "firstName", label: "First Name", placeholder: "John", required: true, col: 1 },
  { key: "lastName",  label: "Last Name",  placeholder: "Doe",  required: true, col: 1 },
  { key: "email", label: "Email", placeholder: "john@example.com", required: true, type: "email", col: 2 },
  { key: "phone", label: "Phone", placeholder: "+91 98765 43210", required: true, col: 2 },
  { key: "city",    label: "City",    placeholder: "Mumbai", col: 3 },
  { key: "country", label: "Country", placeholder: "India",  col: 3 },
];

const OPTIONAL_LINKS: {
  key: "linkedin" | "github" | "portfolio";
  label: string;
  placeholder: string;
}[] = [
  { key: "linkedin",  label: "LinkedIn",           placeholder: "https://linkedin.com/in/you" },
  { key: "github",    label: "GitHub",              placeholder: "https://github.com/you"      },
  { key: "portfolio", label: "Website / Portfolio", placeholder: "https://yoursite.com"        },
];

export default function HeadingStep({ onNext }: HeadingStepProps) {
  const { formData, updateHeading } = useResumeBuilderV2Store();
  const data = formData.heading;

  const handleChange =
    (key: keyof HeadingFormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
      updateHeading({ [key]: e.target.value });

  const toggleOptional = (key: "linkedin" | "github" | "portfolio") => {
    updateHeading({ [key]: data[key] === undefined ? "" : undefined });
  };

  const isComplete = !!(data.firstName && data.lastName && data.email && data.phone);

  return (
    <div className="min-h-screen bg-[#f8f8f6] flex">
      <main className="flex-1 px-12 py-10 max-w-4xl">
        <button
          onClick={() => window.history.back()}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors mb-8 flex items-center gap-1"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">
          How can employers reach you?
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          Required fields are marked <span className="text-rose-400">*</span>
        </p>

        {/* Name */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {FIELDS.filter(f => f.col === 1).map(({ key, label, placeholder, required }) => (
            <Field
              key={key}
              label={label}
              required={required}
              placeholder={placeholder}
              value={(data[key] as string) ?? ""}
              onChange={handleChange(key)}
            />
          ))}
        </div>

        {/* Contact */}
        <SectionDivider label="Contact" />
        <div className="grid grid-cols-2 gap-4 mb-8">
          {FIELDS.filter(f => f.col === 2).map(({ key, label, placeholder, required, type }) => (
            <Field
              key={key}
              label={label}
              required={required}
              placeholder={placeholder}
              type={type}
              value={(data[key] as string) ?? ""}
              onChange={handleChange(key)}
            />
          ))}
        </div>

        {/* Location */}
        <SectionDivider label="Location" />
        <div className="grid grid-cols-2 gap-4 mb-10">
          {FIELDS.filter(f => f.col === 3).map(({ key, label, placeholder }) => (
            <Field
              key={key}
              label={label}
              placeholder={placeholder}
              value={(data[key] as string) ?? ""}
              onChange={handleChange(key)}
            />
          ))}
        </div>

        {/* Online presence */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">
            Online presence
          </span>
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[10px] text-gray-400">optional</span>
        </div>

        <div className="flex gap-2 mb-5">
          {OPTIONAL_LINKS.map(({ key, label }) => {
            const active = data[key] !== undefined;
            return (
              <button
                key={key}
                onClick={() => toggleOptional(key)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  active
                    ? "border-slate-800 bg-slate-800 text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-400 bg-white"
                }`}
              >
                {active ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                {label}
              </button>
            );
          })}
        </div>

        <div className="space-y-4 mb-10">
          {OPTIONAL_LINKS.filter(({ key }) => data[key] !== undefined).map(({ key, label, placeholder }) => (
            <Field
              key={key}
              label={label}
              placeholder={placeholder}
              value={(data[key] as string) ?? ""}
              onChange={handleChange(key)}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <button
            onClick={onNext}
            disabled={!isComplete}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              isComplete
                ? "bg-slate-900 text-white hover:bg-slate-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Save & Continue
            <ChevronRight className="w-4 h-4" />
          </button>
          {!isComplete && (
            <span className="text-xs text-gray-400">Fill required fields to continue</span>
          )}
        </div>
      </main>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">{label}</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

function Field({
  label, placeholder, value, onChange, required, type = "text",
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-700 mb-1.5 block">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all"
      />
    </div>
  );
}