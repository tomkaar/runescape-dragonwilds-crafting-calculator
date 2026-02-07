import { useEffect, useState } from "react";

export function useScreenWidth(largerThan: number) {
  const [isLarger, setIsLarger] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.innerWidth > largerThan;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsLarger(window.innerWidth > largerThan);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [largerThan]);

  return isLarger;
}
