import { eq, and, desc, asc, sql } from "drizzle-orm";
import { db } from "~/db";
import { lessonComments, users, lessons, modules } from "~/db/schema";

export function createComment(userId: number, lessonId: number, content: string) {
  return db
    .insert(lessonComments)
    .values({ userId, lessonId, content })
    .returning()
    .get();
}

export function getCommentById(commentId: number) {
  return db
    .select()
    .from(lessonComments)
    .where(eq(lessonComments.id, commentId))
    .get();
}

export function getCommentsByLessonId(lessonId: number, includeHidden: boolean) {
  const baseQuery = db
    .select({
      id: lessonComments.id,
      lessonId: lessonComments.lessonId,
      userId: lessonComments.userId,
      content: lessonComments.content,
      isHidden: lessonComments.isHidden,
      isPinned: lessonComments.isPinned,
      createdAt: lessonComments.createdAt,
      updatedAt: lessonComments.updatedAt,
      userName: users.name,
      userAvatarUrl: users.avatarUrl,
    })
    .from(lessonComments)
    .innerJoin(users, eq(lessonComments.userId, users.id))
    .where(
      includeHidden
        ? eq(lessonComments.lessonId, lessonId)
        : and(
            eq(lessonComments.lessonId, lessonId),
            eq(lessonComments.isHidden, false)
          )
    )
    .orderBy(desc(lessonComments.isPinned), asc(lessonComments.createdAt));

  return baseQuery.all();
}

export function updateComment(commentId: number, content: string) {
  return db
    .update(lessonComments)
    .set({ content, updatedAt: new Date().toISOString() })
    .where(eq(lessonComments.id, commentId))
    .returning()
    .get();
}

export function deleteComment(commentId: number) {
  return db
    .delete(lessonComments)
    .where(eq(lessonComments.id, commentId))
    .returning()
    .get();
}

export function toggleHidden(commentId: number, isHidden: boolean) {
  return db
    .update(lessonComments)
    .set({ isHidden, updatedAt: new Date().toISOString() })
    .where(eq(lessonComments.id, commentId))
    .returning()
    .get();
}

export function togglePinned(commentId: number, isPinned: boolean) {
  return db
    .update(lessonComments)
    .set({ isPinned, updatedAt: new Date().toISOString() })
    .where(eq(lessonComments.id, commentId))
    .returning()
    .get();
}

export function getCourseIdForLesson(lessonId: number) {
  const result = db
    .select({ courseId: modules.courseId })
    .from(lessons)
    .innerJoin(modules, eq(lessons.moduleId, modules.id))
    .where(eq(lessons.id, lessonId))
    .get();

  return result?.courseId ?? null;
}
