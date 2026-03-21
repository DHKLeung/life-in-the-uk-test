import csv
import json
import os

def parse_questions(filename):
    """Parse questions CSV into a nested dictionary."""
    questions_by_exam = {}
    if not os.path.exists(filename):
        print(f"Error: {filename} not found.")
        return questions_by_exam
        
    with open(filename, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if not row.get('examNumber'):
                continue
            exam_num = row['examNumber'].strip()
            q_num = int(row['questionNumber'].strip())
            if exam_num not in questions_by_exam:
                questions_by_exam[exam_num] = []
            
            questions_by_exam[exam_num].append({
                'id': q_num,
                'question': row['question'].strip(),
                'reference': row['reference'].strip(),
                'answers': []
            })
    return questions_by_exam

def parse_answers(filename, questions_by_exam):
    """Parse answers CSV and attach to existing questions dictionary."""
    if not os.path.exists(filename):
        print(f"Error: {filename} not found.")
        return questions_by_exam
        
    with open(filename, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if not row.get('examNumber'):
                continue
            exam_num = row['examNumber'].strip()
            q_num = int(row['questionNumber'].strip())
            
            if exam_num in questions_by_exam:
                # Find the question in the list for this exam
                for q in questions_by_exam[exam_num]:
                    if q['id'] == q_num:
                        q['answers'].append({
                            'text': row['answer'].strip(),
                            'isCorrect': row['isCorrect'].strip().lower() == 'yes'
                        })
                        break
    return questions_by_exam

def generate_json():
    """Main function to parse CSVs and generate JSON."""
    questions = parse_questions("questions.csv")
    questions = parse_answers("answers.csv", questions)
    
    # Sort exams numerically
    sorted_exams = dict(sorted(questions.items(), key=lambda x: int(x[0])))
    
    from datetime import datetime
    data = {
        "metadata": {
            "lastUpdated": datetime.now().strftime("%Y-%m-%d %H:%M")
        },
        "exams": sorted_exams
    }
    
    with open("exams.json", 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
                
    print(f"Generated exams.json with {len(sorted_exams)} exams.")

if __name__ == "__main__":
    generate_json()
