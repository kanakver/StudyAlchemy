import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flashcard } from "@shared/schema";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface FlashcardsProps {
  flashcards: Flashcard[];
  options: Record<string, any>;
  onRegenerate: () => void;
}

export default function Flashcards({ flashcards, options, onRegenerate }: FlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [animation, setAnimation] = useState<string | null>(null);

  // Reset state when flashcards change
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [flashcards]);

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <p className="text-gray-500 mb-4">No flashcards generated</p>
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

  // Check if we have error flashcards
  const hasError = flashcards.some(card => 
    card.question.includes("Error") || card.answer.includes("Error")
  );

  if (hasError) {
    return (
      <div className="text-center p-8 border-2 border-dashed border-red-300 rounded-lg bg-red-50">
        <p className="text-red-500 mb-4">Failed to generate flashcards. Please try again.</p>
        <Button 
          variant="secondary" 
          onClick={onRegenerate}
          className="px-4 py-2 bg-red-100 text-red-700 font-medium text-sm"
        >
          <ArrowPathIcon className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false);
      setAnimation('slide-out-left');
      
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setAnimation('slide-in-right');
        
        setTimeout(() => {
          setAnimation(null);
        }, 300);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setAnimation('slide-out-right');
      
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setAnimation('slide-in-left');
        
        setTimeout(() => {
          setAnimation(null);
        }, 300);
      }, 300);
    }
  };

  const handleRandom = () => {
    setIsFlipped(false);
    setAnimation('slide-out-down');
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * flashcards.length);
      setCurrentIndex(randomIndex);
      setAnimation('slide-in-up');
      
      setTimeout(() => {
        setAnimation(null);
      }, 300);
    }, 300);
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const currentFlashcard = flashcards[currentIndex];

  return (
    <div className="flashcards-container">
      {/* Card counter and navigation */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center justify-center rounded-full bg-primary/10 w-8 h-8 text-primary font-medium">
            {currentIndex + 1}
          </span>
          <span className="text-sm text-gray-500">of {flashcards.length} cards</span>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handlePrevious} 
            disabled={currentIndex === 0}
            className="p-2 text-gray-500 hover:text-primary transition-colors rounded-full"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRandom}
            className="p-2 text-gray-500 hover:text-primary transition-colors rounded-full"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNext} 
            disabled={currentIndex === flashcards.length - 1}
            className="p-2 text-primary hover:text-primary/80 transition-colors rounded-full"
          >
            <ArrowRightIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Individual Flashcard */}
      <div 
        className="perspective h-80 w-full mb-6"
      >
        <div 
          className={`relative w-full h-full cursor-pointer ${animation ? `animate-${animation}` : ''}`}
          onClick={toggleFlip}
        >
          <div 
            className={`flashcard-inner relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* Flashcard Front */}
            <div className="flashcard-front absolute w-full h-full backface-hidden bg-white shadow-lg rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary/5 to-primary/20 p-4 border-b border-primary/10">
                <div className="text-sm text-primary/70">Question</div>
              </div>
              <div className="flex-grow flex items-center justify-center text-center p-6">
                <h3 className="text-xl font-medium">{currentFlashcard.question}</h3>
              </div>
              <div className="absolute bottom-0 w-full bg-gray-50 text-center text-sm text-gray-500 py-2 border-t">
                Click to reveal answer
              </div>
            </div>
            
            {/* Flashcard Back */}
            <div className="flashcard-back absolute w-full h-full backface-hidden bg-gradient-to-br from-white to-primary/5 shadow-lg rounded-xl overflow-hidden rotate-y-180">
              <div className="bg-gradient-to-r from-primary/10 to-primary/30 p-4 border-b border-primary/10">
                <div className="text-sm text-primary/70">Answer</div>
              </div>
              <div className="flex-grow overflow-auto p-6 max-h-[calc(100%-104px)]">
                <p className="whitespace-pre-line">{currentFlashcard.answer}</p>
              </div>
              <div className="absolute bottom-0 w-full bg-white border-t border-gray-200 p-2 flex justify-center items-center">
                <div className="text-sm text-gray-500">
                  Click card to flip back
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Card Navigation Dots */}
      <div className="flex justify-center mb-6 overflow-x-auto py-2">
        <div className="flex space-x-2 flex-wrap justify-center">
          {flashcards.map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsFlipped(false);
                setCurrentIndex(index);
              }}
              className={`w-4 h-4 rounded-full p-0 ${
                index === currentIndex 
                  ? 'bg-primary border-primary' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
