# Mystery Shopper - Visual Feedback Tool

A powerful web application that allows users to capture, annotate, and analyze screenshots of websites. Perfect for UI/UX designers, quality assurance teams, and developers to identify and communicate visual issues.

## 🌟 Features

- **Screenshot Upload**: Easily upload screenshots through drag-and-drop or file selection
- **Interactive Annotations**: Add, edit, and delete annotations directly on the screenshot
- **AI Analysis**: Automatically detect UI/UX issues using Google's Gemini AI
- **Annotation Types**: Categorize feedback as errors, warnings, or suggestions
- **Export Functionality**: Export annotated screenshots with professional formatting
- **Responsive Design**: Fully responsive interface with dark mode support

## 📋 Requirements

- Node.js 18.x or higher
- Google Gemini API key (for AI analysis features)

## 🚀 Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/akramj13/mystery-shopper.git
   cd mystery-shopper
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Google Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Production

Build the project:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## 🧩 Project Structure

- `src/app/`: Core application pages and API routes
  - `src/app/annotate/`: Screenshot annotation page
  - `src/app/api/analyze-screenshot/`: AI analysis API endpoint
  - `src/app/api/screenshot/`: Screenshot processing endpoint
  - `src/app/result/`: Results display page
- `components/`: Reusable UI components
  - `AnnotatedScreenshot.tsx`: Interactive screenshot annotation component
  - `AnnotationHelper.tsx`: Annotation templates and tools
  - `ExportAnnotated.tsx`: Screenshot export functionality

## 🛠️ How to Use

### Uploading Screenshots

1. Navigate to the home page
2. Either drag and drop an image file or click the "Select Image" button
3. Wait for the image to process and display

### Adding Annotations

1. Click anywhere on the uploaded screenshot to place an annotation marker
2. Add descriptive text in the annotation panel
3. Select a category (error, warning, or suggestion)
4. Use the pre-built templates for common issues if desired

### Using AI Analysis

1. After uploading a screenshot, click the "AI Analyze" button
2. The AI will automatically detect UI/UX issues and add annotations
3. Review and edit the AI-generated annotations as needed

### Exporting Results

1. After adding annotations, click the "Export" button
2. Choose your preferred export format
3. Save the annotated screenshot to your device

## 🌐 Deployment

### Vercel Deployment

This project is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Add the GEMINI_API_KEY environment variable in your Vercel project settings
3. Deploy

### Other Platforms

The application can be deployed on any platform that supports Next.js:

1. Build the project using `npm run build`
2. Deploy the `.next` directory according to your platform's instructions
3. Ensure environment variables are properly configured

## ⚠️ Troubleshooting

### Image Size Limits

- If you encounter a "413 Content Too Large" error, your image may be too large
- The application automatically compresses images, but very large files may still cause issues
- Try reducing the image size or quality before uploading

### API Key Issues

- If AI analysis is not working, verify that your GEMINI_API_KEY is correct
- Ensure the API key has access to the Gemini model used in the application

## 📄 License

MIT License - See LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

Project Link: [https://github.com/akramj13/mystery-shopper](https://github.com/akramj13/mystery-shopper)
