import { useState, useRef } from "react";

interface TextAnnotation {
  id: string;
  x: number;
  y: number;
  text: string;
  isEditing: boolean;
}

interface ResumeImageEditorProps {
  imageUrl: string;
  onSave?: (annotations: TextAnnotation[]) => void;
  onDownload?: () => void;
}

const ResumeImageEditor = ({ imageUrl, onSave, onDownload }: ResumeImageEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [annotations, setAnnotations] = useState<TextAnnotation[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [isDrawMode, setIsDrawMode] = useState(false);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawMode) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newAnnotation: TextAnnotation = {
      id: Date.now().toString(),
      x,
      y,
      text: "Click to edit",
      isEditing: true,
    };

    setAnnotations([...annotations, newAnnotation]);
    setSelectedAnnotation(newAnnotation.id);
  };

  const updateAnnotation = (id: string, text: string) => {
    setAnnotations(
      annotations.map((ann) =>
        ann.id === id ? { ...ann, text } : ann
      )
    );
  };

  const deleteAnnotation = (id: string) => {
    setAnnotations(annotations.filter((ann) => ann.id !== id));
    setSelectedAnnotation(null);
  };

  const handleDownloadWithAnnotations = async () => {
    if (!imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = imageRef.current.width;
    canvas.height = imageRef.current.height;

    // Draw the original image
    ctx.drawImage(imageRef.current, 0, 0);

    // Draw annotations on canvas
    ctx.font = "14px Arial";
    ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;

    annotations.forEach((ann) => {
      // Draw text background
      const textMetrics = ctx.measureText(ann.text);
      const textHeight = 16;
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillRect(
        ann.x - 5,
        ann.y - textHeight - 5,
        textMetrics.width + 10,
        textHeight + 10
      );

      // Draw text
      ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
      ctx.fillText(ann.text, ann.x, ann.y);

      // Draw border circle
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.arc(ann.x, ann.y, 8, 0, 2 * Math.PI);
      ctx.stroke();
    });

    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "resume-annotated.png";
      link.click();
      URL.revokeObjectURL(url);
    }, "image/png");

    onDownload?.();
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setIsDrawMode(!isDrawMode)}
          className={`px-4 py-2 font-semibold rounded-lg transition-all ${
            isDrawMode
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {isDrawMode ? "✏️ Editing Mode ON" : "✏️ Enable Edit Mode"}
        </button>

        <button
          onClick={() => setAnnotations([])}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all"
        >
          🗑️ Clear All Edits
        </button>

        <button
          onClick={handleDownloadWithAnnotations}
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all"
        >
          📥 Download Annotated Resume
        </button>

        {onSave && (
          <button
            onClick={() => onSave(annotations)}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
          >
            💾 Save Annotations
          </button>
        )}
      </div>

      {/* Image Editor Area */}
      <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50">
        <div
          onClick={handleImageClick}
          className={`relative inline-block w-full ${
            isDrawMode ? "cursor-crosshair" : "cursor-default"
          }`}
          style={{ backgroundColor: "#f3f4f6" }}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Resume"
            className="w-full h-auto"
          />

          {/* Annotation Markers */}
          {annotations.map((ann) => (
            <div key={ann.id} className="absolute transform -translate-x-1/2 -translate-y-1/2">
              {/* Marker circle */}
              <div
                style={{
                  left: ann.x,
                  top: ann.y,
                }}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold cursor-pointer transition-all ${
                  selectedAnnotation === ann.id
                    ? "bg-red-500 border-red-700 text-white"
                    : "bg-yellow-300 border-yellow-600"
                }`}
                onClick={() => setSelectedAnnotation(ann.id)}
              >
                ✎
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Annotation Editor */}
      {selectedAnnotation && (
        <div className="bg-white border border-gray-300 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Edit Text</h3>
            <button
              onClick={() => deleteAnnotation(selectedAnnotation)}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>

          <textarea
            value={
              annotations.find((ann) => ann.id === selectedAnnotation)?.text ||
              ""
            }
            onChange={(e) => updateAnnotation(selectedAnnotation, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Enter text to add to resume..."
          />

          <div className="text-sm text-gray-600">
            Position: ({annotations.find((ann) => ann.id === selectedAnnotation)?.x}, {annotations.find((ann) => ann.id === selectedAnnotation)?.y})
          </div>
        </div>
      )}

      {/* Instructions */}
      {isDrawMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
          <p className="font-semibold mb-2">📌 How to use:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Click on the resume image to add text annotations</li>
            <li>Click on any marker to edit the text</li>
            <li>Edit the text in the box below</li>
            <li>Click "Download Annotated Resume" to get your edited resume</li>
          </ul>
        </div>
      )}

      {/* Canvas for rendering (hidden) */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default ResumeImageEditor;
