"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { ROLE_OPTIONS_GROUPED } from "@/lib/options";

interface RoleComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  required?: boolean;
  className?: string;
}

export function RoleCombobox({
  value,
  onChange,
  placeholder = "Select or type a job title",
  id,
  required,
  className = "",
}: RoleComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep query in sync when value changes externally
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        // If user typed something not in list, keep it as custom value
        if (query.trim() && query !== value) {
          onChange(query.trim());
        }
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [query, value, onChange]);

  const handleSelect = (role: string) => {
    onChange(role);
    setQuery(role);
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    onChange("");
    setQuery("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { setOpen(false); inputRef.current?.blur(); }
    if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      onChange(query.trim());
      setOpen(false);
    }
  };

  // Filter groups based on query
  const filtered = ROLE_OPTIONS_GROUPED
    .map((g) => ({
      ...g,
      options: g.options.filter((o) =>
        o.label.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter((g) => g.options.length > 0);

  const showDropdown = open && (filtered.length > 0 || query.trim().length > 0);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        className={`flex items-center border rounded-lg bg-white transition-colors ${
          open ? "border-[#1a1f8f] ring-1 ring-[#1a1f8f]/20" : "border-gray-300"
        }`}
      >
        <input
          ref={inputRef}
          id={id}
          type="text"
          required={required}
          value={query}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value); // live update store while typing
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 bg-transparent focus:outline-none rounded-lg"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => { setOpen((o) => !o); inputRef.current?.focus(); }}
          className="px-3 py-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      {showDropdown && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {/* Custom value option when query doesn't match any role */}
          {query.trim() && !ROLE_OPTIONS_GROUPED.flatMap((g) => g.options).some(
            (o) => o.label.toLowerCase() === query.toLowerCase()
          ) && (
            <button
              type="button"
              onClick={() => handleSelect(query.trim())}
              className="w-full text-left px-4 py-2.5 text-sm text-[#1a1f8f] font-medium hover:bg-indigo-50 transition-colors border-b border-gray-100"
            >
              Use &ldquo;{query.trim()}&rdquo; as custom title
            </button>
          )}

          {filtered.map((group) => (
            <div key={group.group}>
              <p className="px-4 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest bg-gray-50">
                {group.group}
              </p>
              {group.options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-indigo-50 ${
                    value === opt.value
                      ? "text-[#1a1f8f] font-semibold bg-indigo-50"
                      : "text-gray-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ))}

          {filtered.length === 0 && query.trim() && (
            <div className="px-4 py-3 text-sm text-gray-400 text-center">
              Press Enter to use &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
