# Project Red Queen: AI-Powered Chat Application

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/eddietal2/Project_Red_Queen/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/python-3.12+-blue.svg)](https://www.python.org/)
[![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)](https://nodejs.org/)

**Project Red Queen** is a sophisticated full-stack AI chat application that brings intelligent, context-aware conversations to users through a modern web interface. Named after the relentless character from Lewis Carroll's *Through the Looking-Glass*, the app embodies continuous adaptation and evolution in AI interactions.

## 🏗️ Architecture Overview

### Backend (Django)
- **Framework**: Django 5.2+ with Django REST Framework
- **AI Integration**: Google Gemini for natural language processing and multimodal AI responses
- **Vector Database**: ChromaDB for persistent conversation memory and context retrieval
- **Document Processing**: LlamaIndex for intelligent document ingestion and querying
- **Audio Capabilities**: Text-to-speech synthesis using Edge TTS and audio analysis with Librosa
- **Deployment**: Railway with Nixpacks, supporting Python 3.12 and uv package management

### Frontend (Next.js)
- **Framework**: Next.js with TypeScript
- **UI/UX**: Responsive design with real-time chat interface
- **Deployment**: Vercel for seamless hosting and CDN

## 🎯 Core Features

### Intelligent Conversations
- Natural language processing with Google Gemini AI
- Context-aware responses using vector embeddings
- Multimodal input support (text, potentially images/audio)
- Persistent conversation history

### Advanced AI Capabilities
- Document intelligence through LlamaIndex
- Audio processing for voice interactions
- Customizable system prompts
- Extensible AI model integrations

### Production-Ready Infrastructure
- HTTPS-enabled secure communications
- CORS configuration for cross-origin requests
- Scalable deployment on Railway
- Environment-based configuration management

## 🔧 Technical Stack

- **Backend**: Python 3.12, Django, Google Generative AI, ChromaDB, LlamaIndex, Librosa, Edge TTS
- **Frontend**: TypeScript, Next.js, React
- **Database**: SQLite (development), configurable for PostgreSQL/MySQL in production
- **Deployment**: Railway (backend), Vercel (frontend)
- **Package Management**: uv for Python dependencies
- **Version Control**: Git with GitHub

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js 18+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/eddietal2/Project_Red_Queen.git
   cd Project_Red_Queen
   ```

2. **Backend Setup**
   ```bash
   cd b-e
   uv sync
   cp .env.example .env  # Configure your environment variables
   python manage.py migrate
   python manage.py runserver
   ```

3. **Frontend Setup**
   ```bash
   cd f-e
   npm install
   cp .env.example .env.local  # Set NEXT_PUBLIC_API_URL to backend URL
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## 📁 Project Structure

```
Project_Red_Queen/
├── b-e/                    # Backend (Django)
│   ├── config/            # Django settings
│   ├── ai_app/            # Main AI application
│   ├── manage.py
│   ├── pyproject.toml
│   └── uv.lock
├── f-e/                    # Frontend (Next.js)
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── next.config.js
├── .gitignore
├── README.md
└── LICENSE
```

## 🔐 Environment Variables

### Backend (.env)
```env
GOOGLE_API_KEY=your_google_api_key
DEBUG=True
SECRET_KEY=your_django_secret_key
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🚀 Deployment

### Backend (Railway)
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set `NEXT_PUBLIC_API_URL` to your Railway backend URL
3. Deploy automatically

## 🧪 Testing

### Backend
```bash
cd b-e
python manage.py test
```

### Frontend
```bash
cd f-e
npm test
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📊 Project Status

- **Version**: 1.0.0 (Stable Release)
- **Development**: Active
- **License**: MIT
- **Contributors**: Open to contributions

## 📞 Support

For support, email eddietaylor@example.com or join our [Discord community](https://discord.gg/project-red-queen).

## 🙏 Acknowledgments

Special thanks to the open-source community for the amazing libraries that made this project possible: Django, Next.js, Google AI, ChromaDB, and many more.

---

**The Red Queen is live and ready to chat!** 🎭

For more information, visit our [documentation](https://docs.project-red-queen.com) or check out the [issues](https://github.com/eddietal2/Project_Red_Queen/issues) page.
