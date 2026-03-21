import pytest
import json
import os
from generate_json import parse_questions, parse_answers, generate_json

@pytest.fixture
def tmp_questions_csv(tmp_path):
    f = tmp_path / "questions.csv"
    f.write_text("examNumber,questionNumber,question,reference\n1,1,What is the capital?,London", encoding="utf-8")
    return str(f)

@pytest.fixture
def tmp_answers_csv(tmp_path):
    f = tmp_path / "answers.csv"
    f.write_text("examNumber,questionNumber,answerNumber,answer,isCorrect\n1,1,1,London,yes\n1,1,2,Paris,no", encoding="utf-8")
    return str(f)

@pytest.fixture
def mock_csv_files(tmp_path, monkeypatch):
    # Create mock CSVs in tmp_path
    q_file = tmp_path / "questions.csv"
    q_file.write_text("examNumber,questionNumber,question,reference\n1,1,Question 1,Ref 1", encoding="utf-8")
    
    a_file = tmp_path / "answers.csv"
    a_file.write_text("examNumber,questionNumber,answerNumber,answer,isCorrect\n1,1,1,Ans 1,yes", encoding="utf-8")
    
    # Change working directory to tmp_path so generate_json picks them up
    monkeypatch.chdir(tmp_path)
    return str(q_file), str(a_file)

def test_generate_json_full(mock_csv_files):
    generate_json()
    assert os.path.exists("exams.json")
    
    with open("exams.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        
    assert "metadata" in data
    assert "lastUpdated" in data["metadata"]
    assert "exams" in data
    assert "1" in data["exams"]
    assert len(data["exams"]["1"]) == 1
    assert data["exams"]["1"][0]["question"] == "Question 1"
    assert data["exams"]["1"][0]["answers"][0]["text"] == "Ans 1"
    assert data["exams"]["1"][0]["answers"][0]["isCorrect"] is True

def test_parse_questions_json(tmp_questions_csv):
    questions = parse_questions(tmp_questions_csv)
    assert "1" in questions
    assert len(questions["1"]) == 1
    assert questions["1"][0]['id'] == 1
    assert questions["1"][0]['question'] == "What is the capital?"
    assert questions["1"][0]['reference'] == "London"

def test_parse_answers_json(tmp_answers_csv):
    initial_questions = {
        "1": [
            {
                'id': 1,
                'question': "What is the capital?",
                'reference': "London",
                'answers': []
            }
        ]
    }
    questions = parse_answers(tmp_answers_csv, initial_questions)
    assert len(questions["1"][0]['answers']) == 2
    assert questions["1"][0]['answers'][0]['text'] == "London"
    assert questions["1"][0]['answers'][0]['isCorrect'] is True
    assert questions["1"][0]['answers'][1]['text'] == "Paris"
    assert questions["1"][0]['answers'][1]['isCorrect'] is False
