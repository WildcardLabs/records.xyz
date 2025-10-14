import ENSRecordsManager from "@/components/ENSRecordsManager";
import { FileText, Replace, ChevronsRight } from "lucide-react";
import WalletStatus from "@/components/ens/WalletStatus";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileMenu from "@/components/MobileMenu";
import NewFeatureNotice from "@/components/ens/NewFeatureNotice";

const Index = () => {
  const isMobile = useIsMobile();
  
  const handleLogoClick = () => {
    window.location.reload();
  };
  
  return (
    <div className="min-h-screen flex flex-col stars-container relative">
      {/* Stars */}
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>

      {/* Header */}
      <header className="border-b border-[#353B4D]/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex justify-between items-center relative">
            {/* Left section with logo */}
            <div className="flex items-center -ml-2">
              <button 
                onClick={handleLogoClick}
                className="p-2 hover:opacity-80 transition-opacity"
              >
                <img 
                  src="/lovable-uploads/28193e56-2ecb-4f1d-88b9-9b88704698a0.png" 
                  alt="Records Logo" 
                  className="w-8 h-8"
                />
              </button>
            </div>
            
            {/* Center section with navigation */}
            <nav className="hidden md:flex items-center space-x-4 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <a 
                href="https://avatarsync.io" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8E9196] hover:text-white transition-colors px-3 py-2 rounded-lg text-sm font-medium flex items-center"
              >
                <Replace className="w-4 h-4 mr-2" />
                AvatarSync
              </a>
              <a 
                
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8E9196] hover:text-white transition-colors px-3 py-2 rounded-lg text-sm font-medium flex items-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                Docs
              </a>
              <a 
                href="https://ensredirect.xyz" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8E9196] hover:text-white transition-colors px-3 py-2 rounded-lg text-sm font-medium flex items-center"
              >
                <ChevronsRight className="w-4 h-4 mr-2" />
                Redirect
              </a>
            </nav>

            {/* Right section with wallet/mobile menu */}
            <div className="flex items-center">
              <div className="hidden md:block">
                <WalletStatus />
              </div>
              <div className="md:hidden">
                <MobileMenu />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center py-8 sm:py-16 relative z-10">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            {/* Basenames support notice */}
            <NewFeatureNotice />

            <div className="text-center max-w-2xl mx-auto px-4 sm:px-0 mb-6 sm:mb-10">
              <h1 className="text-2xl sm:text-4xl font-bold text-white">
                The Simple, <span className="text-[#9b87f5]">Cross-Chain</span> Records Manager for Everyone
              </h1>
              <p className="mt-4 text-sm sm:text-base text-gray-400 w-full sm:w-[60%] mx-auto">
                Take control, sync, and personalize your ENS profile like never before.
              </p>
            </div>
            <div className="flex flex-col gap-8 items-center w-full">
              <div className="w-full max-w-2xl mx-auto">
                <ENSRecordsManager />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#353B4D]/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-[#8E9196]">
              © 2025 records.xyz. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a 
                href="https://x.com/records_xyz" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-[#8E9196] hover:text-white transition-colors"
              >
                @records_xyz
              </a>
              <a 
                href="https://wildcardlabs.xyz" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-[#8E9196] hover:text-white transition-colors"
              >
                Wildcard Labs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
