import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";

const ENSRecordsAuthManager = () => {
  const { ready, authenticated, logout, login } = usePrivy();

  return (
  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
    <Button
      className="bg-[#9b87f5] hover:bg-[#8875e6] text-white w-full sm:w-auto sm:min-w-[8rem]"
      onClick={() => {
        login();
        setTimeout(() => {
          (
            document.querySelector(
              'input[type="email"]'
            ) as HTMLInputElement
          )?.focus();
        }, 150);
      }}
    >
      Get Started
    </Button>
  </div>
  );
};

export default ENSRecordsAuthManager;