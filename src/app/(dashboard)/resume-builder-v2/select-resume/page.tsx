"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileEdit } from "lucide-react";

type Option = "upload" | "scratch";

export default function SelectResumePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Option>("scratch");

  const handleNext = () => {
    // Upload not yet implemented — always go to create
    router.push('/resume-builder-v2/create');
  };

  const handleBack = () => {
    router.push('/resume-builder-v2/experience-level');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 flex flex-col items-center pt-20 px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Are you uploading an existing resume?
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Just review, edit, and update it with new information
          </p>
        </div>

        <div className="flex gap-6 w-full max-w-4xl">
          {/* Upload option - Coming Soon */}
          <div className="relative flex-1">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-100 text-pink-500 text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
              Coming Soon
            </span>
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-4 p-10 rounded-2xl border-2 border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
            >
              <Upload className="w-10 h-10 text-teal-500" strokeWidth={1.5} />
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">Yes, upload from my resume</p>
                <p className="text-sm text-gray-500 mt-1 max-w-xs">
                  We'll give you expert guidance to fill out your info and enhance your resume, from start to finish
                </p>
              </div>
            </div>
          </div>

          {/* Scratch option */}
          <button
            onClick={() => setSelected("scratch")}
            className={`flex-1 flex flex-col items-center justify-center gap-4 p-10 rounded-2xl border-2 transition-all cursor-pointer ${
              selected === "scratch"
                ? "border-[#1a1f8f] bg-white"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <FileEdit className="w-10 h-10 text-indigo-400" strokeWidth={1.5} />
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">No, start from scratch</p>
              <p className="text-sm text-gray-500 mt-1 max-w-xs">
                We'll guide you through the whole process so your skills can shine
              </p>
            </div>
          </button>
        </div>

        {/* Nav buttons */}
        <div className="flex justify-between w-full max-w-4xl mt-12">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#1a1f8f] text-[#1a1f8f] text-sm font-medium hover:bg-indigo-50 transition-colors cursor-pointer"
          >
            ← Back
          </button>
          <button 
            onClick={handleNext}
            className="px-8 py-3 rounded-full bg-yellow-400 text-gray-900 text-sm font-semibold hover:bg-yellow-300 transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      </main>

      <footer className="py-6 px-10 flex justify-between items-center text-xs text-gray-500 border-t border-gray-100 mt-16">
        <nav className="flex gap-4">
          {["Terms And Conditions", "Privacy Policy", "Accessibility", "Contact Us"].map((item) => (
            <a key={item} href="#" className="uppercase tracking-wide hover:text-gray-800 transition-colors">
              {item}
            </a>
          ))}
        </nav>
        <span>© 2026, Works Limited. All rights reserved.</span>
      </footer>
    </div>
  );
}