"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, FileText, ShieldCheck, ClipboardList, Award, Upload, Download, Trash2, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-context";
import { formStore, verificationStore, applicationStore, resultStore, verificationDataStore, FormSubmission, VerificationRequest, ApplicationStatus, StudentResult, VerificationData } from "@/lib/store";
import { validateVerificationCSV, validateApplicationCSV, validateResultCSV, generateSampleVerificationCSV, generateSampleApplicationCSV, generateSampleResultCSV } from "@/lib/csv-utils";
import { toast } from "sonner";

export default function AdminPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [forms, setForms] = useState<FormSubmission[]>([]);
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [applications, setApplications] = useState<ApplicationStatus[]>([]);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [verificationData, setVerificationData] = useState<VerificationData[]>([]);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast.error("Admin access required");
      router.push("/");
    }
  }, [isAdmin, isLoading, router]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setForms(formStore.getAll());
    setVerifications(verificationStore.getAll());
    setApplications(applicationStore.getAll());
    setResults(resultStore.getAll());
    setVerificationData(verificationDataStore.getAll());
  };

  const handleFormStatusChange = (id: string, status: FormSubmission["status"]) => {
    formStore.updateStatus(id, status);
    loadData();
    toast.success("Status updated");
  };

  const handleFormDelete = (id: string) => {
    formStore.delete(id);
    loadData();
    toast.success("Form deleted");
  };

  const handleVerificationStatusChange = (id: string, status: VerificationRequest["status"]) => {
    verificationStore.updateStatus(id, status);
    loadData();
    toast.success("Status updated");
  };

  const handleVerificationDataUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || "";
      const result = validateVerificationCSV(text);
      if (!result.valid) {
        const first = result.errors[0];
        toast.error(first ? `Row ${first.row}: ${first.errors.join("; ")}` : "Invalid CSV format");
        return;
      }
      verificationDataStore.setAll(result.data as VerificationData[]);
      setVerificationData(result.data as VerificationData[]);
      toast.success(`${result.data.length} verification records uploaded`);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleApplicationUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || "";
      const result = validateApplicationCSV(text);
      if (!result.valid) {
        const first = result.errors[0];
        toast.error(first ? `Row ${first.row}: ${first.errors.join("; ")}` : "Invalid CSV format");
        return;
      }
      applicationStore.setAll(result.data as ApplicationStatus[]);
      setApplications(result.data as ApplicationStatus[]);
      toast.success(`${result.data.length} applications uploaded`);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleResultUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || "";
      const result = validateResultCSV(text);
      if (!result.valid) {
        const first = result.errors[0];
        toast.error(first ? `Row ${first.row}: ${first.errors.join("; ")}` : "Invalid CSV format");
        return;
      }
      resultStore.setAll(result.data as StudentResult[]);
      setResults(result.data as StudentResult[]);
      toast.success(`${result.data.length} results uploaded`);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const downloadSample = (type: "verification" | "application" | "result") => {
    let csv = "";
    if (type === "verification") csv = generateSampleVerificationCSV();
    else if (type === "application") csv = generateSampleApplicationCSV();
    else csv = generateSampleResultCSV();

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}_sample.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = (data: object[], filename: string) => {
    if (data.length === 0) { toast.error("No data to download"); return; }
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((obj) => Object.values(obj).map((v) => typeof v === "object" ? JSON.stringify(v) : v).join(","));
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved": case "Verified": case "Accepted": case "Pass":
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700"><CheckCircle className="w-3 h-3" />{status}</span>;
      case "Rejected": case "Fail":
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-700"><XCircle className="w-3 h-3" />{status}</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700"><Clock className="w-3 h-3" />{status}</span>;
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="shimmer w-32 h-8 rounded" /></div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage forms, verifications, applications, and results</p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto" onClick={loadData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Form Submissions", value: forms.length, icon: FileText, color: "bg-blue-500" },
            { label: "Verification Requests", value: verifications.length, icon: ShieldCheck, color: "bg-green-500" },
            { label: "Applications", value: applications.length, icon: ClipboardList, color: "bg-purple-500" },
            { label: "Results", value: results.length, icon: Award, color: "bg-orange-500" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-border/50">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="forms" className="bg-white rounded-xl shadow-sm border border-border/50">
          <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto">
            <TabsTrigger value="forms" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-4">Form Submissions</TabsTrigger>
            <TabsTrigger value="verifications" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-4">Verifications</TabsTrigger>
            <TabsTrigger value="verification-data" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-4">Verification Data</TabsTrigger>
            <TabsTrigger value="applications" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-4">Applications</TabsTrigger>
            <TabsTrigger value="results" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-4">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="forms" className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Form Submissions</h2>
              <Button variant="outline" size="sm" onClick={() => downloadCSV(forms, "form_submissions")}>
                <Download className="w-4 h-4 mr-2" />Download CSV
              </Button>
            </div>
            {forms.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No form submissions yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b"><th className="text-left p-3">ID</th><th className="text-left p-3">Student Name</th><th className="text-left p-3">Type</th><th className="text-left p-3">Class</th><th className="text-left p-3">Date</th><th className="text-left p-3">Status</th><th className="text-left p-3">Actions</th></tr></thead>
                  <tbody>
                    {forms.map((form) => (
                      <tr key={form.id} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-mono text-xs">{form.id}</td>
                        <td className="p-3">{form.studentName}</td>
                        <td className="p-3">{form.formType}</td>
                        <td className="p-3">{form.classSelected}</td>
                        <td className="p-3">{new Date(form.submissionDate).toLocaleDateString()}</td>
                        <td className="p-3">{getStatusBadge(form.status)}</td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Select value={form.status} onValueChange={(v) => handleFormStatusChange(form.id, v as FormSubmission["status"])}>
                              <SelectTrigger className="h-8 w-24 text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Approved">Approved</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleFormDelete(form.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="verifications" className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Verification Requests</h2>
              <Button variant="outline" size="sm" onClick={() => downloadCSV(verifications, "verifications")}>
                <Download className="w-4 h-4 mr-2" />Download CSV
              </Button>
            </div>
            {verifications.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No verification requests yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b"><th className="text-left p-3">ID</th><th className="text-left p-3">Candidate</th><th className="text-left p-3">Roll No</th><th className="text-left p-3">Class</th><th className="text-left p-3">Purpose</th><th className="text-left p-3">Date</th><th className="text-left p-3">Status</th><th className="text-left p-3">Actions</th></tr></thead>
                  <tbody>
                    {verifications.map((ver) => (
                      <tr key={ver.id} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-mono text-xs">{ver.id}</td>
                        <td className="p-3">{ver.candidateName}</td>
                        <td className="p-3">{ver.rollNo}</td>
                        <td className="p-3">Class {ver.classSelected}</td>
                        <td className="p-3 capitalize">{ver.purpose}</td>
                        <td className="p-3">{new Date(ver.submissionDate).toLocaleDateString()}</td>
                        <td className="p-3">{getStatusBadge(ver.status)}</td>
                        <td className="p-3">
                          <Select value={ver.status} onValueChange={(v) => handleVerificationStatusChange(ver.id, v as VerificationRequest["status"])}>
                            <SelectTrigger className="h-8 w-24 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Verified">Verified</SelectItem>
                              <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="verification-data" className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Verification Data (CSV Upload)</h2>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => downloadSample("verification")}>
                  <Download className="w-4 h-4 mr-2" />Download Sample
                </Button>
                {verificationData.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => downloadCSV(verificationData, "verification_data")}>
                    <Download className="w-4 h-4 mr-2" />Download Data
                  </Button>
                )}
                <Label htmlFor="ver-data-upload" className="cursor-pointer">
                  <Button variant="default" size="sm" asChild>
                    <span><Upload className="w-4 h-4 mr-2" />Upload CSV</span>
                  </Button>
                </Label>
                <Input id="ver-data-upload" type="file" accept=".csv" className="hidden" onChange={handleVerificationDataUpload} />
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-900 mb-2">Required CSV Format:</h3>
              <p className="text-sm text-blue-800 mb-2"><strong>Headers:</strong> rollNo, studentName, classSelected, year, dob, status</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• <strong>rollNo:</strong> Student roll number (e.g., AB1234)</li>
                <li>• <strong>studentName:</strong> Full name of the student</li>
                <li>• <strong>classSelected:</strong> Must be 10 or 12</li>
                <li>• <strong>year:</strong> 4-digit year (e.g., 2024)</li>
                <li>• <strong>dob:</strong> Date of birth in YYYY-MM-DD format</li>
                <li>• <strong>status:</strong> Must be "Pass" or "Fail"</li>
              </ul>
            </div>
            {verificationData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No verification data uploaded. Upload a CSV to enable instant verification searches.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b"><th className="text-left p-3">Roll No</th><th className="text-left p-3">Student Name</th><th className="text-left p-3">Class</th><th className="text-left p-3">Year</th><th className="text-left p-3">DOB</th><th className="text-left p-3">Status</th></tr></thead>
                  <tbody>
                    {verificationData.map((ver, i) => (
                      <tr key={i} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-mono">{ver.rollNo}</td>
                        <td className="p-3">{ver.studentName}</td>
                        <td className="p-3">Class {ver.classSelected}</td>
                        <td className="p-3">{ver.year}</td>
                        <td className="p-3">{ver.dob}</td>
                        <td className="p-3">{getStatusBadge(ver.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="applications" className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Application Status (CSV Upload)</h2>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => downloadSample("application")}>
                  <Download className="w-4 h-4 mr-2" />Download Sample
                </Button>
                {applications.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => downloadCSV(applications, "applications")}>
                    <Download className="w-4 h-4 mr-2" />Download Data
                  </Button>
                )}
                <Label htmlFor="app-upload" className="cursor-pointer">
                  <Button variant="default" size="sm" asChild>
                    <span><Upload className="w-4 h-4 mr-2" />Upload CSV</span>
                  </Button>
                </Label>
                <Input id="app-upload" type="file" accept=".csv" className="hidden" onChange={handleApplicationUpload} />
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-900 mb-2">Required CSV Format:</h3>
              <p className="text-sm text-blue-800 mb-2"><strong>Headers:</strong> applicationId, studentName, dob, classApplied, status, remarks</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• <strong>applicationId:</strong> Unique ID (e.g., APP-001)</li>
                <li>• <strong>studentName:</strong> Full name of the student</li>
                <li>• <strong>dob:</strong> Date of birth in YYYY-MM-DD format</li>
                <li>• <strong>classApplied:</strong> Class applied for (e.g., Class 10)</li>
                <li>• <strong>status:</strong> Must be "Pending", "Accepted", or "Rejected"</li>
                <li>• <strong>remarks:</strong> Optional notes</li>
              </ul>
            </div>
            {applications.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No applications uploaded. Upload a CSV to get started.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b"><th className="text-left p-3">Application ID</th><th className="text-left p-3">Student Name</th><th className="text-left p-3">DOB</th><th className="text-left p-3">Class</th><th className="text-left p-3">Status</th><th className="text-left p-3">Remarks</th></tr></thead>
                  <tbody>
                    {applications.map((app, i) => (
                      <tr key={i} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-mono">{app.applicationId}</td>
                        <td className="p-3">{app.studentName}</td>
                        <td className="p-3">{app.dob}</td>
                        <td className="p-3">{app.classApplied}</td>
                        <td className="p-3">{getStatusBadge(app.status)}</td>
                        <td className="p-3">{app.remarks || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="results" className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Results (CSV Upload)</h2>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => downloadSample("result")}>
                  <Download className="w-4 h-4 mr-2" />Download Sample
                </Button>
                {results.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => downloadCSV(results, "results")}>
                    <Download className="w-4 h-4 mr-2" />Download Data
                  </Button>
                )}
                <Label htmlFor="result-upload" className="cursor-pointer">
                  <Button variant="default" size="sm" asChild>
                    <span><Upload className="w-4 h-4 mr-2" />Upload CSV</span>
                  </Button>
                </Label>
                <Input id="result-upload" type="file" accept=".csv" className="hidden" onChange={handleResultUpload} />
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-900 mb-2">Required CSV Format:</h3>
              <p className="text-sm text-blue-800 mb-2"><strong>Headers:</strong> rollNo, studentName, dob, classSelected, year, totalMarks, percentage, result, division</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• <strong>rollNo:</strong> Student roll number (e.g., AB1234)</li>
                <li>• <strong>studentName:</strong> Full name of the student</li>
                <li>• <strong>dob:</strong> Date of birth in YYYY-MM-DD format</li>
                <li>• <strong>classSelected:</strong> Class (e.g., Class 10, Class 12)</li>
                <li>• <strong>year:</strong> 4-digit year (e.g., 2024)</li>
                <li>• <strong>totalMarks:</strong> Total marks obtained (number)</li>
                <li>• <strong>percentage:</strong> Percentage (number with decimals)</li>
                <li>• <strong>result:</strong> Must be "Pass" or "Fail"</li>
                <li>• <strong>division:</strong> Division (e.g., First Division)</li>
              </ul>
            </div>
            {results.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No results uploaded. Upload a CSV to get started.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b"><th className="text-left p-3">Roll No</th><th className="text-left p-3">Student Name</th><th className="text-left p-3">DOB</th><th className="text-left p-3">Class</th><th className="text-left p-3">Year</th><th className="text-left p-3">Total</th><th className="text-left p-3">%</th><th className="text-left p-3">Result</th></tr></thead>
                  <tbody>
                    {results.map((res, i) => (
                      <tr key={i} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-mono">{res.rollNo}</td>
                        <td className="p-3">{res.studentName}</td>
                        <td className="p-3">{res.dob}</td>
                        <td className="p-3">{res.classSelected}</td>
                        <td className="p-3">{res.year}</td>
                        <td className="p-3">{res.totalMarks}</td>
                        <td className="p-3">{res.percentage}%</td>
                        <td className="p-3">{getStatusBadge(res.result)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
