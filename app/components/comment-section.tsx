import { useState, useCallback } from "react";
import { MessageSquare } from "lucide-react";
import { CommentForm } from "~/components/comment-form";
import { CommentItem, type Comment } from "~/components/comment-item";

export function CommentSection({
  lessonId,
  courseId,
  currentUserId,
  isInstructor,
  isAdmin,
  enrolled,
  initialComments,
}: {
  lessonId: number;
  courseId: number;
  currentUserId: number | null;
  isInstructor: boolean;
  isAdmin: boolean;
  enrolled: boolean;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  const refreshComments = useCallback(async () => {
    try {
      const includeHidden = isInstructor || isAdmin;
      const res = await fetch(
        `/api/lesson-comments?lessonId=${lessonId}&includeHidden=${includeHidden}`
      );
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
      }
    } catch {
      // Silently fail — comments remain in current state
    }
  }, [lessonId, isInstructor, isAdmin]);

  function handleCommentAdded(comment: any) {
    // Optimistically add the new comment to the list with user info
    // We don't have userName/userAvatarUrl from the API response,
    // so we refresh the full list instead
    refreshComments();
  }

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-2">
        <MessageSquare className="size-5" />
        <h2 className="text-xl font-semibold">
          Comments ({comments.length})
        </h2>
      </div>

      {(enrolled || isInstructor || isAdmin) && currentUserId ? (
        <CommentForm lessonId={lessonId} onCommentAdded={handleCommentAdded} />
      ) : (
        !currentUserId ? null : (
          !isInstructor && !isAdmin ? (
            <p className="mb-4 text-sm text-muted-foreground">
              Enroll to join the discussion.
            </p>
          ) : null
        )
      )}

      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              isInstructor={isInstructor}
              isAdmin={isAdmin}
              onUpdated={refreshComments}
            />
          ))}
        </div>
      )}
    </div>
  );
}
