export interface FormSubmission {
  id: string;
  studentName: string;
  guardianName: string;
  email: string;
  mobile: string;
  formType: string;
  classSelected: string;
  submissionDate: string;
  status: "Pending" | "Approved" | "Rejected";
}

export interface VerificationRequest {
  id: string;
  candidateName: string;
  rollNo: string;
  classSelected: string;
  year: string;
  email: string;
  mobile: string;
  purpose: string;
  submissionDate: string;
  status: "Pending" | "Verified" | "Rejected";
}

export interface ApplicationStatus {
  applicationId: string;
  studentName: string;
  dob: string;
  classApplied: string;
  status: "Pending" | "Accepted" | "Rejected";
  remarks?: string;
}

export interface StudentResult {
  rollNo: string;
  studentName: string;
  dob: string;
  classSelected: string;
  year: string;
  subjects: Array<{
    name: string;
    theory: number;
    practical: number;
    total: number;
    grade: string;
  }>;
  totalMarks: number;
  percentage: number;
  result: "Pass" | "Fail";
  division: string;
}

const STORAGE_KEYS = {
  FORMS: "dsbe_form_submissions",
  VERIFICATIONS: "dsbe_verifications",
  APPLICATIONS: "dsbe_applications",
  RESULTS: "dsbe_results",
};

function getStorageItem<T>(key: string, defaultValue: T[]): T[] {
  if (typeof window === "undefined") return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const formStore = {
  getAll: (): FormSubmission[] => getStorageItem(STORAGE_KEYS.FORMS, []),
  add: (submission: Omit<FormSubmission, "id" | "submissionDate" | "status">) => {
    const submissions = formStore.getAll();
    const newSubmission: FormSubmission = {
      ...submission,
      id: `FORM-${Date.now()}`,
      submissionDate: new Date().toISOString(),
      status: "Pending",
    };
    submissions.push(newSubmission);
    setStorageItem(STORAGE_KEYS.FORMS, submissions);
    return newSubmission;
  },
  updateStatus: (id: string, status: FormSubmission["status"]) => {
    const submissions = formStore.getAll();
    const index = submissions.findIndex((s) => s.id === id);
    if (index !== -1) {
      submissions[index].status = status;
      setStorageItem(STORAGE_KEYS.FORMS, submissions);
    }
  },
  delete: (id: string) => {
    const submissions = formStore.getAll().filter((s) => s.id !== id);
    setStorageItem(STORAGE_KEYS.FORMS, submissions);
  },
};

export const verificationStore = {
  getAll: (): VerificationRequest[] => getStorageItem(STORAGE_KEYS.VERIFICATIONS, []),
  add: (request: Omit<VerificationRequest, "id" | "submissionDate" | "status">) => {
    const requests = verificationStore.getAll();
    const newRequest: VerificationRequest = {
      ...request,
      id: `VER-${Date.now()}`,
      submissionDate: new Date().toISOString(),
      status: "Pending",
    };
    requests.push(newRequest);
    setStorageItem(STORAGE_KEYS.VERIFICATIONS, requests);
    return newRequest;
  },
  updateStatus: (id: string, status: VerificationRequest["status"]) => {
    const requests = verificationStore.getAll();
    const index = requests.findIndex((r) => r.id === id);
    if (index !== -1) {
      requests[index].status = status;
      setStorageItem(STORAGE_KEYS.VERIFICATIONS, requests);
    }
  },
};

export const applicationStore = {
  getAll: (): ApplicationStatus[] => getStorageItem(STORAGE_KEYS.APPLICATIONS, []),
  setAll: (applications: ApplicationStatus[]) => {
    setStorageItem(STORAGE_KEYS.APPLICATIONS, applications);
  },
  search: (applicationId: string, dob: string): ApplicationStatus | null => {
    const applications = applicationStore.getAll();
    return applications.find(
      (a) => a.applicationId.toLowerCase() === applicationId.toLowerCase() && a.dob === dob
    ) || null;
  },
};

export const resultStore = {
  getAll: (): StudentResult[] => getStorageItem(STORAGE_KEYS.RESULTS, []),
  setAll: (results: StudentResult[]) => {
    setStorageItem(STORAGE_KEYS.RESULTS, results);
  },
  search: (rollNo: string, dob: string): StudentResult | null => {
    const results = resultStore.getAll();
    return results.find(
      (r) => r.rollNo.toLowerCase() === rollNo.toLowerCase() && r.dob === dob
    ) || null;
  },
};

export interface VerificationData {
  rollNo: string;
  studentName: string;
  classSelected: string;
  year: string;
  dob: string;
  status: "Pass" | "Fail";
}

const STORAGE_KEYS_EXTENDED = {
  ...STORAGE_KEYS,
  VERIFICATION_DATA: "dsbe_verification_data",
};

export const verificationDataStore = {
  getAll: (): VerificationData[] => getStorageItem(STORAGE_KEYS_EXTENDED.VERIFICATION_DATA, []),
  setAll: (data: VerificationData[]) => {
    setStorageItem(STORAGE_KEYS_EXTENDED.VERIFICATION_DATA, data);
  },
  search: (rollNo: string, dob: string): VerificationData | null => {
    const data = verificationDataStore.getAll();
    return data.find(
      (v) => v.rollNo.toLowerCase() === rollNo.toLowerCase() && v.dob === dob
    ) || null;
  },
};
	