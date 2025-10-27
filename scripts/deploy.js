#!/usr/bin/env node

/**
 * Deployment script for PostKar AR Product Experience
 * Handles pre-deployment checks and optimizations
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkEnvironment() {
  log('🔍 Checking environment configuration...', 'blue');
  
  // Check if required environment files exist
  const envFiles = ['.env.production', '.env.example'];
  const missingFiles = envFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    log(`❌ Missing environment files: ${missingFiles.join(', ')}`, 'red');
    process.exit(1);
  }
  
  log('✅ Environment configuration looks good', 'green');
}

function runTests() {
  log('🧪 Running tests...', 'blue');
  
  try {
    execSync('npm run test:run', { stdio: 'inherit' });
    log('✅ All tests passed', 'green');
  } catch (error) {
    log('❌ Tests failed', 'red');
    process.exit(1);
  }
}

function runLinting() {
  log('🔍 Running linting...', 'blue');
  
  try {
    execSync('npm run lint', { stdio: 'inherit' });
    log('✅ Linting passed', 'green');
  } catch (error) {
    log('❌ Linting failed', 'red');
    process.exit(1);
  }
}

function buildProject() {
  log('🏗️  Building project...', 'blue');
  
  try {
    execSync('npm run build', { stdio: 'inherit' });
    log('✅ Build completed successfully', 'green');
  } catch (error) {
    log('❌ Build failed', 'red');
    process.exit(1);
  }
}

function analyzeBundleSize() {
  log('📊 Analyzing bundle size...', 'blue');
  
  const distPath = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distPath)) {
    log('❌ Dist folder not found', 'red');
    return;
  }
  
  // Get bundle sizes
  const jsFiles = fs.readdirSync(path.join(distPath, 'assets', 'js'))
    .filter(file => file.endsWith('.js'))
    .map(file => {
      const filePath = path.join(distPath, 'assets', 'js', file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: (stats.size / 1024).toFixed(2) + ' KB'
      };
    });
  
  const cssFiles = fs.readdirSync(path.join(distPath, 'assets', 'css'))
    .filter(file => file.endsWith('.css'))
    .map(file => {
      const filePath = path.join(distPath, 'assets', 'css', file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: (stats.size / 1024).toFixed(2) + ' KB'
      };
    });
  
  log('📦 Bundle Analysis:', 'cyan');
  log('JavaScript files:', 'yellow');
  jsFiles.forEach(file => log(`  ${file.name}: ${file.size}`, 'reset'));
  
  log('CSS files:', 'yellow');
  cssFiles.forEach(file => log(`  ${file.name}: ${file.size}`, 'reset'));
  
  // Check for large bundles
  const largeJsFiles = jsFiles.filter(file => parseFloat(file.size) > 100);
  if (largeJsFiles.length > 0) {
    log('⚠️  Large JavaScript bundles detected (>100KB):', 'yellow');
    largeJsFiles.forEach(file => log(`  ${file.name}: ${file.size}`, 'yellow'));
  }
}

function checkDeploymentReadiness() {
  log('🚀 Checking deployment readiness...', 'blue');
  
  // Check if dist folder exists and has content
  const distPath = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distPath)) {
    log('❌ Dist folder not found', 'red');
    process.exit(1);
  }
  
  const indexPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    log('❌ index.html not found in dist folder', 'red');
    process.exit(1);
  }
  
  // Check if deployment config files exist
  const deploymentConfigs = ['vercel.json', 'netlify.toml'];
  const existingConfigs = deploymentConfigs.filter(file => fs.existsSync(file));
  
  if (existingConfigs.length === 0) {
    log('⚠️  No deployment configuration files found', 'yellow');
  } else {
    log(`✅ Found deployment configs: ${existingConfigs.join(', ')}`, 'green');
  }
  
  log('✅ Project is ready for deployment', 'green');
}

function main() {
  const args = process.argv.slice(2);
  const skipTests = args.includes('--skip-tests');
  const skipLint = args.includes('--skip-lint');
  
  log('🚀 Starting deployment preparation...', 'magenta');
  
  try {
    checkEnvironment();
    
    if (!skipLint) {
      runLinting();
    }
    
    if (!skipTests) {
      runTests();
    }
    
    buildProject();
    analyzeBundleSize();
    checkDeploymentReadiness();
    
    log('🎉 Deployment preparation completed successfully!', 'green');
    log('📝 Next steps:', 'cyan');
    log('  • For Vercel: vercel --prod', 'reset');
    log('  • For Netlify: netlify deploy --prod --dir=dist', 'reset');
    log('  • Manual: Upload dist/ folder to your hosting provider', 'reset');
    
  } catch (error) {
    log(`❌ Deployment preparation failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run main function
main();