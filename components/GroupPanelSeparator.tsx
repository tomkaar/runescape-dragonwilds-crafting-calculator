import { Separator } from "react-resizable-panels";

type Props = {
  horizontal?: boolean;
};

/**
 * Extends the Separator component from react-resizable-panels to provide
 * a styled separator for grouping panels either horizontally or vertically.
 */
export function GroupPanelSeparator(props: Props) {
  const { horizontal = false } = props;

  if (horizontal) {
    return (
      <Separator className="relative flex flex-row items-center justify-center bg-neutral-700 h-full w-px">
        <div className="absolute h-12 w-0.5 bg-neutral-300 rounded-lg" />
      </Separator>
    );
  }

  return (
    <Separator className="relative flex flex-row items-center justify-center w-full bg-neutral-700 rounded-lg h-px">
      <div className="absolute h-0.5 w-8 bg-neutral-300 rounded-lg" />
    </Separator>
  );
}
