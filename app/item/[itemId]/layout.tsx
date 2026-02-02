import { SearchBox } from "@/components/SearchBox";
import { AnvilIcon, GithubIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout(props: Props) {
  return (
    <div className="h-screen flex flex-col">
      <div className="border-b border-neutral-800 flex flex-col md:flex-row gap-6 md:items-center w-full p-4">
        <Link href="/">
          <div className="flex flex-row gap-4 items-center">
            <div>
              <AnvilIcon />
            </div>
            <h1>
              Runescape: Dragonwilds
              <br />{" "}
              <span className="block -mt-1 text-xs">Crafting calculator</span>
            </h1>
          </div>
        </Link>
        <div className="grow">
          <div className="w-full md:max-w-80">
            <SearchBox />
          </div>
        </div>

        <div className="shrink-0 hidden md:block">
          <Link
            href="/"
            className="block border border-neutral-800 rounded-full p-1.5"
          >
            <GithubIcon size={20} />
          </Link>
        </div>
      </div>

      <div className="grow">{props.children}</div>
    </div>
  );
}
