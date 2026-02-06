#!/usr/bin/env node

/**
 * Convert output.jsonl to output.md using markdown-parser
 */

const fs = require('fs');
const path = require('path');
const { convertToMarkdown } = require('./markdown-parser.js');

// File paths
const inputFile = path.join(__dirname, 'output.jsonl');
const outputFile = path.join(__dirname, 'output.md');

try {
  console.log('📖 Reading input file:', inputFile);
  const jsonlContent = fs.readFileSync(inputFile, 'utf-8');
  
  console.log('🔄 Converting JSONL to Markdown...');
  const markdown = convertToMarkdown(jsonlContent);
  
  console.log('💾 Writing output file:', outputFile);
  fs.writeFileSync(outputFile, markdown, 'utf-8');
  
  console.log('✅ Successfully converted to', outputFile);
  console.log(`📊 Output size: ${markdown.length} characters`);
} catch (err) {
  console.error('❌ Error:', err.message);
  process.exit(1);
}
