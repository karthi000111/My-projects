# Question Paper Pattern Analysis

Full-stack app for uploading past question papers, extracting repeated questions and topics, and helping teachers review likely focus areas for future papers.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB
- Tests: Vitest and Jest

## Project Structure

- `frontend` contains the React app
- `backend` contains the API, PDF analysis logic, uploads, and tests

## Prerequisites

- Node.js 18+
- npm
- MongoDB
- Optional for scanned PDFs: `tesseract` and `pdftoppm` (Poppler)

## Setup

1. Create the backend env file:

```powershell
cd backend
Copy-Item .env.example .env
```

2. Review `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/question-paper-pattern-analysis
JWT_SECRET=change-this-secret
PORT=5000
OCR_ENABLED=true
OCR_TESSERACT_COMMAND=tesseract
OCR_PDFTOPPM_COMMAND=pdftoppm
OCR_MAX_PAGES=4
OCR_DPI=180
```

3. Start the backend:

```powershell
cd backend
npm start
```

4. Start the frontend in a second terminal:

```powershell
cd frontend
npm run dev
```

5. Open the frontend URL shown by Vite, usually `http://localhost:5173`

## OCR Setup For Scanned PDFs

Install both tools if you want analysis to work on scanned or image-only PDFs:

- `tesseract` for OCR text recognition
- `pdftoppm` from Poppler to render PDF pages as images before OCR

Typical Windows approach:

1. Install Tesseract OCR and make sure the install folder is on `PATH`
2. Install Poppler for Windows and make sure its `bin` folder is on `PATH`
3. Restart the terminal after updating `PATH`

If the commands are not on `PATH`, set them explicitly in `backend/.env`:

```env
OCR_TESSERACT_COMMAND=C:\path\to\tesseract.exe
OCR_PDFTOPPM_COMMAND=C:\path\to\pdftoppm.exe
```

The app exposes OCR readiness at `GET /api/upload/analysis/ocr-status` after login, and the upload screen now shows whether scanned PDFs are supported on the current machine.

## Usage

1. Register or log in
2. Upload at least 1 PDF for one subject
3. Open the dashboard or analysis page
4. Run analysis on the latest batch

## Tests

Backend:

```powershell
cd backend
npm test
```

Frontend:

```powershell
cd frontend
npm test
```

Backend analysis tests:

```powershell
cd backend
npx jest tests/analysis.test.js tests/analysis-regression.test.js --runInBand
```

## Notes

- Frontend API requests default to `http://localhost:5000`
- Uploaded files are stored in `backend/uploads`
- Analysis requires at least 1 PDF in the same batch
- Scanned or image-only PDFs can use OCR automatically during analysis when `tesseract` and `pdftoppm` are installed
- If OCR tools are unavailable, analysis falls back to normal PDF text extraction
