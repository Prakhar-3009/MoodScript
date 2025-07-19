import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center space-y-6">
      <img
        src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnoxbnVrcmtsNTg5dzJ1MHprcXB6YXJ3dnh4em5oMWo1YndkeDR5eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/OZeWzZalgU5XNyHAqh/giphy.gif"
        alt="Lost in space"
        className="w-64 h-auto rounded-lg shadow-md"
      />
      <h1 className="text-5xl font-bold bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent m-0">
        404
      </h1>
      <h2 className="text-2xl font-semibold bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent m-0 p-0">
        Uh-oh! This page vanished into the void
      </h2>
      <p className="text-gray-600 max-w-xl m-0 p-0">
        Either the page doesn&apos;t exist... or aliens abducted it. 👽
      </p>
      <Link href="/">
        <Button variant="journal" className="mt-4">Take Me Home 🛸</Button>
      </Link>
    </div>
  );
}
