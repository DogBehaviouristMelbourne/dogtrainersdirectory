#!/bin/bash

# Dog Trainers Directory Deployment Script
# This script automates the deployment process for both Firebase and Cloudflare Pages

echo "🐾 Dog Trainers Directory Deployment Script 🐾"
echo "---------------------------------------------"

# Check if required tools are installed
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed. Aborting."; exit 1; }
command -v firebase >/dev/null 2>&1 || { echo "❌ Firebase CLI is required but not installed. Please run 'npm install -g firebase-tools' and try again."; exit 1; }

# Ask what to deploy
echo "What would you like to deploy?"
echo "1) Everything (Frontend + Functions)"
echo "2) Frontend only (Cloudflare Pages)"
echo "3) Functions only (Firebase Functions)"
read -p "Enter your choice (1-3): " choice

# Build the frontend (React app)
build_frontend() {
  echo "📦 Building frontend..."
  npm install
  npm run build
  echo "✅ Frontend build complete!"
}

# Deploy to Cloudflare Pages
deploy_frontend() {
  echo "🚀 Deploying to Cloudflare Pages..."
  
  # Since Cloudflare Pages is linked to GitHub, we just need to commit and push
  echo "ℹ️ Cloudflare Pages is linked to your GitHub repository."
  echo "To deploy, commit your changes and push to GitHub."
  
  read -p "Would you like to commit and push your changes now? (y/n): " push_choice
  
  if [ "$push_choice" = "y" ] || [ "$push_choice" = "Y" ]; then
    git add .
    read -p "Enter a commit message: " commit_message
    git commit -m "$commit_message"
    git push
    echo "✅ Changes pushed to GitHub. Cloudflare Pages will automatically deploy your site."
  else
    echo "ℹ️ When you're ready, run 'git add .', 'git commit -m \"Your message\"', and 'git push' to deploy."
  fi
}

# Deploy Firebase Functions
deploy_functions() {
  echo "🔥 Deploying Firebase Functions..."
  
  # Navigate to the functions directory
  cd functions
  
  # Install dependencies
  echo "📦 Installing functions dependencies..."
  npm install
  
  # Navigate back to root
  cd ..
  
  # Deploy to Firebase
  echo "🚀 Deploying functions to Firebase..."
  firebase deploy --only functions
  
  echo "✅ Firebase Functions deployment complete!"
}

# Configure Stripe keys for Firebase Functions
configure_stripe() {
  echo "💳 Configuring Stripe API keys..."
  echo "⚠️ Warning: Stripe API keys are sensitive information!"
  
  read -p "Do you want to configure Stripe API keys now? (y/n): " stripe_choice
  
  if [ "$stripe_choice" = "y" ] || [ "$stripe_choice" = "Y" ]; then
    read -p "Enter your Stripe Secret Key: " stripe_secret
    read -p "Enter your Stripe Webhook Secret: " webhook_secret
    
    firebase functions:config:set stripe.secret_key="$stripe_secret" stripe.webhook_secret="$webhook_secret"
    echo "✅ Stripe API keys configured successfully!"
  else
    echo "ℹ️ Skipping Stripe configuration. Remember to configure it later with:"
    echo "firebase functions:config:set stripe.secret_key=\"YOUR_SECRET_KEY\" stripe.webhook_secret=\"YOUR_WEBHOOK_SECRET\""
  fi
}

# Execute the deployment based on choice
case $choice in
  1)
    build_frontend
    deploy_frontend
    deploy_functions
    configure_stripe
    ;;
  2)
    build_frontend
    deploy_frontend
    ;;
  3)
    deploy_functions
    configure_stripe
    ;;
  *)
    echo "❌ Invalid choice. Please run the script again and select 1, 2, or 3."
    exit 1
    ;;
esac

echo "---------------------------------------------"
echo "🎉 Deployment process completed! 🎉"
echo "Dog Trainers Directory is now live at: https://dogtrainersdirectory.com.au"