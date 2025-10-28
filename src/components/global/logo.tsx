import Image from "next/image";

interface LogoProps {
  className?: string;
  variant: "logo" | "logo-text";
}

const Logo = ({ className, variant }: LogoProps) => {
  return (
    <div className={` ${className} h-auto w-32 bg-[var(--bg-logo)] rounded `}>
      <Image
        src={`${variant === "logo" ? "/logo.png" : "/logo-1.png"}`}
        alt="main logo"
        width={1000}
        height={1000}
      />
    </div>
  );
};

export default Logo;
