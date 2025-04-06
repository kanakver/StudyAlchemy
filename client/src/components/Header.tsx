import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const { toast } = useToast();

  const handleSaveAll = () => {
    toast({
      title: "All transformations saved",
      description: "Your transformations have been saved locally.",
    });
  };

  const handleHelp = () => {
    toast({
      title: "Help Information",
      description: "Input your study text, select a transformation type, and click 'Transform Now' to create study materials.",
    });
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <h1 className="ml-2 text-xl font-bold text-primary">StudyTransform</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={handleHelp} 
            className="text-sm text-gray-500"
          >
            <i className="far fa-question-circle mr-1"></i>
            Help
          </Button>
          <Button 
            variant="default" 
            onClick={handleSaveAll} 
            className="text-sm bg-primary text-white"
          >
            <i className="far fa-save mr-1"></i>
            Save All
          </Button>
        </div>
      </div>
    </header>
  );
}
