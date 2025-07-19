import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Book,
  Code,
  HelpCircle,
  AlertCircle,
  Sparkles,
  Key,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Loader2,
  X,
  Copy,
  Check,
  Bookmark,
  RefreshCw,
  Filter,
  FileText,
  Zap
} from 'lucide-react';

// Types for documentation and search
interface DocPage {
  id: string;
  url: string;
  title: string;
  content: string;
  path: string;
  type: 'guide' | 'api' | 'reference' | 'tutorial' | 'changelog' | 'onboarding' | 'general';
  category: string;
  source: 'factory' | 'github' | 'vercel' | 'resend' | string;
  lastUpdated?: string;
}

interface SearchResult {
  page: DocPage;
  relevanceScore: number;
  highlights: {
    text: string;
    position: number;
  }[];
  aiSummary?: string;
  relatedPages?: DocPage[];
}

interface AiResponse {
  answer: string;
  sourcePages: string[];
  relatedQueries?: string[];
  explanation?: string;
  codeSnippets?: {
    code: string;
    language: string;
    description?: string;
  }[];
}

type SearchType = 'all' | 'howto' | 'api' | 'troubleshooting' | 'concept';
type LlmProvider = 'claude' | 'gemini';

// Main SmartDocSearch component
const SmartDocSearch: React.FC = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [aiResponse, setAiResponse] = useState<AiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [llmProvider, setLlmProvider] = useState<LlmProvider>('claude');
  const [savedApiKey, setSavedApiKey] = useState('');
  const [copiedCode, setCopiedCode] = useState<number | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [availableDocs, setAvailableDocs] = useState<{
    factory: boolean;
    github: boolean;
    vercel: boolean;
    resend: boolean;
  }>({
    factory: true,
    github: false,
    vercel: false,
    resend: false
  });
  const [totalDocsCount, setTotalDocsCount] = useState<Record<string, number>>({
    factory: 0,
    github: 0,
    vercel: 0,
    resend: 0
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  // Load saved API key and recent searches from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('docSearchApiKey');
    const savedProvider = localStorage.getItem('docSearchLlmProvider');
    const savedSearches = localStorage.getItem('docSearchRecentSearches');
    
    if (savedKey) {
      setApiKey(savedKey);
      setSavedApiKey(savedKey);
    }
    
    if (savedProvider && (savedProvider === 'claude' || savedProvider === 'gemini')) {
      setLlmProvider(savedProvider);
    }
    
    if (savedSearches) {
      try {
        const searches = JSON.parse(savedSearches);
        if (Array.isArray(searches)) {
          setRecentSearches(searches.slice(0, 5));
        }
      } catch (e) {
        console.error('Failed to parse recent searches', e);
      }
    }
    
    // Check which documentation is available
    checkAvailableDocs();
  }, []);

  // Check which documentation sources are available
  const checkAvailableDocs = async () => {
    try {
      const response = await fetch('/api/docs/stats');
      if (response.ok) {
        const stats = await response.json();
        
        setAvailableDocs({
          factory: stats.sources.factory?.pagesScraped > 0 || false,
          github: stats.sources.github?.pagesScraped > 0 || false,
          vercel: stats.sources.vercel?.pagesScraped > 0 || false,
          resend: stats.sources.resend?.pagesScraped > 0 || false
        });
        
        setTotalDocsCount({
          factory: stats.sources.factory?.pagesScraped || 0,
          github: stats.sources.github?.pagesScraped || 0,
          vercel: stats.sources.vercel?.pagesScraped || 0,
          resend: stats.sources.resend?.pagesScraped || 0
        });
      }
    } catch (e) {
      console.error('Failed to check available docs', e);
    }
  };

  // Save API key to localStorage when it changes
  const saveApiKey = () => {
    if (apiKey) {
      localStorage.setItem('docSearchApiKey', apiKey);
      localStorage.setItem('docSearchLlmProvider', llmProvider);
      setSavedApiKey(apiKey);
      setShowSettings(false);
    }
  };

  // Clear API key
  const clearApiKey = () => {
    setApiKey('');
    setSavedApiKey('');
    localStorage.removeItem('docSearchApiKey');
  };

  // Handle search submission
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    // Add to recent searches
    const newRecentSearches = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 5);
    
    setRecentSearches(newRecentSearches);
    localStorage.setItem('docSearchRecentSearches', JSON.stringify(newRecentSearches));
    
    setIsLoading(true);
    setError(null);
    setSelectedResult(null);
    setAiResponse(null);
    
    try {
      // Call search API
      const response = await fetch('/api/docs/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: searchQuery,
          type: searchType,
          sources: Object.entries(availableDocs)
            .filter(([_, enabled]) => enabled)
            .map(([source]) => source)
        })
      });
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
      
      const results = await response.json();
      setSearchResults(results);
      
      // If we have results, automatically generate AI response
      if (results.length > 0 && savedApiKey) {
        generateAiResponse();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate AI response based on search results
  const generateAiResponse = async () => {
    if (!savedApiKey || searchResults.length === 0) return;
    
    setIsAiLoading(true);
    setAiError(null);
    
    try {
      // Call AI API
      const response = await fetch('/api/docs/ai-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': savedApiKey
        },
        body: JSON.stringify({
          query: searchQuery,
          type: searchType,
          provider: llmProvider,
          topResults: searchResults.slice(0, 3).map(r => r.page.id)
        })
      });
      
      if (!response.ok) {
        throw new Error(`AI processing failed: ${response.statusText}`);
      }
      
      const aiResult = await response.json();
      setAiResponse(aiResult);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'AI processing failed');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Handle selecting a search result
  const handleSelectResult = (result: SearchResult) => {
    setSelectedResult(result === selectedResult ? null : result);
    
    // Scroll to the selected result
    if (result !== selectedResult && searchResultsRef.current) {
      setTimeout(() => {
        searchResultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Copy code to clipboard
  const copyCodeToClipboard = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Format the date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Highlight search terms in text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const terms = query.trim().toLowerCase().split(/\s+/);
    let highlightedText = text;
    
    terms.forEach(term => {
      if (term.length < 3) return; // Skip short terms
      
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(
        regex,
        '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>'
      );
    });
    
    return highlightedText;
  };

  // Determine icon for doc type
  const getDocTypeIcon = (type: DocPage['type']) => {
    switch (type) {
      case 'api':
        return <Code className="h-4 w-4" />;
      case 'guide':
      case 'tutorial':
        return <Book className="h-4 w-4" />;
      case 'reference':
        return <FileText className="h-4 w-4" />;
      case 'changelog':
        return <RefreshCw className="h-4 w-4" />;
      case 'onboarding':
        return <Zap className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  // Get color for source
  const getSourceColor = (source: string) => {
    switch (source) {
      case 'factory':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'github':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'vercel':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'resend':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  // Render search type selector
  const renderSearchTypeSelector = () => (
    <div className="flex flex-wrap gap-2 mt-2">
      <button
        type="button"
        onClick={() => setSearchType('all')}
        className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${
          searchType === 'all'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        <Search className="h-3 w-3" />
        All
      </button>
      <button
        type="button"
        onClick={() => setSearchType('howto')}
        className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${
          searchType === 'howto'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        <Book className="h-3 w-3" />
        How-to
      </button>
      <button
        type="button"
        onClick={() => setSearchType('api')}
        className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${
          searchType === 'api'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        <Code className="h-3 w-3" />
        API
      </button>
      <button
        type="button"
        onClick={() => setSearchType('troubleshooting')}
        className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${
          searchType === 'troubleshooting'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        <AlertCircle className="h-3 w-3" />
        Troubleshooting
      </button>
      <button
        type="button"
        onClick={() => setSearchType('concept')}
        className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${
          searchType === 'concept'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        <HelpCircle className="h-3 w-3" />
        Concept
      </button>
    </div>
  );

  // Render source filters
  const renderSourceFilters = () => (
    <div className="flex flex-wrap gap-2 mt-4">
      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
        <Filter className="h-4 w-4" />
        Sources:
      </div>
      
      <button
        type="button"
        onClick={() => setAvailableDocs(prev => ({...prev, factory: !prev.factory}))}
        disabled={!totalDocsCount.factory}
        className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 ${
          !totalDocsCount.factory 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
            : availableDocs.factory
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        Factory AI {totalDocsCount.factory ? `(${totalDocsCount.factory})` : '(0)'}
      </button>
      
      <button
        type="button"
        onClick={() => setAvailableDocs(prev => ({...prev, github: !prev.github}))}
        disabled={!totalDocsCount.github}
        className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 ${
          !totalDocsCount.github 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
            : availableDocs.github
              ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        GitHub {totalDocsCount.github ? `(${totalDocsCount.github})` : '(0)'}
      </button>
      
      <button
        type="button"
        onClick={() => setAvailableDocs(prev => ({...prev, vercel: !prev.vercel}))}
        disabled={!totalDocsCount.vercel}
        className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 ${
          !totalDocsCount.vercel 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
            : availableDocs.vercel
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        Vercel {totalDocsCount.vercel ? `(${totalDocsCount.vercel})` : '(0)'}
      </button>
      
      <button
        type="button"
        onClick={() => setAvailableDocs(prev => ({...prev, resend: !prev.resend}))}
        disabled={!totalDocsCount.resend}
        className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 ${
          !totalDocsCount.resend 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
            : availableDocs.resend
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        Resend {totalDocsCount.resend ? `(${totalDocsCount.resend})` : '(0)'}
      </button>
    </div>
  );

  // Render API key settings
  const renderApiKeySettings = () => (
    <div className="mt-6 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Key className="h-5 w-5 text-blue-500" />
          AI Integration Settings
        </h3>
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {showSettings ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </div>
      
      {showSettings ? (
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="llm-provider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              AI Provider
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="llm-provider"
                  checked={llmProvider === 'claude'}
                  onChange={() => setLlmProvider('claude')}
                  className="h-4 w-4 text-blue-600"
                />
                <span>Claude (Anthropic)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="llm-provider"
                  checked={llmProvider === 'gemini'}
                  onChange={() => setLlmProvider('gemini')}
                  className="h-4 w-4 text-blue-600"
                />
                <span>Gemini (Google)</span>
              </label>
            </div>
          </div>
          
          <div>
            <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              API Key {llmProvider === 'claude' ? '(Anthropic)' : '(Google)'}
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                id="api-key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`Enter your ${llmProvider === 'claude' ? 'Anthropic' : 'Google'} API key`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700"
              />
              <button
                type="button"
                onClick={saveApiKey}
                disabled={!apiKey}
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your API key is stored locally in your browser and never sent to our servers.
            </p>
          </div>
          
          {savedApiKey && (
            <div className="flex justify-between items-center pt-2">
              <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                <Check className="h-4 w-4" />
                API key saved
              </div>
              <button
                type="button"
                onClick={clearApiKey}
                className="text-sm text-red-600 dark:text-red-400 hover:underline"
              >
                Clear API key
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {savedApiKey ? (
            <div className="flex items-center gap-1">
              <Check className="h-4 w-4 text-green-500" />
              {llmProvider === 'claude' ? 'Anthropic' : 'Google'} API key configured
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              AI features require an API key
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Render AI response section
  const renderAiResponse = () => {
    if (isAiLoading) {
      return (
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
          <p className="text-blue-700 dark:text-blue-300">
            Generating AI response...
          </p>
        </div>
      );
    }
    
    if (aiError) {
      return (
        <div className="mt-6 bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800 dark:text-red-300">
                Error generating AI response
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                {aiError}
              </p>
              <button
                type="button"
                onClick={generateAiResponse}
                className="mt-3 px-3 py-1.5 text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-800 flex items-center gap-1"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Try again
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    if (!aiResponse) return null;
    
    return (
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-2">
          <Sparkles className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-medium text-blue-800 dark:text-blue-300 flex items-center gap-2">
              AI Response
              <span className="text-xs bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                {llmProvider === 'claude' ? 'Claude' : 'Gemini'}
              </span>
            </h3>
            
            <div className="mt-3 prose prose-blue dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: aiResponse.answer }} />
            </div>
            
            {aiResponse.codeSnippets && aiResponse.codeSnippets.length > 0 && (
              <div className="mt-4 space-y-4">
                <h4 className="font-medium text-blue-800 dark:text-blue-300">
                  Code Examples
                </h4>
                
                {aiResponse.codeSnippets.map((snippet, index) => (
                  <div key={index} className="relative bg-gray-900 text-gray-100 rounded-md overflow-hidden">
                    {snippet.description && (
                      <div className="px-4 py-2 bg-gray-800 text-sm border-b border-gray-700">
                        {snippet.description}
                      </div>
                    )}
                    <div className="relative">
                      <pre className="p-4 overflow-x-auto text-sm">
                        <code>{snippet.code}</code>
                      </pre>
                      <button
                        type="button"
                        onClick={() => copyCodeToClipboard(snippet.code, index)}
                        className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200"
                        aria-label="Copy code"
                      >
                        {copiedCode === index ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <div className="px-4 py-2 bg-gray-800 text-xs text-gray-400 border-t border-gray-700">
                      {snippet.language}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {aiResponse.relatedQueries && aiResponse.relatedQueries.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 text-sm">
                  Related Queries
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {aiResponse.relatedQueries.map((query, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setSearchQuery(query);
                        handleSearch();
                      }}
                      className="px-3 py-1 text-xs bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-full text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {aiResponse.sourcePages && aiResponse.sourcePages.length > 0 && (
              <div className="mt-4 pt-3 border-t border-blue-200 dark:border-blue-800/50">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 text-xs flex items-center gap-1">
                  <Book className="h-3 w-3" />
                  Sources
                </h4>
                <ul className="mt-1 space-y-1 text-xs text-blue-700 dark:text-blue-400">
                  {aiResponse.sourcePages.map((source, index) => {
                    const page = searchResults.find(r => r.page.id === source)?.page;
                    return (
                      <li key={index}>
                        {page ? (
                          <a 
                            href={page.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:underline"
                          >
                            <span>{page.title}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span>{source}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render search results
  const renderSearchResults = () => {
    if (isLoading) {
      return (
        <div className="mt-8 flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
          <p className="text-gray-500 dark:text-gray-400">
            Searching documentation...
          </p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="mt-8 bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800 dark:text-red-300">
                Search error
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                {error}
              </p>
              <button
                type="button"
                onClick={handleSearch}
                className="mt-3 px-3 py-1.5 text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-800 flex items-center gap-1"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Try again
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    if (searchResults.length === 0 && searchQuery) {
      return (
        <div className="mt-8 bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 text-center">
          <HelpCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <h3 className="font-medium text-gray-700 dark:text-gray-300">
            No results found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search terms or filters
          </p>
          
          {!savedApiKey && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800 text-sm">
              <p className="text-blue-700 dark:text-blue-300 flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                Add an AI API key to get intelligent answers even when no exact matches are found
              </p>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="mt-8" ref={searchResultsRef}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">
            {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
          </h3>
          
          {!savedApiKey && searchResults.length > 0 && (
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Add AI for smart answers
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          {searchResults.map((result, index) => (
            <div 
              key={index}
              className={`border rounded-lg overflow-hidden ${
                selectedResult === result 
                  ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 bg-white dark:bg-gray-900'
              }`}
            >
              <div 
                className="p-4 cursor-pointer"
                onClick={() => handleSelectResult(result)}
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    {getDocTypeIcon(result.page.type)}
                    <span>{result.page.title}</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getSourceColor(result.page.source)}`}>
                      {result.page.source}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(result.page.lastUpdated)}
                    </span>
                    {selectedResult === result ? (
                      <ChevronDown className="h-4 w-4 text-blue-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
                
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <p className="line-clamp-2">
                    {result.page.path}
                  </p>
                </div>
                
                {result.highlights && result.highlights.length > 0 && (
                  <div className="mt-3 text-sm">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded p-2 border border-gray-100 dark:border-gray-700">
                      {result.highlights.slice(0, 1).map((highlight, i) => (
                        <p 
                          key={i} 
                          className="text-gray-700 dark:text-gray-300"
                          dangerouslySetInnerHTML={{ 
                            __html: `...${highlightText(highlight.text, searchQuery)}...` 
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {selectedResult === result && (
                <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="font-medium text-gray-900 dark:text-gray-100">
                      Content Preview
                    </h5>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => window.open(result.page.url, '_blank')}
                        className="text-sm flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Open original
                      </button>
                      <button
                        type="button"
                        className="text-sm flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <Bookmark className="h-3.5 w-3.5" />
                        Save
                      </button>
                    </div>
                  </div>
                  
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div dangerouslySetInnerHTML={{ 
                      __html: highlightText(
                        result.page.content.substring(0, 1000) + 
                        (result.page.content.length > 1000 ? '...' : ''),
                        searchQuery
                      )
                    }} />
                  </div>
                  
                  {result.relatedPages && result.relatedPages.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Related Pages
                      </h5>
                      <ul className="space-y-1">
                        {result.relatedPages.map((page, i) => (
                          <li key={i}>
                            <a 
                              href={page.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                            >
                              {getDocTypeIcon(page.type)}
                              <span>{page.title}</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render recent searches
  const renderRecentSearches = () => {
    if (recentSearches.length === 0) return null;
    
    return (
      <div className="mt-4">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
          <RefreshCw className="h-3.5 w-3.5" />
          Recent Searches:
        </div>
        <div className="flex flex-wrap gap-2">
          {recentSearches.map((query, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setSearchQuery(query);
                handleSearch();
              }}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-1"
            >
              <Search className="h-3 w-3" />
              {query}
            </button>
          ))}
          {recentSearches.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setRecentSearches([]);
                localStorage.removeItem('docSearchRecentSearches');
              }}
              className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Smart Documentation Search
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Search across Factory AI, GitHub, Vercel, and more with AI-powered insights
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documentation or ask a question..."
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-12 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <button
              type="submit"
              disabled={!searchQuery.trim()}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <div className={`rounded-full p-1 ${
                searchQuery.trim() 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800' 
                  : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed'
              }`}>
                <ChevronRight className="h-4 w-4" />
              </div>
            </button>
          </div>
          
          {renderSearchTypeSelector()}
          {renderRecentSearches()}
          {renderSourceFilters()}
        </form>
        
        {renderApiKeySettings()}
        {renderAiResponse()}
        {renderSearchResults()}
      </div>
    </div>
  );
};

export default SmartDocSearch;
