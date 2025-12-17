"use client";

import { useState } from "react";
import { Award, Search, Printer, CheckCircle, XCircle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { resultStore, StudentResult } from "@/lib/store";
import { toast } from "sonner";
import Link from "next/link";

const toppers = [
  { rank: 1, name: "Priya Sharma", roll: "001234", school: "Delhi Public School", percent: 98.5 },
  { rank: 2, name: "Rahul Kumar", roll: "001102", school: "KV Sector 8", percent: 98.2 },
  { rank: 3, name: "Ananya Verma", roll: "001089", school: "RBM Sr Sec", percent: 97.9 },
  { rank: 4, name: "Mohit Singh", roll: "001045", school: "DPS Rohini", percent: 97.7 },
  { rank: 5, name: "Ishita Bansal", roll: "001033", school: "Bluebells", percent: 97.5 },
];

export default function ResultsPage() {
  const [searchData, setSearchData] = useState({ rollNo: "", classSelected: "", year: "", dob: "" });
  const [result, setResult] = useState<StudentResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchData.rollNo || !searchData.classSelected || !searchData.year || !searchData.dob) {
      toast.error("Please fill all search fields");
      return;
    }
    setSearching(true);
    setNotFound(false);
    setResult(null);

    setTimeout(() => {
      const found = resultStore.search(searchData.rollNo, searchData.dob);
      if (found) {
        setResult(found);
      } else if (searchData.rollNo.toUpperCase() === "AB1234") {
        setResult({
          rollNo: "AB1234",
          studentName: "John Doe",
          dob: searchData.dob,
          classSelected: searchData.classSelected === "12" ? "Class 12 / Science" : "Class 10",
          year: searchData.year,
          subjects: [
            { name: "English Core", theory: 82, practical: 0, total: 82, grade: "A" },
            { name: "Physics", theory: 68, practical: 27, total: 95, grade: "A+" },
            { name: "Chemistry", theory: 71, practical: 29, total: 100, grade: "A+" },
            { name: "Mathematics", theory: 88, practical: 0, total: 88, grade: "A" },
            { name: "Computer Science", theory: 74, practical: 28, total: 102, grade: "A+" },
          ],
          totalMarks: 467,
          percentage: 85.5,
          result: "Pass",
          division: "First Division",
        });
      } else {
        setNotFound(true);
      }
      setSearching(false);
    }, 800);
  };

  const getGradeColor = (grade: string) => {
    if (grade.includes("+")) return "text-green-600";
    if (grade === "A") return "text-blue-600";
    if (grade === "B") return "text-yellow-600";
    return "text-muted-foreground";
  };

  return (
    <div className="min-h-screen py-8">
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <div className="bg-gradient-to-r from-primary/10 to-accent/20 rounded-2xl p-8 md:p-12 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Board Examination Results</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            View your Class 10 and 12 results instantly. Download marksheets and check merit lists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => document.getElementById("results-search")?.scrollIntoView({ behavior: "smooth" })}>
              Check Result
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById("results-merit")?.scrollIntoView({ behavior: "smooth" })}>
              View Merit List
            </Button>
          </div>
        </div>
      </section>

      <section id="results-search" className="max-w-4xl mx-auto px-4 mb-16">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Check Your Result</h2>
              <p className="text-sm text-muted-foreground">Enter your details to view result</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label>Roll Number *</Label>
              <Input value={searchData.rollNo} onChange={(e) => setSearchData({ ...searchData, rollNo: e.target.value })} placeholder="e.g., AB1234" />
            </div>
            <div>
              <Label>Class *</Label>
              <Select value={searchData.classSelected} onValueChange={(v) => setSearchData({ ...searchData, classSelected: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Class 10</SelectItem>
                  <SelectItem value="12">Class 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Session/Year *</Label>
              <Input value={searchData.year} onChange={(e) => setSearchData({ ...searchData, year: e.target.value.replace(/\D/g, "").slice(0, 4) })} placeholder="e.g., 2024" />
            </div>
            <div>
              <Label>Date of Birth *</Label>
              <Input type="date" value={searchData.dob} onChange={(e) => setSearchData({ ...searchData, dob: e.target.value })} />
            </div>
            <div className="md:col-span-2 flex gap-4">
              <Button type="submit" disabled={searching}>{searching ? "Searching..." : "Search"}</Button>
              <Button type="button" variant="outline" onClick={() => { setSearchData({ rollNo: "", classSelected: "", year: "", dob: "" }); setResult(null); setNotFound(false); }}>Reset</Button>
            </div>
          </form>

          {searching && <div className="shimmer h-32 rounded-lg" />}

          {notFound && !searching && (
            <div className="p-6 bg-red-50 rounded-xl border border-red-200 animate-scale-in">
              <div className="flex items-center gap-3 text-red-600">
                <XCircle className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Result Not Found</h3>
                  <p className="text-sm">No matching record found. Please check your details.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {result && !searching && (
        <>
          <section className="max-w-4xl mx-auto px-4 mb-8 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6">Result Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">Candidate Name</p>
                  <p className="font-bold text-primary">{result.studentName}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Roll Number</p>
                  <p className="font-bold text-green-600">{result.rollNo}</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Class / Stream</p>
                  <p className="font-bold text-yellow-600">{result.classSelected}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Result Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${result.result === "Pass" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {result.result}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Division / Grade</p>
                  <p className="font-bold text-primary">{result.division}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Percentage</p>
                  <p className="font-bold text-primary">{result.percentage.toFixed(1)}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Session / Year</p>
                  <p className="font-bold text-primary">{result.year}</p>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => window.print()}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button asChild>
                  <Link href="/verification">Verify via QR</Link>
                </Button>
              </div>
            </div>
          </section>

          <section className="max-w-4xl mx-auto px-4 mb-16 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6">Detailed Marksheet</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-3 text-left">Subject</th>
                      <th className="border p-3 text-center">Theory</th>
                      <th className="border p-3 text-center">Practical</th>
                      <th className="border p-3 text-center">Total</th>
                      <th className="border p-3 text-center">Grade</th>
                      <th className="border p-3 text-center">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.subjects.map((sub, i) => (
                      <tr key={i}>
                        <td className="border p-3">{sub.name}</td>
                        <td className="border p-3 text-center">{sub.theory}</td>
                        <td className="border p-3 text-center">{sub.practical}</td>
                        <td className="border p-3 text-center">{sub.total}</td>
                        <td className={`border p-3 text-center font-bold ${getGradeColor(sub.grade)}`}>{sub.grade}</td>
                        <td className="border p-3 text-center text-green-600">Pass</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted font-bold">
                      <td className="border p-3 text-right">Grand Total</td>
                      <td className="border p-3 text-center">{result.subjects.reduce((a, b) => a + b.theory, 0)}</td>
                      <td className="border p-3 text-center">{result.subjects.reduce((a, b) => a + b.practical, 0)}</td>
                      <td className="border p-3 text-center">{result.totalMarks}</td>
                      <td className="border p-3 text-center" colSpan={2}>
                        {result.percentage.toFixed(1)}% | {result.division}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Note: Minimum pass mark is 33% in each subject.</p>
            </div>
          </section>
        </>
      )}

      <section id="results-merit" className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Merit List / Toppers
          </h2>
          <Select defaultValue="2024">
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-muted-foreground mb-6">Top 5 performers in Class 12 Science</p>
        <div className="grid md:grid-cols-5 gap-4">
          {toppers.map((topper, i) => (
            <div key={i} className={`bg-white rounded-xl shadow-sm p-4 text-center border ${i === 0 ? "border-yellow-400 ring-2 ring-yellow-200" : "border-border/50"} animate-fade-in`} style={{ animationDelay: `${i * 100}ms` }}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${i === 0 ? "bg-yellow-100 text-yellow-700" : i === 1 ? "bg-gray-100 text-gray-600" : i === 2 ? "bg-orange-100 text-orange-600" : "bg-muted text-muted-foreground"}`}>
                {i < 3 ? <Trophy className="w-5 h-5" /> : <span className="font-bold">{topper.rank}</span>}
              </div>
              <h3 className="font-semibold text-sm">{topper.name}</h3>
              <p className="text-xs text-muted-foreground">{topper.school}</p>
              <p className="text-lg font-bold text-primary mt-2">{topper.percent}%</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
