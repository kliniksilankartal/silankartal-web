interface SectionTitleProps {
  title: string;
  subtitle?: string;
  badge?: string;
  centered?: boolean;
}

export default function SectionTitle({
  title,
  subtitle,
  badge,
  centered = true,
}: SectionTitleProps) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      {badge && (
        <span className="inline-block text-xs font-bold tracking-[0.2em] text-teal-700 uppercase mb-2">
          {badge}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto mt-3 leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className={`mt-4 h-0.5 w-12 bg-teal-600 ${centered ? 'mx-auto' : ''}`} />
    </div>
  );
}
