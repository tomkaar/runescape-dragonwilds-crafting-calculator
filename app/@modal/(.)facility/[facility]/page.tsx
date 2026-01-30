import { Modal } from "@/components/Modal";
import Content from "./Content";

type Props = {
  params: Promise<{ facility: string }>;
};

export default async function FacilityPage(props: Props) {
  const { facility } = await props.params;

  return (
    <Modal>
      <Content facility={facility} />
    </Modal>
  );
}
