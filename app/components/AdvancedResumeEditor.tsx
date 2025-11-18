import { useState, useRef } from "react";
import { usePuterStore } from "~/lib/puter";
import type { ImprovedResume } from "~/types";

interface AdvancedResumeEditorProps {
  improvedResume: ImprovedResume;
  jobTitle?: string;
  onSave?: (edited: ImprovedResume) => void;
  onApply?: (edited: ImprovedResume) => Promise<void>;
  resumeScore?: number;
}

const AdvancedResumeEditor = ({ 
  improvedResume, 
  jobTitle = "the target role", 
  onSave,
  onApply,
  resumeScore = 85
}: AdvancedResumeEditorProps) => {
  const [editedResume, setEditedResume] = useState(improvedResume);
  const [isSaving, setIsSaving] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
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
      {/* Left Column - Editor */}
      <div className="bg-white rounded-xl shadow-lg p-6 overflow-y-auto max-h-screen">
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

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-8">
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
      </div>

      {/* Right Column - Live Preview */}
      <div className="bg-white rounded-xl shadow-lg p-8 overflow-y-auto max-h-screen sticky top-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">👀 Live Preview</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Score:</span>
            <span className="text-2xl font-bold text-green-600">{resumeScore}</span>
            <span className="text-2xl">⭐</span>
          </div>
        </div>

        {/* Resume Preview */}
        <div ref={previewRef} className="resume-preview text-gray-900">
          {/* Name/Title */}
          <div className="mb-6 pb-4 border-b-2 border-gray-300">
            <h1 className="text-3xl font-bold text-gray-900">{jobTitle || 'Professional'}</h1>
            <p className="text-gray-600 mt-1">Resume Preview</p>
          </div>

          {/* Professional Summary */}
          {editedResume.summary && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-2">
                Professional Summary
              </h2>
              <p className="text-gray-700 mt-3 leading-relaxed whitespace-pre-wrap">
                {editedResume.summary}
              </p>
            </div>
          )}

          {/* Key Skills */}
          {editedResume.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-2">
                Key Skills
              </h2>
              <div className="flex flex-wrap gap-2 mt-3">
                {editedResume.skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Professional Experience */}
          {editedResume.experience && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-2">
                Professional Experience
              </h2>
              <div className="text-gray-700 mt-3 whitespace-pre-wrap leading-relaxed">
                {editedResume.experience}
              </div>
            </div>
          )}

          {/* Education */}
          {editedResume.education && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-2">
                Education
              </h2>
              <div className="text-gray-700 mt-3 whitespace-pre-wrap leading-relaxed">
                {editedResume.education}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedResumeEditor;
