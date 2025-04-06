import { Summary } from "@shared/schema";

interface SummaryProps {
  summary: Summary;
  options: Record<string, any>;
  onRegenerate: () => void;
}

export default function SummaryComponent({ summary, options, onRegenerate }: SummaryProps) {
  if (!summary || !summary.points || summary.points.length === 0) {
    return <div className="text-center p-4">No summary generated</div>;
  }

  return (
    <div className="summary-container">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Summary Points</h3>
        <ul className="space-y-3 list-disc pl-5">
          {summary.points.map((point, index) => (
            <li key={index} className="text-gray-800">
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
