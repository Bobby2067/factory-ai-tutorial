/**
 * Factory AI Documentation Scraper
 * 
 * This module crawls the Factory AI documentation starting from the welcome page,
 * extracts content, and saves it in a structured format for the documentation aggregator.
 */

import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { URL, fileURLToPath } from 'url';

// __dirname replacement for ES-module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  startUrl: 'https://docs.factory.ai/welcome',
  baseUrl: 'https://docs.factory.ai',
  outputDir: path.join(__dirname, '../../data/factory-docs'),
  rateLimit: 1000, // Time between requests in ms
  maxPages: 500, // Safety limit to prevent infinite crawling
  userAgent: 'FactoryDocsAggregator/1.0 (Educational Project)',
  excludePatterns: [
    /\/api\//,       // Exclude API calls
    /\.(jpg|png|gif|svg|css|js)$/i, // Exclude assets
    /\?/            // Exclude query parameters
  ]
};

/**
 * Main scraper class for Factory AI documentation
 */
class FactoryDocsScraper {
  constructor(options = {}) {
    this.config = { ...config, ...options };
    this.visited = new Set();
    this.queue = [];
    this.results = {
      pages: {},
      navigation: {},
      metadata: {
        scrapedAt: new Date().toISOString(),
        totalPages: 0,
        source: 'Factory AI Documentation',
        baseUrl: this.config.baseUrl
      }
    };
  }

  /**
   * Initialize the scraper and output directories
   */
  async initialize() {
    try {
      await fs.mkdir(this.config.outputDir, { recursive: true });
      console.log(`Created output directory: ${this.config.outputDir}`);
    } catch (error) {
      console.error('Error initializing scraper:', error);
      throw error;
    }
  }

  /**
   * Start the scraping process
   */
  async start() {
    try {
      await this.initialize();
      console.log(`Starting scrape from ${this.config.startUrl}`);
      
      // Add the starting URL to the queue
      this.queue.push({
        url: this.config.startUrl,
        depth: 0,
        parent: null
      });
      
      let pageCount = 0;
      
      // Process the queue
      while (this.queue.length > 0 && pageCount < this.config.maxPages) {
        const current = this.queue.shift();
        
        // Skip if already visited
        if (this.visited.has(current.url)) {
          continue;
        }
        
        console.log(`Scraping (${pageCount + 1}/${this.config.maxPages}): ${current.url}`);
        
        // Process the current page
        const pageData = await this.scrapePage(current.url, current.depth, current.parent);
        if (pageData) {
          this.results.pages[this.normalizeUrl(current.url)] = pageData;
          pageCount++;
        }
        
        // Add to visited set
        this.visited.add(current.url);
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, this.config.rateLimit));
      }
      
      // Update metadata
      this.results.metadata.totalPages = pageCount;
      
      // Extract navigation structure from the collected pages
      this.extractNavigationStructure();
      
      // Save the results
      await this.saveResults();
      
      console.log(`Scraping completed. Processed ${pageCount} pages.`);
      return this.results;
    } catch (error) {
      console.error('Error during scraping:', error);
      throw error;
    }
  }

  /**
   * Scrape a single page
   */
  async scrapePage(url, depth, parent) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': this.config.userAgent
        }
      });
      
      if (!response.ok) {
        console.warn(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
        return null;
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Extract page data
      const pageData = {
        url,
        title: this.extractTitle($),
        content: this.extractContent($),
        headings: this.extractHeadings($),
        links: [],
        parent,
        depth,
        path: this.urlToPath(url),
        type: this.determinePageType(url, $),
        lastUpdated: this.extractLastUpdated($),
        category: this.extractCategory(url, $)
      };
      
      // Find and queue new links
      const links = this.extractLinks($, url);
      pageData.links = links.map(link => this.normalizeUrl(link));
      
      for (const link of links) {
        if (!this.shouldSkipUrl(link) && !this.visited.has(link)) {
          this.queue.push({
            url: link,
            depth: depth + 1,
            parent: url
          });
        }
      }
      
      return pageData;
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      return null;
    }
  }

  /**
   * Extract the page title
   */
  extractTitle($) {
    // Try different selectors for the title
    const title = $('h1').first().text().trim() || 
                 $('title').text().trim().replace(' | Factory Documentation', '') ||
                 'Untitled Page';
    return title;
  }

  /**
   * Extract the main content from the page
   */
  extractContent($) {
    // Remove navigation, header, footer and other non-content elements
    $('nav, header, footer, script, style, .sidebar, .navigation').remove();
    
    // Get the main content area
    const mainContent = $('main, article, .content, .documentation, .doc-content').html() || $('body').html();
    
    // Clean up the content
    return this.cleanContent(mainContent || '');
  }

  /**
   * Clean HTML content
   */
  cleanContent(content) {
    // Basic cleaning - more sophisticated cleaning could be implemented
    return content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .trim();
  }

  /**
   * Extract headings from the page to understand structure
   */
  extractHeadings($) {
    const headings = [];
    $('h1, h2, h3, h4, h5, h6').each((i, el) => {
      const $el = $(el);
      headings.push({
        level: parseInt(el.name.replace('h', '')),
        text: $el.text().trim(),
        id: $el.attr('id') || ''
      });
    });
    return headings;
  }

  /**
   * Extract all links from the page
   */
  extractLinks($, baseUrl) {
    const links = new Set();
    
    $('a[href]').each((i, el) => {
      const href = $(el).attr('href');
      if (!href) return;
      
      try {
        // Handle relative and absolute URLs
        const fullUrl = new URL(href, baseUrl).href;
        
        // Only include links to the same domain
        if (fullUrl.startsWith(this.config.baseUrl)) {
          links.add(fullUrl);
        }
      } catch (error) {
        // Invalid URL, skip
      }
    });
    
    return Array.from(links);
  }

  /**
   * Extract the last updated date if available
   */
  extractLastUpdated($) {
    // Look for common patterns for last updated info
    const lastUpdatedText = $('.last-updated, .updated-date, .modified-date, time').first().text().trim();
    
    if (lastUpdatedText) {
      // Try to parse the date
      try {
        const dateMatch = lastUpdatedText.match(/(\d{1,2}\/\d{1,2}\/\d{4})|(\w+ \d{1,2}, \d{4})/);
        if (dateMatch) {
          return new Date(dateMatch[0]).toISOString();
        }
      } catch (e) {
        // Date parsing failed
      }
      
      return lastUpdatedText;
    }
    
    return null;
  }

  /**
   * Determine the type of page (guide, api, reference, etc.)
   */
  determinePageType(url, $) {
    const path = this.urlToPath(url);
    
    if (path.includes('api')) return 'api';
    if (path.includes('guide') || path.includes('guides')) return 'guide';
    if (path.includes('reference')) return 'reference';
    if (path.includes('tutorial') || path.includes('tutorials')) return 'tutorial';
    if (path.includes('changelog')) return 'changelog';
    if (path.includes('onboarding')) return 'onboarding';
    
    // Check content for clues
    const content = $('body').text().toLowerCase();
    if (content.includes('api reference')) return 'api';
    if (content.includes('step by step') || content.includes('how to')) return 'tutorial';
    
    return 'general';
  }

  /**
   * Extract category information
   */
  extractCategory(url, $) {
    const path = this.urlToPath(url);
    const pathParts = path.split('/').filter(Boolean);
    
    if (pathParts.length > 0) {
      return pathParts[0];
    }
    
    // Try to find category in breadcrumbs
    const breadcrumb = $('.breadcrumb, .breadcrumbs, nav ol, nav ul').first().text();
    if (breadcrumb) {
      const parts = breadcrumb.split(/[>\\/]/).map(p => p.trim()).filter(Boolean);
      if (parts.length > 0) {
        return parts[0].toLowerCase();
      }
    }
    
    return 'general';
  }

  /**
   * Extract the navigation structure from the collected pages
   */
  extractNavigationStructure() {
    const navigation = {};
    
    // Group pages by category
    const pagesByCategory = {};
    for (const [url, page] of Object.entries(this.results.pages)) {
      const category = page.category;
      if (!pagesByCategory[category]) {
        pagesByCategory[category] = [];
      }
      pagesByCategory[category].push(page);
    }
    
    // Build navigation tree
    for (const [category, pages] of Object.entries(pagesByCategory)) {
      navigation[category] = {
        title: category.charAt(0).toUpperCase() + category.slice(1),
        items: []
      };
      
      // Sort pages by depth and path
      pages.sort((a, b) => {
        if (a.depth !== b.depth) return a.depth - b.depth;
        return a.path.localeCompare(b.path);
      });
      
      // Add pages to navigation
      for (const page of pages) {
        navigation[category].items.push({
          title: page.title,
          url: page.url,
          path: page.path,
          type: page.type,
          children: this.findChildPages(page.url)
        });
      }
    }
    
    this.results.navigation = navigation;
  }

  /**
   * Find child pages for a given URL
   */
  findChildPages(parentUrl) {
    const children = [];
    const normalizedParent = this.normalizeUrl(parentUrl);
    
    for (const [url, page] of Object.entries(this.results.pages)) {
      if (page.parent === normalizedParent) {
        children.push({
          title: page.title,
          url,
          path: page.path,
          type: page.type
        });
      }
    }
    
    return children;
  }

  /**
   * Save the scraped results to disk
   */
  async saveResults() {
    try {
      // Create the output directory if it doesn't exist
      await fs.mkdir(this.config.outputDir, { recursive: true });
      
      // Save the complete results
      await fs.writeFile(
        path.join(this.config.outputDir, 'factory-docs.json'),
        JSON.stringify(this.results, null, 2),
        'utf8'
      );
      
      // Save individual pages
      for (const [url, page] of Object.entries(this.results.pages)) {
        const pagePath = path.join(this.config.outputDir, 'pages', `${this.urlToFilename(url)}.json`);
        await fs.mkdir(path.dirname(pagePath), { recursive: true });
        await fs.writeFile(pagePath, JSON.stringify(page, null, 2), 'utf8');
      }
      
      // Save navigation structure
      await fs.writeFile(
        path.join(this.config.outputDir, 'navigation.json'),
        JSON.stringify(this.results.navigation, null, 2),
        'utf8'
      );
      
      console.log(`Results saved to ${this.config.outputDir}`);
    } catch (error) {
      console.error('Error saving results:', error);
      throw error;
    }
  }

  /**
   * Normalize a URL by removing trailing slashes, etc.
   */
  normalizeUrl(url) {
    try {
      const parsed = new URL(url);
      return parsed.origin + parsed.pathname.replace(/\/$/, '');
    } catch (e) {
      return url;
    }
  }

  /**
   * Convert a URL to a file path
   */
  urlToPath(url) {
    try {
      const parsed = new URL(url);
      return parsed.pathname;
    } catch (e) {
      return url;
    }
  }

  /**
   * Convert a URL to a safe filename
   */
  urlToFilename(url) {
    try {
      const parsed = new URL(url);
      let filename = parsed.pathname.replace(/^\//, '').replace(/\/$/, '');
      if (!filename) filename = 'index';
      return filename.replace(/\//g, '_');
    } catch (e) {
      return 'unknown';
    }
  }

  /**
   * Check if a URL should be skipped
   */
  shouldSkipUrl(url) {
    // Skip non-http URLs
    if (!url.startsWith('http')) return true;
    
    // Skip external domains
    if (!url.startsWith(this.config.baseUrl)) return true;
    
    // Skip already visited URLs
    if (this.visited.has(url)) return true;
    
    // Skip URLs matching exclude patterns
    for (const pattern of this.config.excludePatterns) {
      if (pattern.test(url)) return true;
    }
    
    return false;
  }
}

/**
 * Run the scraper
 */
async function runFactoryScraper(options = {}) {
  const scraper = new FactoryDocsScraper(options);
  return await scraper.start();
}

export {
  FactoryDocsScraper,
  runFactoryScraper,
  config
};
