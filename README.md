# Life in the UK Test Exam Practices
by Daniel Ho Kwan Leung

[Live Demo](https://dhkleung.github.io/life-in-the-uk-test/) | [Repository](https://github.com/DHKLeung/life-in-the-uk-test)

This project provides an offline and interactive way to practice for the Life in the UK Test. It includes a comprehensive study guide and a mobile-friendly web interface.

## Features

- **Interactive Web UI**: Practice exams directly in your browser.
- **Multiple Modes**:
    - **Standard Exams**: Fixed exams from the official question bank.
    - **Random Exam**: Draws 25 random questions from the entire database.
    - **Marathon Exam**: A timeless mode to go through all available questions.
- **Timed Practice**: All modes (except Marathon) include a 45-minute countdown timer to simulate real exam conditions.
- **Auto-Shuffle**: Both questions and answer choices are randomized every time you start an exam to ensure genuine learning.
- **Advanced Results**: View your score, percentage, and time taken. Includes a detailed list of incorrect questions with their correct answers and explanations.
- **Mobile-First**: Designed to work perfectly on phones for on-the-go study.
- **Offline-Ready**: Once downloaded, the study guide and web app can be used locally.
- **Comprehensive Data**: Includes all questions, multiple-choice options, and detailed explanations (references).

## Project Structure

- `index.html`: The main web application.
- `exams.md`: A complete study guide in Markdown format.
- `exams.json`: Structured data for the web application.
- `generate_markdown.py`: Script to rebuild the Markdown study guide.
- `generate_json.py`: Script to rebuild the JSON data for the website.
- `tests/`: Unit tests for data processing.

## Getting Started

### Prerequisites
- [uv](https://docs.astral.sh/uv/) installed on your machine.

### Run the Website Locally
To practice interactively on your computer:
1. Open your terminal in this folder.
2. Run the local server:
   ```bash
   uv run python -m http.server 8000
   ```
3. Open `http://localhost:8000` in your browser.

### Update Data
To refresh the exam data and rebuild all resources:
```bash
uv run python generate_markdown.py
uv run python generate_json.py
```

### Run Tests
```bash
uv run pytest
```

## Credits
Built with love by Daniel Ho Kwan Leung.
