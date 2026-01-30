import { Modal } from "@/components/Modal";
import Content from "./RecipeContent";
import { notFound } from "next/navigation";
import { getRecipeByNameOrId } from "@/utils/getRecipeByNameOrID";
import { getItemByNameOrId } from "@/utils/getItemByNameOrId";

type Props = {
  params: Promise<{ itemId: string }>;
};

export default async function ItemPage(props: Props) {
  const { itemId } = await props.params;

  const materialName = decodeURI(itemId);

  const materialRecipe = getRecipeByNameOrId(materialName);
  const item = !materialRecipe ? getItemByNameOrId(materialName) : null;

  if (!materialRecipe && !item) {
    notFound();
  }

  return (
    <Modal>
      {materialRecipe && <Content materialName={materialName} />}
      {item && <div>Item is: {item.page_name}</div>}
    </Modal>
  );
}
