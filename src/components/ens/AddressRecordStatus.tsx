
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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
              Live
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>This record is synchronized with L1</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="default" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
            <Clock className="w-3 h-3 mr-1" />
            {countdown}m
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Time until this record is synchronized with L1</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AddressRecordStatus;
