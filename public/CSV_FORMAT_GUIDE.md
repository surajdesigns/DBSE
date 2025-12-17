# CSV Upload Format Guide - School Portal

This guide explains how to upload CSV files in the admin dashboard for Verification, Application Status, and Results data.

## Important Notes

- **File Format:** Only `.csv` files are accepted
- **Encoding:** UTF-8 encoding is required
- **Headers:** First row MUST contain exact header names (case-insensitive)
- **Date Format:** All dates must be in YYYY-MM-DD format
- **No Empty Rows:** Remove any blank rows from your CSV before uploading

---

## 1. Verification Data CSV

**Purpose:** Upload student verification records for instant online verification

**Required Headers:**
```
rollNo,studentName,classSelected,year,dob,status
```

**Field Descriptions:**
- `rollNo`: Student roll number (e.g., AB1234)
- `studentName`: Full name of the student
- `classSelected`: Must be exactly `10` or `12`
- `year`: 4-digit year (e.g., 2024)
- `dob`: Date of birth in YYYY-MM-DD format
- `status`: Must be exactly `Pass` or `Fail`

**Sample CSV:**
```csv
rollNo,studentName,classSelected,year,dob,status
AB1234,John Doe,12,2024,2006-05-15,Pass
AB1235,Jane Smith,10,2024,2008-08-20,Pass
AB1236,Mike Johnson,12,2023,2005-11-30,Fail
```

**Validation Rules:**
- Roll number cannot be empty
- Student name cannot be empty
- Class must be 10 or 12
- Year must be exactly 4 digits
- DOB must match format YYYY-MM-DD
- Status must be Pass or Fail (case-sensitive)

---

## 2. Application Status CSV

**Purpose:** Upload application status data for students to check their application progress

**Required Headers:**
```
applicationId,studentName,dob,classApplied,status,remarks
```

**Field Descriptions:**
- `applicationId`: Unique application ID (e.g., APP-001)
- `studentName`: Full name of the student
- `dob`: Date of birth in YYYY-MM-DD format
- `classApplied`: Class applied for (e.g., Class 10, Class 12)
- `status`: Must be `Pending`, `Accepted`, or `Rejected`
- `remarks`: Optional notes (can be empty)

**Sample CSV:**
```csv
applicationId,studentName,dob,classApplied,status,remarks
APP-001,John Doe,2006-05-15,Class 12,Accepted,Admission confirmed
APP-002,Jane Smith,2008-08-20,Class 10,Pending,Under review
APP-003,Mike Johnson,2005-11-30,Class 12,Rejected,Incomplete documents
```

**Validation Rules:**
- Application ID cannot be empty
- Student name cannot be empty
- DOB must match format YYYY-MM-DD
- Class applied cannot be empty
- Status must be Pending, Accepted, or Rejected (case-sensitive)
- Remarks field is optional

---

## 3. Results CSV

**Purpose:** Upload student exam results for online result checking

**Required Headers:**
```
rollNo,studentName,dob,classSelected,year,totalMarks,percentage,result,division
```

**Field Descriptions:**
- `rollNo`: Student roll number (e.g., AB1234)
- `studentName`: Full name of the student
- `dob`: Date of birth in YYYY-MM-DD format
- `classSelected`: Class (e.g., Class 10, Class 12)
- `year`: 4-digit year (e.g., 2024)
- `totalMarks`: Total marks obtained (number only)
- `percentage`: Percentage (decimal number, e.g., 85.5)
- `result`: Must be `Pass` or `Fail`
- `division`: Division text (e.g., First Division)

**Sample CSV:**
```csv
rollNo,studentName,dob,classSelected,year,totalMarks,percentage,result,division
AB1234,John Doe,2006-05-15,Class 12,2024,467,85.5,Pass,First Division
AB1235,Jane Smith,2008-08-20,Class 10,2024,425,78.2,Pass,First Division
AB1236,Mike Johnson,2005-11-30,Class 12,2023,310,56.4,Pass,Second Division
```

**Validation Rules:**
- Roll number cannot be empty
- Student name cannot be empty
- DOB must match format YYYY-MM-DD
- Class cannot be empty
- Year must be exactly 4 digits
- Total marks must be a valid number
- Percentage must be a valid decimal number
- Result must be Pass or Fail (case-sensitive)
- Division cannot be empty

---

## How to Upload CSV Files

### Step 1: Prepare Your CSV File
1. Create a CSV file in Excel, Google Sheets, or any text editor
2. Ensure the first row contains the exact header names
3. Fill in the data rows below the headers
4. Save as CSV (UTF-8) format

### Step 2: Login as Admin
1. Go to the website homepage
2. Click "Login" in the navigation bar
3. Use admin credentials:
   - Email: `suraj244023@gmail.com`
   - Password: `suraj244023@gmail.com`

### Step 3: Upload CSV
1. Navigate to `/admin` page
2. Click on the appropriate tab:
   - **Verification Data (CSV)** for verification records
   - **Applications (CSV)** for application status
   - **Results (CSV)** for exam results
3. Click **"Download Sample"** button to get a template
4. Click **"Upload CSV"** button
5. Select your CSV file
6. Wait for validation

### Step 4: Handle Validation Errors
If validation fails:
- Error messages will show which rows have problems
- Error messages show up to 5 errors at a time
- Fix the errors in your CSV file
- Re-upload the corrected file

### Step 5: Verify Upload
- Check the data table below to confirm your data is uploaded
- Use **"Download Data"** to export current data as CSV backup
- Test the search functionality on student-facing pages

---

## Common Errors and Solutions

### Error: "Missing required headers"
**Solution:** Ensure first row has exact header names (case doesn't matter)

### Error: "DOB must be in YYYY-MM-DD format"
**Solution:** Change date format to YYYY-MM-DD (e.g., 2006-05-15, not 15/05/2006)

### Error: "Class must be 10 or 12"
**Solution:** Use only numbers 10 or 12, not "Class 10" or "Tenth"

### Error: "Status must be Pass or Fail"
**Solution:** Use exact text "Pass" or "Fail" (case-sensitive)

### Error: "Year must be a 4-digit number"
**Solution:** Use full 4-digit year like 2024, not 24

### Error: "Expected X columns, got Y"
**Solution:** Check for missing commas or extra commas in your CSV rows

---

## Student Search Instructions

After uploading CSV data, students can search using:

### Verification Page (`/verification`)
- Enter: Roll Number, Class, Year, Date of Birth
- Result: Shows student name and pass/fail status

### Application Status Page (`/application`)
- Enter: Application ID, Date of Birth
- Result: Shows application status and remarks

### Results Page (`/results`)
- Enter: Roll Number, Class, Year, Date of Birth
- Result: Shows detailed marksheet with subject-wise marks

---

## Storage Information

- All data is stored in **browser localStorage** (frontend only)
- No backend database is used
- Data persists until browser cache is cleared
- Each upload **replaces** previous data (not append)
- Admin can download current data as backup CSV

---

## Tips for Success

1. **Test with Sample CSVs:** Download sample CSV files from the admin dashboard
2. **Check UTF-8 Encoding:** Save Excel files as "CSV UTF-8" to avoid character issues
3. **Remove Empty Rows:** Delete any blank rows at the end of your CSV
4. **Consistent Formatting:** Keep date formats consistent across all rows
5. **Backup Data:** Use "Download Data" button to save backups before uploading new files
6. **Validate First:** Fix validation errors before trying to use the search features

---

## Contact

For technical support or questions about CSV uploads, please contact the system administrator.
