# LogLens-SIEM-Lite
# LogLens AI - Automated SIEM-Lite Threat Intelligence Framework

LogLens AI is an enterprise-grade, lightweight Security Information and Event Management (SIEM) pipeline designed to ingest, parse, and block malicious cyber threat vectors from production web server logs (Apache/Nginx) in real-time. 

The architecture features a hybrid model: a highly resilient **Python Flask Backend** paired with an **Asynchronous Client-Side Monitoring Console**, optimizing processing speeds for heavy telemetry feeds.

---

## 🚀 Core Architectural Technical Features

### 1. High-Performance Stream Ingestion Pipeline (500MB+ Logs Optimization)
To guarantee an absolute O(1) memory complexity overhead and prevent Out-Of-Memory (OOM) memory framework exhaustion under severe system loads, the log processing layer utilizes **Python Chunk Generators (`yield`)**. Instead of pulling multi-gigabyte log strings entirely into RAM arrays, the runtime stream reads files line-by-line via a micro-chunk buffer pipeline.

### 2. Analytical Telemetry Framework & Multi-Column Auditing Matrix
The extraction rule filters execute complex regex scanning to identify, segment, and log highly structured protocol metadata strings, ensuring full compliance reporting:
- **HTTP Protocol Actions Tracker:** Categorizes protocol methods (`GET`, `POST`, `PUT`, `DELETE`).
- **Target request URI Tracing:** Captures complete system paths along with live parameter blocks.
- **HTTP Code Profiling:** Tracks responsive server matrices (e.g., `200 OK`, `401 Unauthorized`, `403 Forbidden`).
- **Dynamic Variable Ingestion Metrics:** Real-time logging of user timestamps and attacker unique target source IPs.

### 3. Automated Threat Rule Configuration & Localized Tracing Enrichment
- **Dynamic Signature Mappings:** Security profiles are managed entirely by `signatures.json` configuration blocks, mapping regex rules to behavioral severities (`HIGH`, `MEDIUM`, `LOW`) dynamically.
- **GeoIP Localization Layout:** Enriching attacker coordinates by tracing and rendering targeted host countries (e.g., `[Russia]`, `[United States]`, `[China]`).
- **Timeline Hour Zone Aggregator:** Groups historical logs to track attack acceleration levels per hour slot.
- **Export Configuration Toolkit:** Local audit logs compilation engine that generates plaintext forensically aligned compliance documents on local host files.

---

## 🛠️ Software Repository Architecture Diagram
```text
├── app.py                  # Multi-threaded Flask API backend server gateway
├── parser.py               # Log ingestion logic utilizing python chunk streaming
├── detector.py             # Rule signature algorithmic detection processing engine
├── signatures.json         # Decoupled JSON threat rules severity database
├── final_dashboard.html    # Standalone hybrid dark-theme Operations Center view
└── hackertest.log          # Baseline pre-compiled server valuation dataset
```

---

## 💻 Local Setup & Execution Guide (Terminal Commands)

Follow these explicit sequential steps to launch the entire LogLens stack on a local Windows node:

### 1. Ingestion Backend Environment Setup
Open a standard command prompt terminal in the main directory:
```bash
# 1. Virtual Environment initialization
python -m venv venv

# 2. Activate the localized virtual environment
venv\Scripts\activate

# 3. Download core runtime connection packages
pip install Flask flask-cors requests
```

### 2. Running the Hybrid Stack
Ensure your local `hackertest.log` dataset resides side-by-side with `app.py`.

* **Terminal A (Python API Engine Running on Port 5000):**
  ```bash
  venv\Scripts\activate
  python app.py
  ```
  *(Verify terminal terminal traces indicate: `* Running on all addresses (0.0.0.0)`)*

* **Terminal B (Operations Console Dashboard):**
  Simply go to Windows File Explorer and **Double-Click** on `final_dashboard.html`. It will launch the premium operations panel inside any modern web browser.

---

## 📊 Evaluation & Verification Checklists
- **Evaluator Quick Access Mode:** Click on the green **LOAD DEMO LOG** button. The interface immediately renders multi-column threat grids, logs protocol methods, maps GeoIP countries, and generates the Hour-Zone timeline chart without needing manual folder uploads.
- **Production Audit Logging:** Click on the yellow **EXPORT COMPILATION AUDIT LOG** to download the `loglens_final_security_report.txt` forensic ledger on local disk files instantly.
