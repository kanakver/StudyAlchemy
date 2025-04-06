# StudyAlchemist

StudyAlchemist is an AI-powered study companion that transforms your study materials into various learning formats such as flashcards, summaries, mind maps, and more.

## Features

- **AI-Powered Content Transformation**: Convert your study materials into different learning formats
- **Flashcards**: Generate flashcards from your study notes
- **Summaries**: Create concise summaries of lengthy content
- **Mind Maps**: Visualize concepts with AI-generated mind maps
- **Interactive Learning**: Engage with your study materials in an interactive way

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: Hugging Face API, OpenAI

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/kanakver/StudyAlchemy.git
   cd StudyAlchemy
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=your_database_url
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3001`

## Project Structure

- `client/`: Frontend React application
- `server/`: Backend Express server
- `shared/`: Shared types and utilities
- `drizzle.config.ts`: Database configuration
- `vite.config.ts`: Vite configuration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful UI components
- [Hugging Face](https://huggingface.co/) for AI capabilities
- [OpenAI](https://openai.com/) for additional AI features 