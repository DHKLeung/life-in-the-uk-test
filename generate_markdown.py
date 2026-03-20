import csv
import requests
import os

def download_csv(url, filename):
    print(f"Downloading {url}...")
    response = requests.get(url)
    response.raise_for_status()
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(response.text)

def generate_markdown():
    questions_url = "https://domicch.github.io/life-in-uk/questions.csv"
    answers_url = "https://domicch.github.io/life-in-uk/answers.csv"
    
    download_csv(questions_url, "questions.csv")
    download_csv(answers_url, "answers.csv")
    
    questions = {}
    with open("questions.csv", 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if not row['examNumber']:
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
            
    with open("answers.csv", 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if not row['examNumber']:
                continue
            exam_num = int(row['examNumber'].strip())
            q_num = int(row['questionNumber'].strip())
            if exam_num in questions and q_num in questions[exam_num]:
                questions[exam_num][q_num]['answers'].append({
                    'answer': row['answer'].strip(),
                    'isCorrect': row['isCorrect'].strip().lower() == 'yes'
                })
                
    with open("exams.md", 'w', encoding='utf-8') as f:
        f.write("# Life in the UK - Exam Practices\n\n")
        
        for exam_num in sorted(questions.keys()):
            f.write(f"## Exam {exam_num}\n\n")
            exam_questions = questions[exam_num]
            for q_num in sorted(exam_questions.keys()):
                q_data = exam_questions[q_num]
                f.write(f"### Question {q_num}\n\n")
                f.write(f"{q_data['question']}\n\n")
                
                f.write("#### Options:\n")
                for ans in q_data['answers']:
                    prefix = "- [x]" if ans['isCorrect'] else "- [ ]"
                    f.write(f"{prefix} {ans['answer']}\n")
                
                if q_data['reference']:
                    f.write(f"\n#### Explanation:\n{q_data['reference']}\n")
                
                f.write("\n---\n\n")
                
    print("Generated exams.md")

if __name__ == "__main__":
    generate_markdown()
