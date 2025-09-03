import Image from "next/image";

export default function Loading() {
  return (
      <div className="flex justify-center items-center min-h-[500px]">
        <Image
          src={`/animation/ds-animation.gif`}
          width={140}
          height={140}
          alt="DS animation"
          priority
        />
      </div>
  );
}
