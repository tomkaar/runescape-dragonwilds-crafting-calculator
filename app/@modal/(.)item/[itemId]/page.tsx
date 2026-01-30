import { Modal } from "@/components/Modal";
import Content from "./Content";
import { getRecipeByName } from "@/utils/getRecipeByName";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ itemId: string }>;
};

export default async function ItemPage(props: Props) {
  const { itemId } = await props.params;

  const materialName = decodeURI(itemId);
  const materialRecipe = getRecipeByName(materialName);

  if (!materialRecipe) {
    notFound();
  }

  return (
    <Modal>
      <Content materialName={materialName} />
    </Modal>
  );
}
