import React from "react";
import {
  GraduationCap,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  UserPlus,
  FileSpreadsheet,
  ArrowUpRight,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  AlertCircle
} from "lucide-react";
import SafeImage from "../components/SafeImage";
import { THEME, CAMPUS_BANNER } from "../mockData";

export default function DashboardPage({
  students,
  courses,
  faculty,
  activities,
  onNavigate,
  onOpenAddStudent,
  onSelectStudent,
}) {
  // Compute real-time analytics
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === "Active").length;
  const activeRate = totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0;
  
  const gpaList = students.map((s) => parseFloat(s.gpa)).filter((g) => !isNaN(g));
  const avgGpa = gpaList.length > 0 ? (gpaList.reduce((a, b) => a + b, 0) / gpaList.length).toFixed(2) : "0.00";
  const deansListCount = students.filter((s) => parseFloat(s.gpa) >= 3.8).length;
  
  const totalCourses = courses.length;
  const totalEnrolledSeats = courses.reduce((acc, c) => acc + (c.enrolled || 0), 0);
  const totalCapacity = courses.reduce((acc, c) => acc + (c.capacity || 0), 0);
  const courseCapacityPercent = totalCapacity > 0 ? Math.round((totalEnrolledSeats / totalCapacity) * 100) : 0;
  
  const studentFacultyRatio = faculty.length > 0 ? (totalStudents / faculty.length).toFixed(1) : "0";

  // Major distribution
  const majorCounts = students.reduce((acc, s) => {
    acc[s.major] = (acc[s.major] || 0) + 1;
    return acc;
  }, {});

  const sortedMajors = Object.entries(majorCounts).sort((a, b) => b[1] - a[1]);

  // Class year distribution
  const yearCounts = {
    Freshman: students.filter((s) => s.grade === "Freshman").length,
    Sophomore: students.filter((s) => s.grade === "Sophomore").length,
    Junior: students.filter((s) => s.grade === "Junior").length,
    Senior: students.filter((s) => s.grade === "Senior").length,
  };

  // Top students (GPA descending)
  const topStudents = [...students]
    .sort((a, b) => parseFloat(b.gpa) - parseFloat(a.gpa))
    .slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Campus Banner */}
      <div
        className="relative overflow-hidden rounded-lg border shadow-sm"
        style={{ borderColor: THEME.rule }}
      >
        <div className="absolute inset-0 z-0">
          <img
            src={CAMPUS_BANNER}
            alt="University Campus"
            className="h-full w-full object-cover brightness-[0.38]"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(30,41,59,0.92) 0%, rgba(30,41,59,0.7) 60%, rgba(30,41,59,0.4) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-12 text-white">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-md"
              style={{ backgroundColor: "rgba(169, 128, 62, 0.4)", color: "#FDE68A", border: "1px solid rgba(253, 230, 138, 0.4)" }}
            >
              <Sparkles size={13} />
              Fall Academic Term 2026
            </span>
            <span className="text-xs text-stone-300">
              Week 6 · Census Certified
            </span>
          </div>

          <div className="max-w-2xl">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-white mb-2">
              University Registrar Dashboard
            </h1>
            <p className="text-sm sm:text-base text-stone-200 font-normal leading-relaxed mb-6">
              Welcome back, Administrator. Oversee matriculation records, track real-time departmental enrollments, and manage university academic standing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenAddStudent}
              className="inline-flex items-center gap-2 rounded px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:brightness-110 active:scale-95"
              style={{ backgroundColor: THEME.brass }}
            >
              <UserPlus size={16} strokeWidth={2.2} />
              Enroll New Student
            </button>
            <button
              onClick={() => onNavigate("students")}
              className="inline-flex items-center gap-2 rounded px-4 py-2.5 text-sm font-medium text-white border transition-colors hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.3)" }}
            >
              <Users size={16} />
              Browse Student Ledger
            </button>
            <button
              onClick={() => onNavigate("analytics")}
              className="inline-flex items-center gap-2 rounded px-4 py-2.5 text-sm font-medium text-stone-200 hover:text-white transition-colors"
            >
              <FileSpreadsheet size={16} />
              Generate Term Reports
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Students */}
        <div
          className="rounded-lg border p-5 shadow-sm transition-transform hover:-translate-y-0.5"
          style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: THEME.inkSoft }}>
                Enrolled Students
              </p>
              <h3 className="mt-2 font-serif text-3xl font-bold" style={{ color: THEME.ink }}>
                {totalStudents}
              </h3>
            </div>
            <div
              className="rounded-lg p-2.5"
              style={{ backgroundColor: THEME.brassLight, color: THEME.brassDark }}
            >
              <GraduationCap size={22} strokeWidth={2} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t pt-3" style={{ borderColor: THEME.ruleLight }}>
            <span className="text-xs font-medium" style={{ color: THEME.ok }}>
              {activeStudents} Active ({activeRate}%)
            </span>
            <span className="text-xs text-stone-500">
              {totalStudents - activeStudents} On Leave
            </span>
          </div>
        </div>

        {/* Average GPA */}
        <div
          className="rounded-lg border p-5 shadow-sm transition-transform hover:-translate-y-0.5"
          style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: THEME.inkSoft }}>
                Cumulative Average GPA
              </p>
              <h3 className="mt-2 font-serif text-3xl font-bold" style={{ color: THEME.ink }}>
                {avgGpa}
                <span className="text-base font-normal text-stone-400"> / 4.0</span>
              </h3>
            </div>
            <div
              className="rounded-lg p-2.5"
              style={{ backgroundColor: THEME.okLight, color: THEME.ok }}
            >
              <TrendingUp size={22} strokeWidth={2} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t pt-3" style={{ borderColor: THEME.ruleLight }}>
            <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: THEME.ok }}>
              <Award size={13} /> {deansListCount} Dean's Scholars
            </span>
            <span className="text-xs text-stone-500">Tier: High Honors</span>
          </div>
        </div>

        {/* Active Courses */}
        <div
          className="rounded-lg border p-5 shadow-sm transition-transform hover:-translate-y-0.5"
          style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: THEME.inkSoft }}>
                Active Courses
              </p>
              <h3 className="mt-2 font-serif text-3xl font-bold" style={{ color: THEME.ink }}>
                {totalCourses}
              </h3>
            </div>
            <div
              className="rounded-lg p-2.5"
              style={{ backgroundColor: THEME.infoLight, color: THEME.info }}
            >
              <BookOpen size={22} strokeWidth={2} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t pt-3" style={{ borderColor: THEME.ruleLight }}>
            <span className="text-xs font-medium" style={{ color: THEME.ink }}>
              {totalEnrolledSeats} / {totalCapacity} Seats Filled
            </span>
            <span className="text-xs text-stone-500">{courseCapacityPercent}% util.</span>
          </div>
        </div>

        {/* Faculty Ratio */}
        <div
          className="rounded-lg border p-5 shadow-sm transition-transform hover:-translate-y-0.5"
          style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: THEME.inkSoft }}>
                Faculty Mentorship
              </p>
              <h3 className="mt-2 font-serif text-3xl font-bold" style={{ color: THEME.ink }}>
                {studentFacultyRatio} : 1
              </h3>
            </div>
            <div
              className="rounded-lg p-2.5"
              style={{ backgroundColor: THEME.purpleLight, color: THEME.purple }}
            >
              <Users size={22} strokeWidth={2} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t pt-3" style={{ borderColor: THEME.ruleLight }}>
            <span className="text-xs font-medium" style={{ color: THEME.ink }}>
              {faculty.length} Appointed Faculty
            </span>
            <span className="text-xs text-stone-500">6 Departments</span>
          </div>
        </div>
      </div>

      {/* Main Content Split: Departments & Top Students */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Department Enrollment Bars */}
        <div
          className="rounded-lg border p-6 shadow-sm lg:col-span-2"
          style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold" style={{ color: THEME.ink }}>
                Enrollment by Academic Major
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Distribution across active degree tracks for the current term
              </p>
            </div>
            <button
              onClick={() => onNavigate("students")}
              className="text-xs font-semibold flex items-center gap-1 hover:underline"
              style={{ color: THEME.brassDark }}
            >
              View all students <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="space-y-4">
            {sortedMajors.map(([major, count]) => {
              const pct = Math.round((count / totalStudents) * 100);
              return (
                <div key={major}>
                  <div className="mb-1 flex items-center justify-between text-xs font-medium">
                    <span style={{ color: THEME.ink }}>{major}</span>
                    <span style={{ color: THEME.inkSoft }}>
                      {count} {count === 1 ? "student" : "students"} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-stone-100">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor:
                          major === "Computer Science"
                            ? THEME.brass
                            : major === "Economics"
                            ? "#4F46E5"
                            : major === "Physics"
                            ? "#0284C7"
                            : major === "Biology"
                            ? "#16A34A"
                            : "#9333EA",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Class Year Breakdown Mini Cards */}
          <div className="mt-8 border-t pt-5" style={{ borderColor: THEME.ruleLight }}>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
              Cohort Progression (Class Level)
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Object.entries(yearCounts).map(([year, count]) => (
                <div
                  key={year}
                  className="rounded border p-3 text-center"
                  style={{ backgroundColor: THEME.paper, borderColor: THEME.ruleLight }}
                >
                  <span className="text-[11px] font-medium text-stone-500 block uppercase">
                    {year}
                  </span>
                  <span className="font-serif text-xl font-bold" style={{ color: THEME.ink }}>
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dean's Honor Roll Spotlight */}
        <div
          className="rounded-lg border p-6 shadow-sm flex flex-col justify-between"
          style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award size={18} style={{ color: THEME.brassDark }} />
                <h2 className="font-serif text-lg font-bold" style={{ color: THEME.ink }}>
                  Dean's Honor Roll
                </h2>
              </div>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: THEME.brassLight, color: THEME.brassDark }}
              >
                Top GPA
              </span>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              Students demonstrating exceptional academic achievement this term.
            </p>

            <div className="divide-y" style={{ borderColor: THEME.ruleLight }}>
              {topStudents.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onSelectStudent(s)}
                  className="flex items-center justify-between py-3 cursor-pointer rounded px-2 -mx-2 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <SafeImage
                      src={s.avatar}
                      alt={s.name}
                      fallbackText={s.name}
                      className="h-10 w-10 rounded-full border shadow-xs flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-serif text-sm font-semibold truncate" style={{ color: THEME.ink }}>
                        {s.name}
                      </p>
                      <p className="text-xs text-stone-500 truncate">
                        {s.major} · {s.grade}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <span
                      className="ledger-mono inline-block rounded px-2 py-0.5 text-xs font-bold"
                      style={{ backgroundColor: THEME.okLight, color: THEME.ok }}
                    >
                      {s.gpa}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate("analytics")}
            className="mt-4 w-full rounded border py-2 text-center text-xs font-semibold transition-colors hover:bg-stone-50"
            style={{ borderColor: THEME.rule, color: THEME.ink }}
          >
            View Full Academic Standing Report
          </button>
        </div>
      </div>

      {/* Course Highlights & Registrar Feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Featured Courses Showcase */}
        <div
          className="rounded-lg border p-6 shadow-sm lg:col-span-2"
          style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold" style={{ color: THEME.ink }}>
                Featured Curriculum Courses
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Key undergraduate lectures currently in session
              </p>
            </div>
            <button
              onClick={() => onNavigate("courses")}
              className="text-xs font-semibold flex items-center gap-1 hover:underline"
              style={{ color: THEME.brassDark }}
            >
              Browse all {courses.length} courses <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {courses.slice(0, 4).map((c) => (
              <div
                key={c.code}
                onClick={() => onNavigate("courses")}
                className="group cursor-pointer overflow-hidden rounded-md border transition-all hover:shadow-md"
                style={{ borderColor: THEME.ruleLight }}
              >
                <div className="relative h-28 w-full overflow-hidden bg-stone-200">
                  <SafeImage
                    src={c.image}
                    alt={c.title}
                    fallbackType="image"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2">
                    <span
                      className="ledger-mono rounded bg-white/95 px-2 py-0.5 text-[11px] font-bold shadow-xs backdrop-blur-xs"
                      style={{ color: THEME.ink }}
                    >
                      {c.code}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="rounded bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
                      {c.credits} Credits
                    </span>
                  </div>
                </div>

                <div className="p-3.5" style={{ backgroundColor: THEME.paper }}>
                  <h4 className="font-serif text-sm font-bold line-clamp-1 group-hover:text-amber-800 transition-colors" style={{ color: THEME.ink }}>
                    {c.title}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1">
                    {c.instructor} · {c.department}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-stone-500">
                    <span>{c.room}</span>
                    <span className="font-medium text-stone-700">
                      {c.enrolled} / {c.capacity} students
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Registrar Activity Log */}
        <div
          className="rounded-lg border p-6 shadow-sm"
          style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Clock size={16} style={{ color: THEME.brassDark }} />
            <h2 className="font-serif text-lg font-bold" style={{ color: THEME.ink }}>
              Ledger Notices & Activity
            </h2>
          </div>
          <p className="text-xs text-stone-500 mb-4">
            Recent administrative events logged in this session
          </p>

          <div className="space-y-4">
            {activities.map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs">
                <div
                  className="mt-0.5 rounded-full p-1.5 flex-shrink-0"
                  style={{
                    backgroundColor:
                      act.type === "success"
                        ? THEME.okLight
                        : act.type === "honor"
                        ? THEME.brassLight
                        : act.type === "warning"
                        ? THEME.dangerLight
                        : THEME.infoLight,
                    color:
                      act.type === "success"
                        ? THEME.ok
                        : act.type === "honor"
                        ? THEME.brassDark
                        : act.type === "warning"
                        ? THEME.danger
                        : THEME.info,
                  }}
                >
                  {act.type === "success" ? (
                    <CheckCircle2 size={13} />
                  ) : act.type === "honor" ? (
                    <Award size={13} />
                  ) : act.type === "warning" ? (
                    <AlertCircle size={13} />
                  ) : (
                    <Calendar size={13} />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold" style={{ color: THEME.ink }}>
                      {act.title}
                    </span>
                    <span className="text-[10px] text-stone-400 flex-shrink-0">
                      {act.time}
                    </span>
                  </div>
                  <p className="text-stone-500 mt-0.5 leading-relaxed">
                    {act.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-6 rounded border p-3 text-center text-xs"
            style={{ backgroundColor: THEME.paper, borderColor: THEME.ruleLight, color: THEME.inkSoft }}
          >
            All records synchronized with University Student Information System.
          </div>
        </div>
      </div>
    </div>
  );
}
