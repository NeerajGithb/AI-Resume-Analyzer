"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, X } from "lucide-react";
import type { DegreeGroup, DegreeOption } from "@/lib/degreeOptions";

interface DegreeComboboxProps {
  value: string;
  onChange: (value: string) => void;
  groups: DegreeGroup[];
  allOptions: DegreeOption[];
  placeholder?: string;
  id?: string;
  required?: boolean;
  className?: string;
}

export function DegreeCombobox({
  value,
  onChange,
  groups,
  allOptions,
  placeholder = "Search or type…",
  id,
  required,
  className = "",
}: DegreeComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  // Recompute position on open + scroll/resize
  useEffect(() => {
    if (!open) return;
    const update = () => {
      if (containerRef.current) setRect(containerRef.current.getBoundingClientRect());
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  // Close on outside click — must check BOTH container and dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) return;
      setOpen(false);
      if (query.trim() && query !== value) onChange(query.trim());
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [query, value, onChange]);

  const handleSelect = (val: string) => {
    onChange(val);
    setQuery(val);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const MAX_BROWSE = 50;   // total shown when no query (browsing)
  const MAX_PER_GROUP = 5; // per-group limit when actively searching

  const isSearching = !!query.trim();
  const q = query.toLowerCase();

  let filtered: typeof groups;

  if (isSearching) {
    // Show top 5 matches per group — guarantees exact hits like "BCA" always appear
    filtered = groups
      .map((g) => ({
        ...g,
        options: g.options.filter((o) => o.label.toLowerCase().includes(q)).slice(0, MAX_PER_GROUP),
      }))
      .filter((g) => g.options.length > 0);
  } else {
    // Browsing: cap total across all groups to 50
    let rem = MAX_BROWSE;
    filtered = groups
      .map((g) => {
        const options = g.options.slice(0, rem);
        rem = Math.max(0, rem - g.options.length);
        return { ...g, options };
      })
      .filter((g) => g.options.length > 0);
  }

  const rawMatchCount = isSearching
    ? groups.reduce((n, g) => n + g.options.filter((o) => o.label.toLowerCase().includes(q)).length, 0)
    : groups.reduce((n, g) => n + g.options.length, 0);

  const isCapped = isSearching
    ? groups.some((g) => g.options.filter((o) => o.label.toLowerCase().includes(q)).length > MAX_PER_GROUP)
    : rawMatchCount > MAX_BROWSE;

  const isCustom =
    !!query.trim() &&
    !allOptions.some((o) => o.label.toLowerCase() === query.trim().toLowerCase());

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input */}
      <div
        className={`flex items-center border rounded-lg bg-white transition-colors ${
          open ? "border-[#1a1f8f] ring-1 ring-[#1a1f8f]/20" : "border-gray-200 hover:border-gray-300"
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
            onChange(e.target.value);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="flex-1 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 bg-transparent focus:outline-none"
        />
        {value && (
          <button
            type="button"
            onMouseDown={handleClear}
            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            setOpen((o) => !o);
            inputRef.current?.focus();
          }}
          className="px-2.5 py-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ChevronDown className={`w-4 h-4 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Portal dropdown */}
      {open && rect && typeof document !== "undefined" && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: "fixed",
            top: rect.bottom + 4,
            left: rect.left,
            width: rect.width,
            zIndex: 9999,
          }}
          className="bg-white border border-gray-200 rounded-xl shadow-xl max-h-56 overflow-y-auto"
        >
          {/* Custom value */}
          {isCustom && (
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); handleSelect(query.trim()); }}
              className="w-full text-left px-4 py-2.5 text-sm text-[#1a1f8f] font-medium hover:bg-indigo-50 transition-colors border-b border-gray-100"
            >
              Use &ldquo;{query.trim()}&rdquo;
            </button>
          )}

          {filtered.map((group) => (
            <div key={group.group}>
              <p className="px-4 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest bg-gray-50 sticky top-0">
                {group.group}
              </p>
              {group.options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(opt.value); }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-indigo-50 ${
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

          {isCapped && (
            <p className="px-4 py-2.5 text-[11px] text-gray-400 text-center border-t border-gray-100">
              {isSearching
                ? `Showing top 5 per category — type more to narrow results`
                : `Showing 50 of ${rawMatchCount} — type to search`}
            </p>
          )}

          {filtered.length === 0 && query.trim() && (
            <div className="px-4 py-3 text-sm text-gray-400 text-center">
              Press Enter or click above to use &ldquo;{query}&rdquo;
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}