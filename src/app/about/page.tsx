"use client";

import { Target, Eye, Heart, Award, Building2, Network, Calendar, Users, BookOpen, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const timeline = [
  { year: "1978", title: "Founded", desc: "Established to promote open schooling across India." },
  { year: "2002", title: "Digital Records", desc: "Introduced digital student records and online services." },
  { year: "2010", title: "Expansion", desc: "Expanded study centers to cover more regions." },
  { year: "2015", title: "Student Services", desc: "Enhanced student support and counseling programs." },
  { year: "2025", title: "Modernization", desc: "Ongoing digital transformation for future-ready education." },
];

const values = ["Integrity", "Inclusivity", "Transparency", "Excellence", "Service", "Innovation"];

export default function AboutPage() {
  return (
    <div className="min-h-screen py-8">
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="bg-gradient-to-r from-primary/10 to-accent/20 rounded-2xl p-8 md:p-12 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            About <span className="text-primary">DSBE</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Established in 1978, we are committed to providing inclusive open schooling and flexible learning pathways to empower students across India with quality education.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Our Mission, Vision & Values</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center animate-fade-in border border-border/50">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Mission</h3>
            <ul className="text-left space-y-2 text-muted-foreground text-sm">
              <li>• Inclusive access to education for all</li>
              <li>• Flexible pathways for diverse learners</li>
              <li>• Transparent and fair evaluation processes</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 text-center animate-fade-in delay-100 border border-border/50">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Vision</h3>
            <ul className="text-left space-y-2 text-muted-foreground text-sm">
              <li>• A lifelong learning ecosystem</li>
              <li>• Nationally trusted open schooling leader</li>
              <li>• Empowering future generations</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 text-center animate-fade-in delay-200 border border-border/50">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Core Values</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {values.map((v) => (
                <span key={v} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 mb-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Who We Are</h2>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="animate-slide-left">
              <p className="text-muted-foreground mb-4">
                Delhi State Board Education is a pioneering institution dedicated to open schooling. We bridge educational gaps by offering flexible programs that cater to diverse learner needs.
              </p>
              <p className="text-muted-foreground mb-4">
                Established in 1978 to promote open schooling across India, we have served millions of students through innovative curricula and robust support systems.
              </p>
              <p className="text-muted-foreground">
                Our mission is to provide quality education that is accessible, affordable, and adaptable to the needs of every student, regardless of their background or circumstances.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-accent/30 rounded-2xl p-8 animate-slide-right flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <Users className="w-20 h-20 text-primary mx-auto mb-4" />
                <p className="text-2xl font-bold text-foreground">50,000+ Students</p>
                <p className="text-muted-foreground">Empowered through education</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Recognition & Affiliations</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center animate-fade-in border border-border/50">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">COBSE Membership</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Member of Council of Boards of School Education, ensuring national standards.
            </p>
            <Button size="sm" asChild>
              <a href="https://cobse.org" target="_blank" rel="noopener noreferrer">View Details</a>
            </Button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 text-center animate-fade-in delay-100 border border-border/50">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Ministry of Education</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Recognized by the Ministry for quality open schooling programs.
            </p>
            <Button size="sm" asChild>
              <a href="https://education.gov.in" target="_blank" rel="noopener noreferrer">View Details</a>
            </Button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 text-center animate-fade-in delay-200 border border-border/50">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Network className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">NIOS & State Schools</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Affiliated with National Institute of Open Schooling and state networks.
            </p>
            <Button size="sm" asChild>
              <a href="https://nios.ac.in" target="_blank" rel="noopener noreferrer">View Details</a>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 mb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Our History</h2>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20" />
            {timeline.map((item, i) => (
              <div key={i} className={`relative flex items-center mb-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                <div className={`w-full md:w-1/2 ${i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"} pl-12 md:pl-0`}>
                  <div className="bg-background rounded-xl shadow-sm p-4 border border-border/50 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                    <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold mb-2">
                      {item.year}
                    </span>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-primary rounded-full transform -translate-x-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">What We Do</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: BookOpen, title: "Open Schooling", desc: "Flexible courses for secondary and senior secondary.", href: "/courses" },
            { icon: Calendar, title: "Date-Sheets & Results", desc: "Timely exam schedules and result declarations.", href: "/results" },
            { icon: Award, title: "Certificate Verification", desc: "Secure online verification of credentials.", href: "/verification" },
            { icon: Headphones, title: "Student Support", desc: "Dedicated guidance, helplines, and counseling.", href: "/form" },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 text-center animate-fade-in border border-border/50" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
              <Button size="sm" asChild>
                <Link href={item.href}>Learn More</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
