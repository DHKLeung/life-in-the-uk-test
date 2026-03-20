# Life in the UK Test Exam Practices

This project aims to provide an offline and interactive way to practice for the Life in the UK Test. 

Currently, the project contains all the necessary exam data from [domicch/life-in-uk](https://domicch.github.io/life-in-uk/individual/) and has generated a comprehensive study guide in Markdown.

## Project Structure

- `exams.md`: A complete study guide with all available exams, featuring questions, multiple-choice options (marked with correct answers), and explanations.
- `questions.csv`: Raw question data, including exam and question numbers, the question text, and references/explanations.
- `answers.csv`: Raw answer data, including multiple-choice options and flags for correct answers.
- `generate_markdown.py`: The Python script used to download the latest data and rebuild `exams.md`.
- `tests/`: A directory containing unit tests for the data processing logic.

## Getting Started

### Prerequisites
- [uv](https://docs.astral.sh/uv/) installed on your machine.

### Update Data & Generate Study Guide
To download the latest exam data and regenerate the `exams.md` file, run:
```bash
uv run generate_markdown.py
```

### Run Tests
To verify the data processing and formatting logic, run:
```bash
uv run pytest
```

## Next Steps

- Build an interactive web interface to practice these exams locally or on a private server.
- Implement scoring and progress tracking features.
