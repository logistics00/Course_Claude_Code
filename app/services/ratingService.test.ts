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
  upsertRating,
  getRating,
  getAverageRating,
  getAverageRatings,
  deleteRating,
} from "./ratingService";

describe("ratingService", () => {
  beforeEach(() => {
    testDb = createTestDb();
    base = seedBaseData(testDb);
  });

  describe("upsertRating", () => {
    it("creates a new rating", () => {
      const rating = upsertRating(base.user.id, base.course.id, 4);

      expect(rating).toBeDefined();
      expect(rating.userId).toBe(base.user.id);
      expect(rating.courseId).toBe(base.course.id);
      expect(rating.rating).toBe(4);
    });

    it("updates an existing rating", () => {
      upsertRating(base.user.id, base.course.id, 3);
      const updated = upsertRating(base.user.id, base.course.id, 5);

      expect(updated.rating).toBe(5);

      const found = getRating(base.user.id, base.course.id);
      expect(found?.rating).toBe(5);
    });

    it("rejects ratings below 1", () => {
      expect(() => upsertRating(base.user.id, base.course.id, 0)).toThrow(
        "Rating must be an integer between 1 and 5"
      );
    });

    it("rejects ratings above 5", () => {
      expect(() => upsertRating(base.user.id, base.course.id, 6)).toThrow(
        "Rating must be an integer between 1 and 5"
      );
    });

    it("rejects non-integer ratings", () => {
      expect(() => upsertRating(base.user.id, base.course.id, 3.5)).toThrow(
        "Rating must be an integer between 1 and 5"
      );
    });
  });

  describe("getRating", () => {
    it("returns the rating for a user and course", () => {
      upsertRating(base.user.id, base.course.id, 4);

      const found = getRating(base.user.id, base.course.id);
      expect(found).toBeDefined();
      expect(found!.rating).toBe(4);
    });

    it("returns undefined when no rating exists", () => {
      const found = getRating(base.user.id, base.course.id);
      expect(found).toBeUndefined();
    });
  });

  describe("getAverageRating", () => {
    it("returns average and count for multiple ratings", () => {
      const student2 = testDb
        .insert(schema.users)
        .values({
          name: "Student 2",
          email: "student2@example.com",
          role: schema.UserRole.Student,
        })
        .returning()
        .get();

      const student3 = testDb
        .insert(schema.users)
        .values({
          name: "Student 3",
          email: "student3@example.com",
          role: schema.UserRole.Student,
        })
        .returning()
        .get();

      upsertRating(base.user.id, base.course.id, 4);
      upsertRating(student2.id, base.course.id, 5);
      upsertRating(student3.id, base.course.id, 3);

      const result = getAverageRating(base.course.id);
      expect(result.average).toBe(4);
      expect(result.count).toBe(3);
    });

    it("returns zero average and count for unrated course", () => {
      const result = getAverageRating(base.course.id);
      expect(result.average).toBe(0);
      expect(result.count).toBe(0);
    });
  });

  describe("getAverageRatings", () => {
    it("returns averages for multiple courses", () => {
      const course2 = testDb
        .insert(schema.courses)
        .values({
          title: "Course 2",
          slug: "course-2",
          description: "Another course",
          instructorId: base.instructor.id,
          categoryId: base.category.id,
          status: schema.CourseStatus.Published,
        })
        .returning()
        .get();

      upsertRating(base.user.id, base.course.id, 4);
      upsertRating(base.user.id, course2.id, 2);

      const map = getAverageRatings([base.course.id, course2.id]);
      expect(map.get(base.course.id)).toEqual({ average: 4, count: 1 });
      expect(map.get(course2.id)).toEqual({ average: 2, count: 1 });
    });

    it("returns empty map for empty input", () => {
      const map = getAverageRatings([]);
      expect(map.size).toBe(0);
    });

    it("omits courses with no ratings", () => {
      upsertRating(base.user.id, base.course.id, 5);
      const map = getAverageRatings([base.course.id, 9999]);
      expect(map.has(base.course.id)).toBe(true);
      expect(map.has(9999)).toBe(false);
    });
  });

  describe("deleteRating", () => {
    it("removes an existing rating", () => {
      upsertRating(base.user.id, base.course.id, 4);
      deleteRating(base.user.id, base.course.id);

      const found = getRating(base.user.id, base.course.id);
      expect(found).toBeUndefined();
    });
  });
});
