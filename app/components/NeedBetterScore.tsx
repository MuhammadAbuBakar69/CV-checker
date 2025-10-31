interface NeedBetterScoreProps {
  onEnhance: () => void;
}

const NeedBetterScore = ({ onEnhance }: NeedBetterScoreProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md w-full p-6 animate-in fade-in duration-1000 border-2 border-blue-100">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="text-5xl">🚀</div>
        <h3 className="text-2xl font-bold text-black">Need a Better Score?</h3>
        <p className="text-gray-600 text-lg">
          Use AI to improve your resume and boost your score.
        </p>
        <button
          onClick={onEnhance}
          className="primary-button mt-2 max-w-md hover:scale-105 transition-transform"
        >
          ✨ Enhance Resume with AI
        </button>
      </div>
    </div>
  );
};

export default NeedBetterScore;
