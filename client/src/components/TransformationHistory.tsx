import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Transformation } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface TransformationHistoryProps {
  transformations: Transformation[];
  onSelect: (transformation: Transformation) => void;
}

export default function TransformationHistory({ transformations, onSelect }: TransformationHistoryProps) {
  // Function to get icon based on transformation type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flashcards':
        return 'fas fa-clone';
      case 'summary':
        return 'fas fa-list-ul';
      case 'mindmap':
        return 'fas fa-sitemap';
      case 'questions':
        return 'fas fa-question-circle';
      case 'simplify':
        return 'fas fa-text-height';
      case 'quiz':
        return 'fas fa-check-square';
      default:
        return 'fas fa-file-alt';
    }
  };

  // Function to get count info based on transformation type
  const getCountInfo = (transformation: Transformation) => {
    try {
      const content = JSON.parse(transformation.content);
      
      switch (transformation.type) {
        case 'flashcards':
          return `${content.length} cards`;
        case 'summary':
          return `${content.points.length} points`;
        case 'mindmap':
          return `${content.nodes.length} concepts`;
        case 'questions':
          return `${content.length} questions`;
        case 'quiz':
          return `${content.questions.length} questions`;
        default:
          return "";
      }
    } catch {
      return "";
    }
  };

  // Format time ago
  const formatTimeAgo = (date: Date | string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold mb-4">Recent Transformations</h2>
        <div className="space-y-4">
          {transformations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 border border-dashed border-gray-200 rounded-lg">
              No transformations yet. Create your first one!
            </div>
          ) : (
            transformations.slice(0, 5).map((item) => (
              <div 
                key={item.id}
                onClick={() => onSelect(item)}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary/30 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                        <i className={`${getTypeIcon(item.type)} text-sm`}></i>
                      </span>
                      <h3 className="ml-2 font-medium">{item.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.subject} • {getCountInfo(item)} • {formatTimeAgo(item.createdAt)}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary transition-colors">
                    <i className="fas fa-ellipsis-v"></i>
                  </Button>
                </div>
              </div>
            ))
          )}

          {transformations.length > 5 && (
            <Button 
              variant="link" 
              className="w-full py-2 text-primary text-sm font-medium hover:underline"
            >
              View All Transformations
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
