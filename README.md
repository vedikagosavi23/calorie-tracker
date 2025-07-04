# 🍎 Calorie Counter App

A modern React-based web application that uses **Google Gemini AI** to analyze food images and estimate calorie content. The app captures photos of meals and provides nutritional information using advanced AI image recognition.

## ✨ Features

- 📸 **Camera Integration**: Take photos directly from your device
- 🤖 **AI Food Recognition**: Powered by Google Gemini AI for accurate food identification
- 📊 **Calorie Estimation**: Get detailed calorie information for recognized foods
- 📱 **Responsive Design**: Works on both desktop and mobile devices
- 🎨 **Modern UI**: Built with Chakra UI for a beautiful user experience
- 🔍 **Smart Detection**: Automatically detects when no food is present in images
- 📈 **Confidence Scoring**: Shows AI confidence levels for each food item

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Chakra UI** - Component library for modern design
- **React Router** - Navigation between pages
- **React Webcam** - Camera functionality
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **Google Gemini AI** - Advanced image analysis and food recognition

### AI Integration
- **Google Gemini 1.5 Flash** - State-of-the-art AI model for image analysis
- **Structured JSON Response** - Parsed food data with calories and confidence scores

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Cloud account with Gemini API access

### 1. Clone the Repository
```bash
git clone <repository-url>
cd CalorieCounter
```

### 2. Install Dependencies

**Install server dependencies:**
```bash
npm install
```

**Install client dependencies:**
```bash
cd client
npm install
cd ..
```

### 3. Set Up Google Gemini API

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Gemini API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Gemini API" and enable it

3. **Get API Key**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

### 4. Set Up Environment Variables

Create a `.env` file in the root directory:
```bash
cp env.example .env
```

Edit the `.env` file and add your Gemini API key:

```env
# Google Gemini API Key
# Get this from: https://console.cloud.google.com/apis/credentials
GEMINI_API_KEY=your_gemini_api_key_here

# Server Port (optional)
PORT=5000
```

### 5. Run the Application

**Option 1: Run server and client separately**

Start the server:
```bash
npm start
```

In a new terminal, start the client:
```bash
npm run client
```

**Option 2: Run both together (development)**
```bash
npm run dev:full
```

**Option 3: Use the batch file (Windows)**
```bash
start.bat
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📁 Project Structure

```
CalorieCounter/
├── client/                 # React frontend
│   ├── public/            # Static files
│   │   ├── pages/         # React components
│   │   │   ├── Home.js    # Landing page
│   │   │   ├── Camera.js  # Camera interface
│   │   │   └── Results.js # Results display with modern UI
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json
├── server.js              # Express server with Gemini integration
├── package.json           # Server dependencies
├── .env                   # Environment variables (not in git)
├── env.example            # Environment variables template
├── start.bat              # Windows batch file for easy startup
└── README.md
```

## 🔧 Available Scripts

### Server Scripts
- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm run client` - Start the React development server
- `npm run dev:full` - Start both server and client in development mode

### Client Scripts
- `npm start` - Start the React development server
- `npm run build` - Build the app for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🌐 API Endpoints

### POST `/analyze-image`
Analyzes a food image using Gemini AI and returns structured food data.

**Request Body:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
}
```

**Response:**
```json
{
  "gemini": {
    "candidates": [
      {
        "content": {
          "parts": [
            {
              "text": "[{\"food\": \"apple\", \"estimated_calories\": 95, \"confidence\": 0.85}]"
            }
          ]
        }
      }
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### GET `/health`
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "message": "Calorie Counter API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🎯 How It Works

1. **Image Capture**: User takes a photo using the camera interface
2. **AI Analysis**: Image is sent to Google Gemini AI for analysis
3. **Food Recognition**: Gemini identifies food items and estimates calories
4. **Structured Response**: AI returns JSON with food names, calories, and confidence
5. **Smart Display**: Frontend parses the response and displays results in a beautiful UI
6. **No-Food Detection**: Automatically detects when no food is present and shows helpful message

## ⚠️ Troubleshooting

### API returns index.html instead of JSON
If you call `/api/analyze-image` and get the React app's HTML instead of a JSON response, make sure your API route is defined **before** the static and catch-all routes in `server.js`:

```js
// Correct order in server.js
app.post('/api/analyze-image', ...); // API route first
app.use(express.static(path.join(__dirname, 'client/build')));
app.post('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});
```

### Logging and Debugging
- The backend logs each step of the API request to the terminal. If you don't see logs, ensure your server is running and the API route is not being intercepted by the catch-all.
- Use browser DevTools (Console and Network tabs) to verify requests and responses.
- Use Postman or curl to test the API directly.

### Common Issues
- **No logs in terminal:** The server may not be running, or the API route is not being hit (see route order above).
- **CORS errors:** Ensure the server uses `cors()` middleware.
- **Missing manifest.json:** Ensure `client/public/manifest.json` exists for React build.

## 🔒 Security Notes

- **API Keys**: Never commit your `.env` file to version control
- **Image Data**: Images are processed by Google's secure Gemini API
- **No Local Storage**: No sensitive data is stored locally

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

## 🚀 Deployment

### Deploying to Vercel

This project is ready for seamless deployment on [Vercel](https://vercel.com/). The included `vercel.json` ensures that both the backend API and the React frontend are served correctly.

#### 1. **Push to GitHub**
- Make sure your code is committed and pushed to a GitHub repository.

#### 2. **Import to Vercel**
- Go to [Vercel](https://vercel.com/import/git) and import your repository.
- Set the following environment variable in the Vercel dashboard:
  - `GEMINI_API_KEY` (your Google Gemini API key)
- No build command is needed; Vercel will detect the configuration automatically.

#### 3. **How it Works**
- The `vercel.json` routes all `/api/*` requests to your Express server (`server.js`).
- All other requests are served from the React build output (`client/build`).
- This allows your app to work as a full-stack serverless deployment with a single codebase.

#### 4. **Production Build Locally**
If you want to test the production build locally:
```bash
cd client
npm run build
cd ..
npm start
```
- Visit [http://localhost:5000](http://localhost:5000) to see the production build served by Express.

### Local Development vs. Production
- **Development:** Use `npm run dev:full` to run both backend and frontend with hot reload.
- **Production:** Use `npm start` after building the client to serve everything from Express.
- **Vercel:** Just push to GitHub and deploy—no code changes needed.

### Environment Variables
- **Local:** Set variables in your `.env` file (never commit real secrets).
- **Vercel:** Set variables in the Vercel dashboard under Project Settings > Environment Variables.

### vercel.json Explained
```json
{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/server.js" },
    { "src": "/(.*)", "dest": "/client/build/$1" }
  ]
}
```
- This config ensures API and frontend routes are handled correctly on Vercel.

---

You can now run your app locally or deploy to Vercel with no code changes. For any issues, see the Troubleshooting section above or open an issue on GitHub.
