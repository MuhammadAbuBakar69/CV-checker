import { useState, useRef } from "react";
import type { Feedback, ImprovedResume } from "~/types";

interface InlineResumeEditorProps {
  feedback: Feedback;
  improvedResume?: ImprovedResume;
  onSave?: (updatedFeedback: Feedback, updatedImprovedResume?: ImprovedResume) => void;
}

interface EditableContent {
  summary: string;
  skills: string;
  experience: string;
  education: string;
}

const InlineResumeEditor = ({ feedback, improvedResume, onSave }: InlineResumeEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Helper function to safely convert skills to string
  const skillsToString = (skills: any): string => {
    if (!skills) return "Python, JavaScript, React, Node.js";
    if (typeof skills === 'string') return skills;
    if (Array.isArray(skills)) return skills.join(", ");
    return "Python, JavaScript, React, Node.js";
  };

  const [editContent, setEditContent] = useState<EditableContent>({
    summary: improvedResume?.summary || "Aspiring Machine Learning Engineer with strong foundation in data science and software development.",
    skills: skillsToString(improvedResume?.skills),
    experience: improvedResume?.experience || "Senior Software Engineer at Tech Company\n• Led development of key features\n• Mentored junior developers\n• Improved performance by 40%",
    education: improvedResume?.education || "Bachelor of Science in Computer Science\nUniversity Name, 2023"
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleSaveChanges = () => {
    const updatedImprovedResume: ImprovedResume = {
      summary: editContent.summary,
      skills: editContent.skills.split(",").map((s: string) => s.trim()).filter(Boolean),
      experience: editContent.experience,
      education: editContent.education,
      estimatedScore: improvedResume?.estimatedScore || feedback.overallScore
    };
    
    onSave?.(feedback, updatedImprovedResume);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDownloadPDF = async () => {
    try {
      const element = previewRef.current;
      if (!element) {
        alert("Resume not found");
        return;
      }

      // Try html2pdf
      try {
        const html2pdfModule = await import('html2pdf.js');
        const html2pdf = html2pdfModule.default || html2pdfModule;
        
        if (typeof html2pdf === 'function') {
          const opt = {
            margin: 0.5,
            filename: 'Resume.pdf',
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const },
          };

          await html2pdf().set(opt).from(element).save();
          alert('✅ Resume downloaded successfully!');
          return;
        }
      } catch (html2pdfError) {
        console.warn('html2pdf failed, using print dialog:', html2pdfError);
      }

      // Fallback: Print dialog
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Could not open print window');
      }
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Resume</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; line-height: 1.6; }
              h2 { color: #1a202c; border-bottom: 2px solid #2d3748; padding-bottom: 8px; margin-top: 20px; }
              h3 { color: #2d3748; margin-top: 15px; }
              .skill-tag { display: inline-block; background: #edf2f7; color: #2c5282; padding: 6px 12px; 
                           margin: 4px 4px 4px 0; border-radius: 20px; font-size: 13px; }
              .section { margin-bottom: 20px; }
              p { margin: 8px 0; color: #4a5568; }
            </style>
          </head>
          <body>${element.innerHTML}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Try using browser Print > Save as PDF');
    }
  };

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-6 py-2 rounded-full font-bold text-white transition-colors ${
              isEditing 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-500 hover:bg-gray-600'
            }`}
          >
            {isEditing ? '✏️ Editing Mode' : '👁️ View Mode'}
          </button>
          
          {isEditing && (
            <>
              <button
                onClick={handleSaveChanges}
                className="px-6 py-2 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                💾 Save Changes
              </button>
              {saveSuccess && (
                <span className="text-green-600 font-bold animate-pulse">✅ Saved!</span>
              )}
            </>
          )}
          
          <button
            onClick={handleDownloadPDF}
            className="px-6 py-2 bg-orange-600 text-white rounded-full font-bold hover:bg-orange-700 transition-colors flex items-center gap-2"
          >
            📥 Download PDF
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-gray-50 min-h-screen">
        {/* Left Column - Editor */}
        {isEditing && (
          <div className="bg-white rounded-xl shadow-lg p-6 overflow-y-auto max-h-[calc(100vh-120px)]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">✏️ Edit Resume Content</h2>

            {/* Professional Summary */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">📝 Professional Summary</label>
              <textarea
                value={editContent.summary}
                onChange={(e) => setEditContent({ ...editContent, summary: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Your professional summary..."
              />
            </div>

            {/* Key Skills */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">🎯 Key Skills</label>
              <textarea
                value={editContent.skills}
                onChange={(e) => setEditContent({ ...editContent, skills: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Python, JavaScript, React, Node.js..."
              />
              <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
            </div>

            {/* Professional Experience */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">💼 Professional Experience</label>
              <textarea
                value={editContent.experience}
                onChange={(e) => setEditContent({ ...editContent, experience: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                rows={6}
                placeholder="Your work experience..."
              />
            </div>

            {/* Education */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">🎓 Education</label>
              <textarea
                value={editContent.education}
                onChange={(e) => setEditContent({ ...editContent, education: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Your education details..."
              />
            </div>
          </div>
        )}

        {/* Right Column - Preview / Full View */}
        <div className={`bg-white rounded-xl shadow-lg p-8 overflow-y-auto max-h-[calc(100vh-120px)] ${!isEditing ? 'lg:col-span-2' : ''}`}>
          <div ref={previewRef} className="resume-preview">
            {/* Header */}
            <div className="mb-6 pb-4 border-b-2 border-gray-300">
              <h1 className="text-4xl font-bold text-gray-900">Resume</h1>
              <p className="text-gray-600 text-sm mt-2">
                Score: <span className="font-bold text-green-600 text-lg">{feedback.overallScore}%</span>
              </p>
            </div>

            {/* Professional Summary */}
            {editContent.summary && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-3">
                  PROFESSIONAL SUMMARY
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {editContent.summary}
                </p>
              </div>
            )}

            {/* Key Skills */}
            {editContent.skills && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-3">
                  KEY SKILLS
                </h2>
                <div className="flex flex-wrap gap-2">
                  {editContent.skills.split(',').map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Professional Experience */}
            {editContent.experience && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-3">
                  PROFESSIONAL EXPERIENCE
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                  {editContent.experience}
                </p>
              </div>
            )}

            {/* Education */}
            {editContent.education && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-3">
                  EDUCATION
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                  {editContent.education}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InlineResumeEditor;
