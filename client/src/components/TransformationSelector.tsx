import { Button } from "@/components/ui/button";
import {
  DocumentTextIcon,
  ListBulletIcon,
  MapIcon,
  QuestionMarkCircleIcon,
  DocumentDuplicateIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

interface TransformationSelectorProps {
  selectedType: string;
  onSelect: (type: string) => void;
}

export default function TransformationSelector({ selectedType, onSelect }: TransformationSelectorProps) {
  const transformationTypes = [
    { id: "flashcards", icon: <DocumentDuplicateIcon className="w-6 h-6" />, label: "Flashcards", description: "Create question-answer pairs" },
    { id: "summary", icon: <ListBulletIcon className="w-6 h-6" />, label: "Summary", description: "Extract key points" },
    { id: "mindmap", icon: <MapIcon className="w-6 h-6" />, label: "Mind Map", description: "Visualize connections" },
    { id: "quiz", icon: <QuestionMarkCircleIcon className="w-6 h-6" />, label: "Quiz", description: "Generate test questions" },
    { id: "questions", icon: <AcademicCapIcon className="w-6 h-6" />, label: "Q&A", description: "Practice questions" }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {transformationTypes.map((type) => (
        <Button
          key={type.id}
          onClick={() => onSelect(type.id)}
          variant="outline"
          className={`transform-option flex flex-col items-center p-4 h-auto ${
            selectedType === type.id
              ? "border-2 border-primary bg-primary/5 hover:bg-primary/10"
              : "border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <div className={`mb-2 ${selectedType === type.id ? "text-primary" : "text-gray-500"}`}>
            {type.icon}
          </div>
          <span className="text-sm font-medium mb-1">{type.label}</span>
          <span className="text-xs text-gray-500 text-center">{type.description}</span>
        </Button>
      ))}
    </div>
  );
}
