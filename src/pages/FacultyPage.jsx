import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  Mail,
  MapPin,
  BookOpen,
  Award,
  Sparkles,
  ExternalLink,
  X
} from "lucide-react";
import SafeImage from "../components/SafeImage";
import { THEME, MAJORS } from "../mockData";

export default function FacultyPage({
  faculty,
  courses,
  onNavigateCourse,
}) {
  const [query, setQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  const filteredFaculty = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faculty.filter((f) => {
      const matchesQuery =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.department.toLowerCase().includes(q) ||
        f.title.toLowerCase().includes(q) ||
        f.email.toLowerCase().includes(q);

      const matchesDept = selectedDept === "All" || f.department === selectedDept;

      return matchesQuery && matchesDept;
    });
  }, [faculty, query, selectedDept]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div
        className="rounded-lg border p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[11px] font-bold uppercase tracking-widest"
              style={{ color: THEME.brassDark }}
            >
              Academic Senate
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold" style={{ color: THEME.ink }}>
            Faculty & Department Chairs
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Distinguished scholars, researchers, and undergraduate mentors across all departments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: THEME.brassLight, color: THEME.brassDark }}
          >
            <Award size={14} /> {faculty.length} Appointed Fellows
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div
        className="rounded-lg border p-4 shadow-sm"
        style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: THEME.inkSoft }}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search faculty by name, department, title, email…"
              className="w-full rounded border bg-transparent py-2 pl-9 pr-3 text-xs outline-none focus:border-stone-500 transition-colors"
              style={{ borderColor: THEME.rule, color: THEME.ink }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="w-full sm:w-60">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full rounded border bg-transparent px-3 py-2 text-xs outline-none transition-colors"
              style={{ borderColor: THEME.rule, color: THEME.ink }}
            >
              <option value="All">All Departments</option>
              {MAJORS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      {filteredFaculty.length === 0 ? (
        <div
          className="rounded-lg border p-12 text-center shadow-sm"
          style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
        >
          <p className="font-serif text-lg font-bold" style={{ color: THEME.ink }}>
            No faculty members found
          </p>
          <p className="text-xs text-stone-500 mt-1">
            Try adjusting your search query or clear the department filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFaculty.map((f) => (
            <div
              key={f.id}
              className="group flex flex-col justify-between overflow-hidden rounded-lg border shadow-xs transition-all hover:-translate-y-1 hover:shadow-md"
              style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
            >
              <div className="p-6">
                {/* Portrait and Header */}
                <div className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <SafeImage
                      src={f.avatar}
                      alt={f.name}
                      fallbackText={f.name}
                      className="h-18 w-18 rounded-full border-2 shadow-xs object-cover"
                    />
                    <span
                      className="absolute -bottom-1 -right-1 rounded-full p-1 shadow-xs"
                      style={{ backgroundColor: THEME.brassLight, color: THEME.brassDark }}
                    >
                      <Award size={12} />
                    </span>
                  </div>

                  <div className="min-w-0">
                    <span
                      className="inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-1"
                      style={{ backgroundColor: THEME.paperDark, color: THEME.inkSoft }}
                    >
                      {f.department}
                    </span>
                    <h3 className="font-serif text-lg font-bold leading-tight line-clamp-1" style={{ color: THEME.ink }}>
                      {f.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5 line-clamp-1 font-medium">
                      {f.title}
                    </p>
                  </div>
                </div>

                {/* Bio / Research */}
                <div className="mt-4">
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {f.bio}
                  </p>
                </div>

                {/* Office & Contact info */}
                <div className="mt-4 space-y-1.5 border-t pt-3 text-xs text-stone-600" style={{ borderColor: THEME.ruleLight }}>
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-stone-400" />
                    <span>{f.office}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-stone-400" />
                    <a
                      href={`mailto:${f.email}`}
                      className="text-stone-700 hover:text-amber-800 hover:underline"
                    >
                      {f.email}
                    </a>
                  </div>
                </div>

                {/* Courses Taught */}
                {f.coursesTaught && f.coursesTaught.length > 0 && (
                  <div className="mt-3 border-t pt-3" style={{ borderColor: THEME.ruleLight }}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                      Lectures & Seminars
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {f.coursesTaught.map((c) => (
                        <span
                          key={c}
                          className="ledger-mono rounded border px-2 py-0.5 text-[11px] font-semibold"
                          style={{ backgroundColor: THEME.paper, borderColor: THEME.ruleLight, color: THEME.ink }}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div
                className="border-t p-3 flex items-center justify-between"
                style={{ backgroundColor: THEME.paper, borderColor: THEME.ruleLight }}
              >
                <span className="ledger-mono text-[11px] text-stone-400">{f.id}</span>
                <a
                  href={`mailto:${f.email}`}
                  className="text-xs font-semibold flex items-center gap-1 hover:underline"
                  style={{ color: THEME.brassDark }}
                >
                  Contact Office Hours <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
