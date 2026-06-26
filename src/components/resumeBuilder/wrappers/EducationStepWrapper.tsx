"use client";
import { useState } from "react";
import type { EducationItem } from "@/types/resumeBuilder";

interface EducationStepWrapperProps {
  data: EducationItem[];
  onChange: (data: EducationItem[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const YEARS = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - i + 5));

const DEGREE_LEVELS = [
  "Secondary School",
  "Vocational Certificate or Diploma",
  "Apprenticeship",
  "Associates",
  "Bachelors",
  "Masters",
  "Doctorate or Ph.D.",
];

const inputCls = "w-full border border-gray-300 rounded-lg px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#1a1f8f] transition-colors";
const selectCls = "w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#1a1f8f] transition-colors appearance-none bg-white cursor-pointer";

export default function EducationStepWrapper({ data, onChange, onNext, onBack }: EducationStepWrapperProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentEntry, setCurrentEntry] = useState<EducationItem>({
    id: crypto.randomUUID(),
    degree: '',
    institution: '',
    location: '',
    graduationMonth: '',
    graduationYear: '',
    gpa: '',
  });

  const handleAdd = () => {
    setCurrentEntry({
      id: crypto.randomUUID(),
      degree: '',
      institution: '',
      location: '',
      graduationMonth: '',
      graduationYear: '',
      gpa: '',
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (item: EducationItem) => {
    setCurrentEntry(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!currentEntry.institution.trim()) {
      alert('Please enter an institution name');
      return;
    }

    if (editingId) {
      onChange(data.map(item => item.id === editingId ? currentEntry : item));
    } else {
      onChange([...data, currentEntry]);
    }
    
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this education?')) {
      onChange(data.filter(item => item.id !== id));
    }
  };

  const updateField = (field: keyof EducationItem, value: string) => {
    setCurrentEntry(prev => ({ ...prev, [field]: value }));
  };

  if (showForm) {
    return (
      <div className="max-w-3xl mx-auto px-10 py-10">
        <button
          onClick={() => setShowForm(false)}
          className="text-sm text-[#1a1f8f] font-medium flex items-center gap-1 mb-6 hover:underline cursor-pointer"
        >
          ← Go Back
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Tell us about your education</h1>
        <p className="text-sm text-gray-500 mb-8">Add your educational background and qualifications.</p>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">School/Institution *</label>
              <input 
                className={inputCls} 
                placeholder="University of California" 
                value={currentEntry.institution} 
                onChange={(e) => updateField('institution', e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Location</label>
              <input 
                className={inputCls} 
                placeholder="Los Angeles, CA" 
                value={currentEntry.location} 
                onChange={(e) => updateField('location', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Degree</label>
              <select 
                className={selectCls} 
                value={currentEntry.degree} 
                onChange={(e) => updateField('degree', e.target.value)}
              >
                <option value="">Select degree</option>
                {DEGREE_LEVELS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">GPA (Optional)</label>
              <input 
                className={inputCls} 
                placeholder="3.8" 
                value={currentEntry.gpa} 
                onChange={(e) => updateField('gpa', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Graduation Date</label>
            <div className="grid grid-cols-2 gap-3">
              <select 
                className={selectCls} 
                value={currentEntry.graduationMonth} 
                onChange={(e) => updateField('graduationMonth', e.target.value)}
              >
                <option value="">Month</option>
                {MONTHS.map((m) => <option key={m}>{m}</option>)}
              </select>
              <select 
                className={selectCls} 
                value={currentEntry.graduationYear} 
                onChange={(e) => updateField('graduationYear', e.target.value)}
              >
                <option value="">Year</option>
                {YEARS.map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button 
            onClick={() => setShowForm(false)}
            className="px-6 py-3 rounded-full border-2 border-[#1a1f8f] text-[#1a1f8f] text-sm font-medium hover:bg-indigo-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-8 py-3 rounded-full bg-yellow-400 text-gray-900 text-sm font-semibold hover:bg-yellow-300 transition-colors"
          >
            {editingId ? 'Update' : 'Add'} Education
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-10 py-10">
      <button
        onClick={onBack}
        className="text-sm text-[#1a1f8f] font-medium flex items-center gap-1 mb-6 hover:underline cursor-pointer"
      >
        ← Go Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Education</h1>

      {data.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl mb-6">
          <p className="text-gray-500 mb-4">No education added yet</p>
          <button
            onClick={handleAdd}
            className="px-6 py-3 rounded-full bg-[#1a1f8f] text-white text-sm font-medium hover:bg-[#151a7a] transition-colors"
          >
            Add Your Education
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {data.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-xl p-5">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.degree || 'Degree'}</h3>
                    <p className="text-sm text-gray-600">{item.institution}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.location}
                      {item.graduationMonth && ` | ${item.graduationMonth} ${item.graduationYear}`}
                      {item.gpa && ` | GPA: ${item.gpa}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-[#1a1f8f] hover:text-indigo-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleAdd}
            className="w-full border-2 border-dashed border-[#1a1f8f]/30 rounded-xl py-4 text-sm text-[#1a1f8f] font-medium hover:border-[#1a1f8f]/60 hover:bg-indigo-50/30 transition-colors mb-6"
          >
            + Add Another Degree
          </button>
        </>
      )}

      <div className="flex justify-end gap-3">
        <button 
          onClick={onBack}
          className="px-6 py-3 rounded-full border-2 border-[#1a1f8f] text-[#1a1f8f] text-sm font-medium hover:bg-indigo-50 transition-colors"
        >
          ← Back
        </button>
        <button 
          onClick={onNext}
          disabled={data.length === 0}
          className={`px-8 py-3 rounded-full text-sm font-semibold transition-colors ${
            data.length > 0
              ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next: Skills →
        </button>
      </div>
    </div>
  );
}
