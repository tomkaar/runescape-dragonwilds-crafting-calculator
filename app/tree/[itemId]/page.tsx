import "@xyflow/react/dist/style.css";

import Content from "./Context";
import { notFound } from "next/navigation";
import { getRecipeById } from "@/utils/getRecipeById";

type Props = {
  params: Promise<{ itemId: string }>;
};

export default async function Page(props: Props) {
  const { itemId } = await props.params;
  const materialRecipe = getRecipeById(decodeURI(itemId));

  if (!materialRecipe) {
    notFound();
  }

  return <Content materialName={decodeURI(itemId)} />;
}
