import Image from "next/image";

export default function Loading() {
  return (
    <main className="my-12 flex flex-col items-center gap-y-12 py-8 mx-2 sm:mx-6 lg:mx-16 xl:mx-28">
      <Image
        src={`/images/ds-animation.gif`}
        width={140}
        height={140}
        alt="DS animation"
        priority
      />
    </main>
  );
}
