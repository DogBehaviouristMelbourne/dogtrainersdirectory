# AI Automation Tools for Dog Trainers Directory

This folder contains AI-powered automation tools to help you manage your Dog Trainers Directory with minimal technical effort. These scripts use artificial intelligence to generate high-quality content, optimize images, and perform other tasks that would normally require significant time and expertise.

## 📋 What's Included

- **Content Generation**: Automatically create SEO-optimized descriptions for trainers
- **Social Media**: Generate ready-to-post social content for each trainer
- **SEO Optimization**: Create meta tags, descriptions, and other SEO elements
- **Image Processing**: Optimize images for web use

## 🚀 Quick Start

Follow these simple steps to use the AI automation tools:

### 1. Setup (One-Time)

1. Install [Node.js](https://nodejs.org/) (LTS version recommended)
2. Open a terminal/command prompt
3. Navigate to this folder:
   ```
   cd scripts
   ```
4. Install required packages:
   ```
   npm install
   ```
5. Copy the `.env.example` file to `.env`:
   ```
   // Windows:
   copy .env.example .env
   
   // Mac/Linux:
   cp .env.example .env
   ```
6. Edit the `.env` file and add your OpenAI API key (get one from [OpenAI Platform](https://platform.openai.com/api-keys))

### 2. Running the Tools

To generate all content types for all trainers:

```
npm run generate-all
```

To generate specific content types:

```
npm run generate-descriptions  // Only trainer descriptions
npm run generate-social        // Only social media posts
npm run generate-seo           // Only SEO meta tags
```

### 3. Where to Find the Results

After running the tools, you'll find all generated content in the `scripts/output` folder, organized by trainer name:

```
output/
├── Sarah_Thompson/
│   ├── description.txt     // SEO-optimized trainer description
│   ├── social_posts.txt    // Social media post ideas
│   └── meta_tags.txt       // HTML meta tags for SEO
├── Michael_Rodriguez/
│   └── ...
```

## 📝 Customizing the Data

You can edit `sample-trainer-data.json` to:
- Add new trainers
- Update trainer information
- Modify specialties and other details

The format for each trainer entry is:

```json
{
  "name": "Trainer Name",
  "suburb": "Richmond",
  "experience": 8,
  "specialties": ["Specialty 1", "Specialty 2"],
  "qualifications": "Relevant qualifications"
}
```

## 💡 Tips for Best Results

1. **Be specific with specialties**: The more detailed the specialties, the better the AI can generate targeted content
2. **Review and edit**: While the AI produces high-quality content, always review and add your personal touch
3. **Consistent data**: Keep the format consistent across all trainers for best results
4. **Rotate content**: Generate new social media content monthly to keep your feeds fresh

## ⚙️ Advanced Configuration

For advanced users who want to customize the AI behavior:

- Edit values in the `.env` file:
  - `AI_MODEL`: Change to different OpenAI models (e.g., "gpt-4o", "gpt-3.5-turbo")
  - `TEMPERATURE`: Control creativity (0.0-1.0, higher = more creative)
  - `IMAGE_WIDTH`, `IMAGE_HEIGHT`: Change default image dimensions
  - `IMAGE_QUALITY`: Adjust image quality (1-100)

## 🔍 Troubleshooting

**"API key not configured" error**
- Ensure you've created the `.env` file with your OpenAI API key
- Check that there are no spaces around the API key

**"Error loading trainer data"**
- Verify that `sample-trainer-data.json` exists and contains valid JSON
- Check for missing commas or brackets in the JSON file

**Slow response times**
- This is normal for AI-generated content, especially with GPT-4
- For faster responses, switch to "gpt-3.5-turbo" in your `.env` file

## 📚 Learning More

To learn more about AI automation options for your directory, check:
- [AI Automation Guide](../docs/ai-automation-guide.md): Comprehensive guide to AI tools for your project
- [OpenAI Documentation](https://platform.openai.com/docs): Learn about the AI models powering these tools
- [Zapier Integration](https://zapier.com/apps/openai): Connect these tools to your workflow automation

## 📅 Regular Maintenance Tasks

For best results, set a schedule for these AI-powered tasks:

- **Weekly**: Generate new social media content for 2-3 featured trainers
- **Monthly**: Update trainer descriptions with fresh content and new keywords
- **Quarterly**: Regenerate all SEO meta tags to stay current with trends

---

Need help? Check our [AI Automation Guide](../docs/ai-automation-guide.md) for additional tools and workflows to save you time and effort.