import { BookOpen, Github, Code, Info } from 'lucide-react';
import SmartDocSearch from './components/SmartDocSearch';
import CommunityLogo from './components/CommunityLogo';
import './factory-colors.css'; // Keep the Factory AI colors

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-factory-purple/5">
      {/* Header */}
      <header className="border-b bg-gradient-to-r from-factory-purple to-factory-orange shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CommunityLogo size={36} />
            <div>
              <h1 className="text-2xl font-bold text-white">Factory AI Documentation Explorer</h1>
              <p className="text-sm text-white/80">Search across Factory, GitHub, Vercel, and more</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="https://app.factory.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/90 hover:text-white flex items-center gap-1 text-sm"
            >
              <BookOpen className="h-4 w-4" />
              <span>Factory AI</span>
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/90 hover:text-white flex items-center gap-1 text-sm"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
            <a 
              href="https://vercel.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/90 hover:text-white flex items-center gap-1 text-sm"
            >
              <Code className="h-4 w-4" />
              <span>Vercel</span>
            </a>
          </div>
        </div>
      </header>
      
      {/* Disclaimer Banner */}
      <div className="bg-amber-100 border-b border-amber-300">
        <div className="container mx-auto px-4 py-2">
          <p className="text-amber-800 text-sm flex items-center justify-center">
            <Info className="h-4 w-4 mr-2" />
            This is a community-created tool and is NOT affiliated with or endorsed by Factory AI.
            <a href="https://app.factory.ai" target="_blank" rel="noopener noreferrer" className="underline ml-1 font-medium">
              Visit Factory AI
            </a>
          </p>
        </div>
      </div>

      {/* Main Content - SmartDocSearch Component */}
      <main className="container mx-auto px-4 py-8">
        <SmartDocSearch />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              Factory AI Documentation Explorer - A community project
            </p>
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <span className="text-xs text-gray-500">
                Powered by:
              </span>
              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">Factory AI Docs</span>
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">GitHub</span>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Vercel</span>
            </div>
          </div>
          <p className="text-xs text-center text-gray-500 mt-2">
            Disclaimer: This tool is not affiliated with, endorsed by, or officially connected to Factory AI.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
