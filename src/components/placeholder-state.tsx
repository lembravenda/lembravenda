import { EmptyState } from "@/components/ui";

type PlaceholderStateProps = {
  title: string;
  description: string;
};

export function PlaceholderState({
  title,
  description
}: PlaceholderStateProps) {
  return <EmptyState description={description} title={title} />;
}
