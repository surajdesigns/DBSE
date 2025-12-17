"use client";

import { useState } from "react";
import { Search, ClipboardList, CheckCircle, Clock, XCircle, Calendar, FileText, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { applicationStore, ApplicationStatus } from "@/lib/store";
import { toast } from "sonner";
import Link from "next/link";

const steps = [
  { icon: FileText, title: "Create Account", desc: "Register or login" },
  { icon: ClipboardList, title: "Fill Application", desc: "Enter your details" },
  { icon: CreditCard, title: "Pay Fees", desc: "Complete payment" },
  { icon: CheckCircle, title: "Submit", desc: "Review and submit" },
];

export default function ApplicationPage() {
  const [appId, setAppId] = useState("");
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<ApplicationStatus | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appId.trim() || !dob) {
      toast.error("Please enter both Application ID and Date of Birth");
      return;
    }
    setLoading(true);
    setNotFound(false);
    setResult(null);

    setTimeout(() => {
      const found = applicationStore.search(appId.trim(), dob);
      if (found) {
        setResult(found);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }, 800);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted": return "text-green-600 bg-green-100";
      case "Rejected": return "text-red-600 bg-red-100";
      default: return "text-yellow-600 bg-yellow-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Accepted": return <CheckCircle className="w-5 h-5" />;
      case "Rejected": return <XCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen py-8">
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <div className="bg-gradient-to-r from-primary/10 to-accent/20 rounded-2xl p-8 md:p-12 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Online Application</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Streamline your admission process for Class 10 and 12 with our secure online portal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/form">
                Apply Now <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById("status-section")?.scrollIntoView({ behavior: "smooth" })}>
              Check Status
            </Button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="text-center animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <step.icon className="w-7 h-7 text-primary" />
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute left-full top-1/2 w-full h-0.5 bg-primary/20" />
                )}
              </div>
              <h3 className="font-semibold mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="status-section" className="max-w-7xl mx-auto px-4 mb-16">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-xl mx-auto animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Check Application Status</h2>
              <p className="text-sm text-muted-foreground">Enter your details to check status</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <Label htmlFor="appId">Application ID</Label>
              <Input id="appId" value={appId} onChange={(e) => setAppId(e.target.value)} placeholder="e.g., APP-12345" />
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Searching..." : "Check Status"}
            </Button>
          </form>

          {loading && (
            <div className="mt-6 p-4 rounded-lg shimmer h-24" />
          )}

          {result && !loading && (
            <div className="mt-6 p-6 bg-background rounded-xl border border-border animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{result.studentName}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(result.status)}`}>
                  {getStatusIcon(result.status)}
                  {result.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Application ID</p>
                  <p className="font-medium">{result.applicationId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Class Applied</p>
                  <p className="font-medium">{result.classApplied}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{result.dob}</p>
                </div>
                {result.remarks && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Remarks</p>
                    <p className="font-medium">{result.remarks}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {notFound && !loading && (
            <div className="mt-6 p-6 bg-red-50 rounded-xl border border-red-200 animate-scale-in">
              <div className="flex items-center gap-3 text-red-600">
                <XCircle className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Application Not Found</h3>
                  <p className="text-sm">Please check your Application ID and Date of Birth.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Important Dates</h2>
        <div className="grid md:grid-cols-5 gap-4">
          {[
            { label: "Open", title: "Application Open", date: "01 Oct 2024", color: "bg-blue-500" },
            { label: "Last Date", title: "Last Date", date: "30 Nov 2024", color: "bg-yellow-500" },
            { label: "Late Fee", title: "Late Fee Window", date: "01-15 Dec 2024", color: "bg-orange-500" },
            { label: "Admit", title: "Admit Card", date: "01 Feb 2025", color: "bg-green-500" },
            { label: "Exams", title: "Exam Window", date: "Mar-Apr 2025", color: "bg-purple-500" },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 text-center animate-fade-in border border-border/50" style={{ animationDelay: `${i * 100}ms` }}>
              <span className={`inline-block ${item.color} text-white px-3 py-1 rounded-full text-xs font-semibold mb-2`}>
                {item.label}
              </span>
              <h3 className="font-semibold text-sm">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.date}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-border/50">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Eligibility Criteria
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-primary">Class 10</h4>
                <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                  <li>• Minimum age: 14 years as on 31st March</li>
                  <li>• No prior qualification required</li>
                  <li>• Open to all Indian nationals</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-primary">Class 12</h4>
                <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                  <li>• Passed Class 10 or equivalent</li>
                  <li>• Minimum age: 16 years</li>
                  <li>• Streams: Arts, Commerce, Science</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-border/50">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Application Fees
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Class</th>
                  <th className="text-left py-2">Regular Fee</th>
                  <th className="text-left py-2">Late Fee</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Class 10</td>
                  <td className="py-2">₹800</td>
                  <td className="py-2">₹1200</td>
                </tr>
                <tr>
                  <td className="py-2">Class 12</td>
                  <td className="py-2">₹1000</td>
                  <td className="py-2">₹1400</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-4">Payment Methods: UPI, NetBanking, Card</p>
          </div>
        </div>
      </section>
    </div>
  );
}
