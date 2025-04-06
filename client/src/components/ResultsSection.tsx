import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Flashcards from "./transformations/Flashcards";
import Summary from "./transformations/Summary";
import MindMap from "./transformations/MindMap";
import Questions from "./transformations/Questions";
import Quiz from "./transformations/Quiz";
import TransformationHistory from "./TransformationHistory";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TransformationType, Transformation } from "@shared/schema";

interface ResultsSectionProps {
  transformation: Transformation | null;
  transformationData: any;
  transformationHistory: Transformation[];
  isProcessing: boolean;
  onSelectHistory: (transformation: Transformation) => void;
  onRegenerateTransformation: () => void;
}

export default function ResultsSection({
  transformation,
  transformationData,
  transformationHistory,
  isProcessing,
  onSelectHistory,
  onRegenerateTransformation
}: ResultsSectionProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    if (transformation) {
      setTitle(transformation.title);
    }
  }, [transformation]);

  const handleSave = () => {
    toast({
      title: "Transformation saved",
      description: "Your transformation has been saved locally."
    });
  };

  const handleDownload = () => {
    if (!transformation) return;
    
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(transformationData, null, 2)
    )}`;
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${transformation.title.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Downloaded successfully",
      description: "Your transformation has been downloaded as JSON."
    });
  };

  const handleShare = () => {
    toast({
      title: "Share feature",
      description: "This feature is coming soon!"
    });
  };

  const renderTransformation = () => {
    if (!transformation || !transformationData) {
      return (
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <p className="text-gray-500">Select a transformation type and click "Transform Now" to generate learning materials</p>
        </div>
      );
    }

    switch (transformation.type as TransformationType) {
      case 'flashcards':
        return <Flashcards flashcards={transformationData} options={transformation.options} onRegenerate={onRegenerateTransformation} />;
      case 'summary':
        return <Summary summary={transformationData} options={transformation.options} onRegenerate={onRegenerateTransformation} />;
      case 'mindmap':
        return <MindMap mindMap={transformationData} options={transformation.options} onRegenerate={onRegenerateTransformation} />;
      case 'conceptmap':
        return <ConceptMap conceptMap={transformationData} options={transformation.options} onRegenerate={onRegenerateTransformation} />;
      case 'questions':
        return <Questions questions={transformationData} options={transformation.options} onRegenerate={onRegenerateTransformation} />;
      case 'simplify':
        return <Simplify simplifiedText={transformationData} originalText={transformation.originalText} options={transformation.options} onRegenerate={onRegenerateTransformation} />;
      case 'quiz':
        return <Quiz quiz={transformationData} options={transformation.options} onRegenerate={onRegenerateTransformation} />;
      default:
        return <div>Unsupported transformation type</div>;
    }
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">
              {transformation 
                ? transformation.title 
                : "Generated Content"}
            </h2>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSave} 
                disabled={!transformation || isProcessing}
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <i className="far fa-save"></i>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleDownload} 
                disabled={!transformation || isProcessing}
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <i className="fas fa-download"></i>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleShare} 
                disabled={!transformation || isProcessing}
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <i className="fas fa-share-alt"></i>
              </Button>
            </div>
          </div>

          {isProcessing ? (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
              <svg className="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-500">Transforming your study material...</p>
              <p className="text-xs text-gray-400 mt-2">This may take a few moments</p>
            </div>
          ) : (
            renderTransformation()
          )}
        </CardContent>
      </Card>

      <TransformationHistory 
        transformations={transformationHistory} 
        onSelect={onSelectHistory} 
      />
    </div>
  );
}
