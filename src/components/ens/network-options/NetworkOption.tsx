
import { ArrowRight } from "lucide-react";

interface NetworkOptionProps {
  name: "optimism" | "base";
  title: string;
  description: string;
  imageSrc: string;
  isSelected: boolean;
  isPending: boolean;
  isProcessing: boolean;
  onClick: () => void;
}

const NetworkOption = ({
  name,
  title,
  description,
  imageSrc,
  isSelected,
  isPending,
  isProcessing,
  onClick,
}: NetworkOptionProps) => {
  const getBorderColor = () => {
    if (name === "optimism") {
      return isSelected ? "border-[#FF0420] bg-[#FF0420]/10" : "border-[#403E43] hover:border-[#FF0420] hover:bg-[#FF0420]/10";
    }
    return isSelected ? "border-[#0052FF] bg-[#0052FF]/10" : "border-[#403E43] hover:border-[#0052FF] hover:bg-[#0052FF]/10";
  };

  const getArrowColor = () => {
    return name === "optimism" ? "text-[#FF0420]" : "text-[#0052FF]";
  };

  return (
    <button
      onClick={onClick}
      disabled={isPending || isProcessing}
      className={`flex items-start space-x-4 p-6 rounded-lg border ${getBorderColor()} transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <img
        src={imageSrc}
        alt={title}
        className="w-12 h-12"
      />
      <div className="flex-1 text-left">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">{title}</span>
          <ArrowRight className={`w-5 h-5 transition-opacity ${getArrowColor()} ${
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`} />
        </div>
        <p className="text-sm text-gray-400 mt-1">
          {description}
        </p>
      </div>
    </button>
  );
};

export default NetworkOption;
