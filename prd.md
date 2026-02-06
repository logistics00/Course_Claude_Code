# PRD: Ralph Cohort Course Platform

## Problem Statement

Instructors and students of the Ralph Cohort (a 6-day AI coding course) need a realistic, architecturally complex ~20k line TypeScript codebase to practice AI coding agent techniques. The codebase must be a functional course platform with rich business logic, interactive UI, deliberate architectural conventions, intentional code quality issues, and strategic test gaps — all designed to create teaching scenarios for AI agent exercises.

## Solution

Build a full-featured online course platform where instructors create courses with modules, lessons (rich text + YouTube video), and quizzes; students enroll, watch content, track progress, and take quizzes; and admins manage users and courses. The platform uses a floating DevUI overlay for user switching (no real auth), seeds realistic data, and bakes in deliberate "warts" — TypeScript enums everywhere, positional function parameters, and a legacy quiz-scoring module written by a fictional external contractor — that serve as exercise material for the cohort.

## User Stories

### Platform Setup & DevUI

1. As a developer, I want to run `pnpm install && pnpm db:seed && pnpm dev` and have the app fully working with zero environment variables, so that setup is frictionless.
2. As a developer, I want a floating DevUI panel overlaying the app, so I can switch between seeded users without a login flow.
3. As a developer, I want the DevUI to show a dropdown of all seeded users with their name and role, so I can quickly find the user I want.
4. As a developer, I want user switching to set a session cookie, so the selected user persists across page refreshes.
5. As a developer, I want the DevUI panel to show which user is currently active and their role, so I always know who I'm impersonating.
6. As a developer, I want the DevUI to be draggable or minimizable, so it doesn't permanently obstruct app content.

### Course Catalog (Student)

7. As a student, I want to browse a catalog of all published courses, so I can find something to learn.
8. As a student, I want to search courses by title and description, so I can quickly find specific topics.
9. As a student, I want to filter courses by category, so I can narrow down to my area of interest.
10. As a student, I want course cards showing title, instructor name, category, lesson count, and cover image, so I can evaluate courses at a glance.
11. As a student, I want to click a course card to navigate to the full course detail page, so I can learn more before enrolling.

### Course Detail Page (Student)

12. As a student, I want to see the full course description and instructor info on the detail page, so I can decide whether to enroll.
13. As a student, I want to see the module and lesson structure laid out on the detail page, so I understand the course scope.
14. As a student, I want to enroll in a course with a single click from the detail page, so I can start learning immediately.
15. As a student, I want to see my progress percentage on the detail page if I'm enrolled, so I know how far along I am.
16. As a student, I want to see which lessons I've completed and which remain, so I can plan my study time.
17. As a student, I want to click any lesson in the course structure to navigate directly to it, so I can jump to where I want.

### Lesson Viewer (Student)

18. As a student, I want to view lesson content rendered as rich text (HTML from TipTap), so content looks polished and readable.
19. As a student, I want to watch embedded YouTube videos within lessons, so I can learn from video content without leaving the page.
20. As a student, I want my video watch progress tracked automatically via the YouTube iframe API, so the system knows how much I've watched.
21. As a student, I want to mark a lesson as complete, so my progress is recorded.
22. As a student, I want prev/next navigation between lessons within a course, so I can move through content sequentially.
23. As a student, I want breadcrumb navigation showing Course > Module > Lesson, so I always know where I am.
24. As a student, I want to resume a video from where I left off, so I don't lose my place.

### Quiz Taking (Student)

25. As a student, I want to take a quiz attached to a lesson after viewing the lesson content, so I can test my understanding.
26. As a student, I want to see multiple choice and true/false questions presented clearly, so I can focus on answering.
27. As a student, I want to select my answers and submit the entire quiz at once, so the experience feels like a real assessment.
28. As a student, I want to see my score immediately after submission, so I get instant feedback.
29. As a student, I want to see whether I passed or failed based on the quiz's passing score, so I know if I need to retry.
30. As a student, I want to see which questions I got right and wrong after submission, so I can learn from mistakes.
31. As a student, I want to retake a quiz to improve my score, so I have multiple chances to pass.

### Student Dashboard

32. As a student, I want a dashboard showing all my enrolled courses, so I have a home base for my learning.
33. As a student, I want to see my progress percentage for each enrolled course on the dashboard, so I can track my overall progress.
34. As a student, I want to see which courses I've completed on the dashboard, so I feel a sense of accomplishment.
35. As a student, I want a "continue where I left off" link for each course, so I can quickly resume learning.

### Instructor — Course Management

36. As an instructor, I want to create a new course with title, description, category, and cover image URL, so I can start building curriculum.
37. As an instructor, I want the course slug to be auto-generated from the title, so I don't have to think about URL formatting.
38. As an instructor, I want to edit course title and description using inline editing (click to edit, press Enter to save, Escape to cancel), so I can make quick changes without navigating to a separate form.
39. As an instructor, I want to set a course's status to draft, published, or archived, so I can control visibility.
40. As an instructor, I want to see a list of all my courses on my instructor dashboard, so I can manage my catalog.
41. As an instructor, I want to see enrollment counts for each of my courses, so I know how popular they are.

### Instructor — Module Management

42. As an instructor, I want to add modules to a course, so I can organize lessons into logical groups.
43. As an instructor, I want to edit module titles using inline editing, so I can rename them quickly.
44. As an instructor, I want to reorder modules within a course using drag-and-drop, so I can restructure the curriculum.
45. As an instructor, I want to delete a module (with confirmation), so I can remove content I no longer need.

### Instructor — Lesson Management

46. As an instructor, I want to add lessons to a module, so I can build out course content.
47. As an instructor, I want to edit lesson content using a rich text editor (TipTap) with a toolbar, so I can create polished content.
48. As an instructor, I want to add a YouTube video URL to a lesson, so students can watch video content.
49. As an instructor, I want to set lesson duration in minutes, so students know the expected time commitment.
50. As an instructor, I want to reorder lessons within a module using drag-and-drop, so I can adjust the learning sequence.
51. As an instructor, I want to delete a lesson (with confirmation), so I can remove outdated content.
52. As an instructor, I want to edit lesson titles using inline editing, so I can rename them quickly.

### Instructor — Rich Text Editor

53. As an instructor, I want a formatting toolbar with bold, italic, strikethrough, headings (H1–H3), bullet lists, numbered lists, and blockquotes, so I can create well-structured content.
54. As an instructor, I want to insert code blocks with syntax highlighting, so I can include code examples in lessons.
55. As an instructor, I want to insert and resize images in lesson content, so I can add visual aids.
56. As an instructor, I want to insert links in lesson content, so I can reference external resources.
57. As an instructor, I want slash commands (type `/` to see a menu of insertable content types), so I can quickly add content without reaching for the toolbar.
58. As an instructor, I want the editor to auto-save or prompt before leaving with unsaved changes, so I don't lose work.

### Instructor — Quiz Builder

59. As an instructor, I want to create a quiz attached to a lesson using a multi-step wizard, so the process is guided and clear.
60. As an instructor, I want step 1 of the quiz wizard to set the quiz title and passing score percentage, so I define the assessment criteria upfront.
61. As an instructor, I want step 2 to let me add questions, choosing between multiple choice and true/false types, so I can build varied assessments.
62. As an instructor, I want step 3 to let me add answer options for each question and mark the correct answer(s), so the quiz can be auto-scored.
63. As an instructor, I want step 4 to show a full review of the quiz before saving, so I can catch mistakes.
64. As an instructor, I want to edit an existing quiz through the same wizard interface, so the editing experience is consistent.
65. As an instructor, I want to reorder questions within a quiz using drag-and-drop, so I can adjust question sequence.
66. As an instructor, I want to delete a quiz (with confirmation), so I can remove assessments I no longer need.

### Instructor — Student Roster

67. As an instructor, I want to see a table of enrolled students for each of my courses, so I can track my class.
68. As an instructor, I want to see each student's overall progress percentage in the roster, so I know who's keeping up.
69. As an instructor, I want to see each student's quiz scores in the roster, so I can identify students who are struggling.

### Admin

70. As an admin, I want to view a table of all users with name, email, role, and creation date, so I can manage the platform's users.
71. As an admin, I want to edit a user's name and email, so I can correct user information.
72. As an admin, I want to change a user's role (student/instructor/admin), so I can manage permissions.
73. As an admin, I want to view all courses regardless of status (draft/published/archived), so I have full visibility.
74. As an admin, I want to change any course's status, so I can moderate the platform.

### Video Player

75. As a student, I want YouTube videos to render in a responsive, properly-sized player, so the viewing experience is good at any screen size.
76. As a student, I want my watch position saved automatically as I watch, so I can resume where I left off.
77. As a student, I want a visual indicator showing how much of the video I've watched, so I can track my viewing progress.

### UI/UX & Layout

78. As a user, I want a responsive layout that works well on desktop and tablet, so I can use the platform on different devices.
79. As a user, I want a sidebar navigation with links to the main sections (catalog, dashboard, instructor area, admin area) based on my role, so I can navigate easily.
80. As a user, I want dark mode that I can toggle and that persists across sessions via localStorage, so I can use my preferred visual style.
81. As a user, I want toast notifications (via Sonner) for important actions (enrolled, saved, deleted, error, etc.), so I get feedback on my actions.
82. As a user, I want error boundaries that show a friendly message and recovery option instead of crashing the whole app, so errors are recoverable.
83. As a user, I want breadcrumb navigation on all nested pages, so I can always orient myself and navigate back.
84. As a user, I want consistent loading/skeleton states on pages that fetch data, so the app doesn't feel broken while loading.

### Database & Seed Data

85. As a developer, I want the database schema defined with Drizzle ORM using SQLite, so the DB is a single file with no external dependencies.
86. As a developer, I want a seed script that creates: 1 admin, 2 instructors (each with 1 course containing ~20 lessons across multiple modules), 5 students with partial progress and some quiz attempts, and a set of course categories, so the app feels realistic from first launch.
87. As a developer, I want seed data to include completed and in-progress lesson states, quiz attempts (some passing, some failing), and varied enrollment dates, so data exploration exercises have interesting data to work with.
88. As a developer, I want categories seeded (e.g., Programming, Design, Data Science, DevOps, Marketing), so the catalog filter works immediately.

### Testing

89. As a developer, I want solid test coverage on the enrollment service (enroll, unenroll, duplicate prevention, enrollment validation), so core enrollment logic is verified.
90. As a developer, I want solid test coverage on the progress calculation service (lesson completion, course percentage, edge cases like empty courses), so progress tracking is reliable.
91. As a developer, I want solid test coverage on the course service (CRUD operations, search, filtering, status transitions), so course management logic is verified.
92. As a developer, I want solid test coverage on module/lesson reordering logic (position swaps, position gaps, drag to different positions), so reordering is reliable.
93. As a developer, I want deliberate test gaps on quiz scoring, utility functions, and video tracking, so exercises have untested code to work with.

### Deliberate Warts — TypeScript Enums

94. As a developer, I want TypeScript `enum` declarations used for all status and type values — user roles (`StudentRole`, `InstructorRole`, `AdminRole` or a single `UserRole` enum), course status (`Draft`, `Published`, `Archived`), lesson progress status (`NotStarted`, `InProgress`, `Completed`), question types (`MultipleChoice`, `TrueFalse`) — so that agents will naturally try to replace them with string literal unions, creating a steering exercise.

### Deliberate Warts — Positional Parameters

95. As a developer, I want many functions across all layers to use positional parameters instead of options objects, so the ESLint rule exercise has plenty of targets. Examples:
    - `createLesson(moduleId, title, content, videoUrl, position, durationMinutes)`
    - `enrollUser(userId, courseId, sendEmail, skipValidation)`
    - `calculateProgress(userId, courseId, includeQuizzes, weightByDuration)`
    - `formatDuration(minutes, showHours, showSeconds, padZeros)`
    - `buildCourseQuery(search, category, status, sortBy, limit, offset)`
    - `renderQuizResults(score, total, passed, showAnswers, showExplanations)`

### Deliberate Warts — Legacy Quiz Scoring Module

96. As a developer, I want the quiz scoring/grading module to be written in a deliberately messy "external contractor" style, so the refactoring exercise (6.5) has a realistic target. Specifically:
    - Duplicated scoring logic: separate functions for scoring multiple choice vs true/false instead of a unified approach
    - `any` types on quiz data parameters and return values
    - Bare `try/catch` blocks that `console.log` the error and return a default value instead of proper error handling
    - Magic numbers for score thresholds (e.g., `if (score > 0.7)` instead of using the quiz's `passing_score`)
    - Raw SQL queries mixed with Drizzle ORM calls in the same module
    - Long functions (60+ lines) that do too many things
    - Inconsistent naming (`getScore` vs `calculateGrade` vs `computeResult` for similar operations)
    - No JSDoc or comments explaining the logic
    - Hardcoded strings for grade labels ("A", "B", "C") instead of using enums (ironic, given the rest of the codebase uses enums)

## Polishing Requirements

After all user stories are implemented, these checks should be made:

- All shadcn/ui components are styled consistently across pages (consistent spacing, border radius, color usage)
- Toast messages are helpful, consistent in tone, and appear for all user-facing actions and errors
- Error boundaries exist at route level and show friendly recovery UI (not stack traces)
- Loading/skeleton states appear on all pages that fetch data — no layout shifts
- Dark mode works everywhere with no white flashes, unstyled elements, or contrast issues
- Breadcrumbs are correct and consistent on every nested page
- DevUI panel doesn't obscure critical content and is collapsible
- Drag-and-drop provides clear visual feedback (drop targets, ghost elements, smooth animation)
- Inline editing has proper focus management (focus on click, blur to save, Escape to cancel)
- Quiz builder wizard has clear step indicators, validates each step, and prevents empty submissions
- YouTube player handles missing or invalid URLs gracefully (shows placeholder instead of broken embed)
- Responsive layout tested at desktop (1280px+) and tablet (768px) breakpoints
- Seed data creates a realistic, immediately-explorable app state
- Positional parameter functions are spread believably across the codebase (not clustered in one file)
- The legacy quiz scoring module looks plausibly messy — like it was written under time pressure, not deliberately sabotaged

## Implementation Decisions

- **Framework:** React Router 7 in framework mode — provides SSR, loaders, actions, nested routing. Enough architectural surface area without Next.js complexity.
- **UI Components:** shadcn/ui as the component library, Tailwind CSS for styling.
- **Database:** SQLite via Drizzle ORM. Database is a file — zero external dependencies.
- **Validation:** Zod for all request validation and form schemas. Deliberately chosen so the Zod-to-Valibot migration skill exercise has material.
- **Rich Text Editor:** TipTap core with custom extensions — toolbar, slash commands, code blocks, image handling. Expected to be ~2–3k lines of custom editor code.
- **Drag-and-Drop:** A library like `@hello-pangea/dnd` or `dnd-kit` for module/lesson reordering and quiz question reordering.
- **Video:** YouTube iframe API for embedding and watch progress tracking.
- **Toasts:** Sonner for toast notifications.
- **Architecture:** Service layer pattern. Route loaders/actions call service functions; services call Drizzle. Services are the "deep modules" — simple interfaces encapsulating complex logic, testable in isolation.
- **Auth:** No real auth. A DevUI floating panel sets a session cookie with the selected user's ID. The server reads this cookie to determine the current user. All seeded users are available.
- **Enums:** TypeScript `enum` keyword used for all categorical values (roles, statuses, question types). This is a deliberate architectural convention that agents will want to change.
- **Categories:** A `categories` table with seeded values, referenced by courses via `category_id` foreign key.
- **Video Tracking:** A `video_watch_events` table logging play/pause/seek events with timestamps. The video player component uses the YouTube iframe API's `onStateChange` to record events.

### Service Modules

| Module | Responsibility |
|---|---|
| `courseService` | Course CRUD, search, category filtering, status transitions |
| `enrollmentService` | Enroll/unenroll, duplicate prevention, enrollment validation |
| `progressService` | Mark lessons complete, calculate course completion percentage |
| `lessonService` | Lesson CRUD, reordering within modules |
| `moduleService` | Module CRUD, reordering within courses |
| `quizService` | Quiz CRUD, question/option management, attempt recording |
| `quizScoringService` | **LEGACY MODULE.** Score calculation, grade assignment. Messy contractor code. |
| `userService` | User CRUD, role management |
| `videoTrackingService` | Log watch events, calculate watch progress per lesson |

### Database Tables

| Table | Key Columns |
|---|---|
| `users` | id, name, email, role (enum), avatar_url, created_at |
| `categories` | id, name, slug |
| `courses` | id, title, slug, description, instructor_id, category_id, status (enum), cover_image_url, created_at, updated_at |
| `modules` | id, course_id, title, position, created_at |
| `lessons` | id, module_id, title, content_html, video_url, position, duration_minutes, created_at |
| `enrollments` | id, user_id, course_id, enrolled_at, completed_at |
| `lesson_progress` | id, user_id, lesson_id, status (enum), completed_at |
| `quizzes` | id, lesson_id, title, passing_score |
| `quiz_questions` | id, quiz_id, question_text, question_type (enum), position |
| `quiz_options` | id, question_id, option_text, is_correct |
| `quiz_attempts` | id, user_id, quiz_id, score, passed, attempted_at |
| `quiz_answers` | id, attempt_id, question_id, selected_option_id |
| `video_watch_events` | id, user_id, lesson_id, event_type, position_seconds, created_at |

## Testing Decisions

- **Framework:** Vitest
- **Philosophy:** Test external behavior, not implementation details. Tests should call service functions and assert on return values and DB state — not on which internal functions were called.
- **Test DB:** Tests use an in-memory SQLite database seeded per test or test suite.
- **Tested modules:**
  - `enrollmentService` — enroll, unenroll, duplicate prevention, must-not-be-already-enrolled validation
  - `progressService` — marking complete, percentage calculation, edge cases (empty course, all complete, no enrollment)
  - `courseService` — CRUD, search by title/description, filter by category, status transitions (draft→published→archived)
  - `lessonService` / `moduleService` — reordering logic (move up, move down, move to position, gap handling)
- **Deliberately untested:** `quizScoringService` (legacy module), utility functions, `videoTrackingService`. These gaps are intentional for the red-green-refactor exercise.

## Out of Scope

- **Feature A — Course Reviews/Ratings.** Left unbuilt for the "Build A Feature" exercise (1.2, 1.3). The schema should NOT include a reviews table.
- **Feature B — Instructor Analytics Dashboard.** Left unbuilt for the PRD/multi-phase planning exercises (3.2–3.5). No analytics_events table, no dashboard page.
- **Feature C — Live Presence Indicators.** Left unbuilt for the "Design It Twice" exercise (6.4). No WebSocket/SSE/polling infrastructure.
- **Real authentication.** No OAuth, no password login, no JWT. DevUI user switcher only.
- **Docker/containerization.** Students add this in the sandboxing exercise (6.1).
- **CI/CD pipeline.** Added on the `exercises/ci-broken` branch, not on main.
- **AGENTS.md.** Students create this in exercise 2.1.
- **Email notifications.** No email service integration.
- **File uploads.** Cover images and avatars use URLs, not uploaded files.
- **Payment/billing.** Not a real commercial platform.
- **Mobile-first responsive design.** Desktop and tablet only; mobile is not a priority.

## Further Notes

- **Line count target:** ~20k lines. The TipTap editor customization (~2–3k), shadcn/ui component files (~2–3k), service layer, route modules, and comprehensive seed data should combine to reach this. If the count falls short, the editor can be extended with more custom features (table support, drag-to-reorder blocks, collaborative cursors placeholder).
- **The three unbuilt features** (A, B, C) should be referenced nowhere in the code — no empty route files, no placeholder components, no TODO comments. The architecture should naturally support them (e.g., the categories table pattern makes adding a reviews table straightforward) but there should be zero forward references.
- **Seed data realism matters.** Course titles, lesson titles, and content should feel like a real platform (e.g., "Introduction to TypeScript", "Building REST APIs"), not lorem ipsum. Student progress should vary — some students nearly complete, some just enrolled, some abandoned mid-course.
- **The DevUI panel** is a development tool, not a feature of the platform. It should be visually distinct (perhaps a semi-transparent floating card) and feel separate from the app's actual UI. It should be easy to hide/collapse but always accessible.
