import { useState } from "react";
import axios from "axios";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");

  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [pdfUploaded, setPdfUploaded] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadPdf = async () => {
    if (!selectedFile) {
      alert("Please select a PDF file");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("pdf", selectedFile);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload`,
        formData
      );

      setMessage(response.data.message);

      // New PDF uploaded successfully
      setPdfUploaded(true);

      // Clear previous conversation
      setChatHistory([]);
    } catch (error) {
      console.error(error);
      setMessage("Upload failed");
      setPdfUploaded(false);
    } finally {
      setUploading(false);
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }

    try {
      setAsking(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chat/ask`,
        {
          question,
        }
      );

      setChatHistory((prev) => [
        ...prev,
        {
          question,
          answer: response.data.answer,
          sources: response.data.sourceChunks || [],
        },
      ]);

      setQuestion("");
    } catch (error) {
      console.error(error);

      setChatHistory((prev) => [
        ...prev,
        {
          question,
          answer: "Failed to get answer",
          sources: [],
        },
      ]);
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          AI PDF Chat App
        </h1>

        {/* Upload Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            Upload PDF
          </h2>

          <div className="flex gap-3">
            <input
              type="file"
              onChange={handleFileChange}
              className="border p-2 rounded w-full"
            />

            <button
              onClick={uploadPdf}
              disabled={uploading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          <p className="mt-3 text-green-600">
            {message}
          </p>
        </div>

        {/* Question Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            Ask Question
          </h2>

          <div className="flex gap-3">
            <input
              type="text"
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              placeholder="Ask something about your PDF..."
              className="border p-2 rounded w-full"
            />

            <button
              onClick={askQuestion}
              disabled={!pdfUploaded || asking}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {asking ? "Thinking..." : "Ask"}
            </button>
          </div>
        </div>

        {/* Conversation Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Conversation
          </h2>

          {asking && (
            <div className="border rounded-lg p-4 bg-gray-50 mb-4">
              Generating answer...
            </div>
          )}

          {chatHistory.length === 0 ? (
            <div className="border rounded-lg p-4 bg-gray-50">
              Ask a question about your uploaded PDF.
            </div>
          ) : (
            <div className="space-y-4">
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <p className="font-semibold text-blue-600">
                    Question
                  </p>

                  <p className="mb-4">
                    {chat.question}
                  </p>

                  <p className="font-semibold text-green-600">
                    Answer
                  </p>

                  <p>{chat.answer}</p>

                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm text-gray-600">
                      View Source Context
                    </summary>

                    <div className="mt-3 bg-white p-3 rounded border text-sm">
                      {chat.sources.length > 0 ? (
                        chat.sources.map(
                          (source, idx) => (
                            <p
                              key={idx}
                              className="mb-3"
                            >
                              {source}
                            </p>
                          )
                        )
                      ) : (
                        <p>
                          No source context available.
                        </p>
                      )}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;