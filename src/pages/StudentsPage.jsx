import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Award,
  Filter,
  CheckCircle2,
  Clock,
  X
} from "lucide-react";
import SafeImage from "../components/SafeImage";
import { THEME, GRADES, MAJORS } from "../mockData";

function StatusStamp({ status }) {
  const isOk = status === "Active";
  const isLeave = status === "On Leave";
  const color = isOk ? THEME.ok : isLeave ? THEME.brassDark : THEME.danger;
  const bg = isOk ? THEME.okLight : isLeave ? THEME.brassLight : THEME.dangerLight;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider"
      style={{ backgroundColor: bg, color: color, letterSpacing: "0.05em" }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {status}
    </span>
  );
}

export default function StudentsPage({
  students,
  courses,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  selectedStudent,
  onSelectStudent,
}) {
  const [query, setQuery] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("All");
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const [expandedRowId, setExpandedRowId] = useState(null);

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = students.filter((s) => {
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.major.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.hometown && s.hometown.toLowerCase().includes(q));

      const matchesMajor = selectedMajor === "All" || s.major === selectedMajor;
      const matchesGrade = selectedGrade === "All" || s.grade === selectedGrade;
      const matchesStatus = selectedStatus === "All" || s.status === selectedStatus;

      return matchesQuery && matchesMajor && matchesGrade && matchesStatus;
    });

    result.sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "gpa-desc") return parseFloat(b.gpa) - parseFloat(a.gpa);
      if (sortBy === "gpa-asc") return parseFloat(a.gpa) - parseFloat(b.gpa);
      if (sortBy === "id") return a.id.localeCompare(b.id);
      return 0;
    });

    return result;
  }, [students, query, selectedMajor, selectedGrade, selectedStatus, sortBy]);

  const activeCount = students.filter((s) => s.status === "Active").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
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
              Academic Registry
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold" style={{ color: THEME.ink }}>
            Official Student Ledger
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {students.length} matriculated scholars · {activeCount} active enrollments · Showing {filteredStudents.length} results
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center rounded border p-0.5" style={{ borderColor: THEME.rule, backgroundColor: THEME.paper }}>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                viewMode === "table" ? "bg-white shadow-xs" : "text-stone-500 hover:text-stone-800"
              }`}
              style={{ color: viewMode === "table" ? THEME.ink : undefined }}
              title="Table view"
            >
              <List size={14} /> Table
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                viewMode === "grid" ? "bg-white shadow-xs" : "text-stone-500 hover:text-stone-800"
              }`}
              style={{ color: viewMode === "grid" ? THEME.ink : undefined }}
              title="Grid card view"
            >
              <LayoutGrid size={14} /> Cards
            </button>
          </div>

          <button
            onClick={onAddStudent}
            className="flex items-center gap-1.5 rounded px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:brightness-110 active:scale-95"
            style={{ backgroundColor: THEME.brass }}
          >
            <Plus size={15} strokeWidth={2.5} />
            Enroll New Student
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="rounded-lg border p-4 shadow-sm"
        style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: THEME.inkSoft }}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, ID, major, email…"
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

          {/* Filter: Major */}
          <div>
            <select
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              className="w-full rounded border bg-transparent px-3 py-2 text-xs outline-none transition-colors"
              style={{ borderColor: THEME.rule, color: THEME.ink }}
            >
              <option value="All">All Majors</option>
              {MAJORS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Filter: Grade */}
          <div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full rounded border bg-transparent px-3 py-2 text-xs outline-none transition-colors"
              style={{ borderColor: THEME.rule, color: THEME.ink }}
            >
              <option value="All">All Class Years</option>
              {GRADES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded border bg-transparent px-3 py-2 text-xs outline-none transition-colors"
              style={{ borderColor: THEME.rule, color: THEME.ink }}
            >
              <option value="name-asc">Sort: Name (A to Z)</option>
              <option value="name-desc">Sort: Name (Z to A)</option>
              <option value="gpa-desc">Sort: Highest GPA</option>
              <option value="gpa-asc">Sort: Lowest GPA</option>
              <option value="id">Sort: Student ID</option>
            </select>
          </div>
        </div>

        {/* Filter Badges Strip */}
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3 text-[11px] text-stone-500" style={{ borderColor: THEME.ruleLight }}>
          <span className="font-semibold uppercase tracking-wider text-[10px] text-stone-400">Status filter:</span>
          {["All", "Active", "On Leave", "Withdrawn"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`rounded-full px-2.5 py-0.5 transition-colors ${
                selectedStatus === st
                  ? "bg-stone-800 text-white font-semibold"
                  : "bg-stone-100 hover:bg-stone-200 text-stone-700"
              }`}
            >
              {st}
            </button>
          ))}
          {(query || selectedMajor !== "All" || selectedGrade !== "All" || selectedStatus !== "All") && (
            <button
              onClick={() => {
                setQuery("");
                setSelectedMajor("All");
                setSelectedGrade("All");
                setSelectedStatus("All");
              }}
              className="ml-auto text-xs font-medium text-amber-800 hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Main Student Directory Views */}
      {filteredStudents.length === 0 ? (
        <div
          className="rounded-lg border p-12 text-center shadow-sm"
          style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
        >
          <p className="font-serif text-lg font-bold" style={{ color: THEME.ink }}>
            No student records found
          </p>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Try loosening your search query or reset the major and class year filters.
          </p>
        </div>
      ) : viewMode === "table" ? (
        /* TABLE VIEW */
        <div
          className="overflow-hidden rounded-lg border shadow-sm"
          style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr
                  className="border-b text-[11px] font-semibold uppercase tracking-wider select-none"
                  style={{ backgroundColor: THEME.paperDark, borderColor: THEME.rule, color: THEME.inkSoft }}
                >
                  <th className="py-3.5 pl-5 pr-3">Student Name</th>
                  <th className="py-3.5 px-3">Student ID</th>
                  <th className="py-3.5 px-3">Major & Department</th>
                  <th className="py-3.5 px-3">Class Year</th>
                  <th className="py-3.5 px-3">GPA</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 pr-5 pl-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: THEME.ruleLight }}>
                {filteredStudents.map((s) => {
                  const isExpanded = expandedRowId === s.id;
                  return (
                    <React.Fragment key={s.id}>
                      <tr
                        onClick={() => setExpandedRowId(isExpanded ? null : s.id)}
                        className={`cursor-pointer transition-colors hover:bg-stone-50/80 ${
                          isExpanded ? "bg-amber-50/40" : ""
                        }`}
                      >
                        <td className="py-3 pl-5 pr-3">
                          <div className="flex items-center gap-3">
                            <SafeImage
                              src={s.avatar}
                              alt={s.name}
                              fallbackText={s.name}
                              className="h-9 w-9 rounded-full border shadow-2xs flex-shrink-0"
                            />
                            <div>
                              <p className="font-serif text-sm font-semibold" style={{ color: THEME.ink }}>
                                {s.name}
                              </p>
                              <p className="text-[11px] text-stone-400">{s.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="ledger-mono text-xs font-medium" style={{ color: THEME.inkSoft }}>
                            {s.id}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-medium" style={{ color: THEME.ink }}>
                            {s.major}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-stone-600">{s.grade}</td>
                        <td className="py-3 px-3">
                          <span
                            className="ledger-mono inline-block rounded px-2 py-0.5 text-xs font-bold"
                            style={{
                              backgroundColor: parseFloat(s.gpa) >= 3.8 ? THEME.okLight : THEME.paper,
                              color: parseFloat(s.gpa) >= 3.8 ? THEME.ok : THEME.ink,
                            }}
                          >
                            {s.gpa}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <StatusStamp status={s.status} />
                        </td>
                        <td className="py-3 pr-5 pl-3 text-right">
                          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => onSelectStudent(s)}
                              className="rounded p-1.5 text-stone-500 hover:bg-stone-100 hover:text-stone-800"
                              title="Full student profile"
                            >
                              <BookOpen size={14} />
                            </button>
                            <button
                              onClick={() => onEditStudent(s)}
                              className="rounded p-1.5 text-stone-500 hover:bg-stone-100 hover:text-stone-800"
                              title="Amend record"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => onDeleteStudent(s.id)}
                              className="rounded p-1.5 text-red-600 hover:bg-red-50"
                              title="Delete record"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable row quick glance */}
                      {isExpanded && (
                        <tr style={{ backgroundColor: THEME.paperDark }}>
                          <td colSpan={7} className="px-5 py-4 border-b" style={{ borderColor: THEME.rule }}>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 text-xs">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                                  Contact Phone
                                </span>
                                <span className="text-stone-800 mt-0.5 block">{s.phone || "Not provided"}</span>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                                  Credits Earned
                                </span>
                                <span className="text-stone-800 mt-0.5 block font-mono">{s.credits || 0} credits</span>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                                  Attendance Rate
                                </span>
                                <span className="text-stone-800 mt-0.5 block">{s.attendance || "N/A"}</span>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                                  Hometown
                                </span>
                                <span className="text-stone-800 mt-0.5 block">{s.hometown || "Campus Resident"}</span>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between border-t pt-3" style={{ borderColor: THEME.ruleLight }}>
                              <p className="text-[11px] text-stone-600 italic">
                                "{s.bio || "No biographical notes on file."}"
                              </p>
                              <button
                                onClick={() => onSelectStudent(s)}
                                className="text-xs font-semibold text-amber-800 hover:underline flex-shrink-0 ml-4"
                              >
                                Open Complete Profile →
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARD GRID VIEW */
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredStudents.map((s) => (
            <div
              key={s.id}
              className="group overflow-hidden rounded-lg border shadow-xs transition-all hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
              style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
            >
              {/* Card top banner with photo avatar */}
              <div className="relative p-5 pb-0">
                <div className="flex items-start justify-between">
                  <div className="relative">
                    <SafeImage
                      src={s.avatar}
                      alt={s.name}
                      fallbackText={s.name}
                      className="h-16 w-16 rounded-full border-2 shadow-xs"
                    />
                    <span
                      className="ledger-mono absolute -bottom-1.5 -right-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-xs"
                      style={{
                        backgroundColor: parseFloat(s.gpa) >= 3.8 ? THEME.ok : THEME.brass,
                        color: "#FFFFFF",
                      }}
                    >
                      {s.gpa}
                    </span>
                  </div>
                  <StatusStamp status={s.status} />
                </div>

                <div className="mt-3">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-lg font-bold line-clamp-1" style={{ color: THEME.ink }}>
                      {s.name}
                    </h3>
                  </div>
                  <p className="ledger-mono text-xs text-stone-400">{s.id}</p>
                  <p className="text-xs font-medium mt-1" style={{ color: THEME.brassDark }}>
                    {s.major}
                  </p>
                  <p className="text-[11px] text-stone-500">{s.grade} · {s.credits || 0} credits</p>
                </div>
              </div>

              {/* Bio & Enrolled courses preview */}
              <div className="px-5 py-3">
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {s.bio || "Active scholar in good academic standing."}
                </p>

                {s.enrolledCourses && s.enrolledCourses.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {s.enrolledCourses.map((c) => (
                      <span
                        key={c}
                        className="ledger-mono rounded px-1.5 py-0.5 text-[10px] font-medium"
                        style={{ backgroundColor: THEME.paper, color: THEME.inkSoft }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer actions */}
              <div
                className="border-t p-3.5 flex items-center justify-between"
                style={{ backgroundColor: THEME.paper, borderColor: THEME.ruleLight }}
              >
                <button
                  onClick={() => onSelectStudent(s)}
                  className="text-xs font-semibold hover:underline"
                  style={{ color: THEME.brassDark }}
                >
                  View Details
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditStudent(s)}
                    className="rounded p-1.5 text-stone-500 hover:bg-stone-200"
                    title="Edit record"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => onDeleteStudent(s.id)}
                    className="rounded p-1.5 text-red-600 hover:bg-red-100"
                    title="Delete record"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Complete Student Profile Modal / Drawer */}
      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(30,41,59,0.55)", backdropFilter: "blur(2px)" }}
          onClick={() => onSelectStudent(null)}
        >
          <div
            className="relative w-full max-w-xl overflow-hidden rounded-lg border shadow-2xl animate-fade-in"
            style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header banner */}
            <div
              className="relative px-6 py-6 border-b flex items-start justify-between"
              style={{ backgroundColor: THEME.paperDark, borderColor: THEME.rule }}
            >
              <div className="flex items-center gap-4">
                <SafeImage
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  fallbackText={selectedStudent.name}
                  className="h-20 w-20 rounded-full border-2 border-white shadow-md object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="ledger-mono text-xs font-semibold text-stone-500">
                      {selectedStudent.id}
                    </span>
                    <StatusStamp status={selectedStudent.status} />
                  </div>
                  <h2 className="font-serif text-2xl font-bold mt-0.5" style={{ color: THEME.ink }}>
                    {selectedStudent.name}
                  </h2>
                  <p className="text-xs text-stone-600">
                    {selectedStudent.major} · {selectedStudent.grade}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onSelectStudent(null)}
                className="rounded-full p-1.5 text-stone-500 hover:bg-stone-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Academic Metrics Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded border p-3 text-center" style={{ backgroundColor: THEME.paper, borderColor: THEME.ruleLight }}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Cumulative GPA
                  </span>
                  <span className="font-serif text-2xl font-bold mt-1 block" style={{ color: THEME.ok }}>
                    {selectedStudent.gpa}
                  </span>
                  <span className="text-[10px] text-stone-500">Max 4.00</span>
                </div>
                <div className="rounded border p-3 text-center" style={{ backgroundColor: THEME.paper, borderColor: THEME.ruleLight }}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Credits Completed
                  </span>
                  <span className="font-serif text-2xl font-bold mt-1 block" style={{ color: THEME.ink }}>
                    {selectedStudent.credits || 45}
                  </span>
                  <span className="text-[10px] text-stone-500">Degree Req: 120</span>
                </div>
                <div className="rounded border p-3 text-center" style={{ backgroundColor: THEME.paper, borderColor: THEME.ruleLight }}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Lecture Attendance
                  </span>
                  <span className="font-serif text-2xl font-bold mt-1 block" style={{ color: THEME.ink }}>
                    {selectedStudent.attendance || "94%"}
                  </span>
                  <span className="text-[10px] text-stone-500">Verified</span>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Contact & Residence Details
                </h4>
                <div className="rounded border p-3 space-y-2 text-xs" style={{ backgroundColor: THEME.paper, borderColor: THEME.ruleLight }}>
                  <div className="flex items-center gap-2 text-stone-700">
                    <Mail size={14} className="text-stone-400" />
                    <span>{selectedStudent.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-700">
                    <Phone size={14} className="text-stone-400" />
                    <span>{selectedStudent.phone || "+1 (555) 000-0000"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-700">
                    <MapPin size={14} className="text-stone-400" />
                    <span>{selectedStudent.hometown || "Main Campus Hall"}</span>
                  </div>
                </div>
              </div>

              {/* Biographical note */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                  Dean's Dossier & Notes
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed bg-amber-50/50 rounded border p-3" style={{ borderColor: THEME.ruleLight }}>
                  {selectedStudent.bio || "No administrative disciplinary actions or sanctions recorded. In full good standing."}
                </p>
              </div>

              {/* Enrolled Courses */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Current Course Enrollment
                </h4>
                <div className="space-y-1.5">
                  {(selectedStudent.enrolledCourses || ["CS-201", "MATH-240"]).map((code) => {
                    const courseObj = courses.find((c) => c.code === code);
                    return (
                      <div
                        key={code}
                        className="flex items-center justify-between rounded border p-2 text-xs"
                        style={{ backgroundColor: THEME.paper, borderColor: THEME.ruleLight }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="ledger-mono font-bold" style={{ color: THEME.ink }}>
                            {code}
                          </span>
                          <span className="text-stone-600">
                            {courseObj ? courseObj.title : "University Lecture"}
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-500 font-medium">
                          {courseObj ? `${courseObj.credits} Credits` : "3 Credits"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="border-t p-4 flex items-center justify-between"
              style={{ backgroundColor: THEME.paperDark, borderColor: THEME.rule }}
            >
              <button
                onClick={() => {
                  const toEdit = selectedStudent;
                  onSelectStudent(null);
                  onEditStudent(toEdit);
                }}
                className="rounded border px-4 py-1.5 text-xs font-semibold hover:bg-stone-200"
                style={{ borderColor: THEME.rule, color: THEME.ink }}
              >
                Amend Record
              </button>
              <button
                onClick={() => onSelectStudent(null)}
                className="rounded px-4 py-1.5 text-xs font-semibold text-white shadow-xs"
                style={{ backgroundColor: THEME.brass }}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
