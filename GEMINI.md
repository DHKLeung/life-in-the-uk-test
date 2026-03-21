# GEMINI.md - Instructional Context

## Project Overview

The `life-in-the-uk-test` project is a tool for practicing the Life in the UK Test locally and offline. It provides both a static study guide and an interactive web interface.

## Technology Stack

- **Python:** Data processing and automation (`uv` for environment management).
- **Web:** Pure HTML5, CSS3, and JavaScript (No-build, static SPA).
- **Markdown:** Human-readable study guide.
- **CSV/JSON:** Data formats for storage and the web application.

## Current State & Achievements

- **Data Acquired:** Successfully parsed raw exam data into structured CSVs.
- **Web Interface Complete:** A mobile-friendly, interactive website (`index.html`) is fully functional.
    - **Shuffling Logic:** Fisher-Yates algorithm shuffles questions and answer choices for every session.
    - **Offline Capability:** Designed to run via `http.server` locally or hosted on GitHub Pages.
- **Study Guide Generated:** A comprehensive `exams.md` file is available for offline reading.
- **Testing Suite:** Modularized code with unit tests to ensure data integrity and correct formatting.

## Data Acquisition

The data is fetched from direct assets of a publicly available Life in the UK resource. The `generate_markdown.py` script bypasses the web UI to ensure complete access to all available exams and explanations.

**Key Features of Automation:**
1.  **Fast:** Direct asset fetching is more efficient than web scraping.
2.  **Complete:** Accesses all raw data including explanations (references).
3.  **Dynamic:** Automatically picks up any new exams added to the source data.

## Code Structure

- `generate_markdown.py`: Fetches data and generates the Markdown guide.
- `generate_json.py`: Processes CSV data into the `exams.json` format used by the website.
- `app.js`: Core logic for the web application (shuffling, state management, UI).
- `tests/`: Unit tests for data processing logic.

## Deployment

The website is optimized for **GitHub Pages**. All assets use relative paths to ensure compatibility with both local serving and subdirectory hosting.
