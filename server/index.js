/**
 * Factory Documentation Explorer API Server
 * 
 * This Express server provides API endpoints for the SmartDocSearch component,
 * including documentation stats, search functionality, and AI-powered responses.
 */

// Import dependencies
import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// For Claude and Gemini API clients
import fetch from 'node-fetch';

// Setup __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// Initialize Express app
const app = express();
// Default to 8080 to avoid common local port clashes
const PORT = process.env.PORT || 8080;

// Configure middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Paths to documentation data
const DATA_DIR = path.join(__dirname, '../data');
const FACTORY_DOCS_DIR = path.join(DATA_DIR, 'factory-docs');
const GITHUB_DOCS_DIR = path.join(DATA_DIR, 'github-docs');
const VERCEL_DOCS_DIR = path.join(DATA_DIR, 'vercel-docs');
const RESEND_DOCS_DIR = path.join(DATA_DIR, 'resend-docs');

// Cache for documentation data
const docsCache = {
  factory: null,
  github: null,
  vercel: null,
  resend: null,
  lastLoaded: {}
};

/**
 * Load documentation data from files
 */
async function loadDocumentation(source) {
  // Return from cache if loaded in the last hour
  const now = Date.now();
  if (docsCache[source] && docsCache.lastLoaded[source] && 
      (now - docsCache.lastLoaded[source] < 3600000)) {
    return docsCache[source];
  }
  
  try {
    let docsDir;
    switch (source) {
      case 'factory':
        docsDir = FACTORY_DOCS_DIR;
        break;
      case 'github':
        docsDir = GITHUB_DOCS_DIR;
        break;
      case 'vercel':
        docsDir = VERCEL_DOCS_DIR;
        break;
      case 'resend':
        docsDir = RESEND_DOCS_DIR;
        break;
      default:
        throw new Error(`Unknown documentation source: ${source}`);
    }
    
    // Check if directory exists
    try {
      await fs.access(docsDir);
    } catch (e) {
      console.log(`Documentation directory not found: ${docsDir}`);
      return null;
    }
    
    // Load the main JSON file
    const mainFile = path.join(docsDir, `${source}-docs.json`);
    const data = JSON.parse(await fs.readFile(mainFile, 'utf8'));
    
    // Update cache
    docsCache[source] = data;
    docsCache.lastLoaded[source] = now;
    
    return data;
  } catch (error) {
    console.error(`Error loading ${source} documentation:`, error);
    return null;
  }
}

/**
 * Search through documentation
 */
async function searchDocumentation(query, type = 'all', sources = ['factory']) {
  if (!query) return [];
  
  const results = [];
  const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 2);
  
  // Load documentation from each source
  for (const source of sources) {
    const docs = await loadDocumentation(source);
    if (!docs || !docs.pages) continue;
    
    // Search through pages
    for (const [url, page] of Object.entries(docs.pages)) {
      // Skip if page has no content
      if (!page.content) continue;
      
      // Filter by type if specified
      if (type !== 'all') {
        if (type === 'howto' && !isHowTo(page)) continue;
        if (type === 'api' && page.type !== 'api') continue;
        if (type === 'troubleshooting' && !isTroubleshooting(page)) continue;
        if (type === 'concept' && !isConcept(page)) continue;
      }
      
      // Calculate relevance score and find highlights
      const { score, highlights } = calculateRelevance(page, searchTerms);
      
      // Only include results with a minimum score
      if (score > 0.1) {
        results.push({
          page: {
            id: url,
            url,
            title: page.title,
            content: page.content,
            path: page.path,
            type: page.type,
            category: page.category,
            source,
            lastUpdated: page.lastUpdated
          },
          relevanceScore: score,
          highlights
        });
      }
    }
  }
  
  // Sort by relevance score
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  // Return top results
  return results.slice(0, 20);
}

/**
 * Calculate relevance score and extract highlights
 */
function calculateRelevance(page, searchTerms) {
  if (!searchTerms.length) return { score: 0, highlights: [] };
  
  const content = page.content.toLowerCase();
  const title = page.title.toLowerCase();
  
  let score = 0;
  const highlights = [];
  
  // Check for terms in title (higher weight)
  for (const term of searchTerms) {
    if (title.includes(term)) {
      score += 0.5;
    }
  }
  
  // Check for terms in content
  for (const term of searchTerms) {
    const termIndex = content.indexOf(term);
    if (termIndex !== -1) {
      score += 0.2;
      
      // Extract surrounding context for highlight
      const start = Math.max(0, termIndex - 50);
      const end = Math.min(content.length, termIndex + term.length + 50);
      const text = page.content.substring(start, end).trim();
      
      highlights.push({
        text,
        position: termIndex
      });
    }
  }
  
  // Boost score for exact phrase match
  const phrase = searchTerms.join(' ');
  if (content.includes(phrase)) {
    score += 0.3;
  }
  
  return { score, highlights };
}

/**
 * Determine if a page is a how-to guide
 */
function isHowTo(page) {
  if (page.type === 'guide' || page.type === 'tutorial') return true;
  
  const howToPatterns = [
    'how to', 'step by step', 'tutorial', 'guide', 'walkthrough',
    'getting started', 'quickstart', 'setup', 'install'
  ];
  
  for (const pattern of howToPatterns) {
    if (page.title.toLowerCase().includes(pattern) || 
        page.content.toLowerCase().includes(pattern)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Determine if a page is troubleshooting content
 */
function isTroubleshooting(page) {
  const troubleshootingPatterns = [
    'troubleshoot', 'debug', 'error', 'issue', 'problem', 'fix',
    'resolve', 'solution', 'trouble', 'fail', 'exception'
  ];
  
  for (const pattern of troubleshootingPatterns) {
    if (page.title.toLowerCase().includes(pattern) || 
        page.content.toLowerCase().includes(pattern)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Determine if a page is conceptual content
 */
function isConcept(page) {
  if (page.type === 'reference') return true;
  
  const conceptPatterns = [
    'concept', 'overview', 'introduction', 'understand', 'about',
    'what is', 'how does', 'explanation', 'architecture'
  ];
  
  for (const pattern of conceptPatterns) {
    if (page.title.toLowerCase().includes(pattern) || 
        page.content.toLowerCase().includes(pattern)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Generate AI response using Claude API
 */
async function generateClaudeResponse(query, pages, apiKey) {
  try {
    // Prepare context from pages
    const context = pages.map(page => {
      return `
Title: ${page.title}
URL: ${page.url}
Source: ${page.source}
Content:
${page.content.substring(0, 1500)}
---
`;
    }).join('\n');
    
    // Prepare the prompt
    const prompt = `
You are a helpful documentation assistant for Factory AI and related developer tools.
Answer the following question based on the documentation provided below.
If the answer cannot be found in the documentation, say so clearly.

Question: ${query}

Documentation:
${context}

Provide a clear, concise answer with code examples if relevant. 
If appropriate, suggest related queries the user might want to ask.
`;

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Claude API error: ${error.error?.message || response.statusText}`);
    }
    
    const result = await response.json();
    
    // Extract and format the response
    return {
      answer: result.content[0].text,
      sourcePages: pages.map(p => p.id),
      relatedQueries: extractRelatedQueries(result.content[0].text),
      codeSnippets: extractCodeSnippets(result.content[0].text)
    };
  } catch (error) {
    console.error('Error generating Claude response:', error);
    throw error;
  }
}

/**
 * Generate AI response using Gemini API
 */
async function generateGeminiResponse(query, pages, apiKey) {
  try {
    // Prepare context from pages
    const context = pages.map(page => {
      return `
Title: ${page.title}
URL: ${page.url}
Source: ${page.source}
Content:
${page.content.substring(0, 1500)}
---
`;
    }).join('\n');
    
    // Prepare the prompt
    const prompt = `
You are a helpful documentation assistant for Factory AI and related developer tools.
Answer the following question based on the documentation provided below.
If the answer cannot be found in the documentation, say so clearly.

Question: ${query}

Documentation:
${context}

Provide a clear, concise answer with code examples if relevant. 
If appropriate, suggest related queries the user might want to ask.
`;

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: prompt }] }
        ],
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.2
        }
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
    }
    
    const result = await response.json();
    
    // Extract and format the response
    const content = result.candidates[0].content.parts[0].text;
    
    return {
      answer: content,
      sourcePages: pages.map(p => p.id),
      relatedQueries: extractRelatedQueries(content),
      codeSnippets: extractCodeSnippets(content)
    };
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    throw error;
  }
}

/**
 * Extract related queries from AI response
 */
function extractRelatedQueries(text) {
  // Look for patterns like "Related queries:" or "You might also want to ask:"
  const relatedSections = [
    /related quer(?:y|ies):(.*?)(?:\n\n|$)/is,
    /you might also want to ask:(.*?)(?:\n\n|$)/is,
    /other questions you might have:(.*?)(?:\n\n|$)/is
  ];
  
  for (const pattern of relatedSections) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1]
        .split(/\n/)
        .map(line => line.replace(/^[•\-*]\s*/, '').trim())
        .filter(line => line.length > 0 && line.length < 100)
        .slice(0, 5);
    }
  }
  
  return [];
}

/**
 * Extract code snippets from AI response
 */
function extractCodeSnippets(text) {
  const codeBlocks = [];
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  
  let match;
  while ((match = codeBlockRegex.exec(text)) !== null) {
    const language = match[1].trim() || 'text';
    const code = match[2].trim();
    
    if (code) {
      codeBlocks.push({
        language,
        code,
        description: extractCodeDescription(text, match.index)
      });
    }
  }
  
  return codeBlocks;
}

/**
 * Extract description for a code snippet
 */
function extractCodeDescription(text, codePosition) {
  // Look for a description before the code block
  const beforeCode = text.substring(0, codePosition).trim();
  const lines = beforeCode.split('\n');
  
  // Get the last non-empty line before the code block
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (line && !line.startsWith('#') && !line.startsWith('//')) {
      return line;
    }
  }
  
  return '';
}

// API Routes

/**
 * GET /api/docs/stats
 * Returns statistics about available documentation
 */
app.get('/api/docs/stats', async (req, res) => {
  try {
    const stats = {
      sources: {}
    };
    
    // Get stats for each source
    for (const source of ['factory', 'github', 'vercel', 'resend']) {
      const docs = await loadDocumentation(source);
      
      if (docs) {
        stats.sources[source] = {
          name: docs.metadata?.source || source,
          pagesScraped: docs.metadata?.totalPages || Object.keys(docs.pages || {}).length,
          lastUpdated: docs.metadata?.scrapedAt || docsCache.lastLoaded[source]
        };
      } else {
        stats.sources[source] = {
          name: source,
          pagesScraped: 0,
          available: false
        };
      }
    }
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting documentation stats:', error);
    res.status(500).json({ error: 'Failed to get documentation stats' });
  }
});

/**
 * POST /api/docs/search
 * Searches through documentation
 */
app.post('/api/docs/search', async (req, res) => {
  try {
    const { query, type = 'all', sources = ['factory'] } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    const results = await searchDocumentation(query, type, sources);
    res.json(results);
  } catch (error) {
    console.error('Error searching documentation:', error);
    res.status(500).json({ error: 'Failed to search documentation' });
  }
});

/**
 * POST /api/docs/ai-answer
 * Generates AI response based on search results
 */
app.post('/api/docs/ai-answer', async (req, res) => {
  try {
    const { query, type = 'all', provider = 'claude', topResults = [] } = req.body;
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(401).json({ error: 'API key is required' });
    }
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    // If no specific results provided, do a search
    let pageIds = topResults;
    if (!pageIds.length) {
      const searchResults = await searchDocumentation(query, type, ['factory', 'github', 'vercel', 'resend']);
      pageIds = searchResults.slice(0, 3).map(r => r.page.id);
    }
    
    // Collect the pages
    const pages = [];
    for (const source of ['factory', 'github', 'vercel', 'resend']) {
      const docs = await loadDocumentation(source);
      if (!docs || !docs.pages) continue;
      
      for (const id of pageIds) {
        if (docs.pages[id]) {
          pages.push({
            id,
            title: docs.pages[id].title,
            url: id,
            content: docs.pages[id].content,
            source
          });
        }
      }
    }
    
    if (pages.length === 0) {
      return res.status(404).json({ error: 'No relevant documentation found' });
    }
    
    // Generate AI response
    let aiResponse;
    if (provider === 'claude') {
      aiResponse = await generateClaudeResponse(query, pages, apiKey);
    } else if (provider === 'gemini') {
      aiResponse = await generateGeminiResponse(query, pages, apiKey);
    } else {
      return res.status(400).json({ error: 'Invalid provider' });
    }
    
    res.json(aiResponse);
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ error: `Failed to generate AI response: ${error.message}` });
  }
});

// Serve the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Documentation Explorer API available at http://localhost:${PORT}/api/docs`);
});
