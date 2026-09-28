import React, { useState } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Users,
  BarChart3,
  Bell,
  Search,
  Plus,
  Menu,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from "lucide-react";

import {
  THEME,
  GRADES,
  MAJORS,
  initialStudents,
  initialCourses,
  initialFaculty,
  initialActivities,
} from "./mockData";

import DashboardPage from "./pages/DashboardPage";
import StudentsPage from "./pages/StudentsPage";
import CoursesPage from "./pages/CoursesPage";
import FacultyPage from "./pages/FacultyPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SafeImage from "./components/SafeImage";

// Serial counter for unique IDs
let nextSerial = 2050;
function makeId() {
  return `SR-${nextSerial++}`;
}

const emptyStudentForm = {
  name: "",
  grade: GRADES[0],
  major: MAJORS[0],
  email: "",
  phone: "",
  gpa: "3.50",
  status: "Active",
  credits: 15,
  attendance: "95%",
  bio: "",
  avatar: "",
};

export default function StudentManagementSystem() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [students, setStudents] = useState(initialStudents);
  const [courses, setCourses] = useState(initialCourses);
  const [faculty, setFaculty] = useState(initialFaculty);
  const [activities, setActivities] = useState(initialActivities);

  // Modals and selection state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState(null);

  function triggerToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }

  // Activity logger
  function logActivity(title, description, category, type = "info") {
    const newAct = {
      id: `ACT-${Date.now()}`,
      title,
      description,
      time: "Just now",
      category,
      type,
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 7)]);
  }

  // Add student
  function handleAddStudent(formData) {
    const defaultAvatars = [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    ];
    const chosenAvatar = formData.avatar || defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    const newStudent = {
      id: makeId(),
      ...formData,
      avatar: chosenAvatar,
      credits: parseInt(formData.credits) || 15,
      attendance: formData.attendance || "95%",
      enrolledCourses: ["CS-201"],
    };

    setStudents((prev) => [newStudent, ...prev]);
    setIsAddStudentOpen(false);
    triggerToast(`Enrolled ${newStudent.name} into the official ledger.`);
    logActivity(
      "New Matriculation Enrolled",
      `${newStudent.name} (${newStudent.id}) matriculated into ${newStudent.major}.`,
      "Enrollment",
      "success"
    );
  }

  // Update student
  function handleUpdateStudent(formData) {
    setStudents((prev) =>
      prev.map((s) => (s.id === editingStudent.id ? { ...s, ...formData } : s))
    );
    setEditingStudent(null);
    triggerToast(`Student record for ${formData.name} successfully amended.`);
    logActivity(
      "Ledger Record Amended",
      `Administrative updates saved for student ID ${editingStudent.id}.`,
      "Record",
      "info"
    );
  }

  // Delete student
  function handleDeleteStudent(id) {
    const studentToDelete = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setConfirmDeleteId(null);
    if (selectedStudent && selectedStudent.id === id) {
      setSelectedStudent(null);
    }
    triggerToast(`Student record struck from the ledger.`, "warning");
    logActivity(
      "Record Removed from Ledger",
      `Student ${studentToDelete ? studentToDelete.name : id} was removed from active rolls.`,
      "Status",
      "warning"
    );
  }

  // Add course
  function handleAddCourse(courseData) {
    setCourses((prev) => [courseData, ...prev]);
    triggerToast(`Course offering ${courseData.code} published.`);
    logActivity(
      "New Course Offering Published",
      `${courseData.code}: ${courseData.title} added to curriculum.`,
      "Curriculum",
      "success"
    );
  }

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { id: "students", label: "Students Ledger", icon: GraduationCap, badge: students.length },
    { id: "courses", label: "Courses & Classes", icon: BookOpen, badge: courses.length },
    { id: "faculty", label: "Faculty Directory", icon: Users, badge: faculty.length },
    { id: "analytics", label: "Reports & Analytics", icon: BarChart3, badge: null },
  ];

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row w-full text-slate-800"
      style={{ backgroundColor: THEME.paper }}
    >
      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 border-r flex flex-col justify-between ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundColor: THEME.paperDark, borderColor: THEME.rule }}
      >
        <div>
          {/* Institution Header Branding */}
          <div
            className="p-5 border-b flex items-center justify-between"
            style={{ borderColor: THEME.rule }}
          >
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center shadow-xs"
                style={{ backgroundColor: THEME.brass, color: "#FFFFFF" }}
              >
                <GraduationCap size={22} strokeWidth={2.2} />
              </div>
              <div>
                <span
                  className="ledger-sans text-[10px] font-bold uppercase tracking-widest block"
                  style={{ color: THEME.brassDark }}
                >
                  Office of Registrar
                </span>
                <h2 className="font-serif text-lg font-bold leading-tight" style={{ color: THEME.ink }}>
                  Student Ledger
                </h2>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-stone-500 hover:text-stone-800"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2 mt-2">
              University Management
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold transition-all ${
                    isActive
                      ? "shadow-xs text-white"
                      : "text-stone-700 hover:bg-stone-200/60"
                  }`}
                  style={{
                    backgroundColor: isActive ? THEME.ink : "transparent",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={17}
                      style={{ color: isActive ? "#FDE68A" : THEME.brassDark }}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span
                      className={`ledger-mono text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive
                          ? "bg-stone-700 text-stone-200"
                          : "bg-stone-200 text-stone-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-4 border-t space-y-3" style={{ borderColor: THEME.rule }}>
          <div
            className="rounded p-3 text-xs"
            style={{ backgroundColor: THEME.paper, border: `1px solid ${THEME.ruleLight}` }}
          >
            <div className="flex items-center gap-1.5 text-stone-500 mb-1">
              <Sparkles size={13} style={{ color: THEME.brassDark }} />
              <span className="font-bold uppercase tracking-wider text-[10px]">
                Active Term
              </span>
            </div>
            <p className="font-serif text-xs font-bold" style={{ color: THEME.ink }}>
              Fall Semester 2026
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Census: Regular Standing
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse" />
              System Online
            </span>
            <span className="ledger-mono text-[10px]">v2.4.0</span>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* TOP APP HEADER */}
        <header
          className="sticky top-0 z-20 border-b px-4 py-3 sm:px-8 flex items-center justify-between shadow-2xs backdrop-blur-md"
          style={{ backgroundColor: "rgba(248, 245, 238, 0.94)", borderColor: THEME.rule }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden rounded p-1.5 text-stone-600 hover:bg-stone-200"
            >
              <Menu size={20} />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="font-semibold text-stone-700">Campus:</span>
              <span
                className="rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[10px]"
                style={{ backgroundColor: THEME.brassLight, color: THEME.brassDark }}
              >
                Central University Quad
              </span>
            </div>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-3">
            {/* Quick action: Enroll Student */}
            <button
              onClick={() => setIsAddStudentOpen(true)}
              className="hidden sm:flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-all hover:brightness-110 active:scale-95"
              style={{ backgroundColor: THEME.brass }}
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>Enroll Student</span>
            </button>

            {/* Notifications Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-full p-2 text-stone-600 hover:bg-stone-200 transition-colors"
                title="Ledger Notices"
              >
                <Bell size={17} />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600" />
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div
                  className="absolute right-0 mt-2 w-80 rounded-lg border shadow-xl p-4 z-50 animate-fade-in"
                  style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
                >
                  <div className="flex items-center justify-between pb-2 border-b mb-3" style={{ borderColor: THEME.ruleLight }}>
                    <h4 className="font-serif text-sm font-bold" style={{ color: THEME.ink }}>
                      Registrar Notices & Log
                    </h4>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-stone-400 hover:text-stone-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="space-y-3 max-h-72 overflow-y-auto">
                    {activities.slice(0, 5).map((a) => (
                      <div key={a.id} className="text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-stone-800">{a.title}</span>
                          <span className="text-[10px] text-stone-400">{a.time}</span>
                        </div>
                        <p className="text-stone-500 text-[11px] mt-0.5">{a.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Admin User Profile Tag */}
            <div className="flex items-center gap-2 pl-2 border-l" style={{ borderColor: THEME.rule }}>
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center font-serif text-xs font-bold text-white shadow-2xs"
                style={{ backgroundColor: THEME.ink }}
              >
                RA
              </div>
              <div className="hidden lg:block text-left text-xs">
                <p className="font-semibold leading-tight text-stone-800">Registrar Admin</p>
                <p className="text-[10px] text-stone-400">Chief Matriculation</p>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && (
            <DashboardPage
              students={students}
              courses={courses}
              faculty={faculty}
              activities={activities}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenAddStudent={() => setIsAddStudentOpen(true)}
              onSelectStudent={(s) => setSelectedStudent(s)}
            />
          )}

          {activeTab === "students" && (
            <StudentsPage
              students={students}
              courses={courses}
              onAddStudent={() => setIsAddStudentOpen(true)}
              onEditStudent={(s) => setEditingStudent(s)}
              onDeleteStudent={(id) => setConfirmDeleteId(id)}
              selectedStudent={selectedStudent}
              onSelectStudent={(s) => setSelectedStudent(s)}
            />
          )}

          {activeTab === "courses" && (
            <CoursesPage
              courses={courses}
              students={students}
              onAddCourse={handleAddCourse}
              onSelectStudent={(s) => setSelectedStudent(s)}
            />
          )}

          {activeTab === "faculty" && (
            <FacultyPage
              faculty={faculty}
              courses={courses}
              onNavigateCourse={(code) => setActiveTab("courses")}
            />
          )}

          {activeTab === "analytics" && (
            <AnalyticsPage
              students={students}
              courses={courses}
              faculty={faculty}
              onSelectStudent={(s) => setSelectedStudent(s)}
            />
          )}
        </main>
      </div>

      {/* MODAL: ADD / ENROLL NEW STUDENT */}
      {isAddStudentOpen && (
        <StudentModal
          title="Enroll a New Student"
          initial={emptyStudentForm}
          onCancel={() => setIsAddStudentOpen(false)}
          onSave={handleAddStudent}
        />
      )}

      {/* MODAL: EDIT STUDENT */}
      {editingStudent && (
        <StudentModal
          title={`Amend Record — ${editingStudent.id}`}
          initial={editingStudent}
          onCancel={() => setEditingStudent(null)}
          onSave={handleUpdateStudent}
        />
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(30,41,59,0.55)", backdropFilter: "blur(2px)" }}
          onClick={() => setConfirmDeleteId(null)}
        >
          <div
            className="w-full max-w-sm rounded-lg border p-6 shadow-2xl animate-fade-in"
            style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold" style={{ color: THEME.ink }}>
                Permanently Strike from Ledger?
              </h3>
              <button onClick={() => setConfirmDeleteId(null)} className="text-stone-400 hover:text-stone-600">
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed mb-6">
              This will permanently strike{" "}
              <strong className="text-stone-900">
                {students.find((s) => s.id === confirmDeleteId)?.name}
              </strong>{" "}
              from the active rolls. This action is registered in the audit log.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="rounded border px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100"
                style={{ borderColor: THEME.rule }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteStudent(confirmDeleteId)}
                className="rounded px-4 py-2 text-xs font-semibold text-white shadow-xs"
                style={{ backgroundColor: THEME.danger }}
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-lg border px-4 py-3 shadow-xl animate-fade-in text-xs font-medium"
          style={{
            backgroundColor: THEME.ink,
            color: "#FFFFFF",
            borderColor: THEME.rule,
          }}
        >
          {toast.type === "warning" ? (
            <AlertCircle size={16} className="text-amber-400" />
          ) : (
            <CheckCircle size={16} className="text-emerald-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

// Student Add/Edit Modal
function StudentModal({ title, initial, onCancel, onSave }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email format";

    const gpaNum = parseFloat(form.gpa);
    if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4.0) {
      e.gpa = "GPA must be between 0.00 and 4.00";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(30,41,59,0.55)", backdropFilter: "blur(2px)" }}
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-lg border shadow-2xl animate-fade-in"
        style={{ backgroundColor: THEME.paperCard, borderColor: THEME.rule }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-6 py-5 border-b flex items-center justify-between"
          style={{ backgroundColor: THEME.paperDark, borderColor: THEME.rule }}
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: THEME.brassDark }}>
              Registrar Form
            </span>
            <h2 className="font-serif text-xl font-bold" style={{ color: THEME.ink }}>
              {title}
            </h2>
          </div>
          <button onClick={onCancel} className="text-stone-400 hover:text-stone-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 text-xs">
            {/* Full Name */}
            <div className="col-span-2 sm:col-span-1">
              <label className="font-bold uppercase tracking-wider text-stone-500 block mb-1 text-[11px]">
                Full Legal Name *
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Marguerite Sol"
                className="w-full rounded border px-3 py-2 outline-none"
                style={{ borderColor: errors.name ? THEME.danger : THEME.rule }}
              />
              {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="col-span-2 sm:col-span-1">
              <label className="font-bold uppercase tracking-wider text-stone-500 block mb-1 text-[11px]">
                University Email *
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="name@ledger.edu"
                className="w-full rounded border px-3 py-2 outline-none"
                style={{ borderColor: errors.email ? THEME.danger : THEME.rule }}
              />
              {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
            </div>

            {/* Major */}
            <div>
              <label className="font-bold uppercase tracking-wider text-stone-500 block mb-1 text-[11px]">
                Academic Major
              </label>
              <select
                value={form.major}
                onChange={(e) => update("major", e.target.value)}
                className="w-full rounded border px-3 py-2 outline-none"
                style={{ borderColor: THEME.rule }}
              >
                {MAJORS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Class Year */}
            <div>
              <label className="font-bold uppercase tracking-wider text-stone-500 block mb-1 text-[11px]">
                Class Level
              </label>
              <select
                value={form.grade}
                onChange={(e) => update("grade", e.target.value)}
                className="w-full rounded border px-3 py-2 outline-none"
                style={{ borderColor: THEME.rule }}
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* GPA */}
            <div>
              <label className="font-bold uppercase tracking-wider text-stone-500 block mb-1 text-[11px]">
                Cumulative GPA (0.00 – 4.00) *
              </label>
              <input
                required
                value={form.gpa}
                onChange={(e) => update("gpa", e.target.value)}
                placeholder="3.75"
                className="w-full rounded border px-3 py-2 outline-none"
                style={{ borderColor: errors.gpa ? THEME.danger : THEME.rule }}
              />
              {errors.gpa && <p className="text-[11px] text-red-600 mt-1">{errors.gpa}</p>}
            </div>

            {/* Status */}
            <div>
              <label className="font-bold uppercase tracking-wider text-stone-500 block mb-1 text-[11px]">
                Matriculation Status
              </label>
              <select
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
                className="w-full rounded border px-3 py-2 outline-none"
                style={{ borderColor: THEME.rule }}
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>

            {/* Contact Phone */}
            <div>
              <label className="font-bold uppercase tracking-wider text-stone-500 block mb-1 text-[11px]">
                Contact Phone
              </label>
              <input
                value={form.phone || ""}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded border px-3 py-2 outline-none"
                style={{ borderColor: THEME.rule }}
              />
            </div>

            {/* Credits Completed */}
            <div>
              <label className="font-bold uppercase tracking-wider text-stone-500 block mb-1 text-[11px]">
                Credits Completed
              </label>
              <input
                type="number"
                value={form.credits || 0}
                onChange={(e) => update("credits", e.target.value)}
                className="w-full rounded border px-3 py-2 outline-none"
                style={{ borderColor: THEME.rule }}
              />
            </div>

            {/* Photo Avatar URL */}
            <div className="col-span-2">
              <label className="font-bold uppercase tracking-wider text-stone-500 block mb-1 text-[11px]">
                Profile Photo Avatar URL (optional)
              </label>
              <input
                value={form.avatar || ""}
                onChange={(e) => update("avatar", e.target.value)}
                placeholder="https://images.unsplash.com/... or leave blank for auto"
                className="w-full rounded border px-3 py-2 outline-none text-xs"
                style={{ borderColor: THEME.rule }}
              />
            </div>

            {/* Bio / Dossier */}
            <div className="col-span-2">
              <label className="font-bold uppercase tracking-wider text-stone-500 block mb-1 text-[11px]">
                Biographical Note & Interests
              </label>
              <textarea
                rows={2}
                value={form.bio || ""}
                onChange={(e) => update("bio", e.target.value)}
                placeholder="Undergraduate research focus, clubs, or academic honors..."
                className="w-full rounded border px-3 py-2 outline-none text-xs"
                style={{ borderColor: THEME.rule }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t" style={{ borderColor: THEME.ruleLight }}>
            <button
              type="button"
              onClick={onCancel}
              className="rounded border px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100"
              style={{ borderColor: THEME.rule }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded px-5 py-2 text-xs font-semibold text-white shadow-xs"
              style={{ backgroundColor: THEME.brass }}
            >
              {title.startsWith("Enroll") ? "Add to Ledger" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
