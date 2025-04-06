import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="ml-1 text-sm text-gray-500">StudyTransform</span>
          </div>
          <div className="flex space-x-6">
            <Link href="#help" className="text-sm text-gray-500 hover:text-primary transition-colors">Help</Link>
            <Link href="#privacy" className="text-sm text-gray-500 hover:text-primary transition-colors">Privacy</Link>
            <Link href="#terms" className="text-sm text-gray-500 hover:text-primary transition-colors">Terms</Link>
            <Link href="#feedback" className="text-sm text-gray-500 hover:text-primary transition-colors">Feedback</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
