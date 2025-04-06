import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Quiz as QuizType } from "@shared/schema";
import { ChevronLeftIcon, ChevronRightIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface QuizProps {
  quiz: QuizType;
  options: Record<string, any>;
  onRegenerate: () => void;
}

export default function Quiz({ quiz, options, onRegenerate }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(() => 
    quiz?.questions ? Array(quiz.questions.length).fill(-1) : []
  );
  const [completed, setCompleted] = useState(false);

  // Reset state when quiz changes
  useEffect(() => {
    if (quiz?.questions) {
      setCurrentQuestionIndex(0);
      setSelectedAnswers(Array(quiz.questions.length).fill(-1));
      setCompleted(false);
    }
  }, [quiz]);

  const handleSelectAnswer = (index: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = index;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(Array(quiz.questions.length).fill(-1));
    setCompleted(false);
  };

  const calculateScore = () => {
    let score = 0;
    for (let i = 0; i < quiz.questions.length; i++) {
      if (selectedAnswers[i] === quiz.questions[i].correctAnswerIndex) {
        score++;
      }
    }
    return `${score}/${quiz.questions.length}`;
  };

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <p className="text-gray-500 mb-4">No quiz generated</p>
        <Button 
          variant="secondary" 
          onClick={onRegenerate}
          className="px-4 py-2 bg-gray-100 text-gray-700 font-medium text-sm"
        >
          <ArrowPathIcon className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  // Show results if completed
  if (completed) {
    return (
      <div className="quiz-container">
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-xl font-medium mb-4">Quiz Results</h3>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-primary mb-2">{calculateScore()}</div>
              <p className="text-gray-600">Correct Answers</p>
            </div>
            
            <div className="space-y-4">
              {quiz.questions.map((question, qIndex) => {
                const isCorrect = selectedAnswers[qIndex] === question.correctAnswerIndex;
                return (
                  <div 
                    key={qIndex} 
                    className={`p-4 rounded-lg ${
                      isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <p className="font-medium mb-2">{qIndex + 1}. {question.question}</p>
                    <div className="pl-4">
                      <p className={`${isCorrect ? 'text-green-600' : 'text-red-600'} font-medium`}>
                        Your answer: {question.answers[selectedAnswers[qIndex]]}
                      </p>
                      {!isCorrect && (
                        <p className="text-green-600 font-medium">
                          Correct answer: {question.answers[question.correctAnswerIndex]}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6">
              <Button
                onClick={handleRestart}
                className="w-full py-2 bg-primary text-white font-medium rounded-md hover:bg-primary/90"
              >
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Restart Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show quiz questions
  return (
    <div className="quiz-container">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center justify-center rounded-full bg-primary/10 w-8 h-8 text-primary font-medium">
            {currentQuestionIndex + 1}
          </span>
          <span className="text-sm text-gray-500">of {quiz?.questions?.length || 0} questions</span>
        </div>
        <div className="text-sm font-medium">
          {selectedAnswers.filter(a => a !== -1).length}/{quiz?.questions?.length || 0} answered
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">{currentQuestion?.question}</h3>
          
          <RadioGroup 
            value={selectedAnswers[currentQuestionIndex] >= 0 ? selectedAnswers[currentQuestionIndex].toString() : undefined}
            className="space-y-3"
          >
            {currentQuestion?.answers?.map((answer, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={index.toString()}
                  id={`answer-${index}`}
                  onClick={() => handleSelectAnswer(index)}
                />
                <Label
                  htmlFor={`answer-${index}`}
                  className="text-base cursor-pointer py-2 flex-grow"
                >
                  {answer}
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 text-gray-700 flex items-center gap-1"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestionIndex] === -1}
              className="px-4 py-2 bg-primary text-white flex items-center gap-1"
            >
              {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish' : 'Next'}
              {currentQuestionIndex !== quiz.questions.length - 1 && <ChevronRightIcon className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
