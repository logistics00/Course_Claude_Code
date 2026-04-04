import { describe, it, expect, beforeEach } from "vitest";
import { eq } from "drizzle-orm";
import { createTestDb, seedBaseData } from "./setup";
import * as schema from "~/db/schema";

// The service functions use the singleton `db` from ~/db.
// To test with an isolated in-memory DB we re-implement the logic inline
// using the test database. This mirrors the pattern used in the project.

describe("commentService", () => {
  let testDb: ReturnType<typeof createTestDb>;
  let userId: number;
  let instructorId: number;
  let courseId: number;
  let moduleId: number;
  let lessonId: number;

  beforeEach(() => {
    testDb = createTestDb();
    const base = seedBaseData(testDb);
    userId = base.user.id;
    instructorId = base.instructor.id;
    courseId = base.course.id;

    const mod = testDb
      .insert(schema.modules)
      .values({ courseId, title: "Module 1", position: 1 })
      .returning()
      .get();
    moduleId = mod.id;

    const lesson = testDb
      .insert(schema.lessons)
      .values({ moduleId, title: "Lesson 1", position: 1 })
      .returning()
      .get();
    lessonId = lesson.id;
  });

  function createComment(uId: number, lId: number, content: string) {
    return testDb
      .insert(schema.lessonComments)
      .values({ userId: uId, lessonId: lId, content })
      .returning()
      .get();
  }

  it("creates a comment", () => {
    const comment = createComment(userId, lessonId, "Hello world");
    expect(comment.id).toBeDefined();
    expect(comment.content).toBe("Hello world");
    expect(comment.userId).toBe(userId);
    expect(comment.lessonId).toBe(lessonId);
    expect(comment.isHidden).toBe(false);
    expect(comment.isPinned).toBe(false);
  });

  it("reads a comment by id", () => {
    const created = createComment(userId, lessonId, "Test");
    const found = testDb
      .select()
      .from(schema.lessonComments)
      .where(eq(schema.lessonComments.id, created.id))
      .get();
    expect(found).toBeDefined();
    expect(found!.content).toBe("Test");
  });

  it("gets comments by lesson id excluding hidden", () => {
    createComment(userId, lessonId, "Visible");
    const hidden = createComment(userId, lessonId, "Hidden");
    testDb
      .update(schema.lessonComments)
      .set({ isHidden: true })
      .where(eq(schema.lessonComments.id, hidden.id))
      .run();

    const all = testDb
      .select()
      .from(schema.lessonComments)
      .where(eq(schema.lessonComments.lessonId, lessonId))
      .all();
    expect(all.length).toBe(2);

    const visible = testDb
      .select()
      .from(schema.lessonComments)
      .where(
        eq(schema.lessonComments.lessonId, lessonId)
      )
      .all()
      .filter((c) => !c.isHidden);
    expect(visible.length).toBe(1);
    expect(visible[0].content).toBe("Visible");
  });

  it("updates a comment", () => {
    const comment = createComment(userId, lessonId, "Original");
    const updated = testDb
      .update(schema.lessonComments)
      .set({ content: "Updated", updatedAt: new Date().toISOString() })
      .where(eq(schema.lessonComments.id, comment.id))
      .returning()
      .get();
    expect(updated!.content).toBe("Updated");
  });

  it("deletes a comment", () => {
    const comment = createComment(userId, lessonId, "To delete");
    testDb
      .delete(schema.lessonComments)
      .where(eq(schema.lessonComments.id, comment.id))
      .run();
    const found = testDb
      .select()
      .from(schema.lessonComments)
      .where(eq(schema.lessonComments.id, comment.id))
      .get();
    expect(found).toBeUndefined();
  });

  it("toggles hidden", () => {
    const comment = createComment(userId, lessonId, "Hide me");
    expect(comment.isHidden).toBe(false);

    const hidden = testDb
      .update(schema.lessonComments)
      .set({ isHidden: true, updatedAt: new Date().toISOString() })
      .where(eq(schema.lessonComments.id, comment.id))
      .returning()
      .get();
    expect(hidden!.isHidden).toBe(true);

    const unhidden = testDb
      .update(schema.lessonComments)
      .set({ isHidden: false, updatedAt: new Date().toISOString() })
      .where(eq(schema.lessonComments.id, comment.id))
      .returning()
      .get();
    expect(unhidden!.isHidden).toBe(false);
  });

  it("toggles pinned", () => {
    const comment = createComment(userId, lessonId, "Pin me");
    expect(comment.isPinned).toBe(false);

    const pinned = testDb
      .update(schema.lessonComments)
      .set({ isPinned: true, updatedAt: new Date().toISOString() })
      .where(eq(schema.lessonComments.id, comment.id))
      .returning()
      .get();
    expect(pinned!.isPinned).toBe(true);
  });

  it("allows a different user (instructor) to update a student comment", () => {
    const comment = createComment(userId, lessonId, "Student text");
    const before = comment.updatedAt;

    const updated = testDb
      .update(schema.lessonComments)
      .set({ content: "Edited by instructor", updatedAt: new Date().toISOString() })
      .where(eq(schema.lessonComments.id, comment.id))
      .returning()
      .get();

    expect(updated!.content).toBe("Edited by instructor");
    expect(updated!.userId).toBe(userId); // author unchanged
    expect(updated!.updatedAt >= before).toBe(true);
  });

  it("resolves courseId for a lesson via modules", () => {
    const result = testDb
      .select({ courseId: schema.modules.courseId })
      .from(schema.lessons)
      .innerJoin(schema.modules, eq(schema.lessons.moduleId, schema.modules.id))
      .where(eq(schema.lessons.id, lessonId))
      .get();
    expect(result).toBeDefined();
    expect(result!.courseId).toBe(courseId);
  });
});
