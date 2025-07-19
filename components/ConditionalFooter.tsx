"use client";
import { usePathname } from "next/navigation";

export default function ConditionalFooter() {
  const pathname = usePathname();
  const showFooter = pathname === "/" || pathname === "/dashboard";

  if (!showFooter) return null;

  return (
    <footer className="bg-orange-200 p-4 bg-opacity-10 border-t border-orange-500/50">
      <div className="mx-auto flex justify-center items-center text-center text-gray-700 font-bold">
        <p>
          Made with ❤️ by {" "}
          <a
            href="https://github.com/Prakhar-3009"
            target="_blank"
            rel="noopener noreferrer"
          >
            Prakhar
          </a>
        </p>
      </div>
    </footer>
  );
} 