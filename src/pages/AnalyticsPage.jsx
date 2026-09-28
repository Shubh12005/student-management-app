import React from "react";
import {
  TrendingUp,
  Download,
  Award,
  BookOpen,
  GraduationCap,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet
} from "lucide-react";
import SafeImage from "../components/SafeImage";
import { THEME } from "../mockData";

export default function AnalyticsPage({
  students,
  courses,
  faculty,
  onSelectStudent,
}) {
  const total = students.length;

  // GPA Distribution calculation
  const deansList = students.filter((s) => parseFloat(s.gpa) >= 3.8);
  const highHonors = students.filter((s) => parseFloat(s.gpa) >= 3.5 && parseFloat(s.gpa) < 3.8);
  const goodStanding = students.filter((s) => parseFloat(s.gpa) >= 3.0 && parseFloat(s.gpa) < 3.5);
  const academicNotice = students.filter((s) => parseFloat(s.gpa) < 3.0);

  const gpaTiers = [
    {
      label: "Dean's List",
      range: "3.80 – 4.00",
      count: deansList.length,
      pct: total > 0 ? Math.round((deansList.length / total) * 100) : 0,
      color: THEME.ok,
      bg: THEME.okLight,
      badge: "High Academic Distinction",
    },
    {
      label: "Honors Standing",
      range: "3.50 – 3.79",
      count: highHonors.length,
      pct: total > 0 ? Math.round((highHonors.length / total) * 100) : 0,
      color: THEME.brassDark,
      bg: THEME.brassLight,
      badge: "Commended",
    },
    {
      label: "Good Standing",
      range: "3.00 – 3.49",
      count: goodStanding.length,
      pct: total > 0 ? Math.round((goodStanding.length / total) * 100) : 0,
      color: THEME.info,
      bg: THEME.infoLight,
      badge: "Satisfactory Progress",
    },
    {
      label: "Academic Review",
      range: "< 3.00",
      count: academicNotice.length,
      pct: total > 0 ? Math.round((academicNotice.length / total) * 100) : 0,
      color: THEME.danger,
      bg: THEME.dangerLight,
      badge: "Advising Recommended",
    },
  ];

  // Department analysis
  const deptMap = {};
  students.forEach((s) => {
    if (!deptMap[s.major]) {
      deptMap[s.major] = { students: [], totalGpa: 0 };
    }
    deptMap[s.major].students.push(s);
    deptMap[s.major].totalGpa += parseFloat(s.gpa);
  });

  const deptStats = Object.entries(deptMap).map(([major, data]) => {
    const count = data.students.length;
    const avg = count > 0 ? (data.totalGpa / count).toFixed(2) : "0.00";
    const top = [...data.students].sort((a, b) => parseFloat(b.gpa) - parseFloat(a.gpa))[0];
    return {
      major,
      count,
      avgGpa: avg,
      topStudent: top,
    };
  });

  // Export to CSV helper
  function exportCSV() {
    const headers = ["ID,Name,Major,Grade,GPA,Status,Email,Credits,Attendance\n"];
    const rows = students.map(
      (s) =>
        `"${s.id}","${s.name}","${s.major}","${s.grade}","${s.gpa}","${s.status}","${s.email}","${s.credits || 0}","${s.attendance || "N/A"}"`
    );
    const blob = new Blob([headers.concat(rows.join("\n"))], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `student_ledger_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              Academic Reporting & Quality Assurance
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold" style={{ color: THEME.ink }}>
            Performance & Analytics Ledger
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Institutional metric summaries, GPA bands, and department grade distributions
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 rounded px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:brightness-110 active:scale-95 self-start md:self-auto"
          style={{ backgroundColor: THEME.ink }}
        >
          <Download size={14} />
          Export Student Ledger (.CSV)
        </button>
      </div>

      {/* GPA Tier Breakdown Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {gpaTiers.map((tier) => (
          <div
            key={tier.label}
            className="rounded-lg border p-5 shadow-xs"
            style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
          >
            <div className="flex items-center justify-between">
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: tier.bg, color: tier.color }}
              >
                {tier.range}
              </span>
              <span className="text-xs font-bold text-stone-400">{tier.pct}%</span>
            </div>

            <h3 className="font-serif text-2xl font-bold mt-3" style={{ color: THEME.ink }}>
              {tier.count} <span className="text-xs font-normal text-stone-500">students</span>
            </h3>
            <p className="text-xs font-semibold mt-1" style={{ color: tier.color }}>
              {tier.label}
            </p>
            <p className="text-[11px] text-stone-400 mt-0.5">{tier.badge}</p>

            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${tier.pct}%`, backgroundColor: tier.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Department Performance Matrix */}
      <div
        className="rounded-lg border shadow-sm overflow-hidden"
        style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
      >
        <div className="p-6 border-b" style={{ borderColor: THEME.ruleLight }}>
          <h2 className="font-serif text-xl font-bold" style={{ color: THEME.ink }}>
            Departmental Academic Performance Matrix
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Cross-discipline GPA comparison and top scholar recognition
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr
                className="border-b text-[11px] font-semibold uppercase tracking-wider"
                style={{ backgroundColor: THEME.paperDark, borderColor: THEME.rule, color: THEME.inkSoft }}
              >
                <th className="py-3.5 pl-6 pr-3">Academic Department</th>
                <th className="py-3.5 px-3">Enrolled Scholars</th>
                <th className="py-3.5 px-3">Average GPA</th>
                <th className="py-3.5 px-3">Academic Standing</th>
                <th className="py-3.5 pr-6 pl-3">Top Performing Student</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: THEME.ruleLight }}>
              {deptStats.map((d) => (
                <tr key={d.major} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 pl-6 pr-3 font-semibold" style={{ color: THEME.ink }}>
                    {d.major}
                  </td>
                  <td className="py-3.5 px-3 text-stone-600">
                    {d.count} {d.count === 1 ? "student" : "students"}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className="ledger-mono inline-block rounded px-2 py-0.5 text-xs font-bold"
                      style={{ backgroundColor: THEME.paper, color: THEME.ink }}
                    >
                      {d.avgGpa}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className="inline-flex items-center gap-1 text-xs font-medium"
                      style={{ color: parseFloat(d.avgGpa) >= 3.6 ? THEME.ok : THEME.brassDark }}
                    >
                      <CheckCircle2 size={13} />
                      {parseFloat(d.avgGpa) >= 3.6 ? "Exceeding Benchmark" : "Standard Progress"}
                    </span>
                  </td>
                  <td className="py-3.5 pr-6 pl-3">
                    {d.topStudent ? (
                      <div
                        onClick={() => onSelectStudent(d.topStudent)}
                        className="flex items-center gap-2.5 cursor-pointer group"
                      >
                        <SafeImage
                          src={d.topStudent.avatar}
                          alt={d.topStudent.name}
                          fallbackText={d.topStudent.name}
                          className="h-7 w-7 rounded-full border shadow-2xs"
                        />
                        <span className="font-serif text-xs font-semibold text-stone-800 group-hover:underline">
                          {d.topStudent.name} ({d.topStudent.gpa})
                        </span>
                      </div>
                    ) : (
                      <span className="text-stone-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dean's Honor Roll Spotlight Grid */}
      <div
        className="rounded-lg border p-6 shadow-sm"
        style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award size={18} style={{ color: THEME.brassDark }} />
            <h2 className="font-serif text-xl font-bold" style={{ color: THEME.ink }}>
              Dean's Honor Roll Cohort ({deansList.length})
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Threshold: GPA ≥ 3.80
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {deansList.map((s) => (
            <div
              key={s.id}
              onClick={() => onSelectStudent(s)}
              className="group cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md hover:border-amber-300 flex items-center gap-3.5"
              style={{ backgroundColor: THEME.paper, borderColor: THEME.ruleLight }}
            >
              <SafeImage
                src={s.avatar}
                alt={s.name}
                fallbackText={s.name}
                className="h-12 w-12 rounded-full border-2 border-white shadow-xs object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between">
                  <h4 className="font-serif text-sm font-bold truncate group-hover:text-amber-800 transition-colors" style={{ color: THEME.ink }}>
                    {s.name}
                  </h4>
                  <span className="ledger-mono text-xs font-bold" style={{ color: THEME.ok }}>
                    {s.gpa}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 truncate">{s.major}</p>
                <span className="text-[10px] text-stone-400">{s.grade}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
