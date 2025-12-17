import { ApplicationStatus, StudentResult } from "./store";

export interface VerificationData {
  rollNo: string;
  studentName: string;
  classSelected: string;
  year: string;
  dob: string;
  status: "Pass" | "Fail";
}

export interface CSVValidationError {
  row: number;
  errors: string[];
}

export interface CSVValidationResult {
  valid: boolean;
  errors: CSVValidationError[];
  data: any[];
}

const VERIFICATION_HEADERS = ["rollNo", "studentName", "classSelected", "year", "dob", "status"];
const APPLICATION_HEADERS = ["applicationId", "studentName", "dob", "classApplied", "status", "remarks"];
const RESULT_HEADERS = ["rollNo", "studentName", "dob", "classSelected", "year", "totalMarks", "percentage", "result", "division"];

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function parseCSV(text: string): string[][] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  
  return lines.map((line) => parseCSVLine(line));
}

export function validateVerificationCSV(text: string): CSVValidationResult {
  const errors: CSVValidationError[] = [];
  const data: VerificationData[] = [];

  try {
    const rows = parseCSV(text);
    
    if (rows.length === 0) {
      return { valid: false, errors: [{ row: 0, errors: ["CSV file is empty"] }], data: [] };
    }

    const headers = rows[0].map((h) => h.trim().toLowerCase());
    const expectedHeaders = VERIFICATION_HEADERS.map((h) => h.toLowerCase());
    
    const missingHeaders = expectedHeaders.filter((h) => !headers.includes(h));
    if (missingHeaders.length > 0) {
      return {
        valid: false,
        errors: [{ row: 0, errors: [`Missing required headers: ${missingHeaders.join(", ")}`] }],
        data: [],
      };
    }

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const rowErrors: string[] = [];
      
      if (row.length !== headers.length) {
        rowErrors.push(`Expected ${headers.length} columns, got ${row.length}`);
        errors.push({ row: i + 1, errors: rowErrors });
        continue;
      }

      const rowData: any = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index].trim();
      });

      if (!rowData.rollno || rowData.rollno.length === 0) {
        rowErrors.push("Roll number is required");
      }
      if (!rowData.studentname || rowData.studentname.length === 0) {
        rowErrors.push("Student name is required");
      }
      if (!rowData.classselected || !["10", "12"].includes(rowData.classselected)) {
        rowErrors.push("Class must be 10 or 12");
      }
      if (!rowData.year || !/^\d{4}$/.test(rowData.year)) {
        rowErrors.push("Year must be a 4-digit number");
      }
      if (!rowData.dob || !/^\d{4}-\d{2}-\d{2}$/.test(rowData.dob)) {
        rowErrors.push("DOB must be in YYYY-MM-DD format");
      }
      if (!rowData.status || !["Pass", "Fail"].includes(rowData.status)) {
        rowErrors.push("Status must be Pass or Fail");
      }

      if (rowErrors.length > 0) {
        errors.push({ row: i + 1, errors: rowErrors });
      } else {
        data.push({
          rollNo: rowData.rollno,
          studentName: rowData.studentname,
          classSelected: rowData.classselected,
          year: rowData.year,
          dob: rowData.dob,
          status: rowData.status,
        });
      }
    }

    return { valid: errors.length === 0, errors, data };
  } catch (error) {
    return {
      valid: false,
      errors: [{ row: 0, errors: ["Failed to parse CSV file. Please check the format."] }],
      data: [],
    };
  }
}

export function validateApplicationCSV(text: string): CSVValidationResult {
  const errors: CSVValidationError[] = [];
  const data: ApplicationStatus[] = [];

  try {
    const rows = parseCSV(text);
    
    if (rows.length === 0) {
      return { valid: false, errors: [{ row: 0, errors: ["CSV file is empty"] }], data: [] };
    }

    const headers = rows[0].map((h) => h.trim().toLowerCase());
    const expectedHeaders = APPLICATION_HEADERS.map((h) => h.toLowerCase());
    
    const missingHeaders = expectedHeaders.filter((h) => !headers.includes(h));
    if (missingHeaders.length > 0) {
      return {
        valid: false,
        errors: [{ row: 0, errors: [`Missing required headers: ${missingHeaders.join(", ")}`] }],
        data: [],
      };
    }

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const rowErrors: string[] = [];
      
      if (row.length !== headers.length) {
        rowErrors.push(`Expected ${headers.length} columns, got ${row.length}`);
        errors.push({ row: i + 1, errors: rowErrors });
        continue;
      }

      const rowData: any = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index].trim();
      });

      if (!rowData.applicationid || rowData.applicationid.length === 0) {
        rowErrors.push("Application ID is required");
      }
      if (!rowData.studentname || rowData.studentname.length === 0) {
        rowErrors.push("Student name is required");
      }
      if (!rowData.dob || !/^\d{4}-\d{2}-\d{2}$/.test(rowData.dob)) {
        rowErrors.push("DOB must be in YYYY-MM-DD format");
      }
      if (!rowData.classapplied || rowData.classapplied.length === 0) {
        rowErrors.push("Class applied is required");
      }
      if (!rowData.status || !["Pending", "Accepted", "Rejected"].includes(rowData.status)) {
        rowErrors.push("Status must be Pending, Accepted, or Rejected");
      }

      if (rowErrors.length > 0) {
        errors.push({ row: i + 1, errors: rowErrors });
      } else {
        data.push({
          applicationId: rowData.applicationid,
          studentName: rowData.studentname,
          dob: rowData.dob,
          classApplied: rowData.classapplied,
          status: rowData.status as ApplicationStatus["status"],
          remarks: rowData.remarks || "",
        });
      }
    }

    return { valid: errors.length === 0, errors, data };
  } catch (error) {
    return {
      valid: false,
      errors: [{ row: 0, errors: ["Failed to parse CSV file. Please check the format."] }],
      data: [],
    };
  }
}

export function validateResultCSV(text: string): CSVValidationResult {
  const errors: CSVValidationError[] = [];
  const data: StudentResult[] = [];

  try {
    const rows = parseCSV(text);
    
    if (rows.length === 0) {
      return { valid: false, errors: [{ row: 0, errors: ["CSV file is empty"] }], data: [] };
    }

    const headers = rows[0].map((h) => h.trim().toLowerCase());
    const expectedHeaders = RESULT_HEADERS.map((h) => h.toLowerCase());
    
    const missingHeaders = expectedHeaders.filter((h) => !headers.includes(h));
    if (missingHeaders.length > 0) {
      return {
        valid: false,
        errors: [{ row: 0, errors: [`Missing required headers: ${missingHeaders.join(", ")}`] }],
        data: [],
      };
    }

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const rowErrors: string[] = [];
      
      if (row.length !== headers.length) {
        rowErrors.push(`Expected ${headers.length} columns, got ${row.length}`);
        errors.push({ row: i + 1, errors: rowErrors });
        continue;
      }

      const rowData: any = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index].trim();
      });

      if (!rowData.rollno || rowData.rollno.length === 0) {
        rowErrors.push("Roll number is required");
      }
      if (!rowData.studentname || rowData.studentname.length === 0) {
        rowErrors.push("Student name is required");
      }
      if (!rowData.dob || !/^\d{4}-\d{2}-\d{2}$/.test(rowData.dob)) {
        rowErrors.push("DOB must be in YYYY-MM-DD format");
      }
      if (!rowData.classselected || rowData.classselected.length === 0) {
        rowErrors.push("Class is required");
      }
      if (!rowData.year || !/^\d{4}$/.test(rowData.year)) {
        rowErrors.push("Year must be a 4-digit number");
      }
      if (!rowData.totalmarks || isNaN(Number(rowData.totalmarks))) {
        rowErrors.push("Total marks must be a number");
      }
      if (!rowData.percentage || isNaN(Number(rowData.percentage))) {
        rowErrors.push("Percentage must be a number");
      }
      if (!rowData.result || !["Pass", "Fail"].includes(rowData.result)) {
        rowErrors.push("Result must be Pass or Fail");
      }
      if (!rowData.division || rowData.division.length === 0) {
        rowErrors.push("Division is required");
      }

      if (rowErrors.length > 0) {
        errors.push({ row: i + 1, errors: rowErrors });
      } else {
        data.push({
          rollNo: rowData.rollno,
          studentName: rowData.studentname,
          dob: rowData.dob,
          classSelected: rowData.classselected,
          year: rowData.year,
          subjects: [],
          totalMarks: parseInt(rowData.totalmarks),
          percentage: parseFloat(rowData.percentage),
          result: rowData.result as StudentResult["result"],
          division: rowData.division,
        });
      }
    }

    return { valid: errors.length === 0, errors, data };
  } catch (error) {
    return {
      valid: false,
      errors: [{ row: 0, errors: ["Failed to parse CSV file. Please check the format."] }],
      data: [],
    };
  }
}

export function generateSampleVerificationCSV(): string {
  const headers = VERIFICATION_HEADERS.join(",");
  const rows = [
    "AB1234,John Doe,12,2024,2006-05-15,Pass",
    "AB1235,Jane Smith,10,2024,2008-08-20,Pass",
    "AB1236,Mike Johnson,12,2023,2005-11-30,Fail",
  ];
  return [headers, ...rows].join("\n");
}

export function generateSampleApplicationCSV(): string {
  const headers = APPLICATION_HEADERS.join(",");
  const rows = [
    "APP-001,John Doe,2006-05-15,Class 12,Accepted,Admission confirmed",
    "APP-002,Jane Smith,2008-08-20,Class 10,Pending,Under review",
    "APP-003,Mike Johnson,2005-11-30,Class 12,Rejected,Incomplete documents",
  ];
  return [headers, ...rows].join("\n");
}

export function generateSampleResultCSV(): string {
  const headers = RESULT_HEADERS.join(",");
  const rows = [
    "AB1234,John Doe,2006-05-15,Class 12,2024,467,85.5,Pass,First Division",
    "AB1235,Jane Smith,2008-08-20,Class 10,2024,425,78.2,Pass,First Division",
    "AB1236,Mike Johnson,2005-11-30,Class 12,2023,310,56.4,Pass,Second Division",
  ];
  return [headers, ...rows].join("\n");
}
