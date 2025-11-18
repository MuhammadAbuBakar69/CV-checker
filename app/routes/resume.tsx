import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
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
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <img src="/images/resume-scan-2.gif" className="w-full" />
                    )}
                </section>
            </div>
        </main>
    )
}
export default Resume
