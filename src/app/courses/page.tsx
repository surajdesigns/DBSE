"use client";

import { useState } from "react";
import { BookOpen, Search, Download, Plus, ChevronDown, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

const subjects = [
  { code: "10-ENG", name: "English", class: "10", type: "Compulsory", desc: "Core English language and literature." },
  { code: "10-HIN", name: "Hindi/Sanskrit", class: "10", type: "Compulsory", desc: "Second language." },
  { code: "10-MAT", name: "Mathematics", class: "10", type: "Compulsory", desc: "Algebra, geometry, statistics." },
  { code: "10-SCI", name: "Science", class: "10", type: "Compulsory", desc: "Physics, Chemistry, Biology basics." },
  { code: "10-SST", name: "Social Science", class: "10", type: "Compulsory", desc: "History, Civics, Geography, Economics." },
  { code: "10-IT", name: "Information Technology", class: "10", type: "Skill", desc: "Digital skills & productivity tools." },
  { code: "12-ENGC", name: "English Core", class: "12", stream: "Science", type: "Compulsory", desc: "Advanced English language." },
  { code: "12-PHY", name: "Physics", class: "12", stream: "Science", type: "Elective", desc: "Mechanics, E&M, optics." },
  { code: "12-CHE", name: "Chemistry", class: "12", stream: "Science", type: "Elective", desc: "Physical, Inorganic & Organic chemistry." },
  { code: "12-MAT", name: "Mathematics", class: "12", stream: "Science", type: "Elective", desc: "Calculus, algebra, vectors." },
  { code: "12-BIO", name: "Biology", class: "12", stream: "Science", type: "Elective", desc: "Genetics, evolution, ecology." },
  { code: "12-ACC", name: "Accountancy", class: "12", stream: "Commerce", type: "Compulsory", desc: "Financial accounting." },
  { code: "12-BST", name: "Business Studies", class: "12", stream: "Commerce", type: "Compulsory", desc: "Management, marketing." },
  { code: "12-ECO", name: "Economics", class: "12", stream: "Commerce", type: "Elective", desc: "Micro & macroeconomics." },
  { code: "12-HIS", name: "History", class: "12", stream: "Arts", type: "Compulsory", desc: "Modern world & Indian history." },
  { code: "12-PSC", name: "Political Science", class: "12", stream: "Arts", type: "Compulsory", desc: "Political theory & Indian polity." },
  { code: "12-GEO", name: "Geography", class: "12", stream: "Arts", type: "Elective", desc: "Physical & human geography." },
];

const faqs = [
  { q: "How do I choose the right stream?", a: "Choose based on your interests and career goals. Science suits engineering/medicine; Commerce for business/finance; Arts for humanities/law." },
  { q: "What is the window for changing subjects?", a: "You can change subjects within the first month of the academic session, subject to availability." },
  { q: "How are practicals conducted?", a: "Practicals are scheduled at affiliated centers with internal/external examiners." },
];

export default function CoursesPage() {
  const [classFilter, setClassFilter] = useState("All");
  const [streamFilter, setStreamFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [plan, setPlan] = useState<string[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredSubjects = subjects.filter((s) => {
    if (classFilter !== "All" && s.class !== classFilter) return false;
    if (classFilter === "12" && streamFilter !== "All" && s.stream !== streamFilter) return false;
    if (typeFilters.length > 0 && !typeFilters.includes(s.type)) return false;
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase()) && !s.code.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const toggleType = (type: string) => {
    setTypeFilters((prev) => prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]);
  };

  const addToPlan = (name: string) => {
    if (!plan.includes(name)) setPlan([...plan, name]);
  };

  const removeFromPlan = (name: string) => {
    setPlan(plan.filter((p) => p !== name));
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "Compulsory": return "bg-green-100 text-green-700";
      case "Elective": return "bg-blue-100 text-blue-700";
      default: return "bg-orange-100 text-orange-700";
    }
  };

  return (
    <div className="min-h-screen py-8">
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <div className="bg-gradient-to-r from-primary/10 to-accent/20 rounded-2xl p-8 md:p-12 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Courses & Subjects</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover our comprehensive curriculum for Class 10 and 12. Tailored subjects across streams to build strong foundations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/form">Apply Now</Link>
            </Button>
            <Button size="lg" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Syllabus
            </Button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-border/50">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Class</label>
              <Select value={classFilter} onValueChange={(v) => { setClassFilter(v); if (v !== "12") setStreamFilter("All"); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Classes</SelectItem>
                  <SelectItem value="10">Class 10</SelectItem>
                  <SelectItem value="12">Class 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Stream (Class 12)</label>
              <Select value={streamFilter} onValueChange={setStreamFilter} disabled={classFilter !== "12"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Streams</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="Commerce">Commerce</SelectItem>
                  <SelectItem value="Arts">Arts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name or code..." className="pl-10" />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Compulsory", "Elective", "Skill"].map((type) => (
              <button key={type} onClick={() => toggleType(type)} className={`px-4 py-2 rounded-full text-sm transition-colors ${typeFilters.includes(type) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                {type}
              </button>
            ))}
            <button onClick={() => { setClassFilter("All"); setStreamFilter("All"); setSearchQuery(""); setTypeFilters([]); }} className="text-primary text-sm hover:underline ml-auto">
              Clear All
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">{filteredSubjects.length} results</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject, i) => (
            <div key={subject.code} className="bg-white rounded-xl shadow-sm p-6 border border-border/50 hover:shadow-md transition-shadow animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{subject.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${getTypeBadge(subject.type)}`}>{subject.type}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{subject.code} • Class {subject.class}{subject.stream ? ` • ${subject.stream}` : ""}</p>
              <p className="text-sm text-muted-foreground mb-4">{subject.desc}</p>
              <Button size="sm" variant="outline" onClick={() => addToPlan(subject.name)} disabled={plan.includes(subject.name)}>
                <Plus className="w-3 h-3 mr-1" />
                {plan.includes(subject.name) ? "Added" : "Add to Plan"}
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">My Study Plan</h2>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-border/50">
          {plan.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No subjects added to your plan yet. Start by adding from the courses above!</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {plan.map((name) => (
                <span key={name} className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                  {name}
                  <button onClick={() => removeFromPlan(name)} className="hover:text-primary/70">&times;</button>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-4 mt-6 justify-center">
            <Button variant="destructive" onClick={() => setPlan([])}>Clear Plan</Button>
            <Button asChild>
              <Link href="/form">Proceed to Application</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Suggested Combinations</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { title: "PCM (Science)", subjects: ["Physics", "Chemistry", "Mathematics", "English Core"], color: "blue" },
            { title: "PCB (Science)", subjects: ["Physics", "Chemistry", "Biology", "English Core"], color: "green" },
            { title: "Commerce with Math", subjects: ["Accountancy", "Business Studies", "Economics", "Mathematics"], color: "purple" },
            { title: "Humanities", subjects: ["History", "Political Science", "Geography", "English Core"], color: "orange" },
          ].map((combo, i) => (
            <div key={i} className={`bg-white rounded-xl shadow-sm p-6 border border-border/50`}>
              <h3 className={`font-semibold text-${combo.color}-600 mb-4`}>{combo.title}</h3>
              <ul className="space-y-1 text-sm text-muted-foreground mb-4">
                {combo.subjects.map((s) => <li key={s}>• {s}</li>)}
              </ul>
              <Button size="sm" className="w-full" onClick={() => setPlan(combo.subjects)}>
                Add Combination
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-border/50 overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-6 text-left font-medium flex justify-between items-center hover:bg-muted/50 transition-colors">
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6 text-muted-foreground animate-fade-in">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
