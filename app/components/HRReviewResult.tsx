import type { HRReview } from "~/types";

const ProgressBar = ({ score }: { score: number }) => {
    const color = score > 70 ? 'bg-green-600' : score > 49 ? 'bg-yellow-600' : 'bg-red-600';
    
    return (
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
                className={`h-full ${color} transition-all duration-1000 ease-out`}
                style={{ width: `${score}%` }}
            />
        </div>
    );
};

const HRReviewResult = ({ review }: { review: HRReview }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md w-full p-6 animate-in fade-in duration-1000">
            <h2 className="text-3xl font-bold mb-6 text-black">AI Resume Review</h2>
            
            {/* Overall Suitability */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🧠</span>
                    <h3 className="text-xl font-semibold text-black">Overall Suitability</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.overallSuitability}</p>
            </div>

            {/* Skill Alignment */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🧩</span>
                    <h3 className="text-xl font-semibold text-black">Skill Alignment</h3>
                </div>
                
                {review.skillAlignment.matchedSkills.length > 0 && (
                    <div className="mb-3">
                        <p className="text-sm font-semibold text-green-700 mb-2">✓ Matched Skills:</p>
                        <div className="flex flex-wrap gap-2">
                            {review.skillAlignment.matchedSkills.map((skill, idx) => (
                                <span 
                                    key={idx} 
                                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                
                {review.skillAlignment.missingSkills.length > 0 && (
                    <div>
                        <p className="text-sm font-semibold text-red-700 mb-2">✗ Missing Skills:</p>
                        <div className="flex flex-wrap gap-2">
                            {review.skillAlignment.missingSkills.map((skill, idx) => (
                                <span 
                                    key={idx} 
                                    className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Experience Review */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">💼</span>
                    <h3 className="text-xl font-semibold text-black">Experience Review</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.experienceReview}</p>
            </div>

            {/* Suggestions */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">✍️</span>
                    <h3 className="text-xl font-semibold text-black">Suggestions for Improvement</h3>
                </div>
                <ul className="space-y-2">
                    {review.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span className="text-gray-700">{suggestion}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Role Fit Score */}
            <div className="mb-2">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">⭐</span>
                    <h3 className="text-xl font-semibold text-black">Role Fit Score</h3>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-black">{review.roleFitScore}/100</span>
                    <div className="flex-1">
                        <ProgressBar score={review.roleFitScore} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HRReviewResult;
