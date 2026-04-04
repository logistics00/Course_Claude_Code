import { useState } from "react";
import { toast } from "sonner";
import {
  Pin,
  EyeOff,
  Eye,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { UserAvatar } from "~/components/user-avatar";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export type Comment = {
  id: number;
  lessonId: number;
  userId: number;
  content: string;
  isHidden: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  userName: string;
  userAvatarUrl: string | null;
};

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function CommentItem({
  comment,
  currentUserId,
  isInstructor,
  isAdmin,
  onUpdated,
}: {
  comment: Comment;
  currentUserId: number | null;
  isInstructor: boolean;
  isAdmin: boolean;
  onUpdated: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [saving, setSaving] = useState(false);

  const isOwner = currentUserId === comment.userId;
  const isModerator = isInstructor || isAdmin;

  async function handleEdit() {
    const trimmed = editContent.trim();
    if (!trimmed || trimmed.length > 2000) return;

    setSaving(true);
    try {
      const res = await fetch("/api/lesson-comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId: comment.id, content: trimmed }),
      });
      if (!res.ok) {
        toast.error("Failed to update comment");
        return;
      }
      setEditing(false);
      onUpdated();
      toast.success("Comment updated");
    } catch {
      toast.error("Failed to update comment");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this comment?")) return;

    try {
      const res = await fetch("/api/lesson-comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId: comment.id }),
      });
      if (!res.ok) {
        toast.error("Failed to delete comment");
        return;
      }
      onUpdated();
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  }

  async function handleModerate(action: "hide" | "unhide" | "pin" | "unpin") {
    try {
      const res = await fetch("/api/lesson-comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId: comment.id, action }),
      });
      if (!res.ok) {
        toast.error(`Failed to ${action} comment`);
        return;
      }
      onUpdated();
    } catch {
      toast.error(`Failed to ${action} comment`);
    }
  }

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        comment.isHidden && "border-dashed opacity-60"
      )}
    >
      <div className="mb-2 flex items-start gap-3">
        <UserAvatar
          name={comment.userName}
          avatarUrl={comment.userAvatarUrl}
          className="mt-0.5"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">{comment.userName}</span>
            <span className="text-xs text-muted-foreground">
              {relativeTime(comment.createdAt)}
            </span>
            {comment.isPinned && (
              <span className="flex items-center gap-1 text-xs text-amber-600">
                <Pin className="size-3" />
                Pinned
              </span>
            )}
            {comment.isHidden && isModerator && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <EyeOff className="size-3" />
                Hidden
              </span>
            )}
          </div>

          {editing ? (
            <div className="mt-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                maxLength={2000}
                rows={3}
                className="mb-2"
              />
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleEdit} disabled={saving || editContent.trim().length === 0}>
                  <Check className="mr-1 size-3" />
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditing(false);
                    setEditContent(comment.content);
                  }}
                >
                  <X className="mr-1 size-3" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-1 whitespace-pre-wrap text-sm">{comment.content}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      {!editing && (isOwner || isModerator) && (
        <div className="ml-11 mt-1 flex items-center gap-1">
          {isOwner && (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-xs"
                onClick={() => {
                  setEditContent(comment.content);
                  setEditing(true);
                }}
              >
                <Pencil className="mr-1 size-3" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="mr-1 size-3" />
                Delete
              </Button>
            </>
          )}
          {isModerator && (
            <>
              {!isOwner && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs"
                  onClick={() => {
                    setEditContent(comment.content);
                    setEditing(true);
                  }}
                >
                  <Pencil className="mr-1 size-3" />
                  Edit
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-xs"
                onClick={() =>
                  handleModerate(comment.isHidden ? "unhide" : "hide")
                }
              >
                {comment.isHidden ? (
                  <>
                    <Eye className="mr-1 size-3" />
                    Unhide
                  </>
                ) : (
                  <>
                    <EyeOff className="mr-1 size-3" />
                    Hide
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-xs"
                onClick={() =>
                  handleModerate(comment.isPinned ? "unpin" : "pin")
                }
              >
                <Pin className="mr-1 size-3" />
                {comment.isPinned ? "Unpin" : "Pin"}
              </Button>
              {!isOwner && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-1 size-3" />
                  Delete
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
