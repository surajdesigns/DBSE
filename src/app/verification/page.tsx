"use client";

import { useState } from "react";
import { ShieldCheck, Search, QrCode, ExternalLink, CheckCircle, XCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { verificationStore, verificationDataStore } from "@/lib/store";
import { toast } from "sonner";

type SearchResult = { found: boolean; name?: string; status?: string; rollNo?: string } | null;

type SearchState = { rollNo: string; classSelected: string; year: string; dob: string };

type RequestState = {
  requestorType: string;
  orgName: string;
  orgAddress: string;
  contactPerson: string;
  email: string;
  mobile: string;
  candidateName: string;
  candidateRoll: string;
  candidateClass: string;
  candidateYear: string;
  candidateDob: string;
  purpose: string;
};

const emptySearch: SearchState = { rollNo: "", classSelected: "", year: "", dob: "" };
const emptyRequest: RequestState = {
  requestorType: "",
  orgName: "",
  orgAddress: "",
  contactPerson: "",
  email: "",
  mobile: "",
  candidateName: "",
  candidateRoll: "",
  candidateClass: "",
  candidateYear: "",
  candidateDob: "",
  purpose: "",
};

export default function VerificationPage() {
  const [searchData, setSearchData] = useState<SearchState>(emptySearch);
  const [searchResult, setSearchResult] = useState<SearchResult>(null);
  const [searching, setSearching] = useState(false);

  const [requestData, setRequestData] = useState<RequestState>(emptyRequest);
  const [requestErrors, setRequestErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchData.rollNo || !searchData.classSelected || !searchData.year || !searchData.dob) {
      toast.error("Please fill all search fields");
      return;
    }
    setSearching(true);
    setSearchResult(null);
    setTimeout(() => {
      const found = verificationDataStore.search(searchData.rollNo, searchData.dob);
      if (found && found.classSelected === searchData.classSelected && found.year === searchData.year) {
        setSearchResult({
          found: true,
          name: found.studentName,
          status: found.status,
          rollNo: found.rollNo,
        });
      } else if (searchData.rollNo.toUpperCase() === "AB1234") {
        setSearchResult({ found: true, name: "John Doe", status: "Pass", rollNo: searchData.rollNo });
      } else {
        setSearchResult({ found: false });
      }
      setSearching(false);
    }, 800);
  };

  const validateRequest = () => {
    const errs: Record<string, string> = {};
    if (!requestData.requestorType) errs.requestorType = "Required";
    if (!requestData.orgName.trim()) errs.orgName = "Required";
    if (!requestData.contactPerson.trim()) errs.contactPerson = "Required";
    if (!requestData.email || !/^\S+@\S+\.\S+$/.test(requestData.email)) errs.email = "Valid email required";
    if (!requestData.mobile || !/^\d{10}$/.test(requestData.mobile)) errs.mobile = "Valid 10-digit mobile required";
    if (!requestData.candidateName.trim()) errs.candidateName = "Required";
    if (!requestData.candidateRoll.trim()) errs.candidateRoll = "Required";
    if (!requestData.candidateClass) errs.candidateClass = "Required";
    if (!requestData.candidateYear || !/^\d{4}$/.test(requestData.candidateYear)) errs.candidateYear = "Valid year required";
    if (!requestData.candidateDob) errs.candidateDob = "Required";
    if (!requestData.purpose) errs.purpose = "Required";
    setRequestErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRequest()) {
      toast.error("Please fix the errors");
      return;
    }
    const request = verificationStore.add({
      candidateName: requestData.candidateName,
      rollNo: requestData.candidateRoll,
      classSelected: requestData.candidateClass,
      year: requestData.candidateYear,
      email: requestData.email,
      mobile: requestData.mobile,
      purpose: requestData.purpose,
    });
    setSubmissionId(request.id);
    setSubmitted(true);
    toast.success("Verification request submitted!");
  };

  const resetSearch = () => {
    setSearchData(emptySearch);
    setSearchResult(null);
  };

  const resetRequest = () => setRequestData(emptyRequest);

  if (submitted) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center animate-scale-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Request Submitted!</h1>
            <p className="text-muted-foreground mb-6">Your verification request has been submitted. Processing time is 2-5 working days.</p>
            <div className="bg-primary/10 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground">Request ID</p>
              <p className="text-2xl font-bold text-primary">{submissionId}</p>
            </div>
            <Button onClick={() => { setSubmitted(false); resetRequest(); }}>
              Submit Another Request
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <div className="bg-gradient-to-r from-primary/10 to-accent/20 rounded-2xl p-8 md:p-12 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Certificate Verification</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Instantly verify student results and certificates online, or request official verification for authentic purposes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => document.getElementById("instant-verify")?.scrollIntoView({ behavior: "smooth" })}>
              Online Verify
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById("request-verify")?.scrollIntoView({ behavior: "smooth" })}>
              Request Official Verification
            </Button>
          </div>
        </div>
      </section>

      <section id="instant-verify" className="max-w-4xl mx-auto px-4 mb-16">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Instant Online Verification</h2>
              <p className="text-sm text-muted-foreground">Verify student results instantly</p>
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
              <Button type="button" variant="outline" onClick={resetSearch}>Reset</Button>
            </div>
          </form>

          {searching && <div className="shimmer h-24 rounded-lg" />}

          {searchResult && !searching && (
            <div className={`p-6 rounded-xl border animate-scale-in ${searchResult.found ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              {searchResult.found ? (
                <div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Record Found
                  </h3>
                  <p className="text-green-900"><strong>Name:</strong> {searchResult.name}</p>
                  <p className="text-green-900"><strong>Roll No:</strong> {searchResult.rollNo || searchData.rollNo.toUpperCase()}</p>
                  <p className="text-green-900"><strong>Class:</strong> {searchData.classSelected}</p>
                  <p className="text-green-900"><strong>Year:</strong> {searchData.year}</p>
                  <p className="text-green-900"><strong>Status:</strong> {searchResult.status}</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold text-red-800 mb-2 flex items-center gap-2">
                    <XCircle className="w-5 h-5" /> Record Not Found
                  </h3>
                  <p className="text-red-700">No matching record found. Please check your details or request official verification.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 mb-16">
        <h2 className="text-2xl font-bold mb-6">QR / URL Verification Guide</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {[
                { icon: QrCode, title: "Scan QR Code", desc: "Use your mobile camera or QR scanner on the certificate." },
                { icon: ExternalLink, title: "Open Secure URL", desc: "It will direct you to our verification portal." },
                { icon: CheckCircle, title: "Match Details", desc: "Verify name, roll number, year, and document hash." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <item.icon className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">{i + 1}. {item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-muted rounded-lg p-8 flex items-center justify-center">
              <div className="text-center">
                <QrCode className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">QR Code Demo</p>
              </div>
            </div>
          </div>
        </section>


      <section id="request-verify" className="max-w-4xl mx-auto px-4 mb-16">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Official Verification Request</h2>
              <p className="text-sm text-muted-foreground">For employers, institutions. Processing: 2-5 working days.</p>
            </div>
          </div>

          <form onSubmit={handleRequestSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Requestor Type *</Label>
              <Select value={requestData.requestorType} onValueChange={(v) => setRequestData({ ...requestData, requestorType: v })}>
                <SelectTrigger className={requestErrors.requestorType ? "border-destructive" : ""}><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="employer">Employer</SelectItem>
                  <SelectItem value="institute">Institute</SelectItem>
                  <SelectItem value="embassy">Embassy</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Organization Name *</Label>
              <Input value={requestData.orgName} onChange={(e) => setRequestData({ ...requestData, orgName: e.target.value })} className={requestErrors.orgName ? "border-destructive" : ""} />
            </div>
            <div className="md:col-span-2">
              <Label>Organization Address</Label>
              <Textarea value={requestData.orgAddress} onChange={(e) => setRequestData({ ...requestData, orgAddress: e.target.value })} rows={2} />
            </div>
            <div>
              <Label>Contact Person *</Label>
              <Input value={requestData.contactPerson} onChange={(e) => setRequestData({ ...requestData, contactPerson: e.target.value })} className={requestErrors.contactPerson ? "border-destructive" : ""} />
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" value={requestData.email} onChange={(e) => setRequestData({ ...requestData, email: e.target.value })} className={requestErrors.email ? "border-destructive" : ""} />
            </div>
            <div>
              <Label>Mobile *</Label>
              <Input value={requestData.mobile} onChange={(e) => setRequestData({ ...requestData, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })} className={requestErrors.mobile ? "border-destructive" : ""} />
            </div>
            <div>
              <Label>Candidate Name *</Label>
              <Input value={requestData.candidateName} onChange={(e) => setRequestData({ ...requestData, candidateName: e.target.value })} className={requestErrors.candidateName ? "border-destructive" : ""} />
            </div>
            <div>
              <Label>Candidate Roll No *</Label>
              <Input value={requestData.candidateRoll} onChange={(e) => setRequestData({ ...requestData, candidateRoll: e.target.value })} className={requestErrors.candidateRoll ? "border-destructive" : ""} />
            </div>
            <div>
              <Label>Candidate Class *</Label>
              <Select value={requestData.candidateClass} onValueChange={(v) => setRequestData({ ...requestData, candidateClass: v })}>
                <SelectTrigger className={requestErrors.candidateClass ? "border-destructive" : ""}><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Class 10</SelectItem>
                  <SelectItem value="12">Class 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Candidate Year *</Label>
              <Input value={requestData.candidateYear} onChange={(e) => setRequestData({ ...requestData, candidateYear: e.target.value.replace(/\D/g, "").slice(0, 4) })} placeholder="YYYY" className={requestErrors.candidateYear ? "border-destructive" : ""} />
            </div>
            <div>
              <Label>Candidate DOB *</Label>
              <Input type="date" value={requestData.candidateDob} onChange={(e) => setRequestData({ ...requestData, candidateDob: e.target.value })} className={requestErrors.candidateDob ? "border-destructive" : ""} />
            </div>
            <div>
              <Label>Purpose *</Label>
              <Select value={requestData.purpose} onValueChange={(v) => setRequestData({ ...requestData, purpose: v })}>
                <SelectTrigger className={requestErrors.purpose ? "border-destructive" : ""}><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admission">Admission</SelectItem>
                  <SelectItem value="job">Job</SelectItem>
                  <SelectItem value="abroad">Abroad</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 flex gap-4 pt-4">
              <Button type="submit">
                <Upload className="w-4 h-4 mr-2" />
                Submit Request
              </Button>
              <Button type="button" variant="outline" onClick={resetRequest}>Reset</Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
