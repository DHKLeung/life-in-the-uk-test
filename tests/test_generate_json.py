import pytest
import json
import os
from generate_json import parse_questions, parse_answers

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
