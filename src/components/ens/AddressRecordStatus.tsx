
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AddressRecordStatusProps {
  countdown?: number;
}

const AddressRecordStatus = ({ countdown }: AddressRecordStatusProps) => {
  if (countdown === undefined || countdown === 0) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
              Live
            </Badge>
          </TooltipTrigger>
          <TooltipContent 
            side="top" 
            sideOffset={5} 
            className="z-[9999] bg-[#2A2F3E]/90 text-[#8E9196] border-none"
          >
            <p className="whitespace-nowrap">This record is synchronized with L1</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="default" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
            <Clock className="w-3 h-3 mr-1" />
            {countdown}m
          </Badge>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          sideOffset={5}
          className="z-[9999] bg-[#2A2F3E]/90 text-[#8E9196] border-none"
        >
          <p className="whitespace-nowrap">Time until this record is synchronized with L1</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AddressRecordStatus;
