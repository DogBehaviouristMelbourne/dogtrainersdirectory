# Dog Trainers Directory

Premium directory for verified dog behaviourists in Melbourne, specializing in reactive and anxious dogs. Built with React, Firebase, Firestore, and Stripe for a fully automated experience.

## 🌟 Overview

Dog Trainers Directory is a mobile-first, SEO-optimized platform connecting Melbourne dog owners with specialized trainers. The site features premium listings, robust search capabilities, and seamless payment processing.

### 🎯 Target Audience
- **Dog Owners**: People seeking qualified help for dogs with behavioral issues
- **Dog Trainers**: Professionals seeking to reach dog owners in Melbourne

### 🔍 Key Features
- Mobile-responsive design with premium aesthetics
- Advanced search and filtering by suburb and specialty
- Trainer profiles with detailed information, ratings, and location maps
- Automated listing submission and approval system
- Premium subscription management with Stripe

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Stripe account
- Cloudflare Pages account (for hosting)

### Local Development
1. Clone the repository:
   ```
   git clone https://github.com/DogBehaviouristMelbourne/dogtrainersdirectory.git
   cd dogtrainersdirectory
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase and Stripe keys:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) to view the application in your browser.

## 📂 Project Structure

```
/
├── src/                      # Source code
│   ├── components/           # Reusable React components
│   │   ├── Layout.jsx        # Main layout wrapper
│   │   ├── MapLocation.jsx   # Google Maps component
│   │   ├── AboutPage.jsx     # About page component
│   │   └── AdminDashboard.jsx # Admin interface
│   ├── styles/               # CSS files
│   ├── App.jsx               # Main application component
│   ├── TrainerListingViewer.jsx # Directory listing page
│   ├── TrainerProfile.jsx    # Individual trainer profile
│   ├── SubmitTrainerForm.jsx # Trainer submission form
│   ├── firebase.js           # Firebase configuration
│   └── main.jsx              # Entry point
├── functions/                # Firebase Cloud Functions
│   ├── index.js              # Function implementations
│   └── package.json          # Functions dependencies
├── public/                   # Static assets
└── deploy.sh                 # Deployment script
```

## 💰 Monetization

The platform uses a freemium model:
- **Free Listings**: Basic trainer information
- **Premium Listings**: $20/month, includes enhanced profile, photos, priority placement
- **Sponsored Posts**: $50/post for featured content

All payments are processed through Stripe with automatic subscription management.

## 🔧 Stripe Integration

### Setting Up Stripe
1. Create products and price points in the Stripe dashboard
2. Configure the webhook endpoint in Stripe to point to your Firebase Function URL
3. Set up your Stripe API keys in Firebase environment:
   ```
   firebase functions:config:set stripe.secret_key="your-secret-key" stripe.webhook_secret="your-webhook-secret"
   ```

### Subscription Flow
1. Trainer chooses premium plan during submission
2. Stripe Checkout session created via Firebase Function
3. After successful payment, trainer gets premium status
4. Webhook handles subscription updates, cancellations, and failures

## 📱 Admin Dashboard

Access the admin dashboard at `/admin` to:
- Review and approve trainer submissions
- Manage existing trainers
- Toggle premium status

Admin login is required using Firebase Authentication.

## 🚀 Deployment

### Automatic Deployment (Recommended)
Use the provided deployment script:
```
chmod +x deploy.sh
./deploy.sh
```

### Manual Deployment

#### Cloudflare Pages (Frontend)
1. Push your code to GitHub
2. Connect your repository to Cloudflare Pages
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Environment variables: Add your Firebase config

#### Firebase Functions
1. Navigate to the functions directory:
   ```
   cd functions
   npm install
   ```
2. Deploy to Firebase:
   ```
   firebase deploy --only functions
   ```

## 🔒 Security & Privacy

- Firebase Security Rules restrict write access to trainers collection
- Submissions are stored separately and require admin approval
- Stripe API keys are stored securely in Firebase environment config
- No user data is shared with third parties

## 🔍 SEO Optimization

The application uses:
- JSON-LD structured data for trainer listings and profiles
- Optimized meta tags for search engines
- Mobile-first, performance-optimized design
- Semantic HTML structure

## 📧 Contact & Support

For technical support or questions about the implementation:
- Email: info@dogtrainersdirectory.com.au
- Domain: dogtrainersdirectory.com.au

---

Built with ❤️ for Melbourne's dog training community
