import { HfInference } from '@huggingface/inference';
import { v4 as uuidv4 } from 'uuid';
import { 
  Flashcard, 
  Summary, 
  MindMap, 
  Question, 
  Quiz
} from '@shared/schema';

// Initialize the HuggingFace client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Use a consistent model for all transformations
const MODEL = 'google/flan-t5-xxl';

// Helper function to safely parse JSON
function extractJsonFromText(text: string): any {
  try {
    // Clean the text to handle code blocks
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    
    // Find JSON boundaries
    const jsonStart = cleanText.indexOf('[') !== -1 ? cleanText.indexOf('[') : cleanText.indexOf('{');
    const jsonEnd = cleanText.lastIndexOf(']') !== -1 ? cleanText.lastIndexOf(']') + 1 : cleanText.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd <= 0) {
      throw new Error('No valid JSON found in response');
    }
    
    const jsonText = cleanText.slice(jsonStart, jsonEnd);
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    throw error;
  }
}

// Generate flashcards from text
export async function generateFlashcards(text: string, options: any = {}): Promise<Flashcard[]> {
  const prompt = `Generate ${options.numberOfCards || 5} flashcards from this text. Format as JSON array with objects containing "question" and "answer" fields.
  
Text: ${text}

Example format:
[
  {
    "question": "What is photosynthesis?",
    "answer": "The process by which plants convert light energy into chemical energy"
  }
]`;

  try {
    // First try with Hugging Face API
    try {
      const response = await hf.textGeneration({
        model: MODEL,
        inputs: prompt,
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.7,
          return_full_text: false
        }
      });

      const flashcards = extractJsonFromText(response.generated_text);
      
      if (!Array.isArray(flashcards)) {
        throw new Error('Response is not an array');
      }

      return flashcards.map((card: any) => ({
        id: uuidv4(),
        question: card.question || "Question not generated",
        answer: card.answer || "Answer not generated"
      }));
    } catch (apiError) {
      console.error('Error with Hugging Face API:', apiError);
      
      // If API fails, use fallback static flashcards based on the content
      console.log('Using fallback flashcards generation');
      
      // Extract keywords and create basic flashcards
      const lines = text.split('.');
      const flashcards: Flashcard[] = [];
      
      // Get subject from options or default to generic
      const subject = options.subject || 'the subject';
      
      // Generate 5 simple flashcards from the text
      for (let i = 0; i < Math.min(5, lines.length); i++) {
        if (lines[i].trim().length > 10) {
          flashcards.push({
            id: uuidv4(),
            question: `What is important about ${lines[i].trim().split(' ').slice(0, 3).join(' ')}...?`,
            answer: lines[i].trim()
          });
        }
      }
      
      // If we couldn't generate any flashcards from the text, use default ones
      if (flashcards.length === 0) {
        return [
          { 
            id: uuidv4(), 
            question: `What is ${subject}?`, 
            answer: "The study material provided discusses this topic in detail." 
          },
          { 
            id: uuidv4(), 
            question: `Name a key concept in ${subject}.`, 
            answer: "Key concepts include the main ideas presented in the study material." 
          },
          { 
            id: uuidv4(), 
            question: `How would you define ${subject}?`, 
            answer: "It can be defined based on the content provided in your study material." 
          },
          { 
            id: uuidv4(), 
            question: `What's an example of ${subject} in practice?`, 
            answer: "The study material may provide examples of practical applications." 
          },
          { 
            id: uuidv4(), 
            question: `Why is ${subject} important?`, 
            answer: "Its importance is related to the context described in your study material." 
          }
        ];
      }
      
      return flashcards;
    }
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return [{
      id: uuidv4(),
      question: "Error generating flashcards",
      answer: "Please try again with different text or options."
    }];
  }
}

// Generate summary from text
export async function generateSummary(text: string, options: any = {}): Promise<Summary> {
  const prompt = `Summarize the following text into key points. Format as JSON with a "points" array containing bullet points.
  
Text: ${text}

Example format:
{
  "points": [
    "First key point about the text",
    "Second key point about the text",
    "Third key point about the text"
  ]
}`;

  try {
    try {
      const response = await hf.textGeneration({
        model: MODEL,
        inputs: prompt,
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.7,
          return_full_text: false
        }
      });

      const summary = extractJsonFromText(response.generated_text);
      return {
        points: Array.isArray(summary.points) ? summary.points : ["Summary not generated correctly"]
      };
    } catch (apiError) {
      console.error('Error with Hugging Face API:', apiError);
      
      // Fallback: Generate a simple summary by extracting key sentences
      const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0);
      const points = [];
      
      // Take first sentence as intro
      if (sentences.length > 0) {
        points.push(sentences[0].trim());
      }
      
      // Select a few sentences from the middle based on length
      const middle = Math.floor(sentences.length / 2);
      if (sentences.length > 3) {
        points.push(sentences[middle].trim());
      }
      
      // Take last sentence as conclusion if available
      if (sentences.length > 1) {
        points.push(sentences[sentences.length - 1].trim());
      }
      
      // If we couldn't extract enough points, add a generic one
      if (points.length < 3) {
        points.push("The text covers important concepts and information related to the subject.");
      }
      
      return { points };
    }
  } catch (error) {
    console.error('Error generating summary:', error);
    return { points: ["Error generating summary. Please try again with different text or options."] };
  }
}

// Generate mind map from text
export async function generateMindMap(text: string, options: any = {}): Promise<MindMap> {
  const prompt = `Create a mind map from this text. Format as JSON with "nodes" array (each with "id", "text", "parentId", "position" with x/y coordinates) and "edges" array (each with "id", "source", "target").
  
Text: ${text}

Example format:
{
  "nodes": [
    {
      "id": "root",
      "text": "Main Topic",
      "parentId": null,
      "position": {"x": 0, "y": 0}
    },
    {
      "id": "subtopic1",
      "text": "Subtopic 1",
      "parentId": "root",
      "position": {"x": -100, "y": 100}
    }
  ],
  "edges": [
    {
      "id": "edge1",
      "source": "root",
      "target": "subtopic1"
    }
  ]
}`;

  try {
    try {
      const response = await hf.textGeneration({
        model: MODEL,
        inputs: prompt,
        parameters: {
          max_new_tokens: 2048,
          temperature: 0.7,
          return_full_text: false
        }
      });

      const mindMap = extractJsonFromText(response.generated_text);
      
      // Ensure proper node positioning and edge connections
      const nodes = Array.isArray(mindMap.nodes) ? mindMap.nodes.map((node: any, index: number) => ({
        id: node.id || `node-${index}`,
        text: node.text || `Node ${index}`,
        parentId: node.parentId,
        position: node.position || { x: 100 * (index % 5), y: 100 * Math.floor(index / 5) }
      })) : [];
      
      const edges = Array.isArray(mindMap.edges) ? mindMap.edges.map((edge: any, index: number) => ({
        id: edge.id || `edge-${index}`,
        source: edge.source,
        target: edge.target
      })) : [];
      
      return { nodes, edges };
    } catch (apiError) {
      console.error('Error with Hugging Face API:', apiError);
      
      // Fallback: Generate a simple mind map structure from the text
      const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0).slice(0, 5);
      const nodes = [];
      const edges = [];
      
      // Create root node
      const subject = options.subject || 'Main Topic';
      nodes.push({
        id: "root",
        text: subject,
        parentId: null,
        position: { x: 0, y: 0 }
      });
      
      // Create child nodes from sentences
      sentences.forEach((sentence, index) => {
        const firstWords = sentence.trim().split(' ').slice(0, 3).join(' ');
        nodes.push({
          id: `node-${index}`,
          text: firstWords + '...',
          parentId: "root",
          position: { 
            x: 150 * Math.cos(2 * Math.PI * index / sentences.length), 
            y: 150 * Math.sin(2 * Math.PI * index / sentences.length) 
          }
        });
        
        edges.push({
          id: `edge-${index}`,
          source: "root",
          target: `node-${index}`
        });
      });
      
      return { nodes, edges };
    }
  } catch (error) {
    console.error('Error generating mind map:', error);
    return { 
      nodes: [
        { id: "root", text: "Error", parentId: null, position: { x: 0, y: 0 } },
        { id: "error", text: "Failed to generate mind map", parentId: "root", position: { x: 0, y: 100 } }
      ], 
      edges: [{ id: "edge1", source: "root", target: "error" }] 
    };
  }
}

// Generate questions from text
export async function generateQuestions(text: string, options: any = {}): Promise<Question[]> {
  const prompt = `Generate ${options.numberOfQuestions || 5} practice questions from this text. Format as JSON array with objects containing "question" and "answer" fields.
  
Text: ${text}

Example format:
[
  {
    "question": "What is the capital of France?",
    "answer": "Paris"
  }
]`;

  try {
    try {
      const response = await hf.textGeneration({
        model: MODEL,
        inputs: prompt,
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.7,
          return_full_text: false
        }
      });

      const questions = extractJsonFromText(response.generated_text);
      
      if (!Array.isArray(questions)) {
        throw new Error('Response is not an array');
      }

      return questions.map((question: any) => ({
        id: uuidv4(),
        question: question.question || "Question not generated",
        answer: question.answer || "Answer not generated"
      }));
    } catch (apiError) {
      console.error('Error with Hugging Face API:', apiError);
      
      // Fallback: Create simple questions from the text
      const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0).slice(0, 5);
      const questions = [];
      
      // Generate "what" questions from sentences
      for (const sentence of sentences) {
        if (sentence.trim().length > 15) {
          const words = sentence.trim().split(' ');
          questions.push({
            id: uuidv4(),
            question: `What does it mean that "${words.slice(0, Math.min(8, words.length)).join(' ')}..."?`,
            answer: sentence.trim()
          });
        }
      }
      
      // If we couldn't generate enough questions, add generic ones
      const subject = options.subject || 'the topic';
      while (questions.length < 5) {
        questions.push({
          id: uuidv4(),
          question: `What is an important aspect of ${subject}?`,
          answer: "The text discusses various aspects of this topic."
        });
      }
      
      return questions;
    }
  } catch (error) {
    console.error('Error generating questions:', error);
    return [{ 
      id: uuidv4(), 
      question: "Error generating questions", 
      answer: "Please try again with different text or options." 
    }];
  }
}

// Generate quiz from text
export async function generateQuiz(text: string, options: any = {}): Promise<Quiz> {
  const prompt = `Create a quiz with ${options.numberOfQuestions || 5} multiple-choice questions from this text. Format as JSON with a "questions" array. Each question object should have "question", "answers" (array of 4 choices), and "correctAnswerIndex" (index 0-3 of correct answer).
  
Text: ${text}

Example format:
{
  "questions": [
    {
      "question": "What is the capital of France?",
      "answers": ["London", "Paris", "Berlin", "Madrid"],
      "correctAnswerIndex": 1
    }
  ]
}`;

  try {
    try {
      const response = await hf.textGeneration({
        model: MODEL,
        inputs: prompt,
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.7,
          return_full_text: false
        }
      });

      const quiz = extractJsonFromText(response.generated_text);
      
      if (!quiz.questions || !Array.isArray(quiz.questions)) {
        throw new Error('Invalid quiz format');
      }

      return {
        questions: quiz.questions.map((question: any) => ({
          id: uuidv4(),
          question: question.question || "Question not generated",
          answers: Array.isArray(question.answers) ? question.answers : ["Option 1", "Option 2", "Option 3", "Option 4"],
          correctAnswerIndex: typeof question.correctAnswerIndex === 'number' ? question.correctAnswerIndex : 0
        }))
      };
    } catch (apiError) {
      console.error('Error with Hugging Face API:', apiError);
      
      // Fallback: Create simple quiz questions from the text
      const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0).slice(0, 5);
      const quizQuestions = [];
      
      // Extract words that might be important
      const words = text.split(' ').filter(w => w.length > 5);
      
      // Get subject from options or default to generic
      const subject = options.subject || 'the subject';
      
      // Generate multiple choice questions
      for (let i = 0; i < Math.min(5, sentences.length); i++) {
        if (sentences[i].trim().length > 15) {
          const question = {
            id: uuidv4(),
            question: `Which statement is true about ${subject}?`,
            answers: [
              sentences[i].trim(),
              `The opposite of ${sentences[i].trim()}`,
              `${subject} is unrelated to ${words[i % words.length] || 'this topic'}`,
              `None of the above`,
            ],
            correctAnswerIndex: 0 // First option is always correct in our fallback
          };
          quizQuestions.push(question);
        }
      }
      
      // If we couldn't generate enough questions, add generic ones
      while (quizQuestions.length < 5) {
        quizQuestions.push({
          id: uuidv4(),
          question: `What best describes ${subject}?`,
          answers: [
            "It is as described in the text",
            "It is unrelated to the text",
            "It contradicts the text",
            "None of the above"
          ],
          correctAnswerIndex: 0
        });
      }
      
      return { questions: quizQuestions };
    }
  } catch (error) {
    console.error('Error generating quiz:', error);
    return { 
      questions: [{ 
        id: uuidv4(), 
        question: "Error generating quiz", 
        answers: ["Option 1", "Option 2", "Option 3", "Option 4"], 
        correctAnswerIndex: 0 
      }] 
    };
  }
}