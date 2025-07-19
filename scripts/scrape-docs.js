#!/usr/bin/env node
/**
 * Documentation Scraper Script
 * 
 * This script runs the Factory docs scraper and other documentation scrapers.
 * It handles command-line arguments, error handling, and progress reporting.
 * 
 * Usage:
 *   node scripts/scrape-docs.js --source=factory
 *   node scripts/scrape-docs.js --source=all
 *   node scripts/scrape-docs.js --source=factory,github,vercel
 */

import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { program } from 'commander';
import ora from 'ora';
import chalk from 'chalk';

// Resolve dirname in ES-module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import scrapers
import { runFactoryScraper } from '../src/scrapers/factory-docs-scraper.js';

// Define available scrapers
const SCRAPERS = {
  factory: {
    name: 'Factory AI Documentation',
    run: runFactoryScraper,
    baseUrl: 'https://docs.factory.ai',
    outputDir: path.join(__dirname, '../data/factory-docs')
  },
  // Add more scrapers here as they're implemented
  github: {
    name: 'GitHub Documentation',
    // This will be implemented later
    run: async () => { 
      console.warn(chalk.yellow('GitHub scraper not yet implemented'));
      return null;
    },
    baseUrl: 'https://docs.github.com',
    outputDir: path.join(__dirname, '../data/github-docs')
  },
  vercel: {
    name: 'Vercel Documentation',
    // This will be implemented later
    run: async () => { 
      console.warn(chalk.yellow('Vercel scraper not yet implemented'));
      return null;
    },
    baseUrl: 'https://vercel.com/docs',
    outputDir: path.join(__dirname, '../data/vercel-docs')
  },
  resend: {
    name: 'Resend Documentation',
    // This will be implemented later
    run: async () => { 
      console.warn(chalk.yellow('Resend scraper not yet implemented'));
      return null;
    },
    baseUrl: 'https://resend.com/docs',
    outputDir: path.join(__dirname, '../data/resend-docs')
  }
};

// Setup command-line interface
program
  .version('1.0.0')
  .description('Documentation scraper for Factory AI and related tools')
  .option('-s, --source <sources>', 'Documentation sources to scrape (comma-separated: factory,github,vercel,resend,all)', 'factory')
  .option('-o, --output <dir>', 'Output directory for scraped data', path.join(__dirname, '../data'))
  .option('-m, --max-pages <number>', 'Maximum number of pages to scrape per source', '500')
  .option('-d, --delay <ms>', 'Delay between requests in milliseconds', '1000')
  .option('-v, --verbose', 'Enable verbose logging')
  .parse(process.argv);

const options = program.opts();

/**
 * Main function to run the scrapers
 */
async function main() {
  console.log(chalk.blue('=== Documentation Scraper ==='));
  console.log(chalk.gray(`Started at: ${new Date().toLocaleString()}`));
  
  // Determine which sources to scrape
  const sources = options.source.toLowerCase() === 'all'
    ? Object.keys(SCRAPERS)
    : options.source.split(',').map(s => s.trim().toLowerCase());
  
  console.log(chalk.blue(`Will scrape: ${sources.join(', ')}`));
  
  // Create the main output directory
  await fs.mkdir(options.output, { recursive: true });
  
  // Track overall stats
  const stats = {
    startTime: Date.now(),
    totalPages: 0,
    sources: {},
    errors: []
  };
  
  // Run each scraper
  for (const source of sources) {
    if (!SCRAPERS[source]) {
      console.warn(chalk.yellow(`Unknown source: ${source} - skipping`));
      continue;
    }
    
    const scraper = SCRAPERS[source];
    const spinner = ora(`Scraping ${scraper.name}...`).start();
    
    try {
      // Create source-specific stats
      stats.sources[source] = {
        name: scraper.name,
        startTime: Date.now(),
        pagesScraped: 0,
        status: 'running'
      };
      
      // Run the scraper with options
      const result = await scraper.run({
        outputDir: scraper.outputDir || path.join(options.output, source),
        maxPages: parseInt(options.maxPages, 10),
        rateLimit: parseInt(options.delay, 10),
        verbose: options.verbose
      });
      
      // Update stats
      if (result) {
        stats.sources[source].pagesScraped = result.metadata?.totalPages || 0;
        stats.sources[source].status = 'completed';
        stats.totalPages += stats.sources[source].pagesScraped;
        
        spinner.succeed(chalk.green(
          `Scraped ${scraper.name}: ${stats.sources[source].pagesScraped} pages`
        ));
      } else {
        stats.sources[source].status = 'skipped';
        spinner.info(chalk.blue(`Skipped ${scraper.name}`));
      }
    } catch (error) {
      // Handle errors
      stats.sources[source].status = 'error';
      stats.sources[source].error = error.message;
      stats.errors.push({
        source,
        message: error.message,
        stack: error.stack
      });
      
      spinner.fail(chalk.red(`Error scraping ${scraper.name}: ${error.message}`));
      
      if (options.verbose) {
        console.error(error);
      }
    } finally {
      stats.sources[source].endTime = Date.now();
      stats.sources[source].duration = 
        stats.sources[source].endTime - stats.sources[source].startTime;
    }
  }
  
  // Complete the overall stats
  stats.endTime = Date.now();
  stats.duration = stats.endTime - stats.startTime;
  
  // Save the scraping stats
  await fs.writeFile(
    path.join(options.output, 'scrape-stats.json'),
    JSON.stringify(stats, null, 2),
    'utf8'
  );
  
  // Print summary
  console.log('\n' + chalk.blue('=== Scraping Summary ==='));
  console.log(chalk.gray(`Completed at: ${new Date().toLocaleString()}`));
  console.log(chalk.gray(`Total duration: ${(stats.duration / 1000).toFixed(2)}s`));
  console.log(chalk.blue(`Total pages scraped: ${stats.totalPages}`));
  
  // Print errors if any
  if (stats.errors.length > 0) {
    console.log(chalk.red(`\nEncountered ${stats.errors.length} errors:`));
    stats.errors.forEach((err, i) => {
      console.log(chalk.red(`  ${i+1}. ${err.source}: ${err.message}`));
    });
    
    process.exit(1);
  }
  
  console.log(chalk.green('\nScraping completed successfully!'));
  console.log(chalk.gray(`Results saved to: ${options.output}`));
}

// Run the main function
main().catch(error => {
  console.error(chalk.red('Fatal error:'), error);
  process.exit(1);
});
