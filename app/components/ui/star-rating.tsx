import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "~/lib/utils";

interface StarRatingDisplayProps {
  average: number;
  count: number;
  size?: "sm" | "md";
}

export function StarRatingDisplay({
  average,
  count,
  size = "sm",
}: StarRatingDisplayProps) {
  const starSize = size === "sm" ? "size-4" : "size-5";

  if (count === 0) {
    return (
      <div className="flex items-center gap-1 text-muted-foreground">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(starSize, "text-muted-foreground/30")}
            />
          ))}
        </div>
        <span className={cn("text-muted-foreground", size === "sm" ? "text-xs" : "text-sm")}>
          No ratings
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < Math.floor(average);
          const partial = !filled && i < average;
          const fraction = partial ? average - Math.floor(average) : 0;
          if (partial) {
            return (
              <span key={i} className="relative">
                <Star className={cn(starSize, "text-muted-foreground/30")} />
                <Star
                  className={cn(starSize, "absolute inset-0 fill-amber-400 text-amber-400")}
                  style={{ clipPath: `inset(0 ${(1 - fraction) * 100}% 0 0)` }}
                />
              </span>
            );
          }
          return (
            <Star
              key={i}
              className={cn(
                starSize,
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/30"
              )}
            />
          );
        })}
      </div>
      <span className={cn("text-muted-foreground", size === "sm" ? "text-xs" : "text-sm")}>
        {average.toFixed(1)} ({count})
      </span>
    </div>
  );
}

interface StarRatingInteractiveProps {
  courseId: number;
  currentRating: number | null;
  onRated?: (average: number, count: number, rating: number | null) => void;
}

export function StarRatingInteractive({
  courseId,
  currentRating,
  onRated,
}: StarRatingInteractiveProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [rating, setRating] = useState(currentRating);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayRating = hoveredStar ?? rating ?? 0;

  async function handleClick(star: number) {
    if (isSubmitting) return;

    if (star === rating) {
      return handleDelete();
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/rate-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, rating: star }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to submit rating");
      }

      const result = await response.json();
      setRating(star);
      toast.success(`You rated this course ${star} star${star !== 1 ? "s" : ""}`);
      onRated?.(result.average, result.count, star);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit rating"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/rate-course", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to remove rating");
      }

      const result = await response.json();
      setRating(null);
      toast.success("Your rating has been removed");
      onRated?.(result.average, result.count, null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove rating"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Your rating:</span>
      <div
        className="flex"
        onMouseLeave={() => setHoveredStar(null)}
      >
        {Array.from({ length: 5 }).map((_, i) => {
          const star = i + 1;
          const filled = star <= displayRating;
          return (
            <button
              key={i}
              type="button"
              disabled={isSubmitting}
              className={cn(
                "p-0.5 transition-transform hover:scale-110 disabled:opacity-50",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              )}
              onMouseEnter={() => setHoveredStar(star)}
              onClick={() => handleClick(star)}
              aria-label={star === rating ? `Remove your ${star}-star rating` : `Rate ${star} star${star !== 1 ? "s" : ""}`}
            >
              <Star
                className={cn(
                  "size-6",
                  filled
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/40"
                )}
              />
            </button>
          );
        })}
      </div>
      {rating !== null && (
        <>
          <span className="text-sm font-medium text-amber-600">
            {rating}/5
          </span>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleDelete}
            className="text-xs text-muted-foreground hover:text-destructive disabled:opacity-50 transition-colors"
            title="Remove your rating"
          >
            Remove
          </button>
        </>
      )}
    </div>
  );
}
