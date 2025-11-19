import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import type {Resume} from "~/types";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath, resumePath }, onDelete }: { resume: Resume; onDelete?: (id: string) => void }) => {
    const { fs, kv, puterReady } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        let isCancelled = false;

        const loadResume = async () => {
            // Don't load if component is unmounted or being deleted
            if (isCancelled || isDeleting) return;

            try {
                const blob = await fs.read(imagePath);
                
                // Check again after async operation
                if (isCancelled || isDeleting) return;
                
                if(!blob) {
                    setImageError(true);
                    return;
                }
                let url = URL.createObjectURL(blob);
                setResumeUrl(url);
                setImageError(false);
            } catch (error: any) {
                // Only set error state if not cancelled (component still mounted)
                if (!isCancelled && !isDeleting) {
                    // Silently handle expected errors (404, file not found, Puter errors)
                    const isExpectedError = 
                        error?.message?.includes('404') || 
                        error?.message?.includes('File or directory not found') ||
                        error?.code === 'ENOENT' || 
                        error?.code === 'subject_does_not_exist' ||
                        error?.status === 404;
                    
                    setImageError(true);
                    
                    // Only log truly unexpected errors
                    if (!isExpectedError) {
                        console.warn('Unexpected error loading resume image:', error);
                    }
                }
            }
        }

        loadResume();

        // Cleanup function
        return () => {
            isCancelled = true;
            // Revoke object URL to prevent memory leaks
            if (resumeUrl) {
                URL.revokeObjectURL(resumeUrl);
            }
        };
    }, [imagePath, fs, isDeleting]);

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation to resume detail
        e.stopPropagation();

        if (!puterReady) {
            alert('Storage system is not ready. Please wait a moment and try again.');
            return;
        }

        if (!confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);

        try {
            // Delete files from storage (handle errors gracefully)
            try {
                await fs.delete(imagePath);
                console.log('✓ Deleted image file:', imagePath);
            } catch (err) {
                console.warn('Could not delete image file:', err);
            }

            if (resumePath) {
                try {
                    await fs.delete(resumePath);
                    console.log('✓ Deleted resume file:', resumePath);
                } catch (err) {
                    console.warn('Could not delete resume file:', err);
                }
            }

            // Delete from key-value store - CRITICAL for persistence
            let kvDeleteSuccess = false;
            
            try {
                const deleteResult = await kv.delete(`resume:${id}`);
                if (deleteResult) {
                    console.log('✓ Successfully deleted resume from KV');
                    kvDeleteSuccess = true;
                } else {
                    console.warn('KV delete returned false for resume');
                }
            } catch (kvErr) {
                console.error('Error deleting from KV:', kvErr);
                throw new Error(`Failed to delete resume from KV store: ${kvErr}`);
            }

            // Verify deletion by trying to fetch the deleted key
            try {
                const stillExists = await kv.get(`resume:${id}`);
                if (stillExists) {
                    console.warn('Resume still exists in KV after deletion attempt');
                    throw new Error('Resume data was not properly deleted from storage');
                }
                console.log('✓ Verified: Resume deleted from KV');
            } catch (verifyErr: any) {
                if (!verifyErr.message?.includes('not properly deleted')) {
                    console.warn('Could not verify deletion:', verifyErr);
                } else {
                    throw verifyErr;
                }
            }

            // Also delete HR review data
            try {
                await kv.delete(`resume-hr:${id}`);
                console.log('✓ Deleted resume-hr from KV');
            } catch (kvHrErr) {
                console.warn('Warning: Could not delete resume-hr from KV:', kvHrErr);
            }

            // Call parent component's onDelete callback to update UI
            if (onDelete) {
                await onDelete(id);
            }

            console.log('✓ Resume completely deleted:', id);
            setIsDeleting(false);
            alert('✅ Resume deleted successfully!');
        } catch (error) {
            console.error('Error deleting resume:', error);
            setIsDeleting(false);
            alert('❌ Failed to delete resume: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    };

    return (
        <div className="relative group">
            {/* Delete Button */}
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="absolute top-2 right-2 z-20 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete Resume"
            >
                {isDeleting ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                )}
            </button>

            <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
                <div className="resume-card-header">
                    <div className="flex flex-col gap-2">
                        {companyName && <h2 className="!text-black font-bold break-words">{companyName}</h2>}
                        {jobTitle && <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>}
                        {!companyName && !jobTitle && <h2 className="!text-black font-bold">Resume</h2>}
                    </div>
                    <div className="flex-shrink-0">
                        <ScoreCircle score={feedback.overallScore} />
                    </div>
                </div>
                {imageError ? (
                    <div className="gradient-border animate-in fade-in duration-1000">
                        <div className="w-full h-[350px] max-sm:h-[200px] bg-gray-100 flex items-center justify-center">
                            <div className="text-center text-gray-400">
                                <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-sm">Image not available</p>
                            </div>
                        </div>
                    </div>
                ) : resumeUrl ? (
                    <div className="gradient-border animate-in fade-in duration-1000">
                        <div className="w-full h-full">
                            <img
                                src={resumeUrl}
                                alt="resume"
                                className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="gradient-border animate-in fade-in duration-1000">
                        <div className="w-full h-[350px] max-sm:h-[200px] bg-gray-100 flex items-center justify-center">
                            <div className="text-center text-gray-400">
                                <svg className="w-16 h-16 mx-auto mb-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <p className="text-sm">Loading...</p>
                            </div>
                        </div>
                    </div>
                )}
            </Link>
        </div>
    )
}
export default ResumeCard
