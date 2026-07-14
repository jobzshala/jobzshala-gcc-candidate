type SectionHeadingProps = {
  heading: string;
  highlight?: string;
  subheading?: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({ heading, highlight, subheading, align = "left", className = "" }: SectionHeadingProps) {
  return (
    <div className={`${align === "center" ? "text-center" : "text-left"} ${className}`}>
      <h2 className="font-serif text-3xl sm:text-4xl font-semibold leading-tight text-jz-white-50">
        {heading}
        {highlight ? (
          <>
            {" "}
            <span className="italic text-jz-yellow-400">{highlight}</span>
          </>
        ) : null}
      </h2>
      {subheading ? <p className="mt-3 max-w-2xl text-jz-white-400 text-base">{subheading}</p> : null}
    </div>
  );
}
