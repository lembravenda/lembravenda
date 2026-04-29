type PlaceholderStateProps = {
  title: string;
  description: string;
};

export function PlaceholderState({
  title,
  description
}: PlaceholderStateProps) {
  return (
    <section className="rounded-lg border border-border bg-white p-5 shadow-soft">
      <p className="text-sm font-semibold text-primary">Acompanhe por aqui</p>
      <h2 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
    </section>
  );
}
