import { describe, it, expect, beforeEach, vi } from "vitest";
import { createTestDb, seedBaseData } from "~/test/setup";
import * as schema from "~/db/schema";

let testDb: ReturnType<typeof createTestDb>;
let base: ReturnType<typeof seedBaseData>;

vi.mock("~/db", () => ({
  get db() {
    return testDb;
  },
}));

import {
  toggleBookmark,
  isLessonBookmarked,
  getBookmarkedLessonIds,
} from "./bookmarkService";

function seedModuleAndLessons(
  testDb: ReturnType<typeof createTestDb>,
  courseId: number
) {
  const mod = testDb
    .insert(schema.modules)
    .values({ courseId, title: "Module 1", position: 1 })
    .returning()
    .get();

  const lesson1 = testDb
    .insert(schema.lessons)
    .values({ moduleId: mod.id, title: "Lesson 1", position: 1 })
    .returning()
    .get();

  const lesson2 = testDb
    .insert(schema.lessons)
    .values({ moduleId: mod.id, title: "Lesson 2", position: 2 })
    .returning()
    .get();

  return { mod, lesson1, lesson2 };
}

describe("bookmarkService", () => {
  let mod: ReturnType<typeof seedModuleAndLessons>["mod"];
  let lesson1: ReturnType<typeof seedModuleAndLessons>["lesson1"];
  let lesson2: ReturnType<typeof seedModuleAndLessons>["lesson2"];

  beforeEach(() => {
    testDb = createTestDb();
    base = seedBaseData(testDb);
    ({ mod, lesson1, lesson2 } = seedModuleAndLessons(testDb, base.course.id));
  });

  describe("toggleBookmark", () => {
    it("creates a bookmark when none exists", () => {
      const result = toggleBookmark({
        userId: base.user.id,
        lessonId: lesson1.id,
      });

      expect(result.bookmarked).toBe(true);
      expect(
        isLessonBookmarked({ userId: base.user.id, lessonId: lesson1.id })
      ).toBe(true);
    });

    it("removes a bookmark when one exists", () => {
      toggleBookmark({ userId: base.user.id, lessonId: lesson1.id });
      const result = toggleBookmark({
        userId: base.user.id,
        lessonId: lesson1.id,
      });

      expect(result.bookmarked).toBe(false);
      expect(
        isLessonBookmarked({ userId: base.user.id, lessonId: lesson1.id })
      ).toBe(false);
    });

    it("toggles back to bookmarked after unbookmarking", () => {
      toggleBookmark({ userId: base.user.id, lessonId: lesson1.id });
      toggleBookmark({ userId: base.user.id, lessonId: lesson1.id });
      const result = toggleBookmark({
        userId: base.user.id,
        lessonId: lesson1.id,
      });

      expect(result.bookmarked).toBe(true);
    });
  });

  describe("isLessonBookmarked", () => {
    it("returns false when no bookmark exists", () => {
      expect(
        isLessonBookmarked({ userId: base.user.id, lessonId: lesson1.id })
      ).toBe(false);
    });

    it("returns true when bookmark exists", () => {
      toggleBookmark({ userId: base.user.id, lessonId: lesson1.id });

      expect(
        isLessonBookmarked({ userId: base.user.id, lessonId: lesson1.id })
      ).toBe(true);
    });

    it("is scoped to the specific user", () => {
      toggleBookmark({ userId: base.user.id, lessonId: lesson1.id });

      expect(
        isLessonBookmarked({
          userId: base.instructor.id,
          lessonId: lesson1.id,
        })
      ).toBe(false);
    });
  });

  describe("getBookmarkedLessonIds", () => {
    it("returns empty array when no bookmarks exist", () => {
      const ids = getBookmarkedLessonIds({
        userId: base.user.id,
        courseId: base.course.id,
      });

      expect(ids).toEqual([]);
    });

    it("returns bookmarked lesson IDs for a course", () => {
      toggleBookmark({ userId: base.user.id, lessonId: lesson1.id });
      toggleBookmark({ userId: base.user.id, lessonId: lesson2.id });

      const ids = getBookmarkedLessonIds({
        userId: base.user.id,
        courseId: base.course.id,
      });

      expect(ids).toHaveLength(2);
      expect(ids).toContain(lesson1.id);
      expect(ids).toContain(lesson2.id);
    });

    it("excludes bookmarks from other courses", () => {
      const otherCourse = testDb
        .insert(schema.courses)
        .values({
          title: "Other Course",
          slug: "other-course",
          description: "Another course",
          instructorId: base.instructor.id,
          categoryId: base.category.id,
          status: schema.CourseStatus.Published,
        })
        .returning()
        .get();

      const otherMod = testDb
        .insert(schema.modules)
        .values({ courseId: otherCourse.id, title: "Other Module", position: 1 })
        .returning()
        .get();

      const otherLesson = testDb
        .insert(schema.lessons)
        .values({ moduleId: otherMod.id, title: "Other Lesson", position: 1 })
        .returning()
        .get();

      toggleBookmark({ userId: base.user.id, lessonId: lesson1.id });
      toggleBookmark({ userId: base.user.id, lessonId: otherLesson.id });

      const ids = getBookmarkedLessonIds({
        userId: base.user.id,
        courseId: base.course.id,
      });

      expect(ids).toEqual([lesson1.id]);
    });

    it("excludes bookmarks from other users", () => {
      toggleBookmark({ userId: base.user.id, lessonId: lesson1.id });
      toggleBookmark({ userId: base.instructor.id, lessonId: lesson2.id });

      const ids = getBookmarkedLessonIds({
        userId: base.user.id,
        courseId: base.course.id,
      });

      expect(ids).toEqual([lesson1.id]);
    });
  });
});
