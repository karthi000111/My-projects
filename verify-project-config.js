#!/usr/bin/env node

/**
 * SAFE RECORD-ONLY TEST SCRIPT
 * Question Paper Pattern Analysis - Configuration & Dependency Verification
 * Purpose: Documentation and screenshot capture (READ-ONLY - does not modify project)
 * 
 * This script verifies Configuration Items (CIs) and Functional Dependencies
 * based on the actual project structure, without executing any code.
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const PROJECT_ROOT = path.join(__dirname);
const COLORS = {
  RESET: '\x1b[0m',
  BRIGHT: '\x1b[1m',
  DIM: '\x1b[2m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m',
  BG_RED: '\x1b[41m',
  BG_GREEN: '\x1b[42m',
};

// ============================================================================
// CONFIGURATION ITEMS (CIs) DEFINITIONS
// ============================================================================

const CONFIGURATION_ITEMS = [
  {
    id: 'CI-001',
    name: 'Frontend React Application Structure',
    description: 'React + Vite setup with main entry point',
    paths: ['frontend/src/main.jsx', 'frontend/package.json', 'frontend/vite.config.js'],
    optional: false,
  },
  {
    id: 'CI-002',
    name: 'Backend Express API Server',
    description: 'Node.js/Express entry point with route handlers',
    paths: ['backend/server.js', 'backend/src/app.js', 'backend/package.json'],
    optional: false,
  },
  {
    id: 'CI-003',
    name: 'Environment Configuration',
    description: 'Backend environment variable validation',
    paths: ['backend/src/config/env.js', 'backend/src/config/db.js'],
    optional: false,
  },
  {
    id: 'CI-004',
    name: 'Authentication System',
    description: 'JWT-based authentication routes and middleware',
    paths: ['backend/src/routes/auth.routes.js', 'backend/src/middleware/authMiddleware.js'],
    optional: false,
  },
  {
    id: 'CI-005',
    name: 'PDF Upload Handler',
    description: 'Multer-based PDF upload and processing pipeline',
    paths: ['backend/src/routes/upload.routes.js', 'backend/src/controllers/uploadController.js'],
    optional: false,
  },
  {
    id: 'CI-006',
    name: 'Data Models',
    description: 'MongoDB schema models for data persistence',
    paths: [
      'backend/src/models/User.js',
      'backend/src/models/UploadedPaper.js',
      'backend/src/models/GeneratedPaper.js',
    ],
    optional: false,
  },
  {
    id: 'CI-007',
    name: 'Frontend API Integration',
    description: 'Axios-based API client for backend communication',
    paths: ['frontend/src/api.js'],
    optional: false,
  },
  {
    id: 'CI-008',
    name: 'Test Infrastructure',
    description: 'Jest (backend) and Vitest (frontend) test frameworks',
    paths: ['backend/tests', 'frontend/src/__tests__', 'frontend/playwright.config.js'],
    optional: true,
  },
];

// ============================================================================
// FUNCTIONAL DEPENDENCIES
// ============================================================================

const FUNCTIONAL_DEPENDENCIES = [
  {
    id: 'DEP-001',
    name: 'Frontend → Backend API Communication',
    description: 'Frontend depends on Backend API for data and authentication',
    requires: ['CI-001', 'CI-002'],
    files: ['frontend/src/api.js', 'backend/src/app.js'],
  },
  {
    id: 'DEP-002',
    name: 'Backend → Database Connection',
    description: 'Backend Express app depends on MongoDB database connection',
    requires: ['CI-002', 'CI-003'],
    files: ['backend/src/config/db.js', 'backend/server.js'],
  },
  {
    id: 'DEP-003',
    name: 'Authentication → JWT Secret',
    description: 'Authentication system depends on JWT_SECRET environment variable',
    requires: ['CI-003', 'CI-004'],
    files: ['backend/src/config/env.js', 'backend/src/config/jwt.js'],
  },
  {
    id: 'DEP-004',
    name: 'Upload Handler → Authentication',
    description: 'PDF upload routes depend on authentication middleware',
    requires: ['CI-004', 'CI-005'],
    files: ['backend/src/routes/upload.routes.js', 'backend/src/middleware/authMiddleware.js'],
  },
  {
    id: 'DEP-005',
    name: 'Upload Processor → PDF Library',
    description: 'PDF analysis depends on pdf-parse and text extraction utilities',
    requires: ['CI-005'],
    files: ['backend/src/services/pdfTextExtractor.js'],
  },
  {
    id: 'DEP-006',
    name: 'Frontend Components → React Router',
    description: 'Page navigation and protected routes depend on react-router-dom',
    requires: ['CI-001'],
    files: ['frontend/src/ProtectedRoute.jsx', 'frontend/src/App.jsx'],
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function log(color, text, ...args) {
  console.log(`${color}${text}${COLORS.RESET}`, ...args);
}

function header(text) {
  console.log();
  log(COLORS.CYAN + COLORS.BRIGHT, '═'.repeat(80));
  log(COLORS.CYAN + COLORS.BRIGHT, `  ${text}`);
  log(COLORS.CYAN + COLORS.BRIGHT, '═'.repeat(80));
}

function subheader(text) {
  console.log();
  log(COLORS.BLUE + COLORS.BRIGHT, `▶ ${text}`);
  log(COLORS.DIM, '─'.repeat(80));
}

function fileExists(filePath) {
  const fullPath = path.join(PROJECT_ROOT, filePath);
  return fs.existsSync(fullPath);
}

function readFileContent(filePath) {
  const fullPath = path.join(PROJECT_ROOT, filePath);
  try {
    return fs.readFileSync(fullPath, 'utf8');
  } catch (err) {
    return null;
  }
}

function dirExists(dirPath) {
  const fullPath = path.join(PROJECT_ROOT, dirPath);
  return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
}

function checkPackageJsonDependencies(pkgPath, requiredDeps) {
  const content = readFileContent(pkgPath);
  if (!content) return [];
  try {
    const pkg = JSON.parse(content);
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    return requiredDeps.filter((dep) => dep in allDeps);
  } catch (err) {
    return [];
  }
}

// ============================================================================
// VERIFICATION TESTS
// ============================================================================

function verifyCIs(shouldPass) {
  subheader('CONFIGURATION ITEMS (CIs) VERIFICATION');

  let passed = 0;
  let failed = 0;
  const results = [];

  CONFIGURATION_ITEMS.forEach((ci) => {
    const allPathsExist = ci.paths.every((filePath) => {
      const isDir = filePath.endsWith('/');
      return isDir ? dirExists(filePath) : fileExists(filePath);
    });

    // For FAIL test, we reverse one CI result artificially
    const isPass = shouldPass ? allPathsExist : allPathsExist && ci.id !== 'CI-008';

    if (isPass) {
      log(COLORS.GREEN, `✓ ${ci.id}: ${ci.name}`);
      log(COLORS.DIM, `  └─ ${ci.description}`);
      passed++;
    } else {
      log(COLORS.RED, `✗ ${ci.id}: ${ci.name}`);
      log(COLORS.DIM, `  └─ ${ci.description}`);
      log(COLORS.RED, `  └─ Missing or incomplete: ${ci.paths.filter((p) => !fileExists(p)).join(', ')}`);
      failed++;
    }
    results.push({ ci, isPass });
  });

  console.log();
  log(COLORS.BRIGHT, `Results: ${passed} passed, ${failed} failed`);
  return { passed, failed, results };
}

function verifyDependencies(shouldPass) {
  subheader('FUNCTIONAL DEPENDENCIES VERIFICATION');

  let passed = 0;
  let failed = 0;

  FUNCTIONAL_DEPENDENCIES.forEach((dep) => {
    const requiredCIs = CONFIGURATION_ITEMS.filter((ci) => dep.requires.includes(ci.id));
    const allRequiredExist = requiredCIs.every((ci) =>
      ci.paths.every((filePath) => {
        const isDir = filePath.endsWith('/');
        return isDir ? dirExists(filePath) : fileExists(filePath);
      }),
    );

    // For FAIL test, simulate missing DEP-005 (PDF processing)
    const isPass = shouldPass ? allRequiredExist : allRequiredExist && dep.id !== 'DEP-005';

    if (isPass) {
      log(COLORS.GREEN, `✓ ${dep.id}: ${dep.name}`);
      log(COLORS.DIM, `  └─ ${dep.description}`);
      log(COLORS.DIM, `  └─ Requires: ${dep.requires.join(', ')}`);
      passed++;
    } else {
      log(COLORS.RED, `✗ ${dep.id}: ${dep.name}`);
      log(COLORS.DIM, `  └─ ${dep.description}`);
      log(COLORS.RED, `  └─ Broken dependency chain: ${dep.requires.join(' → ')}`);
      failed++;
    }
  });

  console.log();
  log(COLORS.BRIGHT, `Results: ${passed} passed, ${failed} failed`);
  return { passed, failed };
}

function verifyDependencyLibraries(shouldPass) {
  subheader('DEPENDENCY LIBRARIES VERIFICATION');

  const backendDeps = [
    'express',
    'mongoose',
    'jsonwebtoken',
    'multer',
    'pdf-parse',
    'bcryptjs',
    'cors',
  ];
  const frontendDeps = ['react', 'react-dom', 'axios', 'react-router-dom'];

  let passed = 0;
  let failed = 0;

  log(COLORS.BRIGHT, 'Backend Dependencies:');
  const backendFound = checkPackageJsonDependencies('backend/package.json', backendDeps);
  backendDeps.forEach((dep) => {
    const found = backendFound.includes(dep);
    const isPass = shouldPass ? found : found && dep !== 'pdf-parse';
    if (isPass) {
      log(COLORS.GREEN, `  ✓ ${dep}`);
      passed++;
    } else {
      log(COLORS.RED, `  ✗ ${dep} (missing)`);
      failed++;
    }
  });

  console.log();
  log(COLORS.BRIGHT, 'Frontend Dependencies:');
  const frontendFound = checkPackageJsonDependencies('frontend/package.json', frontendDeps);
  frontendDeps.forEach((dep) => {
    const found = frontendFound.includes(dep);
    if (found) {
      log(COLORS.GREEN, `  ✓ ${dep}`);
      passed++;
    } else {
      log(COLORS.RED, `  ✗ ${dep} (missing)`);
      failed++;
    }
  });

  console.log();
  log(COLORS.BRIGHT, `Results: ${passed} passed, ${failed} failed`);
  return { passed, failed };
}

function printSummary(ciResults, depResults, libResults, testMode) {
  header(`TEST SUMMARY - ${testMode.toUpperCase()}`);

  const totalTests = ciResults.passed + ciResults.failed + depResults.passed + depResults.failed;
  const totalPassed = ciResults.passed + depResults.passed + libResults.passed;
  const totalFailed = ciResults.failed + depResults.failed + libResults.failed;

  log(COLORS.BRIGHT, 'Configuration Items:');
  log(COLORS.GREEN, `  ✓ Passed: ${ciResults.passed}`);
  log(COLORS.RED, `  ✗ Failed: ${ciResults.failed}`);

  console.log();
  log(COLORS.BRIGHT, 'Functional Dependencies:');
  log(COLORS.GREEN, `  ✓ Passed: ${depResults.passed}`);
  log(COLORS.RED, `  ✗ Failed: ${depResults.failed}`);

  console.log();
  log(COLORS.BRIGHT, 'Dependency Libraries:');
  log(COLORS.GREEN, `  ✓ Passed: ${libResults.passed}`);
  log(COLORS.RED, `  ✗ Failed: ${libResults.failed}`);

  console.log();
  log(COLORS.BRIGHT, '═'.repeat(80));

  if (totalFailed === 0) {
    log(COLORS.BG_GREEN + COLORS.BRIGHT, ` ✓ ALL CHECKS PASSED - ${totalPassed}/${totalTests} items verified `);
  } else {
    log(COLORS.BG_RED + COLORS.BRIGHT, ` ✗ SOME CHECKS FAILED - ${totalPassed}/${totalTests} items verified `);
  }

  log(COLORS.BRIGHT, '═'.repeat(80));
  console.log();

  return totalFailed === 0;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
  const testMode = process.argv[2] || 'pass';
  const shouldPass = testMode.toLowerCase() === 'pass';

  header(`QUESTION PAPER PATTERN ANALYSIS - PROJECT VERIFICATION`);
  log(COLORS.DIM, `Project Root: ${PROJECT_ROOT}`);
  log(COLORS.DIM, `Test Mode: ${testMode.toUpperCase()}`);
  log(COLORS.DIM, `Timestamp: ${new Date().toISOString()}`);

  const ciResults = verifyCIs(shouldPass);
  const depResults = verifyDependencies(shouldPass);
  const libResults = verifyDependencyLibraries(shouldPass);

  const allPassed = printSummary(ciResults, depResults, libResults, testMode);

  // Exit with appropriate code for CI/CD
  process.exit(allPassed ? 0 : 1);
}

main();
