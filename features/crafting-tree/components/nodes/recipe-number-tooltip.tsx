import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; 

type Props = {
  isRecipeNumberVariant: number;
}

export function RecipeNumberTooltip({ isRecipeNumberVariant }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="whitespace-nowrap rounded-lg px-2 py-0.5 bg-title text-[8px] text-black cursor-default">
            Recipe option {isRecipeNumberVariant}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          This item has multiple ways to be crafted.
          <br />
          This branch shows recipe option {isRecipeNumberVariant}.
          <br /> Only one recipe option needs to be completed.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}