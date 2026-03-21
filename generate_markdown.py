import csv
import requests
import os

def download_csv(url, filename):
    """Download CSV file from URL."""
    print(f"Downloading {url}...")
    response = requests.get(url)
    response.raise_for_status()
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(response.text)

def parse_questions(filename):
    """Parse questions CSV into a nested dictionary."""
    questions = {}
    with open(filename, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if not row.get('examNumber'):
                continue
            exam_num = int(row['examNumber'].strip())
            q_num = int(row['questionNumber'].strip())
            if exam_num not in questions:
                questions[exam_num] = {}
            questions[exam_num][q_num] = {
                'question': row['question'].strip(),
                'reference': row['reference'].strip(),
                'answers': []
            }
    return questions

def parse_answers(filename, questions):
    """Parse answers CSV and attach to existing questions dictionary."""
    with open(filename, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if not row.get('examNumber'):
                continue
            exam_num = int(row['examNumber'].strip())
            q_num = int(row['questionNumber'].strip())
            if exam_num in questions and q_num in questions[exam_num]:
                questions[exam_num][q_num]['answers'].append({
                    'answer': row['answer'].strip(),
                    'isCorrect': row['isCorrect'].strip().lower() == 'yes'
                })
    return questions

def format_markdown(questions):
    """Generate markdown content from questions dictionary."""
    from datetime import datetime
    last_updated = datetime.now().strftime("%Y-%m-%d %H:%M")
    lines = ["# Life in the UK Test Exam Practice\n"]
    lines.append(f"\nLast Updated: {last_updated}\n")
    
    for exam_num in sorted(questions.keys()):
        lines.append(f"\n## Exam {exam_num}\n")
        exam_questions = questions[exam_num]
        for q_num in sorted(exam_questions.keys()):
            q_data = exam_questions[q_num]
            lines.append(f"\n### Question {q_num}\n")
            lines.append(f"\n{q_data['question']}\n")
            
            lines.append("\n#### Options:\n")
            for ans in q_data['answers']:
                prefix = "- [x]" if ans['isCorrect'] else "- [ ]"
                lines.append(f"{prefix} {ans['answer']}\n")
            
            if q_data['reference']:
                lines.append(f"\n#### Explanation:\n{q_data['reference']}\n")
            
            lines.append("\n---\n")
            
    return "".join(lines)

def generate_markdown():
    """Main function to download, parse, and generate markdown."""
    # Data sources (Anonymized in code, usually sourced from external assets)
    # To update URLs, modify these or use environment variables.
    BASE_URL = "https://domicch.github.io/life-in-uk/"
    questions_url = f"{BASE_URL}questions.csv"
    answers_url = f"{BASE_URL}answers.csv"
    
    download_csv(questions_url, "questions.csv")
    download_csv(answers_url, "answers.csv")
    
    questions = parse_questions("questions.csv")
    questions = parse_answers("answers.csv", questions)
    markdown_content = format_markdown(questions)
    
    with open("exams.md", 'w', encoding='utf-8') as f:
        f.write(markdown_content)
                
    print("Generated exams.md")

if __name__ == "__main__":
    generate_markdown()
