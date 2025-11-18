import { useState, useRef } from "react";
import { usePuterStore } from "~/lib/puter";
import type { ImprovedResume } from "~/types";

interface EnhancedResumeViewProps {
  improvedResume: ImprovedResume;
  jobTitle?: string;
  onSave?: (edited: ImprovedResume) => void;
  onApply?: (edited: ImprovedResume) => Promise<void>;
}

interface UpdateResult {
  newScore: number;
  feedback: string;
}

const EnhancedResumeView = ({ improvedResume, jobTitle = "the target role", onSave, onApply }: EnhancedResumeViewProps) => {
  const { ai } = usePuterStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedResume, setEditedResume] = useState(improvedResume);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [updateResult, setUpdateResult] = useState<UpdateResult | null>(null);
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    setIsEditing(false);
    onSave?.(editedResume);
  };

  const handleApplyEnhancedResume = async () => {
    setIsApplying(true);
    try {
      await onApply?.(editedResume);
    } catch (error) {
      console.error('Error applying enhanced resume:', error);
      alert('Failed to apply enhanced resume. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleUpdateResume = async () => {
    setIsUpdating(true);
    setUpdateResult(null);

    try {
      // Prepare resume content
      const resumeContent = `
Professional Summary: ${editedResume.summary}

Skills: ${editedResume.skills.join(', ')}

Experience: ${editedResume.experience}

Education: ${editedResume.education}
      `.trim();

      // Use Puter AI to analyze the resume (no rate limits!)
      const prompt = `You are an expert ATS (Applicant Tracking System) and resume analyzer. Analyze the following resume for the position: "${jobTitle}".

Resume Content:
${resumeContent}

Provide your analysis in the following JSON format (IMPORTANT: Return ONLY valid JSON, no markdown formatting):
{
  "score": <number between 0-100>,
  "feedback": "<brief feedback about the resume quality and improvements>"
}

Be honest and constructive in your feedback.`;

      const response = await ai.chat(prompt);
      
      if (!response) {
        throw new Error('No response from AI');
      }

      // Extract text content from AI response
      const responseText = typeof response.message.content === 'string'
        ? response.message.content
        : response.message.content[0].text;

      // Extract JSON from response (handle potential markdown formatting)
      let jsonText = responseText;
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }

      const result = JSON.parse(jsonText);

      setUpdateResult({
        newScore: result.score,
        feedback: result.feedback,
      });

      // Update the estimated score in the edited resume
      setEditedResume({
        ...editedResume,
        estimatedScore: result.score,
      });

    } catch (error: any) {
      console.error('Error updating resume:', error);
      
      // Check for Puter AI usage limit errors
      if (error?.code === 'error_400_from_delegate' || error?.message?.includes('Permission denied')) {
        alert('⚠️ AI Usage Limit Reached\n\nYou have exceeded the free tier AI usage limit. Please:\n\n• Wait a while and try again later\n• Upgrade your Puter account for more usage\n• Contact Puter support for assistance');
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        alert(`Failed to update resume: ${errorMessage}\n\nPlease try again.`);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const element = resumeRef.current;
      if (!element) {
        alert('Resume content not found. Please try again.');
        return;
      }

      // Try using html2pdf
      try {
        const html2pdfModule = await import('html2pdf.js');
        const html2pdf = html2pdfModule.default || html2pdfModule;
        
        if (typeof html2pdf !== 'function') {
          throw new Error('html2pdf library failed to load');
        }

        const opt = {
          margin: 0.5,
          filename: 'Enhanced_Resume.pdf',
          image: { type: 'jpeg' as const, quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const },
        };

        await html2pdf().set(opt).from(element).save();
        
      } catch (html2pdfError) {
        console.warn('html2pdf failed, using browser print as fallback:', html2pdfError);
        
        // Fallback: Use browser's print dialog
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          throw new Error('Could not open print window. Please allow popups for this site.');
        }
        
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Enhanced Resume</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h3 { color: #333; margin-top: 20px; }
                .skill-tag { display: inline-block; background: #e3f2fd; color: #1976d2; 
                             padding: 5px 10px; margin: 3px; border-radius: 15px; }
              </style>
            </head>
            <body>${element.innerHTML}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to generate PDF: ${errorMessage}\n\nTip: Try using your browser's Print > Save as PDF feature instead.`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md w-full p-6 animate-in fade-in duration-1000">
      {/* Header with Score */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-black">✨ Enhanced Resume</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm text-gray-600">Current Score:</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-600">{editedResume.estimatedScore}</span>
              <span className="text-2xl">⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button Bar */}
      <div className="flex flex-wrap gap-3 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={isUpdating || isApplying}
        >
          {isEditing ? '💾 Save Changes' : '✏️ Edit Resume'}
        </button>
        <button
          onClick={handleUpdateResume}
          className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          disabled={isUpdating || isApplying}
        >
          {isUpdating ? (
            <>
              <span className="animate-spin">⏳</span> Updating...
            </>
          ) : (
            '🔄 Update Resume'
          )}
        </button>
        <button
          onClick={handleApplyEnhancedResume}
          className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          disabled={isUpdating || isApplying}
          title="Apply enhanced resume to your CV and save it"
        >
          {isApplying ? (
            <>
              <span className="animate-spin">⏳</span> Applying...
            </>
          ) : (
            '✅ Apply to CV'
          )}
        </button>
        <button
          onClick={handleDownloadPDF}
          className="px-6 py-2 primary-gradient text-white rounded-full hover:opacity-90 transition-opacity"
          title="Download resume as PDF or print"
        >
          📥 Download PDF
        </button>
      </div>

      {/* Update Result Display */}
      {updateResult && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border-2 border-green-200 animate-in fade-in duration-500">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✅</span>
            <div>
              <p className="text-lg font-bold text-green-800">
                New Score: {updateResult.newScore}
              </p>
              <p className="text-sm text-green-700">{updateResult.feedback}</p>
            </div>
          </div>
        </div>
      )}

      {/* Resume Content - For PDF Export */}
      <div ref={resumeRef} className="resume-content">
        {/* Summary Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-black mb-3 flex items-center gap-2">
          <span>📝</span> Professional Summary
        </h3>
        {isEditing ? (
          <textarea
            value={editedResume.summary}
            onChange={(e) => setEditedResume({ ...editedResume, summary: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          />
        ) : (
          <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
            {editedResume.summary}
          </p>
        )}
      </div>

      {/* Skills Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-black mb-3 flex items-center gap-2">
          <span>🎯</span> Key Skills
        </h3>
        {isEditing ? (
          <textarea
            value={editedResume.skills.join(', ')}
            onChange={(e) => setEditedResume({ 
              ...editedResume, 
              skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
            })}
            placeholder="Separate skills with commas"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {editedResume.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Experience Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-black mb-3 flex items-center gap-2">
          <span>💼</span> Professional Experience
        </h3>
        {isEditing ? (
          <textarea
            value={editedResume.experience}
            onChange={(e) => setEditedResume({ ...editedResume, experience: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px] font-mono text-sm"
          />
        ) : (
          <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {editedResume.experience}
          </div>
        )}
      </div>

      {/* Education Section */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-black mb-3 flex items-center gap-2">
          <span>🎓</span> Education
        </h3>
        {isEditing ? (
          <textarea
            value={editedResume.education}
            onChange={(e) => setEditedResume({ ...editedResume, education: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          />
        ) : (
          <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {editedResume.education}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          💡 <strong>Pro Tip:</strong> Review the enhanced sections and customize them further if needed. 
          Download and update your LinkedIn profile for maximum impact!
        </p>
      </div>
      </div> {/* Close resume-content div */}
    </div>
  );
};

export default EnhancedResumeView;
