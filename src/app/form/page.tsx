"use client";

import { useState } from "react";
import { FileSignature, Upload, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formStore } from "@/lib/store";
import { toast } from "sonner";

const subjects10 = ["English", "Hindi/Sanskrit", "Mathematics", "Science", "Social Science", "Information Technology", "Home Science", "Painting"];
const subjects12 = {
  Science: ["English Core", "Physics", "Chemistry", "Mathematics", "Biology", "Computer Science", "Physical Education"],
  Commerce: ["English Core", "Accountancy", "Business Studies", "Economics", "Mathematics", "Entrepreneurship", "Physical Education"],
  Arts: ["English Core", "History", "Political Science", "Geography", "Sociology", "Psychology", "Economics", "Fine Arts"],
};

export default function FormPage() {
  const [formData, setFormData] = useState({
    applicantName: "",
    guardianName: "",
    dob: "",
    gender: "",
    category: "",
    nationality: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    classSelected: "",
    stream: "",
    subjects: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState("");

  const availableSubjects = formData.classSelected === "10" ? subjects10 : formData.stream ? subjects12[formData.stream as keyof typeof subjects12] || [] : [];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.applicantName.trim()) errs.applicantName = "Name is required";
    if (!formData.guardianName.trim()) errs.guardianName = "Guardian name is required";
    if (!formData.dob) errs.dob = "Date of birth is required";
    if (!formData.gender) errs.gender = "Gender is required";
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = "Valid email is required";
    if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) errs.mobile = "Valid 10-digit mobile is required";
    if (!formData.address.trim()) errs.address = "Address is required";
    if (!formData.city.trim()) errs.city = "City is required";
    if (!formData.state) errs.state = "State is required";
    if (!formData.pincode || !/^\d{6}$/.test(formData.pincode)) errs.pincode = "Valid 6-digit pincode is required";
    if (!formData.classSelected) errs.classSelected = "Class is required";
    if (formData.classSelected === "12" && !formData.stream) errs.stream = "Stream is required";
    if (formData.subjects.length < 5) errs.subjects = "Select at least 5 subjects";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    const submission = formStore.add({
      studentName: formData.applicantName,
      guardianName: formData.guardianName,
      email: formData.email,
      mobile: formData.mobile,
      formType: "Student Application",
      classSelected: formData.classSelected === "12" ? `Class 12 - ${formData.stream}` : "Class 10",
    });
    setSubmissionId(submission.id);
    setSubmitted(true);
    toast.success("Application submitted successfully!");
  };

  const handleSubjectToggle = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : prev.subjects.length < 7
        ? [...prev.subjects, subject]
        : prev.subjects,
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center animate-scale-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Application Submitted!</h1>
            <p className="text-muted-foreground mb-6">
              Your application has been submitted successfully. Please save your application ID for future reference.
            </p>
            <div className="bg-primary/10 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground">Application ID</p>
              <p className="text-2xl font-bold text-primary">{submissionId}</p>
            </div>
            <Button onClick={() => { setSubmitted(false); setFormData({ applicantName: "", guardianName: "", dob: "", gender: "", category: "", nationality: "", email: "", mobile: "", address: "", city: "", state: "", pincode: "", classSelected: "", stream: "", subjects: [] }); }}>
              Submit Another Application
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileSignature className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Student Application Form</h1>
              <p className="text-sm text-muted-foreground">Apply online for Class 10 or 12</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="applicantName">Applicant Name *</Label>
                <Input id="applicantName" value={formData.applicantName} onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })} className={errors.applicantName ? "border-destructive" : ""} />
                {errors.applicantName && <p className="text-xs text-destructive mt-1">{errors.applicantName}</p>}
              </div>
              <div>
                <Label htmlFor="guardianName">Guardian Name *</Label>
                <Input id="guardianName" value={formData.guardianName} onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })} className={errors.guardianName ? "border-destructive" : ""} />
                {errors.guardianName && <p className="text-xs text-destructive mt-1">{errors.guardianName}</p>}
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input id="dob" type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} className={errors.dob ? "border-destructive" : ""} />
                {errors.dob && <p className="text-xs text-destructive mt-1">{errors.dob}</p>}
              </div>
              <div>
                <Label>Gender *</Label>
                <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v })}>
                  <SelectTrigger className={errors.gender ? "border-destructive" : ""}><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-xs text-destructive mt-1">{errors.gender}</p>}
              </div>
              <div>
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="obc">OBC</SelectItem>
                    <SelectItem value="sc">SC</SelectItem>
                    <SelectItem value="st">ST</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="nationality">Nationality</Label>
                <Input id="nationality" value={formData.nationality} onChange={(e) => setFormData({ ...formData, nationality: e.target.value })} placeholder="Indian" />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={errors.email ? "border-destructive" : ""} />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="mobile">Mobile (10 digits) *</Label>
                <Input id="mobile" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })} className={errors.mobile ? "border-destructive" : ""} />
                {errors.mobile && <p className="text-xs text-destructive mt-1">{errors.mobile}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address *</Label>
              <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={errors.address ? "border-destructive" : ""} />
              {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className={errors.city ? "border-destructive" : ""} />
                {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
              </div>
              <div>
                <Label>State *</Label>
                <Select value={formData.state} onValueChange={(v) => setFormData({ ...formData, state: v })}>
                  <SelectTrigger className={errors.state ? "border-destructive" : ""}><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {["Delhi", "Uttar Pradesh", "Haryana", "Punjab", "Rajasthan", "Maharashtra", "Other"].map((s) => (
                      <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && <p className="text-xs text-destructive mt-1">{errors.state}</p>}
              </div>
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input id="pincode" value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })} className={errors.pincode ? "border-destructive" : ""} />
                {errors.pincode && <p className="text-xs text-destructive mt-1">{errors.pincode}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Class *</Label>
                <Select value={formData.classSelected} onValueChange={(v) => setFormData({ ...formData, classSelected: v, stream: "", subjects: [] })}>
                  <SelectTrigger className={errors.classSelected ? "border-destructive" : ""}><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">Class 10</SelectItem>
                    <SelectItem value="12">Class 12</SelectItem>
                  </SelectContent>
                </Select>
                {errors.classSelected && <p className="text-xs text-destructive mt-1">{errors.classSelected}</p>}
              </div>
              {formData.classSelected === "12" && (
                <div>
                  <Label>Stream *</Label>
                  <Select value={formData.stream} onValueChange={(v) => setFormData({ ...formData, stream: v, subjects: [] })}>
                    <SelectTrigger className={errors.stream ? "border-destructive" : ""}><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="Commerce">Commerce</SelectItem>
                      <SelectItem value="Arts">Arts</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.stream && <p className="text-xs text-destructive mt-1">{errors.stream}</p>}
                </div>
              )}
            </div>

            {availableSubjects.length > 0 && (
              <div>
                <Label>Subjects (Select 5-7) *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {availableSubjects.map((subject) => (
                    <label key={subject} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${formData.subjects.includes(subject) ? "bg-primary/10 border-primary" : "bg-background border-border hover:border-primary/50"}`}>
                      <input type="checkbox" checked={formData.subjects.includes(subject)} onChange={() => handleSubjectToggle(subject)} className="sr-only" />
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${formData.subjects.includes(subject) ? "bg-primary border-primary" : "border-muted-foreground"}`}>
                        {formData.subjects.includes(subject) && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <span className="text-sm">{subject}</span>
                    </label>
                  ))}
                </div>
                {errors.subjects && <p className="text-xs text-destructive mt-1">{errors.subjects}</p>}
                <p className="text-xs text-muted-foreground mt-2">Selected: {formData.subjects.length}/7</p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                <Upload className="w-4 h-4 mr-2" />
                Submit Application
              </Button>
              <Button type="button" variant="outline" onClick={() => setFormData({ applicantName: "", guardianName: "", dob: "", gender: "", category: "", nationality: "", email: "", mobile: "", address: "", city: "", state: "", pincode: "", classSelected: "", stream: "", subjects: [] })}>
                Reset
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
