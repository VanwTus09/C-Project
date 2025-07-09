import Image from "next/image";

export default function Navigation() {
  return (
    <aside className="h-screen bg-gray-300 border-r space-y-2 p-2 ">
      <Image
        src={"/Logoapp.webp"}
        alt="Logo"
        width={50}
        height={50}
        className="rounded-full bg-[]"
      />
    </aside>
  );
}
