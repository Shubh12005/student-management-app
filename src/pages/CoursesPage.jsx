import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Search,
  Users,
  Clock,
  MapPin,
  Plus,
  X,
  GraduationCap,
  Sparkles,
  Calendar
} from "lucide-react";
import SafeImage from "../components/SafeImage";
import { THEME, MAJORS } from "../mockData";

export default function CoursesPage({
  courses,
  students,
  onAddCourse,
  onSelectStudent,
}) {
  const [query, setQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [activeCourseModal, setActiveCourseModal] = useState(null);
  const [showAddCourse, setShowAddCourse] = useState(false);

  // New course form state
  const [newCourse, setNewCourse] = useState({
    code: "",
    title: "",
    department: MAJORS[0],
    instructor: "",
    credits: 4,
    schedule: "Mon / Wed · 10:00 AM – 11:30 AM",
    room: "Academic Quad 101",
    capacity: 40,
    enrolled: 1,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    description: "",
  });

  // Filter courses
  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => {
      const matchesQuery =
        !q ||
        c.code.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q);

      const matchesDept = selectedDept === "All" || c.department === selectedDept;

      return matchesQuery && matchesDept;
    });
  }, [courses, query, selectedDept]);

  function handleCreateCourse(e) {
    e.preventDefault();
    if (!newCourse.code || !newCourse.title || !newCourse.instructor) return;
    onAddCourse(newCourse);
    setShowAddCourse(false);
    setNewCourse({
      code: "",
      title: "",
      department: MAJORS[0],
      instructor: "",
      credits: 4,
      schedule: "Mon / Wed · 10:00 AM – 11:30 AM",
      room: "Academic Quad 101",
      capacity: 40,
      enrolled: 1,
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
      description: "",
    });
  }

  // Get enrolled students for a specific course
  function getCourseStudents(courseCode) {
    return students.filter((s) => s.enrolledCourses && s.enrolledCourses.includes(courseCode));
  }

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
              Academic Catalog
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold" style={{ color: THEME.ink }}>
            Courses & Curriculum
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {courses.length} active courses · Fall Term 2026 syllabus roster
          </p>
        </div>

        <button
          onClick={() => setShowAddCourse(true)}
          className="flex items-center gap-2 rounded px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:brightness-110 active:scale-95 self-start md:self-auto"
          style={{ backgroundColor: THEME.brass }}
        >
          <Plus size={15} strokeWidth={2.5} />
          Create Course Offering
        </button>
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
              placeholder="Search by course code, title, professor, department…"
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

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div
          className="rounded-lg border p-12 text-center shadow-sm"
          style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
        >
          <p className="font-serif text-lg font-bold" style={{ color: THEME.ink }}>
            No courses match your query
          </p>
          <p className="text-xs text-stone-500 mt-1">
            Try adjusting your search criteria or clear the department filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((c) => {
            const courseEnrolledList = getCourseStudents(c.code);
            const fillRate = Math.min(100, Math.round((c.enrolled / c.capacity) * 100));
            const isAlmostFull = fillRate >= 90;

            return (
              <div
                key={c.code}
                className="group flex flex-col justify-between overflow-hidden rounded-lg border shadow-xs transition-all hover:-translate-y-1 hover:shadow-md"
                style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
              >
                {/* Course Cover Image Banner */}
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-stone-200">
                    <SafeImage
                      src={c.image}
                      alt={c.title}
                      fallbackType="image"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="ledger-mono rounded bg-white/95 px-2.5 py-1 text-xs font-bold text-stone-900 shadow-sm backdrop-blur-xs">
                        {c.code}
                      </span>
                      <span className="rounded bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs">
                        {c.department}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="rounded-full bg-amber-500/90 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
                        {c.credits} Credits
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-serif text-lg font-bold leading-snug line-clamp-1 text-white drop-shadow-xs">
                        {c.title}
                      </h3>
                      <p className="text-xs text-stone-200 mt-0.5">
                        {c.instructor}
                      </p>
                    </div>
                  </div>

                  {/* Course Details Content */}
                  <div className="p-5 space-y-4">
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>

                    <div className="space-y-2 text-xs text-stone-600 border-t pt-3" style={{ borderColor: THEME.ruleLight }}>
                      <div className="flex items-center gap-2">
                        <Clock size={13} className="text-stone-400" />
                        <span>{c.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-stone-400" />
                        <span>{c.room}</span>
                      </div>
                    </div>

                    {/* Enrollment Bar */}
                    <div className="border-t pt-3" style={{ borderColor: THEME.ruleLight }}>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="text-stone-500">
                          Class Capacity: <span className="font-medium text-stone-800">{c.enrolled} / {c.capacity}</span>
                        </span>
                        <span
                          className="font-semibold text-[11px]"
                          style={{ color: isAlmostFull ? THEME.danger : THEME.ok }}
                        >
                          {isAlmostFull ? "Seats Limited" : `${fillRate}% filled`}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${fillRate}%`,
                            backgroundColor: isAlmostFull ? THEME.danger : THEME.brass,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div
                  className="border-t p-3.5 flex items-center justify-between"
                  style={{ backgroundColor: THEME.paper, borderColor: THEME.ruleLight }}
                >
                  <div className="flex items-center -space-x-1.5 overflow-hidden">
                    {courseEnrolledList.slice(0, 4).map((s) => (
                      <SafeImage
                        key={s.id}
                        src={s.avatar}
                        alt={s.name}
                        fallbackText={s.name}
                        className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                      />
                    ))}
                    {courseEnrolledList.length > 4 && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-200 text-[10px] font-bold text-stone-700 ring-2 ring-white">
                        +{courseEnrolledList.length - 4}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveCourseModal(c)}
                    className="text-xs font-semibold hover:underline"
                    style={{ color: THEME.brassDark }}
                  >
                    View Roster & Syllabus →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Course Detail / Roster Modal */}
      {activeCourseModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(30,41,59,0.55)", backdropFilter: "blur(2px)" }}
          onClick={() => setActiveCourseModal(null)}
        >
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-lg border shadow-2xl animate-fade-in"
            style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Cover Image */}
            <div className="relative h-48 w-full bg-stone-800">
              <SafeImage
                src={activeCourseModal.image}
                alt={activeCourseModal.title}
                fallbackType="image"
                className="h-full w-full object-cover brightness-[0.6]"
              />
              <button
                onClick={() => setActiveCourseModal(null)}
                className="absolute top-4 right-4 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 backdrop-blur-xs"
              >
                <X size={18} />
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="ledger-mono rounded bg-white/95 px-2 py-0.5 text-xs font-bold text-stone-900">
                    {activeCourseModal.code}
                  </span>
                  <span className="text-xs text-stone-200">
                    {activeCourseModal.department} · {activeCourseModal.credits} Credits
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-bold leading-tight drop-shadow-xs">
                  {activeCourseModal.title}
                </h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="rounded border p-3" style={{ backgroundColor: THEME.paper, borderColor: THEME.ruleLight }}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Instructor
                  </span>
                  <span className="font-serif text-sm font-bold text-stone-800 mt-1 block">
                    {activeCourseModal.instructor}
                  </span>
                </div>
                <div className="rounded border p-3" style={{ backgroundColor: THEME.paper, borderColor: THEME.ruleLight }}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Meeting Schedule & Hall
                  </span>
                  <span className="text-xs text-stone-800 mt-1 block font-medium">
                    {activeCourseModal.schedule} ({activeCourseModal.room})
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                  Course Synopsis & Objectives
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {activeCourseModal.description} Designed for matriculated undergraduate degree candidates. Weekly lab sessions and research reviews required.
                </p>
              </div>

              {/* Enrolled Students Roster */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Enrolled Student Roster ({getCourseStudents(activeCourseModal.code).length})
                  </h4>
                  <span className="text-xs text-stone-500">
                    {activeCourseModal.capacity - activeCourseModal.enrolled} seats remaining
                  </span>
                </div>

                <div className="rounded border divide-y" style={{ borderColor: THEME.ruleLight }}>
                  {getCourseStudents(activeCourseModal.code).length === 0 ? (
                    <div className="p-4 text-center text-xs text-stone-500">
                      No students are currently linked to this roster.
                    </div>
                  ) : (
                    getCourseStudents(activeCourseModal.code).map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          setActiveCourseModal(null);
                          onSelectStudent(s);
                        }}
                        className="flex items-center justify-between p-3 hover:bg-stone-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <SafeImage
                            src={s.avatar}
                            alt={s.name}
                            fallbackText={s.name}
                            className="h-8 w-8 rounded-full border"
                          />
                          <div>
                            <p className="font-serif text-xs font-bold text-stone-800">
                              {s.name}
                            </p>
                            <p className="text-[11px] text-stone-400">
                              {s.id} · {s.major}
                            </p>
                          </div>
                        </div>
                        <span className="ledger-mono text-xs font-bold text-stone-700">
                          GPA {s.gpa}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="border-t p-4 flex justify-end"
              style={{ backgroundColor: THEME.paperDark, borderColor: THEME.rule }}
            >
              <button
                onClick={() => setActiveCourseModal(null)}
                className="rounded px-4 py-1.5 text-xs font-semibold text-white"
                style={{ backgroundColor: THEME.ink }}
              >
                Close Syllabus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showAddCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(30,41,59,0.55)", backdropFilter: "blur(2px)" }}
          onClick={() => setShowAddCourse(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-lg border shadow-2xl animate-fade-in"
            style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ backgroundColor: THEME.paperDark, borderColor: THEME.rule }}>
              <h3 className="font-serif text-xl font-bold" style={{ color: THEME.ink }}>
                Create New Course Offering
              </h3>
              <button onClick={() => setShowAddCourse(false)} className="text-stone-500 hover:text-stone-800">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Course Code *
                  </label>
                  <input
                    required
                    placeholder="e.g. CS-310"
                    value={newCourse.code}
                    onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                    className="w-full rounded border px-3 py-2 text-xs outline-none"
                    style={{ borderColor: THEME.rule }}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Credits
                  </label>
                  <select
                    value={newCourse.credits}
                    onChange={(e) => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) })}
                    className="w-full rounded border px-3 py-2 text-xs outline-none"
                    style={{ borderColor: THEME.rule }}
                  >
                    <option value={1}>1 Credit</option>
                    <option value={2}>2 Credits</option>
                    <option value={3}>3 Credits</option>
                    <option value={4}>4 Credits</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Course Title *
                  </label>
                  <input
                    required
                    placeholder="e.g. Distributed Operating Systems"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    className="w-full rounded border px-3 py-2 text-xs outline-none"
                    style={{ borderColor: THEME.rule }}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Academic Department
                  </label>
                  <select
                    value={newCourse.department}
                    onChange={(e) => setNewCourse({ ...newCourse, department: e.target.value })}
                    className="w-full rounded border px-3 py-2 text-xs outline-none"
                    style={{ borderColor: THEME.rule }}
                  >
                    {MAJORS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Instructor *
                  </label>
                  <input
                    required
                    placeholder="e.g. Dr. Alan Turing"
                    value={newCourse.instructor}
                    onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                    className="w-full rounded border px-3 py-2 text-xs outline-none"
                    style={{ borderColor: THEME.rule }}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Schedule
                  </label>
                  <input
                    value={newCourse.schedule}
                    onChange={(e) => setNewCourse({ ...newCourse, schedule: e.target.value })}
                    className="w-full rounded border px-3 py-2 text-xs outline-none"
                    style={{ borderColor: THEME.rule }}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Room / Hall
                  </label>
                  <input
                    value={newCourse.room}
                    onChange={(e) => setNewCourse({ ...newCourse, room: e.target.value })}
                    className="w-full rounded border px-3 py-2 text-xs outline-none"
                    style={{ borderColor: THEME.rule }}
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Course Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of lecture curriculum..."
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    className="w-full rounded border px-3 py-2 text-xs outline-none"
                    style={{ borderColor: THEME.rule }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t" style={{ borderColor: THEME.ruleLight }}>
                <button
                  type="button"
                  onClick={() => setShowAddCourse(false)}
                  className="rounded border px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100"
                  style={{ borderColor: THEME.rule }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded px-4 py-2 text-xs font-semibold text-white shadow-xs"
                  style={{ backgroundColor: THEME.brass }}
                >
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
