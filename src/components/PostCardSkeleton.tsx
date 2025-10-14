import { Skeleton } from "@/components/ui/skeleton";

export function PostCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-soft">
      <Skeleton className="aspect-video w-full" />
      
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex gap-1.5">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>

        <Skeleton className="mb-2 h-6 w-full" />
        <Skeleton className="mb-1 h-6 w-3/4" />

        <Skeleton className="mb-3 mt-2 h-4 w-full" />
        <Skeleton className="mb-1 h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />

        <Skeleton className="mt-auto h-4 w-32" />
      </div>
    </div>
  );
}
