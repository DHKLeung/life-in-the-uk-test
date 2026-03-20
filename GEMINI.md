# GEMINI.md - Instructional Context

## Project Overview

The `life-in-the-uk-test` project is a tool for practicing the Life in the UK Test locally and offline. It currently focuses on data acquisition from existing resources and providing a static study guide in Markdown.

## Technology Stack

- **Python:** Used for scraping, data processing, and script generation.
- **`uv`:** Used for managing Python dependencies and running scripts.
- **Markdown:** The primary format for the generated study guide.
- **CSV:** The raw data format for questions and answers.

## Current State & Achievements

- **Data Acquired:** Successfully identified and downloaded `questions.csv` and `answers.csv` from [domicch/life-in-uk](https://domicch.github.io/life-in-uk/).
- **Study Guide Generated:** A comprehensive `exams.md` file has been created, containing all 18 exams, with questions, multiple-choice options, correct answers, and explanations.
- **Generation Script:** A `generate_markdown.py` script exists to rebuild the `exams.md` file from the raw CSV data.

## Data Acquisition Discovery

During the initial phase, several approaches were evaluated to gather the exam data:
- **Direct Scraping (Failed):** The target site (https://domicch.github.io/life-in-uk/) is a Single Page Application (SPA). Standard HTTP fetching only returns a "Loading..." state.
- **Browser Automation (Inefficient):** Using Playwright to intercept network requests worked but was complex and slow for batch updates.
- **Source Code Analysis (Success):** By analyzing the GitHub repository `domicch/life-in-uk`, we discovered that the application pulls its entire database from two raw CSV files: `questions.csv` and `answers.csv`.

**Current Strategy:** The `generate_markdown.py` script bypasses the web UI and downloads these CSVs directly from the site's assets. This is the fastest and most reliable way to update the data if the source repository adds more exams.

## Key Files & Locations

- `exams.md`: The primary study resource for the user.
- `questions.csv` & `answers.csv`: The raw source data.
- `generate_markdown.py`: The logic for processing the raw data into the study guide.

## Future Direction

The next phase of the project is to build an interactive, locally-hostable web interface to practice the exams dynamically, moving beyond the static Markdown guide.
