export const ButtonDown = ({ scrollTo }: {scrollTo: () => void}) => {
  return (
    <button onClick={() => {
      scrollTo()
      }} className="hover:shadow-[0px_0px_38px_7px_rgba(68,48,140,0.75)] rounded-full p-5 transition-all transition-discrete bg-[rgba(68,48,140,0.2)] mt-3 cursor-pointer animate-bounce">
      <svg viewBox="0 0 100 100" className="w-8 h-8">
        <polyline
          points="10,10 50,90 90,10"
          fill="none"
          stroke="white"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
};
