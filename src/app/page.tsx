"use client";

import Link from "next/link";
import { GraduationCap, BookOpen, ClipboardCheck, Award, Calendar, FileText, Users, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: BookOpen, title: "Open Schooling", desc: "Flexible learning for Class 10 & 12", href: "/courses" },
  { icon: ClipboardCheck, title: "Online Application", desc: "Apply from anywhere, anytime", href: "/form" },
  { icon: Award, title: "Check Results", desc: "View your exam results online", href: "/results" },
  { icon: FileText, title: "Verification", desc: "Instant certificate verification", href: "/verification" },
];

const stats = [
  { value: "1978", label: "Established" },
  { value: "50K+", label: "Students" },
  { value: "100+", label: "Centers" },
  { value: "95%", label: "Pass Rate" },
];

const announcements = [
  { title: "Date Sheet 2025 Released", desc: "Class 10 & 12 exam schedules are now available", date: "Jan 15, 2025" },
  { title: "Admissions Open", desc: "Apply now for Class 10 & 12 for 2025 session", date: "Jan 10, 2025" },
  { title: "Results Declared", desc: "Class 12 supplementary results are now available", date: "Jan 5, 2025" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/20 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse delay-500" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full text-sm mb-6 shadow-sm">
              <GraduationCap className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground">Est. 1978 | COBSE Member</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Delhi State Board<br />
              <span className="text-primary">Education</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Empowering students through flexible open schooling. Quality education for Class 10 & 12 with modern curriculum and accessible learning.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="group">
                <Link href="/form">
                  Apply Now
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/results">Check Results</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need for your educational journey, all in one place.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Link
                key={i}
                href={feature.href}
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-primary/30 animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-left">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Choose <span className="text-primary">DSBE</span>?
              </h2>
              <div className="space-y-4">
                {[
                  "Recognized by Ministry of Education, Govt. of India",
                  "Member of Council of Boards of School Education (COBSE)",
                  "Flexible learning pathways for diverse learners",
                  "Online application and result checking facilities",
                  "Affordable fee structure with quality education",
                  "Study centers across multiple states",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex gap-4">
                <Button asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/courses">View Courses</Link>
                </Button>
              </div>
            </div>
            
            <div className="animate-slide-right">
              <div className="bg-gradient-to-br from-primary/5 to-accent/10 rounded-2xl p-8 border border-border/50">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">Latest Announcements</h3>
                </div>
                <div className="space-y-4">
                  {announcements.map((item, i) => (
                    <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-foreground">{item.title}</h4>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{item.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Join thousands of students who have achieved their educational goals with Delhi State Board Education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/form">
                <Users className="mr-2 w-5 h-5" />
                Apply for Admission
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="/application">Check Application Status</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
