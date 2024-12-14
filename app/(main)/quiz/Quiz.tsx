"use client"
import { useState, useEffect } from 'react';
import { useAvailableFolders, useVocabulariesInFolder, Folder, Vocabulary } from '@/hooks/use-vocabularies';
import { FullPageLoadingIndicator } from '@/components/layout/FullPageLoadingIndicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AvailableFolderSelector } from '@/components/AvailableFolderSelector';
import { Label } from '@/components/ui/label';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2 } from 'lucide-react';
import { CrossCircledIcon } from '@radix-ui/react-icons';

interface VocabularyWithTitle extends Vocabulary {
  title: string;
  description: string;
}

const QuizApp = () => {
  const [isAnswersLoading, setIsAnswersLoading] = useState(false);
  const { toast } = useToast();
  const { isFolderLoading } = useAvailableFolders();
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const { allVocabularies, fetchAllVocabularies } = useVocabulariesInFolder();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [answers, setAnswers] = useState<string[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizVocabularies, setQuizVocabularies] = useState<VocabularyWithTitle[]>([]);
  const searchParams = useSearchParams();

  const [quizMode, setQuizMode] = useState('front');
  const [quizSide, setQuizSide] = useState<'front'|'back'>('front');
  const handleQuizSideChange = (side: 'front' | 'back' | 'random') => {
    setQuizMode(side);
  }

  const generateAnswers = () => {
    if (quizVocabularies.length === 0) return [];
    setIsAnswersLoading(true);

    if (quizMode === "random"){
      setQuizSide(Math.random() < 0.5 ? "front" : "back")
    } else {
      setQuizSide(quizMode === "front" ? "front" : "back");
    }

    const correctAnswer = quizSide === "back" ? quizVocabularies[currentIndex].title : quizVocabularies[currentIndex].description;
    const questionText = quizSide === "back" ? quizVocabularies[currentIndex].description : quizVocabularies[currentIndex].title;

    setCorrectAnswer(correctAnswer);
    setQuestionText(questionText);
    const incorrectAnswers = generateIncorrectAnswers();
    const allAnswers = [correctAnswer, ...incorrectAnswers];
    return shuffleArray(allAnswers);
  };

  const currentIndex = currentQuestion % quizVocabularies.length;

  useEffect(() => {
    setScore(0);
    setCurrentQuestion(0);
    setShowAnswer(false);
    setSelectedAnswer('');
    setQuizStarted(false);
    setNumQuestions(5);
    setQuizVocabularies([]);
    const fetchVocab = async () => {
      if (!selectedFolder) return;
      await fetchAllVocabularies(selectedFolder);
    };
    fetchVocab();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFolder]);

  useEffect(() => {
    const folderId = searchParams.get('folder');
    if (folderId) {
      setSelectedFolder(folderId);
      fetchAllVocabularies(folderId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    if (quizStarted && allVocabularies.length > 0) {
      // setNumQuestions(allVocabularies.length || 1);
      const shuffledVocab = shuffleArray([...allVocabularies]);
      setQuizVocabularies(shuffledVocab.slice(0, numQuestions));
    }
  }, [allVocabularies, quizStarted, numQuestions]);

  useEffect(() => {
    if (quizStarted) {
      setAnswers(generateAnswers());
      setIsAnswersLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizVocabularies, quizStarted, currentQuestion]);


  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
    if (answer === correctAnswer) {
      setScore((score) => score + 1);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => Math.min(prev + 1, numQuestions - 1));
    setShowAnswer(false);
    setSelectedAnswer('');
    setAnswers(generateAnswers());
  };

  const handleStartQuiz = () => {
    if (selectedFolder) {
      setQuizStarted(true);
    } else {
      toast({
        title: "請選擇資料夾",
        variant: "destructive"
      })
    }
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
    const correctAnswer = quizSide === "back" ? quizVocabularies[currentIndex].title : quizVocabularies[currentIndex].description;
    const incorrectAnswers: string[] = [];
    const answers = quizSide === "back"? "title" : "description";
    const availableWords = allVocabularies.map((vocab: VocabularyWithTitle) => vocab[answers]).filter((word: string) => word !== correctAnswer);

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
    <div className='w-[375px] h-[540px] max-w-full max-h-full gap-y-4 flex flex-col'>
      {!quizStarted && <>
        <h1 className='text-xl'>單字考試</h1>
        <AvailableFolderSelector selectedFolder={selectedFolder} setSelectedFolder={setSelectedFolder} />
      </>}
      {selectedFolder && allVocabularies.length < 4 && (
        <>
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-xl font-semibold text-gray-500">此資料夾的單字數量不足</h1>
            <p className="text-gray-400 mt-2">資料夾中單字數量需高於4個！</p>
          </div>
        </>
      )}
      {selectedFolder && allVocabularies.length > 3 && (
        <>
          {!quizStarted && <>
            <Label htmlFor="numQuestions">問題數量</Label>
            <Input
              type="number"
              id="numQuestions"
              min="1"
              max={allVocabularies.length}
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value, 10))}
              disabled={quizStarted}
            />

            <Label>複習模式</Label>
            <div className="flex justify-center gap-4 w-full">
              <Button
                variant={quizMode === 'front' ? 'outline' : 'ghost'}
                onClick={() => handleQuizSideChange('front')}
                className='w-full'
              >
                正面
              </Button>
              <Button
                variant={quizMode === 'back' ? 'outline' : 'ghost'}
                onClick={() => handleQuizSideChange('back')}
                className='w-full'
              >
                背面
              </Button>
              <Button
                variant={quizMode === 'random' ? 'outline' : 'ghost'}
                onClick={() => handleQuizSideChange('random')}
                className='w-full'
              >
                單字隨機
              </Button>
            </div>
            <Button variant="default" onClick={handleStartQuiz}>開始考試</Button>
          </>}
          {quizStarted && (
            <div>
              {!isAnswersLoading ? <>
              <h2 className='text-xl px-2 py-4'>{questionText || ''}</h2>
              <div className='flex flex-col gap-y-4'>
                {answers.map((answer, index) => (
                  <Button variant={answer === correctAnswer && showAnswer ? "default" : showAnswer && selectedAnswer === answer ? "destructive" : "outline"} key={index} onClick={() => {
                    if (showAnswer) return;
                    handleAnswerClick(answer)
                  }}>
                    {answer}
                  </Button>
                ))}
              </div></> : <QuestionPlaceholder />}
              {showAnswer && (
                <div>
                  <div className='w-full flex flex-row justify-center py-4'>
                    {selectedAnswer === correctAnswer && 
                      <span className="text-green-500">
                        <CheckCircle2 width={48} height={48} />
                        答對了！
                      </span>
                    }
                    {selectedAnswer !== correctAnswer && 
                      <span className="text-red-500">
                        <CrossCircledIcon width={48} height={48} />
                        答錯囉！
                      </span>
                    }
                  </div>
                  {selectedAnswer !== correctAnswer &&
                    <div className='bg-gray-100 p-4 rounded-md mb-4'>
                      <p>正確答案： {correctAnswer}</p>
                      <p>你的回答： {selectedAnswer}</p>
                    </div>
                  }
                  {currentQuestion < numQuestions - 1 ? (
                    <Button className='w-full' onClick={handleNextQuestion}>下一題</Button>
                  ) : (
                    <div>
                      <p className='text-xl mb-4'>考試結束！你的分數是 {score} / {numQuestions}分</p>
                      <Button className='w-full' onClick={handleResetQuiz} variant="destructive">重新考試</Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const QuestionPlaceholder = () => {
  const answers = ['...','...','...','...']
  return (
    <>
      <h2 className='text-xl px-2 py-4'>{'...'}</h2>
      <div className='flex flex-col gap-y-4'>
        {answers.map((answer, index) => (
          <Button variant="outline" key={index}>
            {answer}
          </Button>
        ))}
      </div>
    </>
  )
}

export default QuizApp;
