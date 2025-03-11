
import React from "react";

const NewFeatureNotice = () => {
  return (
    <div className="flex items-center bg-[#1A1F2C]/80 backdrop-blur-sm rounded-full px-4 py-2 border border-[#353B4D]/30 mx-auto mb-6">
      <img 
        src="/lovable-uploads/81cb8a3c-8d8d-44cc-ae5f-8d995f1a3687.png" 
        alt="Basenames" 
        className="w-5 h-5 mr-2" 
      />
      <span className="text-white text-sm">
        Basenames support is live!
      </span>
    </div>
  );
};

export default NewFeatureNotice;
