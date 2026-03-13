interface SectionHeaderProps {
  badge: string;
  title: string;
  subtitle: string;
}

const SectionHeader = ({ badge, title, subtitle }: SectionHeaderProps) => (
  <div className="text-center mb-12">
    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium font-body uppercase tracking-wider mb-4">
      {badge}
    </span>
    <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">{title}</h2>
    <p className="text-muted-foreground font-body max-w-xl mx-auto">{subtitle}</p>
  </div>
);

export default SectionHeader;
