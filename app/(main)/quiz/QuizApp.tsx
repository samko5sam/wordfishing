"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { bank1, bank2, allBanks } from './questionBanks';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


const formatTextWithLineBreaks = (text) => {
  return text.split('\n').map((line, index) => (
    <span key={index}>
      {line}
      <br />
    </span>
  ));
};

const QuizApp = () => {
  const [selectedBank, setSelectedBank] = useState(allBanks);
  const [selectedBankName, setSelectedBankName] = useState('allBanks');
  const [randomizedQuestions, setRandomizedQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [numQuestions, setNumQuestions] = useState(2);
  const [score, setScore] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [inputValue, setInputValue] = useState(2);
  const [incorrectMessage, setIncorrectMessage] = useState('');
  const [timer, setTimer] = useState(15); // Set initial time per question
  const timerDuration = 15; // Time limit per question

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  const formatTimer = () => {
    const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
    const seconds = (timer % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // Update timer each second
  useEffect(() => {
    let countdown;
    if (quizStarted && !showExplanation && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer === 0) {
      handleAnswerClick(null);
    }

    return () => clearInterval(countdown);
  }, [quizStarted, timer, showExplanation]);

  const handleSelectBank = (bankName) => {
    const selectedQuestions =
      bankName === 'bank1' ? bank1 : bankName === 'bank2' ? bank2 : allBanks;
    setSelectedBank(selectedQuestions);
    setSelectedBankName(bankName); // Update selected bank name
  };

  const handleNumQuestionsSubmit = (event) => {
    event.preventDefault();
    const inputNum = parseInt(inputValue, 10);

    if (inputNum > 0 && inputNum <= selectedBank.length) {
      const shuffledQuestions = shuffleArray([...selectedBank]);
      const selectedQuestions = shuffledQuestions.slice(0, inputNum);
      setRandomizedQuestions(selectedQuestions);
      setNumQuestions(inputNum);
      setQuizStarted(true);
      setQuizEnded(false);
      setCurrentQuestion(0);
      setScore(0);
      setTimer(timerDuration); // Reset timer for the first question
    } else {
      alert(`Please enter a number between 1 and ${selectedBank.length}.`);
    }
  };

  const handleAnswerClick = (answer) => {
    const correct = randomizedQuestions[currentQuestion].correctAnswer;
    const incorrectMessages = randomizedQuestions[currentQuestion].incorrectMessages;
    setSelectedAnswer(answer);
    setShowExplanation(true);
    clearInterval(timer); // Stop the timer when an answer is selected

    if (answer === correct) {
      setIsCorrect(true);
      setScore((prev) => prev + 1);
    } else {
      setIsCorrect(false);
      setIncorrectMessage(answer ? incorrectMessages[answer] : "Time's up!");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < numQuestions) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowExplanation(false);
      setIncorrectMessage('');
      setTimer(timerDuration); // Reset timer for the next question
    } else {
      setQuizEnded(true);
    }
  };

  const handlePlayAgain = () => {
    const shuffledQuestions = shuffleArray([...selectedBank]);
    const selectedQuestions = shuffledQuestions.slice(0, numQuestions);
    setRandomizedQuestions(selectedQuestions);
    setQuizStarted(true);
    setQuizEnded(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
    setScore(0);
  };

  const handleResetQuiz = () => {
    setQuizStarted(false);
    setQuizEnded(false);
    setCurrentQuestion(0);
    setScore(0);
    setTimer(timerDuration); // Reset timer to initial value
    setInputValue(5);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIncorrectMessage('');
  };

  return (
    <div className="container max-w-[600px]">
      <Card>
      <div className="mt-2"></div>
        <CardContent>
          {!quizStarted ? (
            <form onSubmit={handleNumQuestionsSubmit}>
              <h1>Enter Number of Questions:</h1>
              <Label htmlFor="numQuestions">Questions:</Label>
              <Input
                id="numQuestions"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                min="1"
                max={selectedBank.length}
              />
              <CardFooter></CardFooter>
              <Button type="submit">Start Quiz</Button>
            </form>
          ) : (
            <>
              {!quizEnded ? (
                <>
                  {randomizedQuestions.length > 0 && (
                    <>
                      <Card>
                        <CardContent>
                        <div className="mt-2">
                        <h1>{randomizedQuestions[currentQuestion].title}</h1>
                        </div>
                        <div className="mt-2">
                        <span>{randomizedQuestions[currentQuestion].quip}</span>
                        </div>
                        <div className="mt-2">
                        <span>{randomizedQuestions[currentQuestion].question}</span>
                        </div>
                        <div className="mt-2"></div>
                          <ul>
                            {randomizedQuestions[currentQuestion].answers.map((answer, idx) => (
                              <li key={idx}>
                                <Button
                                  onClick={() => !selectedAnswer && handleAnswerClick(answer)}
                                >
                                  {answer}
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                      <div className="mt-5">
                      {showExplanation && (
                        <Card>
                          <CardContent>
                            {isCorrect ? (
                              <span>Correct! </span>
                            ) : (
                              <div className="mt-2">
                              <span>{formatTextWithLineBreaks(incorrectMessage)}</span>
                              </div>
                            )}
                            <div className="mt-2">
                            <span>{formatTextWithLineBreaks(randomizedQuestions[currentQuestion].explanation)}</span>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      </div>
                      <div className="mt-2">
                      <Button onClick={handleNextQuestion} disabled={!showExplanation}>
                        Next Question
                      </Button>
                      </div>
                    </>
                  )}
                  <Button onClick={handleResetQuiz}>Reset</Button>
                  
                </>
              ) : (
                <Card>
                  <CardContent>
                    <div className="mt-2">
                    <h1>Quiz Ended</h1>
                    </div>
                    <span>Your final score is: {score} / {numQuestions}</span>
                    <div className="mt-2">
                    <Button onClick={handlePlayAgain}>Play Again</Button>
                    </div>
                    <div className="mt-2">
                    <Button onClick={handleResetQuiz}>Reset</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const Question = ({ data, selectedAnswer, isCorrect, onAnswerClick }) => {
  return (
    <div>
      <h2>{formatTextWithLineBreaks(data.title)}</h2>
      <h3>{formatTextWithLineBreaks(data.quip)}</h3>
      <h4>{formatTextWithLineBreaks(data.question)}</h4>
      <ul>
        {data.answers.map((answer, idx) => (
          <li
            key={idx}
            className={`${
              selectedAnswer === answer ? (isCorrect ? 'correct' : 'incorrect') : ''
            }`}
            onClick={() => !selectedAnswer && onAnswerClick(answer)}
          >
            {answer}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizApp;
