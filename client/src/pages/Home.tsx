import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { storeTransformation, getStoredTransformations } from "@/lib/storage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InputSection from "@/components/InputSection";
import ResultsSection from "@/components/ResultsSection";
import { Transformation } from "@shared/schema";

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTransformation, setCurrentTransformation] = useState<Transformation | null>(null);
  const [transformationData, setTransformationData] = useState<any>(null);
  const [transformationHistory, setTransformationHistory] = useState<Transformation[]>([]);
  const { toast } = useToast();

  // Load transformation history from local storage on mount
  useEffect(() => {
    const loadTransformations = async () => {
      try {
        const stored = await getStoredTransformations();
        setTransformationHistory(stored);
      } catch (error) {
        console.error("Error loading transformations:", error);
      }
    };
    
    loadTransformations();
  }, []);

  // Process text transformation
  const handleTransform = async (data: {
    text: string;
    type: string;
    subject: string;
    contentType: string;
    options: Record<string, any>;
  }) => {
    setIsProcessing(true);
    
    try {
      const response = await apiRequest("POST", "/api/transform", data);
      const result = await response.json();
      
      if (result.success) {
        // Save transformation to local storage
        await storeTransformation(result.transformation);
        
        // Update state
        setCurrentTransformation(result.transformation);
        setTransformationData(result.data);
        
        // Update history
        setTransformationHistory((prev) => [result.transformation, ...prev]);
        
        toast({
          title: "Transformation complete",
          description: `Successfully created ${data.type} from your study material.`,
        });
      } else {
        throw new Error(result.error || "Failed to transform text");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process your request",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Select a transformation from history
  const handleSelectHistory = (transformation: Transformation) => {
    setCurrentTransformation(transformation);
    
    try {
      const data = JSON.parse(transformation.content);
      setTransformationData(data);
    } catch (error) {
      console.error("Error parsing transformation data:", error);
      toast({
        title: "Error",
        description: "Failed to load transformation data",
        variant: "destructive",
      });
    }
  };

  // Regenerate the current transformation
  const handleRegenerateTransformation = async () => {
    if (!currentTransformation) return;
    
    setIsProcessing(true);
    
    try {
      const data = {
        text: currentTransformation.originalText,
        type: currentTransformation.type,
        subject: currentTransformation.subject,
        contentType: "notes", // Default
        options: currentTransformation.options,
      };
      
      const response = await apiRequest("POST", "/api/transform", data);
      const result = await response.json();
      
      if (result.success) {
        // Save transformation to local storage
        await storeTransformation(result.transformation);
        
        // Update state
        setCurrentTransformation(result.transformation);
        setTransformationData(result.data);
        
        // Update history
        setTransformationHistory((prev) => {
          const filtered = prev.filter(t => t.id !== result.transformation.id);
          return [result.transformation, ...filtered];
        });
        
        toast({
          title: "Regeneration complete",
          description: "Your study material has been retransformed.",
        });
      } else {
        throw new Error(result.error || "Failed to regenerate");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to regenerate",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <InputSection
            onTransform={handleTransform}
            isProcessing={isProcessing}
          />
          <ResultsSection
            transformation={currentTransformation}
            transformationData={transformationData}
            transformationHistory={transformationHistory}
            isProcessing={isProcessing}
            onSelectHistory={handleSelectHistory}
            onRegenerateTransformation={handleRegenerateTransformation}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
