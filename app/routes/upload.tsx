import {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions, prepareHRInstructions} from "../../constants";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        setIsProcessing(true);

        setStatusText('Uploading the file...');
        const uploadedFile = await fs.upload([file]);
        if(!uploadedFile) return setStatusText('Error: Failed to upload file');

        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file);
        if(!imageFile.file) return setStatusText('Error: Failed to convert PDF to image');

        setStatusText('Uploading the image...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) return setStatusText('Error: Failed to upload image');

        setStatusText('Preparing data...');
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analyzing...');

        try {
            const feedback = await ai.feedback(
                uploadedFile.path,
                prepareInstructions({ jobTitle, jobDescription })
            )
            if (!feedback) {
                setStatusText('Error: Failed to analyze resume');
                setIsProcessing(false);
                return;
            }

            const feedbackText = typeof feedback.message.content === 'string'
                ? feedback.message.content
                : feedback.message.content[0].text;

            data.feedback = JSON.parse(feedbackText);
            await kv.set(`resume:${uuid}`, JSON.stringify(data));
            setStatusText('Analysis complete, redirecting...');
            console.log(data);
            navigate(`/resume/${uuid}`);
        } catch (error: any) {
            console.error('AI analysis error:', error);
            if (error?.code === 'error_400_from_delegate' || error?.message?.includes('Permission denied')) {
                setStatusText('⚠️ AI usage limit reached. Please try again later or upgrade your Puter account.');
            } else {
                setStatusText('Error: Failed to analyze resume. Please try again.');
            }
            setIsProcessing(false);
        }
    }

    const handleHRReview = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        setIsProcessing(true);

        setStatusText('Uploading the file...');
        const uploadedFile = await fs.upload([file]);
        if(!uploadedFile) return setStatusText('Error: Failed to upload file');

        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file);
        if(!imageFile.file) return setStatusText('Error: Failed to convert PDF to image');

        setStatusText('Uploading the image...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) return setStatusText('Error: Failed to upload image');

        setStatusText('Preparing data...');
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            hrReview: '',
        }
        await kv.set(`resume-hr:${uuid}`, JSON.stringify(data));

        setStatusText('Analyzing your resume for HR insights...');

        try {
            const hrReview = await ai.feedback(
                uploadedFile.path,
                prepareHRInstructions({ jobTitle, jobDescription })
            )
            if (!hrReview) {
                setStatusText('Error: Failed to analyze resume');
                setIsProcessing(false);
                return;
            }

            const reviewText = typeof hrReview.message.content === 'string'
                ? hrReview.message.content
                : hrReview.message.content[0].text;

            data.hrReview = JSON.parse(reviewText);
            await kv.set(`resume-hr:${uuid}`, JSON.stringify(data));
            setStatusText('HR Review complete, redirecting...');
            console.log(data);
            navigate(`/resume-hr/${uuid}`);
        } catch (error: any) {
            console.error('AI HR review error:', error);
            if (error?.code === 'error_400_from_delegate' || error?.message?.includes('Permission denied')) {
                setStatusText('⚠️ AI usage limit reached. Please try again later or upgrade your Puter account.');
            } else {
                setStatusText('Error: Failed to analyze resume. Please try again.');
            }
            setIsProcessing(false);
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;

        // Determine which button was clicked
        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
        const buttonType = submitter?.dataset?.type || 'analyze';

        if (buttonType === 'hr-review') {
            handleHRReview({ companyName, jobTitle, jobDescription, file });
        } else {
            handleAnalyze({ companyName, jobTitle, jobDescription, file });
        }
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full">
                                <button 
                                    className="primary-button flex-1" 
                                    type="submit"
                                    data-type="analyze"
                                >
                                    Analyze Resume
                                </button>
                                
                                <button 
                                    className="hr-review-button flex-1" 
                                    type="submit"
                                    data-type="hr-review"
                                >
                                    <span className="mr-2"></span>
                                    Review CV for HR
                                </button>
                            </div>
                            
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload
