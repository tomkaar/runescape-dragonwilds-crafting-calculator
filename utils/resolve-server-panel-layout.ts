import "server-only";

import { cookies } from "next/headers";
import { Layout } from "react-resizable-panels";

/**
 * Will fetch the layout for a given panel from the cookies.
 * This is used to ensure that the server and client have the same
 * layout when rendering, which prevents hydration errors.
 * The layout is stored in a cookie with the id as the key,
 * and the value as a JSON string of the layout.
 */
export async function resolveServerPanelLayout(
  id: string,
): Promise<Layout | undefined> {
  const cookieStore = await cookies();
  const layoutString = cookieStore.get(id)?.value;
  return layoutString ? JSON.parse(layoutString) : undefined;
}
