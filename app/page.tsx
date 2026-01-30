import RequiredFacilities from "@/components/RequiredFacilities";
import RequiredMaterials from "@/components/RequiredMaterials/RequiredMaterials";
import SelectedRecipes from "@/components/SelectedRecipes";
import SelectRecipe from "@/components/SelectRecipe";
import ShoppingCart from "@/components/ShoppingCart";

export default function Home() {
  return (
    <div className="">
      <main className="flex flex-row gap-8">
        <div className="w-92 overflow-scroll h-screen relative pb-16">
          <div className="flex flex-col gap-2 sticky top-0 bg-background z-10 p-4">
            <h2 className="text-xl font-bold mb-3">Find recipes</h2>
            <SelectRecipe />
          </div>

          <div className="mt-4 flex flex-col gap-2 p-4">
            <h2 className="text-xl font-bold mb-3">Selected recipes</h2>
            <SelectedRecipes />
          </div>
        </div>

        <div className="grow p-4 overflow-scroll h-screen">
          <div className="flex flex-col gap-8">
            <RequiredFacilities />

            <div className="flex flex-row gap-4">
              <RequiredMaterials />
              <ShoppingCart />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
