import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TransformationSelector from "./TransformationSelector";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PaperClipIcon, SparklesIcon, LightBulbIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface InputSectionProps {
  onTransform: (data: {
    text: string;
    type: string;
    subject: string;
    contentType: string;
    options: Record<string, any>;
  }) => void;
  isProcessing: boolean;
}

export default function InputSection({ onTransform, isProcessing }: InputSectionProps) {
  const [studyMaterial, setStudyMaterial] = useState<string>("");
  const [contentType, setContentType] = useState<string>("notes");
  const [subject, setSubject] = useState<string>("biology");
  const [transformationType, setTransformationType] = useState<string>("flashcards");
  const [charCount, setCharCount] = useState<number>(0);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    setCharCount(studyMaterial.length);
  }, [studyMaterial]);

  // Sample data for placeholders and examples
  const sampleData = {
    biology: "Photosynthesis is the process by which plants convert light energy into chemical energy. It occurs in the chloroplasts of plant cells, which contain the pigment chlorophyll. This process involves two main stages: the light-dependent reactions and the light-independent reactions (Calvin cycle).\n\nDuring the light-dependent reactions, chlorophyll absorbs light energy and converts it to chemical energy in the form of ATP and NADPH. Water is split during this process, releasing oxygen as a byproduct.\n\nIn the Calvin cycle, the energy from ATP and NADPH is used to convert carbon dioxide from the atmosphere into glucose. This process is also known as carbon fixation. The glucose produced can be used immediately for energy or stored as starch for later use.",
    chemistry: "The periodic table organizes elements based on their atomic number and chemical properties. Elements in the same group (column) have similar properties because they have the same number of electrons in their outer shell.\n\nChemical bonding occurs when atoms interact to form molecules. The three main types of chemical bonds are ionic, covalent, and metallic bonds.\n\nIonic bonds form when electrons are transferred from one atom to another, creating positively and negatively charged ions that attract each other. Sodium chloride (table salt) is a classic example of an ionic compound.\n\nCovalent bonds form when atoms share electrons. Water (H₂O) is an example of a molecule with covalent bonds, where oxygen shares electrons with two hydrogen atoms.",
    physics: "Newton's three laws of motion describe the relationship between an object and the forces acting upon it. The first law states that an object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force. This is also known as the law of inertia.\n\nThe second law states that force equals mass times acceleration (F = ma). This means that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.\n\nThe third law states that for every action, there is an equal and opposite reaction. When one object exerts a force on another, the second object exerts an equal force in the opposite direction on the first object.",
    math: "The quadratic formula is used to solve quadratic equations of the form ax² + bx + c = 0. The formula is x = (-b ± √(b² - 4ac)) / 2a, where the discriminant (b² - 4ac) determines the number and nature of the solutions.\n\nIf the discriminant is positive, the equation has two distinct real solutions. If the discriminant is zero, the equation has one repeated real solution. If the discriminant is negative, the equation has two complex solutions.\n\nThe Pythagorean theorem states that in a right triangle, the square of the length of the hypotenuse equals the sum of the squares of the lengths of the other two sides. Algebraically, this is expressed as a² + b² = c², where c is the length of the hypotenuse, and a and b are the lengths of the other two sides.",
    history: "World War II (1939-1945) was a global conflict that involved most of the world's nations. It was fought between the Allies (including Great Britain, France, USSR, United States, and others) and the Axis powers (Nazi Germany, Italy, and Japan).\n\nThe war was triggered by Germany's invasion of Poland in September 1939. The conflict expanded when Germany invaded the Soviet Union in June 1941, and Japan attacked Pearl Harbor in December 1941, bringing the United States into the war.\n\nThe war in Europe ended with Germany's surrender in May 1945, and the war in the Pacific ended with Japan's surrender in August 1945 following the atomic bombings of Hiroshima and Nagasaki. World War II resulted in an estimated 70-85 million fatalities and fundamentally changed the political and social structure of the world.",
    literature: "Shakespeare's 'Hamlet' is a tragedy written between 1599 and 1601. The play is set in Denmark and follows Prince Hamlet who seeks revenge against his uncle Claudius, who murdered Hamlet's father (the king), seized the throne, and married Hamlet's mother.\n\nThroughout the play, Hamlet struggles with his indecisiveness and delays his revenge. The play explores themes of revenge, madness, mortality, and the complexity of human action and intention.\n\nFamous quotes from the play include 'To be, or not to be, that is the question' from Hamlet's soliloquy in Act 3, Scene 1, where he contemplates life, death, and suicide. Another notable quote is 'The lady doth protest too much, methinks' spoken by Queen Gertrude during the play-within-a-play, which has become a common expression used to describe someone who is overly insistent about something, suggesting that the opposite is true.",
    "computer-science": "An algorithm is a step-by-step procedure or a set of rules for solving a specific problem or accomplishing a defined task. Algorithms are essential in computer science and form the basis for all computer programs.\n\nTime complexity is a measure of the amount of time an algorithm takes to complete as a function of the length of the input. It's typically expressed using Big O notation. For example, an algorithm with O(n) time complexity means the runtime grows linearly with the input size.\n\nData structures are specialized formats for organizing, storing, and manipulating data. Common data structures include arrays, linked lists, stacks, queues, trees, and graphs. Each has its own strengths and weaknesses, making them suitable for different types of operations and applications.",
    psychology: "Cognitive psychology is the study of mental processes such as attention, language use, memory, perception, problem solving, creativity, and thinking. It focuses on how people perceive, process, and store information.\n\nClassical conditioning, discovered by Ivan Pavlov, is a learning process that occurs when two stimuli are repeatedly paired. Eventually, a response that is initially caused by the second stimulus is triggered by the first stimulus alone. For example, in Pavlov's experiments, dogs naturally salivated (unconditioned response) when presented with food (unconditioned stimulus). After repeatedly pairing a bell with food, the dogs began to salivate (conditioned response) at the sound of the bell alone (conditioned stimulus).\n\nMaslow's hierarchy of needs is a motivational theory in psychology comprising a five-tier model of human needs. From bottom to top, the needs are: physiological (food, water), safety (security, employment), love and belonging (friendship, intimacy), esteem (respect, recognition), and self-actualization (achieving one's full potential).",
    economics: "Supply and demand is a fundamental economic model that explains how prices are determined in a market. According to this theory, the price of a good or service is determined by the interaction between consumers' demand for it and producers' willingness to supply it.\n\nInflation is the rate at which the general level of prices for goods and services is rising, and, subsequently, purchasing power is falling. Central banks attempt to limit inflation and avoid deflation to keep the economy running smoothly.\n\nGross Domestic Product (GDP) is the total monetary or market value of all the finished goods and services produced within a country's borders in a specific time period. As a broad measure of overall domestic production, it functions as a comprehensive scorecard of a country's economic health.",
    other: "Artificial Intelligence (AI) is a branch of computer science concerned with building smart machines capable of performing tasks that typically require human intelligence. Machine learning is a subset of AI that involves training algorithms to learn patterns from data and make predictions or decisions without being explicitly programmed.\n\nRenewable energy comes from sources that are naturally replenished on a human timescale, such as sunlight, wind, rain, tides, waves, and geothermal heat. Transitioning to renewable energy is crucial for reducing greenhouse gas emissions and combating climate change.\n\nGlobal supply chains are networks of production, logistics, and distribution that span multiple countries and continents. They enable the flow of goods and services from raw materials to finished products delivered to consumers. Events like the COVID-19 pandemic have highlighted both the efficiency and vulnerability of these interconnected systems."
  };

  const handleTransformationSelect = (type: string) => {
    setTransformationType(type);
  };

  const getTransformationOptions = (type: string) => {
    // Return empty object for all transformation types to simplify the UI
    // No specific options will be passed now
    return {};
  };

  const getPlaceholderText = () => {
    return subject in sampleData 
      ? sampleData[subject as keyof typeof sampleData]
      : "Paste or type your study material here...";
  };

  const handleInsertExample = () => {
    if (subject in sampleData) {
      setStudyMaterial(sampleData[subject as keyof typeof sampleData]);
      toast({
        title: "Example inserted",
        description: `Sample ${subject} content has been added.`,
      });
    }
  };

  const handleClearText = () => {
    if (studyMaterial.trim().length > 0) {
      setStudyMaterial("");
      toast({
        title: "Text cleared",
        description: "The input field has been cleared.",
      });
    }
  };

  const handleTransform = () => {
    if (studyMaterial.trim().length < 10) {
      toast({
        title: "Input too short",
        description: "Please enter more study material to process.",
        variant: "destructive",
      });
      return;
    }

    onTransform({
      text: studyMaterial,
      type: transformationType,
      subject,
      contentType,
      options: getTransformationOptions(transformationType),
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = () => {
    setIsHovering(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovering(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      if (file.type === "text/plain" || file.name.endsWith('.txt') || file.type === "application/pdf") {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === 'string') {
            setStudyMaterial(event.target.result);
            toast({
              title: "File loaded",
              description: `${file.name} has been loaded successfully.`,
            });
          }
        };
        
        reader.readAsText(file);
      } else {
        toast({
          title: "Unsupported file type",
          description: "Please upload a text (.txt) file.",
          variant: "destructive",
        });
      }
    }
  };

  const getCharCountColor = () => {
    if (charCount === 0) return "text-gray-400";
    if (charCount < 10) return "text-red-500";
    if (charCount < 100) return "text-orange-500";
    if (charCount < 500) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="lg:col-span-1 space-y-6"
    >
      <Card className="shadow-lg border-primary/10 overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-5">
            <h2 className="text-xl font-bold text-primary">Study Material</h2>
            <p className="text-sm text-gray-600">Enter your content to transform</p>
          </div>
          <div className="p-5 space-y-5">
            <div 
              className={`relative border-2 rounded-lg transition-all duration-300 ${isHovering ? 'border-primary border-dashed bg-primary/5' : 'border-gray-200'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Textarea
                value={studyMaterial}
                onChange={(e) => setStudyMaterial(e.target.value)}
                className="w-full h-64 p-4 border-none focus:outline-none focus:ring-0 resize-none bg-transparent"
                placeholder={getPlaceholderText()}
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-white/90 hover:bg-gray-100 text-gray-700 flex items-center gap-1"
                        onClick={handleInsertExample}
                      >
                        <LightBulbIcon className="h-4 w-4" />
                        <span>Example</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Insert example {subject} content</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-white/90 hover:bg-gray-100 text-gray-700"
                        onClick={handleClearText}
                        disabled={studyMaterial.length === 0}
                      >
                        <ArrowPathIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Clear text</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="absolute bottom-2 right-3">
                <span className={`text-xs font-mono ${getCharCountColor()}`}>
                  {charCount} characters
                </span>
              </div>
              
              <AnimatePresence>
                {isHovering && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-primary/5 pointer-events-none"
                  >
                    <div className="text-center">
                      <PaperClipIcon className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-700">Drop your file here</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px] space-y-1">
                <Label className="block text-sm font-medium text-gray-700">Content Type</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="notes">Study Notes</SelectItem>
                    <SelectItem value="textbook">Textbook Content</SelectItem>
                    <SelectItem value="lecture">Lecture Notes</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="research">Research Paper</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1 min-w-[200px] space-y-1">
                <Label className="block text-sm font-medium text-gray-700">Subject</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="biology">Biology</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="math">Mathematics</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="literature">Literature</SelectItem>
                    <SelectItem value="computer-science">Computer Science</SelectItem>
                    <SelectItem value="psychology">Psychology</SelectItem>
                    <SelectItem value="economics">Economics</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-gray-500 text-sm bg-gray-50 p-2 rounded-md">
              <PaperClipIcon className="h-4 w-4" />
              <span>Drag and drop files here to upload</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-primary/10 overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-5">
            <h2 className="text-xl font-bold text-primary">Transform Into</h2>
            <p className="text-sm text-gray-600">Choose how to process your content</p>
          </div>
          
          <div className="p-5">
            <TransformationSelector 
              selectedType={transformationType} 
              onSelect={handleTransformationSelect} 
            />
            
            <div className="mt-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleTransform}
                  disabled={isProcessing}
                  className="w-full py-4 px-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="font-semibold">Processing...</span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-5 w-5" />
                      <span className="font-semibold">Transform Now</span>
                    </>
                  )}
                </Button>
              </motion.div>
              <p className="text-xs text-gray-500 mt-2 text-center">Using AI to process your content</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
