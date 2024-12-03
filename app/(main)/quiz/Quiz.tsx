"use client"
import { useState, useEffect } from 'react';
import { useAvailableFolders, useVocabulariesInFolder, Folder, Vocabulary } from '../../../hooks/use-vocabularies';
import { FullPageLoadingIndicator } from '../../../components/layout/FullPageLoadingIndicator';
import { Button } from '../../../components/ui/button';

interface VocabularyWithTitle extends Vocabulary {
  title: string;
  description: string;
}

const QuizApp = () => {
  const { availableFolders, isFolderLoading } = useAvailableFolders();
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const { allVocabularies, isVocabLoading, fetchAllVocabularies } = useVocabulariesInFolder();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [answers, setAnswers] = useState<string[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [initialNumQuestions, setInitialNumQuestions] = useState(5);
  const [quizVocabularies, setQuizVocabularies] = useState<VocabularyWithTitle[]>([]);

  const generateAnswers = () => {
    if (quizVocabularies.length === 0) return [];

    const correctAnswer = quizVocabularies[currentQuestion].description;
    const incorrectAnswers = generateIncorrectAnswers();
    const allAnswers = [correctAnswer, ...incorrectAnswers];
    return shuffleArray(allAnswers);
  };

  useEffect(() => {
    setScore(0);
    setCurrentQuestion(0);
    setShowAnswer(false);
    setSelectedAnswer('');
    setQuizStarted(false);
    setInitialNumQuestions(5);
    setQuizVocabularies([]);
    const fetchVocab = async () => {
      if (!selectedFolder) return;
      await fetchAllVocabularies(selectedFolder?.id || "");
    };
    fetchVocab();
  }, [selectedFolder]);

  useEffect(() => {
    if (quizStarted && allVocabularies.length > 0) {
      const shuffledVocab = shuffleArray([...allVocabularies]);
      setQuizVocabularies(shuffledVocab.slice(0, initialNumQuestions));
    }
  }, [allVocabularies, quizStarted, initialNumQuestions]);

  useEffect(() => {
    if (quizStarted) {
      setAnswers(generateAnswers());
    }
  }, [quizVocabularies, quizStarted, currentQuestion]);


  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
    if (answer === quizVocabularies[currentQuestion].description) {
      setScore((score) => score + 1);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => Math.min(prev + 1, initialNumQuestions - 1));
    setShowAnswer(false);
    setSelectedAnswer('');
    setAnswers(generateAnswers());
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleResetQuiz = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowAnswer(false);
    setSelectedAnswer('');
    setAnswers([]);
    setQuizStarted(false);
  };

  const shuffleArray = (array: any[]): any[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const generateIncorrectAnswers = () => {
    if (allVocabularies.length < 4) {
      return ["Incorrect Answer 1", "Incorrect Answer 2", "Incorrect Answer 3"];
    }

    const incorrectAnswers: string[] = [];
    const correctAnswer = quizVocabularies[currentQuestion].description;
    const availableWords = allVocabularies.map((vocab: VocabularyWithTitle) => vocab.description).filter((word: string) => word !== correctAnswer);

    const shuffledWords = shuffleArray(availableWords);
    incorrectAnswers.push(...shuffledWords.slice(0, 3));

    while (incorrectAnswers.length < 3) {
      incorrectAnswers.push(`Placeholder Incorrect Answer ${incorrectAnswers.length + 1}`);
    }

    return incorrectAnswers;
  };

  if (isFolderLoading) {
    return <FullPageLoadingIndicator />;
  }

  return (
    <div>
      <h1>Vocabulary Quiz</h1>
      <select
        value={selectedFolder?.id || ''}
        onChange={(e) => {
          const selectedFolderId = e.target.value;
          const selectedFolder = availableFolders.find((folder: Folder) => folder.id === selectedFolderId);
          setSelectedFolder(selectedFolder || null);
        }}
        disabled={quizStarted} // Disable folder selection when quiz is started
      >
        <option value="">Select a folder</option>
        {availableFolders.map((folder: Folder) => (
          <option key={folder.id} value={folder.id}>
            {folder.folderName}
          </option>
        ))}
      </select>
      {selectedFolder && allVocabularies.length > 0 && (
        <>
          <label htmlFor="numQuestions">Number of Questions:</label>
          <input
            type="number"
            id="numQuestions"
            min="1"
            max={allVocabularies.length}
            value={initialNumQuestions}
            onChange={(e) => setInitialNumQuestions(parseInt(e.target.value, 10))}
            disabled={quizStarted}
          />
          {!quizStarted && <Button onClick={handleStartQuiz}>Start Quiz</Button>}
          {quizStarted && (
            <div>
              <h2>{quizVocabularies[currentQuestion]?.title || ''}</h2>
              {!showAnswer && (
                <div>
                  {answers.map((answer, index) => (
                    <Button key={index} onClick={() => handleAnswerClick(answer)}>
                      {answer}
                    </Button>
                  ))}
                </div>
              )}
              {showAnswer && (
                <div>
                  <p>Correct answer: {quizVocabularies[currentQuestion].description}</p>
                  <p>Your answer: {selectedAnswer}</p>
                  {currentQuestion < initialNumQuestions - 1 ? (
                    <Button onClick={handleNextQuestion}>Next</Button>
                  ) : (
                    <div>
                      <p>Quiz Finished! Your score is {score} out of {initialNumQuestions}</p>
                      <Button onClick={handleResetQuiz}>Restart Quiz</Button>
                    </div>
                  )}
                </div>
              )}
              <Button onClick={handleResetQuiz}>Reset Quiz</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuizApp;
