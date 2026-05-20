const configurationItems = [
  {
    ciId: "CI-001",
    name: "Authentication Module",
    version: "v1.2",
    status: "Approved",
    owner: "Frontend + Backend",
    files: "frontend/src/auth.js, backend/src/controllers/authController.js",
  },
  {
    ciId: "CI-002",
    name: "PDF Upload Module",
    version: "v1.3",
    status: "Reviewed",
    owner: "Backend",
    files: "frontend/src/UploadPDF.jsx, backend/src/controllers/uploadController.js",
  },
  {
    ciId: "CI-003",
    name: "Analysis Module",
    version: "v2.0",
    status: "Approved",
    owner: "Backend + Frontend",
    files: "frontend/src/Analysis.jsx, backend/src/services/pdfTextExtractor.js",
  },
  {
    ciId: "CI-004",
    name: "Teacher Generator Module",
    version: "v1.1",
    status: "Reviewed",
    owner: "Frontend + Backend",
    files: "frontend/src/QuestionPaperGenerator.jsx, backend/src/controllers/teacherController.js",
  },
  {
    ciId: "CI-005",
    name: "Database Schema",
    version: "v1.0",
    status: "Approved",
    owner: "Backend",
    files: "backend/src/models/User.js, UploadedPaper.js, AnalysisRun.js, TeacherWorkspace.js",
  },
  {
    ciId: "CI-006",
    name: "User Interface",
    version: "v1.4",
    status: "Reviewed",
    owner: "Frontend",
    files: "frontend/src/App.jsx, Dashboard.jsx, TeacherDashboard.jsx",
  },
  {
    ciId: "CI-007",
    name: "Test Cases and Reports",
    version: "v1.1",
    status: "Approved",
    owner: "QA",
    files: "frontend/tests, backend/tests",
  },
];

const dependencies = [
  {
    module: "Authentication Module",
    dependsOn: "Database Schema",
    dependencyType: "Data Dependency",
    reason: "Stores and validates user credentials and roles.",
  },
  {
    module: "PDF Upload Module",
    dependsOn: "Authentication Module + Database Schema",
    dependencyType: "Control + Data Dependency",
    reason: "Only authenticated users can upload PDFs and metadata is stored in the database.",
  },
  {
    module: "Analysis Module",
    dependsOn: "PDF Upload Module + Database Schema",
    dependencyType: "Functional Dependency",
    reason: "Analysis runs only after uploaded PDFs are available for a selected batch.",
  },
  {
    module: "Teacher Generator Module",
    dependsOn: "Analysis Module + Authentication Module",
    dependencyType: "Functional Dependency",
    reason: "Teacher paper generation uses analysis results and teacher role validation.",
  },
  {
    module: "User Interface",
    dependsOn: "All Core Modules",
    dependencyType: "Functional Dependency",
    reason: "UI interacts with login, upload, analysis, dashboard, and generator services.",
  },
  {
    module: "Test Cases and Reports",
    dependsOn: "All Core Modules",
    dependencyType: "Verification Dependency",
    reason: "Tests validate behavior of frontend routes, APIs, uploads, auth, and analysis flows.",
  },
];

console.log("Question Paper Pattern Analysis - Configuration Item Tracking");
console.log("-------------------------------------------------------------");
console.table(configurationItems);

console.log("\nQuestion Paper Pattern Analysis - Functional Dependencies");
console.log("--------------------------------------------------------");
console.table(dependencies);

console.log("\nResult:");
console.log(
  "Configuration items of the Question Paper Pattern Analysis system were identified and tracked successfully."
);
console.log(
  "Functional dependencies among authentication, upload, analysis, teacher generator, database, and UI modules were documented clearly."
);
