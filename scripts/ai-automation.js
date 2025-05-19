/**
 * Dog Trainers Directory - AI Automation Utility
 * 
 * This script provides practical AI automation for common tasks:
 * 1. Generate SEO-optimized trainer descriptions
 * 2. Create social media posts from trainer data
 * 3. Generate SEO meta tags
 * 
 * Usage:
 * - npm install axios dotenv openai sharp
 * - Create .env file with your OpenAI API key
 * - node ai-automation.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { OpenAI } = require('openai');
const sharp = require('sharp');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here'
});

/**
 * Generate SEO-optimized trainer descriptions
 */
async function generateTrainerDescription(trainerData) {
  try {
    const prompt = `
Create a professional, SEO-optimized 150-word description for a dog trainer with the following details:

Name: ${trainerData.name}
Location: ${trainerData.suburb}, Melbourne
Experience: ${trainerData.experience} years
Specialties: ${trainerData.specialties.join(', ')}
Qualifications: ${trainerData.qualifications || 'Professional dog trainer'}

The description should:
1. Emphasize their expertise with reactive and anxious dogs
2. Mention their location in Melbourne
3. Highlight their unique approach to training
4. Include keywords like "dog trainer Melbourne", "reactive dog specialist", and "${trainerData.suburb} dog training"
5. Use a professional, trustworthy tone

Format as a single paragraph without bullet points.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', role: 'You are a professional copywriter specializing in pet services.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating trainer description:', error);
    return null;
  }
}

/**
 * Generate social media posts for trainers
 */
async function generateSocialMediaPosts(trainerData) {
  try {
    const prompt = `
Create 3 different social media posts to promote this dog trainer on Instagram:

Name: ${trainerData.name}
Location: ${trainerData.suburb}, Melbourne
Specialties: ${trainerData.specialties.join(', ')}

Each post should:
1. Be 50-80 words
2. Include 4-5 relevant hashtags
3. Have a clear call to action
4. Highlight different aspects of their services
5. Focus on solutions for reactive and anxious dogs

Format as Post 1, Post 2, Post 3 with hashtags at the end of each post.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', role: 'You are a social media manager for pet professionals.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 350
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating social media posts:', error);
    return null;
  }
}

/**
 * Generate SEO meta tags for trainer profiles
 */
async function generateSeoMetaTags(trainerData) {
  try {
    const prompt = `
Create SEO meta tags for this dog trainer's profile page:

Name: ${trainerData.name}
Location: ${trainerData.suburb}, Melbourne
Specialties: ${trainerData.specialties.join(', ')}

Generate:
1. A page title (60 chars max)
2. Meta description (150 chars max)
3. 5 relevant keywords
4. Open Graph title (60 chars max)
5. Open Graph description (90 chars max)

Format as:
PAGE_TITLE: [title]
META_DESCRIPTION: [description]
KEYWORDS: [keywords]
OG_TITLE: [title]
OG_DESCRIPTION: [description]
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', role: 'You are an SEO specialist for local businesses.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating SEO meta tags:', error);
    return null;
  }
}

/**
 * Optimize images for web
 */
async function optimizeImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize(800, 600, { 
        fit: 'cover',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toFile(outputPath);
    
    console.log(`Image optimized: ${outputPath}`);
    return true;
  } catch (error) {
    console.error('Error optimizing image:', error);
    return false;
  }
}

/**
 * Process trainer data file and generate content
 */
/**
 * Process trainer data from JSON file
 */
async function processTrainerData() {
  // Load trainer data from file
  let trainers = [];
  try {
    const data = fs.readFileSync(path.join(__dirname, 'sample-trainer-data.json'), 'utf8');
    trainers = JSON.parse(data);
  } catch (error) {
    console.error('Error loading trainer data:', error);
    return;
  }

  // Create output directory if it doesn't exist
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Process each trainer
  console.log(`Found ${trainers.length} trainers to process`);
  
  for (let i = 0; i < trainers.length; i++) {
    const trainer = trainers[i];
    console.log(`\n[${i+1}/${trainers.length}] Processing trainer: ${trainer.name}`);
    
    // Create trainer directory
    const trainerDir = path.join(outputDir, trainer.name.replace(/\s/g, '_'));
    if (!fs.existsSync(trainerDir)) {
      fs.mkdirSync(trainerDir, { recursive: true });
    }
    
    // Generate trainer description
    const description = await generateTrainerDescription(trainer);
    if (description) {
      console.log("✅ Generated SEO description");
      fs.writeFileSync(
        path.join(trainerDir, 'description.txt'),
        description
      );
    }

    // Generate social media posts
    const socialPosts = await generateSocialMediaPosts(trainer);
    if (socialPosts) {
      console.log("✅ Generated social media posts");
      fs.writeFileSync(
        path.join(trainerDir, 'social_posts.txt'),
        socialPosts
      );
    }

    // Generate SEO meta tags
    const seoTags = await generateSeoMetaTags(trainer);
    if (seoTags) {
      console.log("✅ Generated SEO meta tags");
      fs.writeFileSync(
        path.join(trainerDir, 'meta_tags.txt'),
        seoTags
      );
    }
  }

  console.log("\n✨ All processing complete! Files saved to 'scripts/output/' directory");
}

/**
 * Main execution
 */
async function main() {
  console.log("Dog Trainers Directory - AI Automation Utility");
  console.log("============================================");
  
  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-api-key-here') {
    console.log("\n⚠️  WARNING: OpenAI API key not configured!");
    console.log("Please set your OpenAI API key in a .env file");
    console.log("See .env.example for reference\n");
  }
  
  // Process trainer data
  await processTrainerData();
}

// Execute if run directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  generateTrainerDescription,
  generateSocialMediaPosts,
  generateSeoMetaTags,
  optimizeImage,
  processTrainerData
};