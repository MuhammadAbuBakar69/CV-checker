import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import AdvancedResumeEditor from "~/components/AdvancedResumeEditor";
import type {ImprovedResume, Resume} from "~/types";

export const meta = () => ([
    { title: 'Resumind | Enhanced Resume' },
    { name: 'description', content: 'Get your AI-enhanced resume' },
])

const ResumeEnhance = () => {
    const { auth, isLoading, ai, kv, fs } = usePuterStore();
    const { id } = useParams();
    const [isGenerating, setIsGenerating] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [improvedResume, setImprovedResume] = useState<ImprovedResume | null>(null);
    const [resumeData, setResumeData] = useState<Resume | null>(null);
    const [resumeImageUrl, setResumeImageUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume-enhance/${id}`);
    }, [isLoading, auth.isAuthenticated, navigate, id]);

    useEffect(() => {
        const loadResume = async () => {
            try {
                const resume = await kv.get(`resume:${id}`);
                if (!resume) {
                    navigate('/', { replace: true });
                    return;
                }
                const data = JSON.parse(resume) as Resume;
                setResumeData(data);
                
                // Load the resume image
                try {
                    const imageBlob = await fs.read(data.imagePath);
                    if (imageBlob) {
                        const imageUrl = URL.createObjectURL(imageBlob);
                        setResumeImageUrl(imageUrl);
                    }
                } catch (imgErr) {
                    console.warn('Failed to load resume image:', imgErr);
                }
            } catch (error) {
                console.error('Failed to load resume:', error);
                navigate('/', { replace: true });
            }
        };
        loadResume();
    }, [id, kv, navigate, fs]);

    const handleGenerateEnhancement = async () => {
        if (!resumeData) return;

        setIsGenerating(true);
        setStatusText('Analyzing your resume...');

        try {
            const prompt = `You are a professional resume consultant. Analyze this resume and provide an enhanced version with improvements.

Job Title: ${resumeData.jobTitle || 'Not specified'}
Company: ${resumeData.companyName || 'Not specified'}
Current Score: ${resumeData.feedback?.overallScore || 0}%

Please provide an enhanced resume with:
1. A professional summary
2. Improved skills list
3. Enhanced experience descriptions
4. Polished education section
5. An estimated score (0-100) for the improved resume

Provide your response in the following JSON format (IMPORTANT: Return ONLY valid JSON, no markdown):
{
  "summary": "Professional summary text...",
  "skills": ["skill1", "skill2", "skill3", ...],
  "experience": "Enhanced experience section...",
  "education": "Polished education section...",
  "estimatedScore": 85
}`;

            const response = await ai.feedback(
                resumeData.resumePath,
                prompt
            );

            if (!response) {
                throw new Error('No response from AI');
            }

            const responseText = typeof response.message.content === 'string'
                ? response.message.content
                : response.message.content[0].text;

            // Extract JSON from response
            let jsonText = responseText;
            const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                jsonText = jsonMatch[0];
            }

            const enhanced = JSON.parse(jsonText) as ImprovedResume;
            setImprovedResume(enhanced);
            setStatusText('Enhancement complete!');

        } catch (error: any) {
            console.error('Error generating enhancement:', error);
            if (error?.code === 'error_400_from_delegate' || error?.message?.includes('Permission denied')) {
                setStatusText('⚠️ AI usage limit reached. Please try again later or upgrade your Puter account.');
            } else {
                setStatusText('Error: Failed to generate enhanced resume. Please try again.');
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async (updatedResume: ImprovedResume) => {
        try {
            if (!resumeData) return;

            // Save the enhanced resume to KV store
            const enhancedData = {
                ...resumeData,
                improvedResume: updatedResume,
            };

            await kv.set(`resume:${id}`, JSON.stringify(enhancedData));
            alert('✅ Enhanced resume saved successfully!');
        } catch (error) {
            console.error('Failed to save enhanced resume:', error);
            alert('❌ Failed to save enhanced resume. Please try again.');
        }
    };

    const handleApplyEnhanced = async (updatedResume: ImprovedResume) => {
        try {
            if (!resumeData) return;

            // Merge enhanced content with original resume
            const appliedData = {
                ...resumeData,
                improvedResume: updatedResume,
                // Update the main feedback with new estimated score
                feedback: {
                    ...resumeData.feedback,
                    overallScore: updatedResume.estimatedScore || resumeData.feedback?.overallScore || 0,
                }
            };

            await kv.set(`resume:${id}`, JSON.stringify(appliedData));
            
            alert('✅ Enhanced resume applied successfully!\n\nYour CV has been updated with the new content and score.');
            
            // Redirect back to the resume view
            setTimeout(() => {
                navigate(`/resume/${id}`);
            }, 1500);
        } catch (error) {
            console.error('Failed to apply enhanced resume:', error);
            alert('❌ Failed to apply enhanced resume. Please try again.');
        }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to={`/resume/${id}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-semibold">Back to Review</span>
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900">Enhanced Resume Generator</h1>
                    <div className="w-24"></div>
                </div>
            </nav>

            <div className="max-w-full mx-auto p-0">
                {!improvedResume ? (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
                            <div className="bg-gradient-to-r from-orange-500 to-red-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Boost Your Resume Score
                            </h2>
                            
                            {resumeData && (
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                                    <p className="text-orange-800">
                                        Current Score: <span className="font-bold text-2xl">{resumeData.feedback?.overallScore}%</span>
                                    </p>
                                </div>
                            )}

                            <p className="text-gray-600 text-lg mb-8">
                                Let our AI enhance your resume with professional improvements, 
                                better formatting, and optimized content to help you stand out!
                            </p>

                            <button
                                onClick={handleGenerateEnhancement}
                                disabled={isGenerating}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg rounded-xl hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100"
                            >
                                {isGenerating ? (
                                    <>
                                        <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Generate Enhanced Resume
                                    </>
                                )}
                            </button>

                            {statusText && (
                                <div className={`mt-6 p-4 rounded-lg ${
                                    statusText.includes('⚠️') || statusText.includes('Error') 
                                        ? 'bg-red-50 text-red-700 border border-red-200' 
                                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                                }`}>
                                    <p className="font-medium">{statusText}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <AdvancedResumeEditor 
                        improvedResume={improvedResume}
                        jobTitle={resumeData?.jobTitle || 'your target role'}
                        resumeScore={improvedResume.estimatedScore || 85}
                        onSave={handleSave}
                        onApply={handleApplyEnhanced}
                        resumeImageUrl={resumeImageUrl}
                    />
                )}
            </div>
        </main>
    );
};

export default ResumeEnhance;
