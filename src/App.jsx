import "./App.css";
import TryExtract from "./component/TryExtract";
import { useState } from 'react';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Navbar */}
      <nav className={`px-6 py-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              SkimmifyAI
            </h1>
            <div className="hidden md:flex space-x-6">
              <a href="#features" className="hover:text-blue-500 transition-colors">Features</a>
              <a href="#about" className="hover:text-blue-500 transition-colors">About</a>
              <a href="#contact" className="hover:text-blue-500 transition-colors">Contact</a>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
          >
            {darkMode ? '🌞' : '🌙'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Summarize any webpage article instantly, with high accuracy.
          </h1>
          <p className="text-xl bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent max-w-2xl mx-auto">
            Extract, analyze, and summarize content from any webpage instantly using our advanced AI technology.
          </p>
        </div>

        {/* Main Content */}
        <div className=" dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <TryExtract />
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-600 dark:text-gray-400">
          <p>© 2024 SkimmifyAI. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );

}

export default App;

