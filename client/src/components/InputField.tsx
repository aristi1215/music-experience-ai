interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type: string;
  name: string;
  placeholder: string;
  value: string;
  isSurpriseMe?: boolean;
  handleSurpriseMe?: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField = ({
  label,
  type,
  name,
  placeholder,
  value,
  isSurpriseMe,
  handleSurpriseMe,
  handleChange,
}: Props) => {
  return (
    <div>
      <div className="flex flex-col items-center gap-2 mb-2">
        <label
          htmlFor={name}
          className="block text-xl font-medium text-white self-start"
        >
          {label}
        </label>
        {isSurpriseMe && (
          <button
            onClick={handleSurpriseMe}
            className="font-semibold text-xs bg-[#ECECF1] py-1 px-2 rounded-[5px] text-black cursor-pointer self-start"
          >
            Surprise Me
          </button>
        )}
      </div>

      <div className="h-[3rem] w-[20rem] bg-purple-900/10 0 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100 border-1 rounded-xl relative z-10">
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          id={name}
          typeof={type}
          onChange={handleChange}
          value={value}
          className=" border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-[#4649ff] focus:border-[#4649ff] outline-none block w-[20rem] p-3 border-2 absolute top-0 left-0 z-20 text-white"
        />
      </div>
    </div>
  );
};
