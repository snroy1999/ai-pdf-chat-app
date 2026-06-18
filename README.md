# AI PDF Chat App (RAG System)

An AI-powered PDF Question Answering application built using Retrieval-Augmented Generation (RAG). Users can upload PDF documents and ask natural language questions about the content. The application retrieves relevant document chunks from a vector database and generates context-aware answers using a Large Language Model (LLM).

---

## Live Demo

Frontend: https://ai-pdf-chat-app-one.vercel.app

Backend API: https://ai-pdf-chat-app-mry7.onrender.com

---

## Features

* Upload PDF documents
* Extract and process PDF text
* Text chunking for efficient retrieval
* Generate embeddings for document chunks
* Store embeddings in Pinecone Vector Database
* Semantic search using vector similarity
* Context-aware question answering using OpenRouter LLMs
* Document-specific retrieval for multiple uploaded PDFs
* Source context viewer for transparency
* Responsive and user-friendly interface
* Fully deployed frontend and backend

---

## Tech Stack

### Frontend

* React.js
* Vite
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js
* Multer
* PDF-Parse

### AI & Vector Search

* OpenRouter
* Pinecone Vector Database
* Embedding Models
* Retrieval-Augmented Generation (RAG)

### Deployment

* Vercel (Frontend)
* Render (Backend)

---

## System Architecture

PDF Upload
→ Text Extraction
→ Chunking
→ Embedding Generation
→ Pinecone Vector Storage

User Question
→ Query Embedding
→ Pinecone Semantic Search
→ Context Retrieval
→ OpenRouter LLM
→ Answer Generation

---

## Project Workflow

### Document Ingestion

1. User uploads a PDF.
2. Text is extracted from the PDF.
3. Text is divided into smaller chunks.
4. Embeddings are generated for each chunk.
5. Embeddings are stored in Pinecone with document metadata.

### Question Answering

1. User asks a question.
2. Question embedding is generated.
3. Pinecone retrieves relevant chunks.
4. Retrieved chunks are used as context.
5. OpenRouter generates a grounded answer.
6. Answer and source context are displayed to the user.

---

## Folder Structure

```text
ai-pdf-chat-app/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.js
│   │
│   ├── uploads/
│   ├── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│
└── README.md
```

## Installation

### Clone Repository

```bash
git clone https://github.com/snroy1999/ai-pdf-chat-app.git
cd ai-pdf-chat-app
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000

OPENROUTER_API_KEY=your_openrouter_key

PINECONE_API_KEY=your_pinecone_key

PINECONE_INDEX_NAME=your_index_name
```

Start Backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Start Frontend:

```bash
npm run dev
```

---

## Key Concepts Demonstrated

* Retrieval-Augmented Generation (RAG)
* Vector Databases
* Embeddings
* Semantic Search
* Context Retrieval
* Prompt Engineering
* REST APIs
* Full Stack Development
* AI Application Deployment

---

## Future Improvements

* Conversational Memory
* Streaming Responses
* User Authentication
* Chat History Persistence
* Multiple File Upload Support
* PDF Preview Viewer
* Hybrid Search (Keyword + Semantic Search)

---

## Author

Snehal Roy

Data Analyst | Data Science Enthusiast


