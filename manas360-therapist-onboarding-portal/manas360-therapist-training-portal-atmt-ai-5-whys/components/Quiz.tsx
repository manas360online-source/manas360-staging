import React, { useState } from 'react';
import { User, QuizQuestion } from '../types';
import { QUIZ_QUESTIONS } from '../constants';
import { AlertCircle, CheckCircle, XCircle, Trophy, RefreshCcw, ArrowRight, Lock } from 'lucide-react';

interface QuizProps {
  user: User;
  onPass: () => void;
}

const Quiz: React.FC<QuizProps> = ({ user, onPass }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [history, setHistory] = useState<{questionId: number, isCorrect: boolean}[]>([]);

  // Check if all modules are complete
  const allModulesComplete = 
    user.progress.module1 === 100 &&
    user.progress.module2 === 100 &&
    user.progress.module3 === 100 &&
    user.progress.module4 === 100 &&
    user.progress.module5 === 100 &&
    user.progress.module6 === 100 &&
    user.progress.module7 === 100;

  if (!allModulesComplete) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center border border-gray-200">
          <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Certification Exam Locked</h2>
          <p className="text-gray-600 mb-6">
            You must complete all 7 training modules (100%) before taking the final certification exam.
          </p>
          <div className="inline-block bg-gray-100 rounded-lg px-6 py-3 text-left">
             <div className="text-xs font-bold text-gray-500 uppercase mb-2">Current Progress</div>
             <div className="flex flex-col gap-2 text-sm text-gray-600">
                <div className="flex justify-between w-64"><span>Opening</span> <span>{user.progress.module1}%</span></div>
                <div className="flex justify-between w-64"><span>Module 1</span> <span>{user.progress.module2}%</span></div>
                <div className="flex justify-between w-64"><span>Module 2</span> <span>{user.progress.module3}%</span></div>
                <div className="flex justify-between w-64"><span>Module 3</span> <span>{user.progress.module4}%</span></div>
                <div className="flex justify-between w-64"><span>Module 4</span> <span>{user.progress.module5}%</span></div>
                <div className="flex justify-between w-64"><span>Module 5</span> <span>{user.progress.module6}%</span></div>
                <div className="flex justify-between w-64"><span>Recap</span> <span>{user.progress.module7}%</span></div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const PASSING_SCORE = 4;
  const TOTAL_QUESTIONS = QUIZ_QUESTIONS.length;

  const handleOptionSelect = (index: number) => {
    if (showFeedback) return; // Prevent changing answer after submission
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setHistory([...history, { questionId: currentQuestion.id, isCorrect }]);
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowFeedback(false);
    setQuizComplete(false);
    setHistory([]);
  };

  if (quizComplete) {
    const passed = score >= PASSING_SCORE;
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-10">
        <div className={`p-8 text-center ${passed ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mb-6">
            {passed ? <Trophy className="w-10 h-10 text-yellow-500" /> : <AlertCircle className="w-10 h-10 text-red-500" />}
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${passed ? 'text-green-800' : 'text-red-800'}`}>
            {passed ? 'Certification Passed!' : 'Certification Failed'}
          </h2>
          <p className="text-gray-600 mb-6">
            You scored <span className="font-bold text-xl">{score}/{TOTAL_QUESTIONS}</span> ({(score/TOTAL_QUESTIONS)*100}%)
          </p>
          
          {passed ? (
            <div>
              <p className="text-green-700 mb-8">Congratulations! You have mastered the 5 Whys technique. Your certificate is ready.</p>
              <button 
                onClick={onPass}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
              >
                View My Certificate
              </button>
            </div>
          ) : (
            <div>
              <p className="text-red-700 mb-8">You need 4 correct answers to pass. Please review the modules and try again.</p>
              <button 
                onClick={restartQuiz}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center mx-auto"
              >
                <RefreshCcw className="w-5 h-5 mr-2" /> Retake Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const isCorrect = selectedOption === currentQuestion.correctAnswer;
  const feedbackText = isCorrect ? currentQuestion.correctFeedback : currentQuestion.incorrectFeedback;

  return (
    <div className="max-w-3xl mx-auto mt-8">
       <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
         {/* Header / Progress */}
         <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-bold text-gray-700">ALL modules Quiz</h2>
            <div className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {TOTAL_QUESTIONS}
            </div>
         </div>
         <div className="w-full bg-gray-200 h-1.5">
            <div 
              className="bg-mans-500 h-1.5 transition-all duration-300" 
              style={{ width: `${((currentQuestionIndex) / TOTAL_QUESTIONS) * 100}%` }}
            ></div>
         </div>

         {/* Content */}
         <div className="p-8">
            <h3 className="text-xl font-medium text-gray-900 mb-6">{currentQuestion.text}</h3>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={showFeedback}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center
                    ${showFeedback 
                      ? idx === currentQuestion.correctAnswer 
                        ? 'border-green-500 bg-green-50' 
                        : idx === selectedOption 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-200 opacity-50'
                      : idx === selectedOption 
                        ? 'border-mans-500 bg-mans-50 ring-1 ring-mans-500' 
                        : 'border-gray-200 hover:border-mans-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0
                    ${showFeedback
                      ? idx === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-500 text-white'
                        : idx === selectedOption
                          ? 'border-red-500 bg-red-500 text-white'
                          : 'border-gray-300'
                      : idx === selectedOption
                        ? 'border-mans-500 bg-mans-500 text-white'
                        : 'border-gray-300'
                    }
                  `}>
                    {showFeedback && idx === currentQuestion.correctAnswer ? <CheckCircle size={14} /> : 
                     showFeedback && idx === selectedOption ? <XCircle size={14} /> : 
                     <span className="text-xs">{String.fromCharCode(65 + idx)}</span>}
                  </div>
                  <span className={`text-base ${showFeedback && idx === currentQuestion.correctAnswer ? 'font-medium text-green-900' : 'text-gray-700'}`}>
                    {option}
                  </span>
                </button>
              ))}
            </div>

            {/* Explanation Panel */}
            {showFeedback && (
              <div className={`mt-6 p-4 rounded-lg border ${selectedOption === currentQuestion.correctAnswer ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className="font-bold text-sm mb-1">
                  {selectedOption === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect.'}
                </p>
                <p className="text-sm text-gray-700">
                  {feedbackText || currentQuestion.explanation}
                </p>
              </div>
            )}
         </div>

         {/* Footer / Actions */}
         <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
            {!showFeedback ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="bg-mans-600 hover:bg-mans-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-lg shadow-sm transition-colors"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-6 rounded-lg shadow-sm flex items-center"
              >
                {currentQuestionIndex < TOTAL_QUESTIONS - 1 ? 'Next Question' : 'Finish Quiz'} <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            )}
         </div>
       </div>
    </div>
  );
};

export default Quiz;