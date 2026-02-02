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
      <Separator className="flex flex-row items-center justify-center bg-neutral-950 h-full px-1">
        <div className="h-12 w-1 bg-neutral-500 rounded-lg" />
      </Separator>
    );
  }

  return (
    <Separator className="flex flex-row items-center justify-center w-full bg-neutral-900 rounded-lg py-1">
      <div className="h-1 w-8 bg-neutral-500 rounded-lg" />
    </Separator>
  );
}
