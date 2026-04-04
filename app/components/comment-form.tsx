import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";

const MAX_LENGTH = 2000;

export function CommentForm({
  lessonId,
  onCommentAdded,
}: {
  lessonId: number;
  onCommentAdded: (comment: any) => void;
}) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || trimmed.length > MAX_LENGTH) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/lesson-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, content: trimmed }),
      });

      if (!res.ok) {
        const text = await res.text();
        toast.error(text || "Failed to post comment");
        return;
      }

      const data = await res.json();
      setContent("");
      onCommentAdded(data.comment);
      toast.success("Comment posted");
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        maxLength={MAX_LENGTH}
        rows={3}
        className="mb-2"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {content.length}/{MAX_LENGTH}
        </span>
        <Button
          type="submit"
          size="sm"
          disabled={submitting || content.trim().length === 0}
        >
          {submitting ? "Posting..." : "Post Comment"}
        </Button>
      </div>
    </form>
  );
}
