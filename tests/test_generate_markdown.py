import pytest
import os
import csv
from generate_markdown import parse_questions, parse_answers, format_markdown

@pytest.fixture
def tmp_questions_csv(tmp_path):
    d = tmp_path / "data"
    d.mkdir()
    f = d / "questions.csv"
    f.write_text("examNumber,questionNumber,question,reference\n1,1,What is the capital?,London", encoding="utf-8")
    return str(f)

@pytest.fixture
def tmp_answers_csv(tmp_path):
    d = tmp_path / "data"
    if not d.exists():
        d.mkdir()
    f = d / "answers.csv"
    f.write_text("examNumber,questionNumber,answerNumber,answer,isCorrect\n1,1,1,London,yes\n1,1,2,Paris,no", encoding="utf-8")
    return str(f)

def test_parse_questions(tmp_questions_csv):
    questions = parse_questions(tmp_questions_csv)
    assert 1 in questions
    assert 1 in questions[1]
    assert questions[1][1]['question'] == "What is the capital?"
    assert questions[1][1]['reference'] == "London"

def test_parse_answers(tmp_answers_csv):
    initial_questions = {
        1: {
            1: {
                'question': "What is the capital?",
                'reference': "London",
                'answers': []
            }
        }
    }
    questions = parse_answers(tmp_answers_csv, initial_questions)
    assert len(questions[1][1]['answers']) == 2
    assert questions[1][1]['answers'][0]['answer'] == "London"
    assert questions[1][1]['answers'][0]['isCorrect'] is True
    assert questions[1][1]['answers'][1]['answer'] == "Paris"
    assert questions[1][1]['answers'][1]['isCorrect'] is False

def test_format_markdown():
    questions = {
        1: {
            1: {
                'question': "Test Q?",
                'reference': "Test Ref",
                'answers': [
                    {'answer': "Ans 1", 'isCorrect': True},
                    {'answer': "Ans 2", 'isCorrect': False}
                ]
            }
        }
    }
    markdown = format_markdown(questions)
    assert "# Life in the UK Test Exam Practice" in markdown
    assert "Last Updated:" in markdown
    assert "## Exam 1" in markdown
    assert "### Question 1" in markdown
    assert "Test Q?" in markdown
    assert "- [x] Ans 1" in markdown
    assert "- [ ] Ans 2" in markdown
    assert "Explanation:\nTest Ref" in markdown
