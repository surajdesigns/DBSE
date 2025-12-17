"use client";

import Link from "next/link";
import { GraduationCap, MapPin, Mail, Phone, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-primary">DSBE</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Established in 1978 to promote open schooling across India, providing quality education to all.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Preet Vihar, Delhi – 110092</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:dsbe.contact@gmail.com" className="hover:text-primary">
                  dsbe.contact@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+91-99141-83885</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>Mon-Fri: 10AM - 5PM</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-widest text-muted-foreground mb-5 uppercase">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="text-foreground hover:text-primary">Home</Link></li>
              <li><Link href="/about" className="text-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/form" className="text-foreground hover:text-primary">Apply Online</Link></li>
              <li><Link href="/application" className="text-foreground hover:text-primary">Check Status</Link></li>
              <li><Link href="/results" className="text-foreground hover:text-primary">View Results</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-widest text-muted-foreground mb-5 uppercase">
              Courses
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/courses" className="text-foreground hover:text-primary">Class 10</Link></li>
              <li><Link href="/courses" className="text-foreground hover:text-primary">Class 12 - Science</Link></li>
              <li><Link href="/courses" className="text-foreground hover:text-primary">Class 12 - Commerce</Link></li>
              <li><Link href="/courses" className="text-foreground hover:text-primary">Class 12 - Arts</Link></li>
              <li><Link href="/courses" className="text-foreground hover:text-primary">Skill Courses</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-widest text-muted-foreground mb-5 uppercase">
              Resources
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/verification" className="text-foreground hover:text-primary">Certificate Verification</Link></li>
              <li><a href="https://cobse.org" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary">COBSE</a></li>
              <li><a href="https://education.gov.in" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary">Ministry of Education</a></li>
              <li><a href="https://nios.ac.in" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary">NIOS</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Delhi State Board Education. All rights reserved.</p>
          <p className="text-xs mt-1">Designed and developed by Suraj Kumar</p>
        </div>
      </div>
    </footer>
  );
}
