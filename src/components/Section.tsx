interface SectionProps {
  title: string;
  children: React.ReactNode;
  moreHref?: string;
}

export default function Section({ title, children, moreHref }: SectionProps) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold hover:underline cursor-pointer">
          {title}
        </h2>
        {moreHref && (
          <a 
            href={moreHref}
            className="text-sm font-bold text-gray-400 hover:text-white"
          >
            显示全部
          </a>
        )}
      </div>
      {children}
    </section>
  );
} 