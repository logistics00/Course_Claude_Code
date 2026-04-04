import { data } from "react-router";
import { z } from "zod";
import type { Route } from "./+types/api.lesson-comments";
import { getCurrentUserId } from "~/lib/session";
import { isUserEnrolled } from "~/services/enrollmentService";
import {
  createComment,
  getCommentById,
  getCommentsByLessonId,
  updateComment,
  deleteComment,
  toggleHidden,
  togglePinned,
  getCourseIdForLesson,
} from "~/services/commentService";
import { getCourseById } from "~/services/courseService";
import { getUserById } from "~/services/userService";
import { UserRole } from "~/db/schema";
import { parseJsonBody } from "~/lib/validation";

const createCommentSchema = z.object({
  lessonId: z.number().int().positive(),
  content: z.string().trim().min(1).max(2000),
});

const updateCommentSchema = z.object({
  commentId: z.number().int().positive(),
  content: z.string().trim().min(1).max(2000),
});

const deleteCommentSchema = z.object({
  commentId: z.number().int().positive(),
});

const moderateCommentSchema = z.object({
  commentId: z.number().int().positive(),
  action: z.enum(["hide", "unhide", "pin", "unpin"]),
});

function isInstructorOrAdmin(
  currentUserId: number,
  courseInstructorId: number,
  userRole: string
) {
  return currentUserId === courseInstructorId || userRole === UserRole.Admin;
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const lessonId = Number(url.searchParams.get("lessonId"));
  const includeHidden = url.searchParams.get("includeHidden") === "true";

  if (!lessonId || isNaN(lessonId)) {
    throw data("lessonId is required", { status: 400 });
  }

  const comments = getCommentsByLessonId(lessonId, includeHidden);
  return { comments };
}

export async function action({ request }: Route.ActionArgs) {
  const currentUserId = await getCurrentUserId(request);
  if (!currentUserId) {
    throw data("Unauthorized", { status: 401 });
  }

  // POST — create comment
  if (request.method === "POST") {
    const parsed = await parseJsonBody(request, createCommentSchema);
    if (!parsed.success) {
      throw data("Invalid parameters", { status: 400 });
    }

    const { lessonId, content } = parsed.data;

    const courseId = getCourseIdForLesson(lessonId);
    if (!courseId) {
      throw data("Lesson not found", { status: 404 });
    }

    if (!isUserEnrolled(currentUserId, courseId)) {
      const course = getCourseById(courseId);
      const user = getUserById(currentUserId);
      if (!course || !user || !isInstructorOrAdmin(currentUserId, course.instructorId, user.role)) {
        throw data("You must be enrolled to comment", { status: 403 });
      }
    }

    const comment = createComment(currentUserId, lessonId, content);
    return { success: true, comment };
  }

  // PUT — edit comment (owner, instructor, or admin)
  if (request.method === "PUT") {
    const parsed = await parseJsonBody(request, updateCommentSchema);
    if (!parsed.success) {
      throw data("Invalid parameters", { status: 400 });
    }

    const { commentId, content } = parsed.data;

    const comment = getCommentById(commentId);
    if (!comment) {
      throw data("Comment not found", { status: 404 });
    }

    if (comment.userId !== currentUserId) {
      const courseId = getCourseIdForLesson(comment.lessonId);
      if (!courseId) {
        throw data("Lesson not found", { status: 404 });
      }
      const course = getCourseById(courseId);
      const user = getUserById(currentUserId);
      if (!course || !user || !isInstructorOrAdmin(currentUserId, course.instructorId, user.role)) {
        throw data("Not authorized to edit this comment", { status: 403 });
      }
    }

    const updated = updateComment(commentId, content);
    return { success: true, comment: updated };
  }

  // DELETE — delete comment
  if (request.method === "DELETE") {
    const parsed = await parseJsonBody(request, deleteCommentSchema);
    if (!parsed.success) {
      throw data("Invalid parameters", { status: 400 });
    }

    const { commentId } = parsed.data;

    const comment = getCommentById(commentId);
    if (!comment) {
      throw data("Comment not found", { status: 404 });
    }

    // Allow if owner, course instructor, or admin
    if (comment.userId !== currentUserId) {
      const courseId = getCourseIdForLesson(comment.lessonId);
      if (!courseId) {
        throw data("Lesson not found", { status: 404 });
      }
      const course = getCourseById(courseId);
      const user = getUserById(currentUserId);
      if (!course || !user || !isInstructorOrAdmin(currentUserId, course.instructorId, user.role)) {
        throw data("Not authorized to delete this comment", { status: 403 });
      }
    }

    deleteComment(commentId);
    return { success: true };
  }

  // PATCH — moderate (hide/unhide, pin/unpin)
  if (request.method === "PATCH") {
    const parsed = await parseJsonBody(request, moderateCommentSchema);
    if (!parsed.success) {
      throw data("Invalid parameters", { status: 400 });
    }

    const { commentId, action: moderateAction } = parsed.data;

    const comment = getCommentById(commentId);
    if (!comment) {
      throw data("Comment not found", { status: 404 });
    }

    const courseId = getCourseIdForLesson(comment.lessonId);
    if (!courseId) {
      throw data("Lesson not found", { status: 404 });
    }

    const course = getCourseById(courseId);
    const user = getUserById(currentUserId);
    if (!course || !user || !isInstructorOrAdmin(currentUserId, course.instructorId, user.role)) {
      throw data("Only instructors and admins can moderate comments", { status: 403 });
    }

    let updated;
    if (moderateAction === "hide") {
      updated = toggleHidden(commentId, true);
    } else if (moderateAction === "unhide") {
      updated = toggleHidden(commentId, false);
    } else if (moderateAction === "pin") {
      updated = togglePinned(commentId, true);
    } else {
      updated = togglePinned(commentId, false);
    }

    return { success: true, comment: updated };
  }

  throw data("Method not allowed", { status: 405 });
}
