import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import InlineResumeEditor from "~/components/InlineResumeEditor";
import type {Feedback} from "~/types";

export const meta = () => ([
    { title: 'Resumind | Review ' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    useEffect(() => {
        let isCancelled = false;

        const loadResume = async () => {
            try {
                const resume = await kv.get(`resume:${id}`);

                if (isCancelled) return;

                if(!resume) {
                    console.warn('Resume not found in KV store:', id);
                    navigate('/', { replace: true });
                    return;
                }

                const data = JSON.parse(resume);

                // Try to load PDF
                try {
                    const resumeBlob = await fs.read(data.resumePath);
                    if (isCancelled) return;
                    
                    if(!resumeBlob) {
                        console.warn('Resume PDF file not found');
                    } else {
                        const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
                        const resumeUrl = URL.createObjectURL(pdfBlob);
                        setResumeUrl(resumeUrl);
                    }
                } catch (err) {
                    if (!isCancelled) {
                        console.warn('Failed to load resume PDF:', err);
                    }
                }

                // Try to load image
                try {
                    const imageBlob = await fs.read(data.imagePath);
                    if (isCancelled) return;
                    
                    if(!imageBlob) {
                        console.warn('Resume image file not found');
                    } else {
                        const imageUrl = URL.createObjectURL(imageBlob);
                        setImageUrl(imageUrl);
                    }
                } catch (err) {
                    if (!isCancelled) {
                        console.warn('Failed to load resume image:', err);
                    }
                }

                if (!isCancelled) {
                    setFeedback(data.feedback);
                    console.log('Resume loaded successfully');
                }
            } catch (error) {
                if (!isCancelled) {
                    console.error('Failed to load resume:', error);
                    // Redirect to home if resume doesn't exist or is corrupted
                    navigate('/', { replace: true });
                }
            }
        }

        loadResume();

        // Cleanup function
        return () => {
            isCancelled = true;
            // Revoke object URLs to prevent memory leaks
            if (resumeUrl) URL.revokeObjectURL(resumeUrl);
            if (imageUrl) URL.revokeObjectURL(imageUrl);
        };
    }, [id, fs, kv, navigate]);

    return (
        <main className="!pt-0">
            {isEditMode && feedback ? (
                // Edit Mode - Full Screen Editor
                <>
                    <nav className="resume-nav">
                        <button onClick={() => setIsEditMode(false)} className="back-button">
                            <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                            <span className="text-gray-800 text-sm font-semibold">Back to View</span>
                        </button>
                    </nav>
                    <InlineResumeEditor 
                        feedback={feedback}
                        onSave={(updatedFeedback) => {
                            setFeedback(updatedFeedback);
                            // Save to KV store
                            const resumeData = { feedback: updatedFeedback };
                            kv.set(`resume:${id}`, JSON.stringify(resumeData));
                        }}
                    />
                </>
            ) : (
                // View Mode - Normal Resume Review
                <>
                    <nav className="resume-nav">
                        <Link to="/" className="back-button">
                            <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                            <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                        </Link>
                    </nav>
                    <div className="flex flex-row w-full max-lg:flex-col-reverse">
                        <section className="feedback-section bg-[url('/images/bg-small.svg') bg-cover h-[100vh] sticky top-0 items-center justify-center">
                            {imageUrl && resumeUrl && (
                                <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                                    <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={imageUrl}
                                            className="w-full h-full object-contain rounded-2xl"
                                            title="resume"
                                        />
                                    </a>
                                </div>
                            )}
                        </section>
                        <section className="feedback-section">
                            <div className="mb-2 inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                                👤 Your Resume Analysis
                            </div>
                            <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
                            {feedback ? (
                                <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                                    <Summary feedback={feedback} />
                                    
                                    {/* Edit & Download Button */}
                                    <button
                                        onClick={() => setIsEditMode(true)}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-fit"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit & Download PDF
                                    </button>
                                    
                                    {/* Show "Get Enhanced Resume" button if score is less than 80% */}
                                    {feedback.overallScore < 80 && (
                                        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-6 animate-in fade-in duration-500">
                                            <div className="flex items-start gap-4">
                                                <div className="bg-orange-500 text-white p-3 rounded-xl flex-shrink-0">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                        Need Help Improving Your Resume?
                                                    </h3>
                                                    <p className="text-gray-700 mb-4">
                                                        Your current score is <span className="font-bold text-orange-600">{feedback.overallScore}%</span>. 
                                                        Get an AI-enhanced version of your resume with professional improvements and better formatting!
                                                    </p>
                                                    <Link 
                                                        to={`/resume-enhance/${id}`}
                                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Get Enhanced Resume
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                                    <Details feedback={feedback} />
                                </div>
                            ) : (
                                <img src="/images/resume-scan-2.gif" className="w-full" />
                            )}
                        </section>
                    </div>
                </>
            )}
        </main>
    )
}
export default Resume
