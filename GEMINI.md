# GEMINI.md - Instructional Context

## Project Overview

The `life-in-the-uk-test` project is a tool for practicing the Life in the UK Test locally and offline. It currently focuses on data acquisition from existing resources and providing a static study guide in Markdown.

## Technology Stack

- **Python:** Primary language for data processing and automation.
- **`uv`:** Modern package manager and environment handler for reproducibility.
- **`pytest`:** Unit testing framework.
- **Markdown:** The human-readable format for the study guide.
- **CSV:** The raw data format for questions and answers.

## Current State & Achievements

- **Data Acquired:** Successfully identified and downloaded `questions.csv` and `answers.csv` from [domicch/life-in-uk](https://domicch.github.io/life-in-uk/).
- **Study Guide Generated:** A 6000+ line `exams.md` file has been created, containing all 18 exams, with questions, multiple-choice options, correct answers, and explanations.
- **Environment Initialized:** A `uv` Python environment is fully configured with dependencies (`requests`, `pytest`) and a `.python-version` file.
- **Testing Suite:** Modularized code with unit tests in `tests/` to ensure data integrity and correct formatting.

## Data Acquisition Discovery

The target site is a Single Page Application (SPA), which makes simple scraping difficult. Through source code analysis, it was discovered that the app fetches its database from direct CSV URLs. 

**Current Strategy:** The `generate_markdown.py` script bypasses the web UI and downloads these CSVs directly from the site's assets. This approach is:
1.  **Fast:** No need to render JavaScript for 18+ separate pages.
2.  **Complete:** Accesses all raw data including explanations (references) that are often hidden in "test mode."
3.  **Evergreen:** The script dynamically identifies all exam numbers present in the CSV data, meaning it will automatically pick up any new exams added to the source.

## Code Structure

- `generate_markdown.py`:
    - `download_csv()`: Fetches the raw data.
    - `parse_questions()`: Builds the question-reference dictionary.
    - `parse_answers()`: Merges answer options into the question objects.
    - `format_markdown()`: Generates the structured Markdown content.
- `tests/test_generate_markdown.py`:
    - Uses `pytest` fixtures and mock data to verify each processing step.

## Key Files & Locations

- `exams.md`: The primary study resource for the user.
- `questions.csv` & `answers.csv`: The raw source data.
- `generate_markdown.py`: The core logic for processing data.
- `pyproject.toml` & `uv.lock`: Environment and dependency definitions.

## Future Direction

The next phase is to build an interactive, locally-hostable web interface to practice the exams dynamically, utilizing the existing CSV/Markdown data as a foundation.
