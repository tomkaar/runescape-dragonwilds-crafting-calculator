import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  quantity: number;
  quantityRecieved: number;
}

export function ExcessItemsTooltip({ quantityRecieved, quantity }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="whitespace-nowrap rounded-lg px-2 py-0.5 bg-blue-600 text-[8px] text-white cursor-default">
            {quantityRecieved - quantity} extra
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          After finishing this recipe you will <br />
          have {quantityRecieved - quantity} extra{" "}
          {quantityRecieved - quantity === 1 ? "item" : "items"} left
          over.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}