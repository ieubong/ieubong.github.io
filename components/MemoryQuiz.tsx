
import React, { useState, useMemo, useEffect } from 'react';
import { ThemePack } from '../types';
import { MEMORY_DATA } from '../constants';
import { X, Trophy, Brain, MapPin, Smile, RefreshCw, PartyPopper, Calendar, Clock, Sun } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MemoryQuizProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemePack;
}

interface Question {
  id: number;
  text: string;
  type: 'location' | 'mood' | 'date' | 'chronology' | 'season' | 'time';
  options: string[];
  correctAnswer: string;
  img?: string;
}

const MemoryQuiz: React.FC<MemoryQuizProps> = ({ isOpen, onClose, theme }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  // Helper to parse date string (approximate format "HH:mm dd/MM/yyyy" or similar)
  const parseDate = (dateStr: string): Date | null => {
      const match = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (match) {
          // If time exists "HH:mm dd/MM/yyyy"
          const timeMatch = dateStr.match(/(\d{1,2}):(\d{1,2})/);
          const h = timeMatch ? parseInt(timeMatch[1]) : 12;
          const m = timeMatch ? parseInt(timeMatch[2]) : 0;
          return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]), h, m);
      }
      return null;
  };

  // Generate Questions
  const generateQuestions = () => {
    if (MEMORY_DATA.length < 3) return; 

    const newQuestions: Question[] = [];
    const allDetails = MEMORY_DATA.flatMap(l => l.detail.map(d => ({ ...d, locationName: l.name })));
    const shuffledDetails = [...allDetails].sort(() => 0.5 - Math.random());
    const shuffledLocations = [...MEMORY_DATA].sort(() => 0.5 - Math.random());

    // 1. Image Location Guess
    const imgMem = shuffledDetails.find(d => d.img);
    if (imgMem) {
        const others = MEMORY_DATA.filter(l => l.name !== imgMem.locationName).map(l => l.name).sort(() => 0.5 - Math.random()).slice(0, 3);
        const options = [...others, imgMem.locationName].sort(() => 0.5 - Math.random());
        newQuestions.push({
            id: 1,
            text: "Where was this photo taken?",
            type: 'location',
            img: imgMem.img,
            options,
            correctAnswer: imgMem.locationName
        });
    }

    // 2. Mood Guess
    const moodMem = shuffledDetails.find(d => d.mood && d.desc.length > 20 && d !== imgMem);
    if (moodMem) {
         const options = ['happy', 'romantic', 'funny', 'chaos', 'chill', 'foodie'].sort(() => 0.5 - Math.random()).slice(0, 4);
         if (!options.includes(moodMem.mood!)) options[0] = moodMem.mood!;
         newQuestions.push({
             id: 2,
             text: `On a date at "${moodMem.locationName}", what was the main vibe?`,
             type: 'mood',
             options: options.sort(() => 0.5 - Math.random()),
             correctAnswer: moodMem.mood!
         });
    }

    // 3. Description Guess
    const descMem = shuffledDetails.find(d => d.desc.length > 50 && d !== imgMem && d !== moodMem);
    if (descMem) {
        const others = MEMORY_DATA.filter(l => l.name !== descMem.locationName).map(l => l.name).sort(() => 0.5 - Math.random()).slice(0, 3);
        const options = [...others, descMem.locationName].sort(() => 0.5 - Math.random());
        const snippet = descMem.desc.substring(0, 60) + "...";
        newQuestions.push({
            id: 3,
            text: `Which location matches this memory: "${snippet}"?`,
            type: 'location',
            options,
            correctAnswer: descMem.locationName
        });
    }

    // 4. Chronology: Which came first?
    // Pick 2 memories with valid dates
    const datedMems = shuffledDetails.filter(d => parseDate(d.date)).slice(0, 2);
    if (datedMems.length === 2) {
        const d1 = parseDate(datedMems[0].date)!;
        const d2 = parseDate(datedMems[1].date)!;
        const correct = d1 < d2 ? datedMems[0].locationName : datedMems[1].locationName;
        
        // Ensure names are different, otherwise skip
        if (datedMems[0].locationName !== datedMems[1].locationName) {
            newQuestions.push({
                id: 4,
                text: "Which of these memories happened first?",
                type: 'chronology',
                options: [datedMems[0].locationName, datedMems[1].locationName].sort(() => 0.5 - Math.random()),
                correctAnswer: correct
            });
        }
    }

    // 5. Season Guess
    const seasonMem = shuffledDetails.find(d => {
        const date = parseDate(d.date);
        return date && (date.getMonth() === 11 || date.getMonth() < 2 || (date.getMonth() >= 5 && date.getMonth() <= 7));
    }); // Look for winter/summer
    if (seasonMem) {
        const date = parseDate(seasonMem.date)!;
        const month = date.getMonth();
        const season = (month === 11 || month <= 1) ? 'Winter' : (month >= 5 && month <= 7) ? 'Summer' : (month >= 2 && month <= 4) ? 'Spring' : 'Autumn';
        newQuestions.push({
            id: 5,
            text: `In which season did we visit "${seasonMem.locationName}"?`,
            type: 'season',
            options: ['Spring', 'Summer', 'Autumn', 'Winter'],
            correctAnswer: season
        });
    }

    // 6. Time of Day
    const timeMem = shuffledDetails.find(d => {
        const date = parseDate(d.date);
        return date;
    });
    if (timeMem) {
        const date = parseDate(timeMem.date)!;
        const hour = date.getHours();
        let timeOfDay = "Afternoon";
        if (hour < 12) timeOfDay = "Morning";
        else if (hour > 18) timeOfDay = "Evening";

        newQuestions.push({
            id: 6,
            text: `Did we visit "${timeMem.locationName}" in the morning, afternoon, or evening?`,
            type: 'time',
            options: ['Morning', 'Afternoon', 'Evening'],
            correctAnswer: timeOfDay
        });
    }
    
    // Fill remaining to ensure we have questions (duplicates allowed for fallback)
    let fillIdx = 0;
    while (newQuestions.length < 8 && newQuestions.length > 0) {
        newQuestions.push({ ...newQuestions[fillIdx % newQuestions.length], id: newQuestions.length + 1 });
        fillIdx++;
    }

    setQuestions(newQuestions.slice(0, 8)); // Cap at 8
    setCurrentQIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswerChecked(false);
  };

  useEffect(() => {
    if (isOpen) generateQuestions();
  }, [isOpen]);

  const handleAnswer = (option: string) => {
      if (isAnswerChecked) return;
      setSelectedOption(option);
      setIsAnswerChecked(true);
      
      if (option === questions[currentQIndex].correctAnswer) {
          setScore(prev => prev + 1);
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }

      setTimeout(() => {
          if (currentQIndex < questions.length - 1) {
              setCurrentQIndex(prev => prev + 1);
              setSelectedOption(null);
              setIsAnswerChecked(false);
          } else {
              setShowResult(true);
              if (score + (option === questions[currentQIndex].correctAnswer ? 1 : 0) === questions.length) {
                  confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
              }
          }
      }, 1500);
  };

  if (!isOpen) return null;
  const currentQ = questions[currentQIndex];

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4">
       <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>

       <div className={`
         relative w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden
         bg-white border-4 border-white/20 animate-pop flex flex-col min-h-[500px]
       `}>
          {/* Header */}
          <div className={`p-4 ${theme.colors.primary} text-white flex justify-between items-center`}>
              <div className="flex items-center gap-2">
                  <Brain size={24} />
                  <span className="font-black text-xl">Memory Quiz</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full"><X size={20} /></button>
          </div>

          <div className="flex-1 p-6 flex flex-col">
              {!showResult && currentQ ? (
                  <>
                    <div className="flex justify-between items-center mb-6 text-sm font-bold text-gray-400">
                        <span>Question {currentQIndex + 1}/{questions.length}</span>
                        <span>Score: {score}</span>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                        {currentQ.img && (
                            <div className="mb-4 rounded-xl overflow-hidden h-40 shadow-lg rotate-1 border-4 border-white">
                                <img src={currentQ.img} alt="Question" className="w-full h-full object-cover" />
                            </div>
                        )}
                        
                        {/* Type Icon */}
                        <div className="mx-auto mb-2 text-gray-400">
                            {currentQ.type === 'chronology' && <Calendar size={32} />}
                            {currentQ.type === 'time' && <Clock size={32} />}
                            {currentQ.type === 'season' && <Sun size={32} />}
                        </div>

                        <h3 className="text-lg font-bold text-gray-800 mb-6 text-center leading-relaxed">
                            {currentQ.text}
                        </h3>

                        <div className="space-y-3">
                            {currentQ.options.map((opt, idx) => {
                                let btnClass = "bg-gray-100 hover:bg-gray-200 text-gray-700";
                                if (isAnswerChecked) {
                                    if (opt === currentQ.correctAnswer) btnClass = "bg-green-500 text-white ring-4 ring-green-200";
                                    else if (opt === selectedOption) btnClass = "bg-red-500 text-white";
                                    else btnClass = "bg-gray-100 opacity-50";
                                }

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(opt)}
                                        disabled={isAnswerChecked}
                                        className={`w-full p-4 rounded-xl font-bold text-left transition-all transform active:scale-95 shadow-sm ${btnClass}`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                  </>
              ) : showResult ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                      <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-white shadow-xl animate-bounce">
                          <Trophy size={48} />
                      </div>
                      <div>
                          <h2 className="text-3xl font-black text-gray-800">Quiz Complete!</h2>
                          <p className="text-lg text-gray-500 font-bold mt-2">You scored {score} out of {questions.length}</p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-2xl w-full">
                          {score === questions.length ? "Perfect! You know us so well! ❤️" : score > questions.length / 2 ? "Good job! Keep making memories! 📸" : "Oops! Time to revisit some memories! 😅"}
                      </div>

                      <button 
                        onClick={generateQuestions}
                        className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg flex items-center gap-2 hover:scale-105 transition-transform ${theme.colors.secondary}`}
                      >
                          <RefreshCw size={20} /> Play Again
                      </button>
                  </div>
              ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                      Not enough memories to generate a quiz yet!
                  </div>
              )}
          </div>
       </div>
    </div>
  );
};

export default MemoryQuiz;
