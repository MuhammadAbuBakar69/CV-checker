import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import HRReviewResult from "~/components/HRReviewResult";
import type { HRReview } from "~/types";

export const meta = () => ([
    { title: 'Resumind | HR Review ' },
    { name: 'description', content: 'HR-style review of your resume' },
])

const ResumeHR = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [hrReview, setHRReview] = useState<HRReview | null>(null);
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
            console.log({resumeUrl, imageUrl, hrReview: data.hrReview });
        }

        loadResume();
    }, [id]);

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
                    <div className="mb-2 inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold">
                        🏢 HR Job Match Analysis
                    </div>
                    <h2 className="text-4xl !text-black font-bold">HR Resume Review</h2>
                    
                    {hrReview ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <HRReviewResult review={hrReview} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center animate-in fade-in duration-1000">
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
