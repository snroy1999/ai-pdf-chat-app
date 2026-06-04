import { useState } from "react";
import axios from "axios";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [pdfUploaded, setPdfUploaded] = useState(false);

  const [documentId, setDocumentId] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (
           question.trim() &&
           pdfUploaded &&
           !asking
          ) {
            askQuestion();
         }
      }
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

      setDocumentId(response.data.documentId);
      setPdfUploaded(true);

      // Clear previous conversation when a new PDF is uploaded
      setChatHistory([]);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
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
          documentId,
        }
      );

      setChatHistory((prev) => [
        {
          question,
          answer: response.data.answer,
          sources: response.data.sourceChunks || [],
        },
        ...prev,
      ]);

      setQuestion("");
    } catch (error) {
      console.error(error);

      const backendMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to get answer";

      setChatHistory((prev) => [
        {
          question,
          answer: backendMessage,
          sources: [],
        },
        ...prev,
      ]);
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-4xl font-bold text-center mb-10">
          AI PDF Chat App
        </h1>

        {/* Upload Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            Upload PDF
          </h2>

          <div className="flex gap-3">
            <input
              type="file"
              id="pdfUpload"
              accept=".pdf"
              onChange={handleFileChange}
              hidden
            />

            <label
              htmlFor="pdfUpload"
              className="flex-1 border p-3 rounded bg-white cursor-pointer"
            >
              {selectedFile
                ? selectedFile.name
                : "Select PDF"}
            </label>

            <button
              onClick={uploadPdf}
              disabled={uploading}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>

        {/* Question Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            Ask Question
          </h2>

          <div className="flex gap-3">
            <input
               type="text"
               value={question}
               onChange={(e) =>
               setQuestion(e.target.value)
            }
            onKeyDown={handleKeyPress}
            placeholder="Ask something about your PDF..."
            className="border p-3 rounded w-full"
          />

            <button
              onClick={askQuestion}
              disabled={
                !pdfUploaded ||
                asking ||
                !question.trim()
              }
              className={`px-6 py-3 rounded text-white ${
                !pdfUploaded ||
                asking ||
                !question.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {asking ? "Thinking..." : "Ask"}
            </button>
          </div>
        </div>

        {/* Conversation Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Conversation
          </h2>

          {chatHistory.length === 0 ? (
            <div className="border rounded-lg p-4 bg-gray-50">
              Upload a PDF and ask a question.
            </div>
          ) : (
            <div className="space-y-4">
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-5 bg-gray-50"
                >
                  <p className="font-semibold text-blue-600 mb-2">
                    Question
                  </p>

                  <p className="mb-4">
                    {chat.question}
                  </p>

                  <p className="font-semibold text-green-600 mb-2">
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