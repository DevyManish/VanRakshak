import Image from "next/image";
import { Button } from "@/components/ui/button"
import { Hero5 } from "@/components/hero";

export default function Home() {
  return (
    <div className="container w-full mx-auto px-18">
      <div className="flex flex-col md:flex-row w-full items-center justify-center md:px-20">
        <div className="w-full md:w-2/3">
          <Hero5 />
        </div>
        <div className="md:w-1/3">
          <div className="grid grid-cols-2 gap-8">
            <Image
              src="/plants.jpg"
              alt="Image"
              width="1920"
              height="1080"
              className="rounded-md aspect-square"
            />
            <Image
              src="/animal.jpg"
              alt="Image"
              width="1920"
              height="1080"
              className="rounded-md row-span-2 object-cover h-full"
            />
            <Image
              src="/forest.jpg"
              alt="Image"
              width="1920"
              height="1080"
              className="rounded-md aspect-square"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
