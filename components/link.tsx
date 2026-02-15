"use client";

import NextLink from "next/link";
import { forwardRef, useState } from "react";
import type { ComponentPropsWithoutRef, MouseEvent, TouchEvent } from "react";

type LinkProps = ComponentPropsWithoutRef<typeof NextLink>;

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { onMouseEnter, onTouchStart, prefetch, ...props },
  ref
) {
  const [shouldPrefetch, setShouldPrefetch] = useState(false);

  const handleMouseEnter = (event: MouseEvent<HTMLAnchorElement>) => {
    onMouseEnter?.(event);

    if (!event.defaultPrevented) {
      setShouldPrefetch(true);
    }
  };

  const handleTouchStart = (event: TouchEvent<HTMLAnchorElement>) => {
    onTouchStart?.(event);

    if (!event.defaultPrevented) {
      setShouldPrefetch(true);
    }
  };

  return (
    <NextLink
      {...props}
      prefetch={shouldPrefetch ? (prefetch ?? true) : false}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
      ref={ref}
    />
  );
});

Link.displayName = "Link";

export default Link;
