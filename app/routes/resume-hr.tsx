import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import HRReviewResult from "~/components/HRReviewResult";
import NeedBetterScore from "~/components/NeedBetterScore";
import EnhancedResumeView from "~/components/EnhancedResumeView";
import type { HRReview, ImprovedResume } from "~/types";
import {prepareImprovementInstructions} from "../../constants";

export const meta = () => ([
    { title: 'Resumind | HR Review ' },
    { name: 'description', content: 'HR-style review of your resume' },
])

const ResumeHR = () => {
    const { auth, isLoading, fs, kv, ai } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [hrReview, setHRReview] = useState<HRReview | null>(null);
    const [improvedResume, setImprovedResume] = useState<ImprovedResume | null>(null);
    const [isImproving, setIsImproving] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [resumePath, setResumePath] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume-hr/${id}`);
    }, [isLoading])

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume-hr:${id}`);

            if(!resume) return;

            const data = JSON.parse(resume);

            const resumeBlob = await fs.read(data.resumePath);
            if(!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setHRReview(data.hrReview);
            setImprovedResume(data.improvedResume || null);
            setJobTitle(data.jobTitle || '');
            setJobDescription(data.jobDescription || '');
            setResumePath(data.resumePath || '');
            console.log({resumeUrl, imageUrl, hrReview: data.hrReview });
        }

        loadResume();
    }, [id]);

    const handleEnhanceResume = async () => {
        if (!hrReview) return;
        
        setIsImproving(true);
        setStatusText('Analyzing current resume...');

        try {
            // Read the resume file to extract text
            const resumeBlob = await fs.read(resumePath);
            if (!resumeBlob) {
                setStatusText('Error: Failed to read resume');
                setIsImproving(false);
                return;
            }

            setStatusText('Generating improved resume with AI...');

            // Prepare HR feedback string
            const hrFeedbackStr = JSON.stringify({
                overallSuitability: hrReview.overallSuitability,
                skillAlignment: hrReview.skillAlignment,
                experienceReview: hrReview.experienceReview,
                suggestions: hrReview.suggestions,
                roleFitScore: hrReview.roleFitScore,
            });

            // Call AI to improve resume
            const improvement = await ai.feedback(
                resumePath,
                prepareImprovementInstructions({
                    jobTitle,
                    jobDescription,
                    hrFeedback: hrFeedbackStr,
                })
            );

            if (!improvement) {
                setStatusText('Error: Failed to generate improvement');
                setIsImproving(false);
                return;
            }

            const improvementText = typeof improvement.message.content === 'string'
                ? improvement.message.content
                : improvement.message.content[0].text;

            const improvedResumeData = JSON.parse(improvementText);
            setImprovedResume(improvedResumeData);

            // Save to KV store
            const currentData = JSON.parse(await kv.get(`resume-hr:${id}`) || '{}');
            currentData.improvedResume = improvedResumeData;
            await kv.set(`resume-hr:${id}`, JSON.stringify(currentData));

            setStatusText('Improvement complete!');
        } catch (error) {
            console.error('Error improving resume:', error);
            setStatusText('Error: Failed to improve resume');
        } finally {
            setTimeout(() => {
                setIsImproving(false);
                setStatusText('');
            }, 1000);
        }
    };

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
                    <h2 className="text-4xl !text-black font-bold">HR Resume Review</h2>
                    
                    {isImproving ? (
                        <div className="flex flex-col items-center animate-in fade-in duration-1000">
                            <h3 className="text-2xl text-gray-700 mb-4">{statusText}</h3>
                            <img src="/images/resume-scan-2.gif" className="w-full" />
                            <p className="text-center text-gray-600 mt-4 text-lg">
                                AI is crafting your enhanced resume...
                            </p>
                        </div>
                    ) : hrReview ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <HRReviewResult review={hrReview} />
                            
                            {/* Show enhancement option if score < 80 and no improved resume yet */}
                            {hrReview.roleFitScore < 80 && !improvedResume && (
                                <NeedBetterScore onEnhance={handleEnhanceResume} />
                            )}
                            
                            {/* Show improved resume if it exists */}
                            {improvedResume && (
                                <EnhancedResumeView 
                                    improvedResume={improvedResume}
                                    onSave={(edited) => setImprovedResume(edited)}
                                    jobTitle={jobTitle}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <img src="/images/resume-scan-2.gif" className="w-full" />
                            <p className="text-center text-gray-600 mt-4 text-lg">
                                Analyzing your resume for HR insights...
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}
export default ResumeHR
