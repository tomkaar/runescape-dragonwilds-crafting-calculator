type Props = {
  numberOfRecipies: number;
};

export function RecipeCountBadge({ numberOfRecipies }: Props) {
  if (numberOfRecipies <= 1) return null;

  return (
    <div className="relative w-[calc(100%+2px)] -mb-px flex flex-row items-center justify-center text-xs text-black bg-title px-2 py-1 rounded-b-lg">
      {numberOfRecipies} recipes
    </div>
  );
}
