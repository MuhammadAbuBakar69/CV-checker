import { useState, useRef } from "react";
import { usePuterStore } from "~/lib/puter";
import ResumeImageEditor from "./ResumeImageEditor";
import type { ImprovedResume } from "~/types";

interface AdvancedResumeEditorProps {
  improvedResume: ImprovedResume;
  jobTitle?: string;
  onSave?: (edited: ImprovedResume) => void;
  onApply?: (edited: ImprovedResume) => Promise<void>;
  resumeScore?: number;
  resumeImageUrl?: string;
}

const AdvancedResumeEditor = ({ 
  improvedResume, 
  jobTitle = "the target role", 
  onSave,
  onApply,
  resumeScore = 85,
  resumeImageUrl
}: AdvancedResumeEditorProps) => {
  const [editedResume, setEditedResume] = useState(improvedResume);
  const [isSaving, setIsSaving] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editMode, setEditMode] = useState<'text' | 'image'>('text');
  const previewRef = useRef<HTMLDivElement>(null);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      onSave?.(editedResume);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyAndDownload = async () => {
    setIsApplying(true);
    try {
      await onApply?.(editedResume);
    } catch (error) {
      console.error('Error applying:', error);
      alert('Failed to apply resume');
    } finally {
      setIsApplying(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const element = previewRef.current;
      if (!element) {
        alert('Resume preview not found');
        return;
      }

      // Try html2pdf library
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
          return;
        }
      } catch (html2pdfError) {
        console.warn('html2pdf failed, using print dialog:', html2pdfError);
      }

      // Fallback: Print dialog
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Could not open print window. Please allow popups.');
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-screen bg-gray-50 p-4">
      {/* Left Column - Editor with Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col max-h-screen">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setEditMode('text')}
            className={`flex-1 py-3 px-4 font-semibold text-center transition-all ${
              editMode === 'text'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ✏️ Edit Text
          </button>
          <button
            onClick={() => setEditMode('image')}
            className={`flex-1 py-3 px-4 font-semibold text-center transition-all ${
              editMode === 'image'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🖼️ Edit Image
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {editMode === 'text' ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">✏️ Edit Your Resume</h2>
                <p className="text-gray-600 text-sm">Make any changes to your content below</p>
              </div>

              {/* Success Message */}
              {saveSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg border border-green-300 animate-pulse">
                  ✅ Changes saved successfully!
                </div>
              )}

              {/* Professional Summary */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">📝 Professional Summary</label>
                <textarea
                  value={editedResume.summary}
                  onChange={(e) => setEditedResume({ ...editedResume, summary: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                  rows={4}
                  placeholder="Your professional summary..."
                />
              </div>

              {/* Key Skills */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">🎯 Key Skills</label>
                <textarea
                  value={editedResume.skills.join(', ')}
                  onChange={(e) => setEditedResume({ 
                    ...editedResume, 
                    skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                  rows={3}
                  placeholder="Python, JavaScript, React, Node.js..."
                />
                <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
              </div>

              {/* Professional Experience */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">💼 Professional Experience</label>
                <textarea
                  value={editedResume.experience}
                  onChange={(e) => setEditedResume({ ...editedResume, experience: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  rows={6}
                  placeholder="Your work experience..."
                />
              </div>

              {/* Education */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">🎓 Education</label>
                <textarea
                  value={editedResume.education}
                  onChange={(e) => setEditedResume({ ...editedResume, education: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                  rows={4}
                  placeholder="Your education details..."
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">🖼️ Edit Resume Image</h2>
                <p className="text-gray-600 text-sm">Add annotations and text directly to your resume image</p>
              </div>
              {resumeImageUrl && (
                <ResumeImageEditor 
                  imageUrl={resumeImageUrl}
                  onDownload={() => {
                    alert('✅ Annotated resume downloaded!');
                  }}
                />
              )}
            </>
          )}
        </div>

        {/* Action Buttons - Fixed at bottom */}
        {editMode === 'text' && (
          <div className="border-t border-gray-200 bg-white p-6 flex flex-col gap-3">
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="animate-spin">⏳</span> Saving...
                </>
              ) : (
                <>
                  💾 Save Changes
                </>
              )}
            </button>
            <button
              onClick={handleDownloadPDF}
              className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              📥 Download PDF
            </button>
            <button
              onClick={handleApplyAndDownload}
              disabled={isApplying}
              className="w-full px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {isApplying ? (
                <>
                  <span className="animate-spin">⏳</span> Applying...
                </>
              ) : (
                <>
                  ✅ Apply & Save to CV
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Right Column - Original Resume Image */}
      <div className="bg-white rounded-xl shadow-lg p-4 overflow-y-auto max-h-screen sticky top-4 flex flex-col">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-1">📄 Your Original Resume</h2>
          <p className="text-gray-600 text-sm">Original uploaded document</p>
        </div>

        {resumeImageUrl ? (
          <div className="flex-1 flex items-center justify-center min-h-[500px] bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={resumeImageUrl} 
              alt="Original Resume" 
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center min-h-[500px] bg-gray-100 rounded-lg">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500">Resume image not available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedResumeEditor;
