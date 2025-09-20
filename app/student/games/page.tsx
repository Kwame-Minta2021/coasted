'use client';

import { useState } from 'react';
import { 
  Gamepad2, 
  Play, 
  Star, 
  Clock, 
  Users,
  Search,
  Filter,
  Trophy,
  Target,
  Zap,
  Brain,
  Cpu,
  Code
} from 'lucide-react';


interface Game {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  rating: number;
  players: number;
  isCompleted: boolean;
  highScore?: number;
  bestTime?: string;
  image?: string;
}

export default function GamesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

    // Empty games - will be populated from database when student enrolls
  const games: Game[] = [];

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || game.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const categories = ['all', ...Array.from(new Set(games.map(g => g.category)))];
  const difficulties = ['all', ...Array.from(new Set(games.map(g => g.difficulty)))];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Programming': return <Code className="h-5 w-5" />;
      case 'Robotics': return <Cpu className="h-5 w-5" />;
      case 'AI & ML': return <Brain className="h-5 w-5" />;
      case 'Electronics': return <Zap className="h-5 w-5" />;
      default: return <Gamepad2 className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const completedGames = games.filter(g => g.isCompleted).length;
  const totalGames = games.length;

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Educational Games</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Learn through interactive games and challenges
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{completedGames}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalGames}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Games</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Levels' : difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredGames.map((game) => (
            <div key={game.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                <div className="text-center">
                  {getCategoryIcon(game.category)}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{game.category}</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {game.title}
                  </h3>
                  {game.isCompleted && (
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {game.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Target className="h-4 w-4" />
                      <span>{game.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>{game.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4" />
                      <span>{game.players} player{game.players > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{game.rating}</span>
                    </div>
                  </div>
                </div>

                {game.isCompleted && game.highScore && (
                  <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-700 dark:text-green-300">High Score:</span>
                      <span className="font-semibold text-green-800 dark:text-green-200">{game.highScore}</span>
                    </div>
                    {game.bestTime && (
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-green-700 dark:text-green-300">Best Time:</span>
                        <span className="font-semibold text-green-800 dark:text-green-200">{game.bestTime}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    <Play className="h-4 w-4" />
                    {game.isCompleted ? 'Play Again' : 'Start Game'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon State */}
        {filteredGames.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-12 max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gamepad2 className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Games Coming Soon! 🎮</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                We're working hard to bring you amazing educational games that will make learning to code fun and interactive!
              </p>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">What to expect:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center gap-3">
                    <Code className="h-5 w-5 text-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Programming Challenges</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-purple-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">AI & Machine Learning</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Cpu className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Robotics Simulations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Electronics Projects</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                Stay tuned for updates! We'll notify you when games are available.
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
