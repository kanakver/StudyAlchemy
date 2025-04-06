import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Question } from "@shared/schema";

interface QuestionsProps {
  questions: Question[];
  options: Record<string, any>;
  onRegenerate: () => void;
}

export default function Questions({ questions, options, onRegenerate }: QuestionsProps) {
  const [showAllAnswers, setShowAllAnswers] = useState(false);

  if (!questions || questions.length === 0) {
    return <div className="text-center p-4">No questions generated</div>;
  }

  return (
    <div className="questions-container">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Practice Questions</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAllAnswers(!showAllAnswers)}
          className="text-sm"
        >
          {showAllAnswers ? "Hide All Answers" : "Show All Answers"}
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <Accordion
          type="multiple"
          defaultValue={showAllAnswers ? questions.map((_, i) => `item-${i}`) : []}
          className="space-y-2"
        >
          {questions.map((question, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center text-left">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-medium mr-3">
                    {index + 1}
                  </span>
                  <h4 className="text-base font-medium">
                    {question.question}
                  </h4>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <div className="pl-11">
                  <p className="whitespace-pre-line">{question.answer}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
