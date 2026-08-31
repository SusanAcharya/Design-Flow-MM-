import { useState, type ReactNode } from "react";
import { Icon } from "../ds/Icon";
import { ObjectiveHero } from "../ds/ObjectiveHero";
import { Badge, Button, Overline, SearchField } from "../ds/primitives";
import { mitra } from "../lib/mitra";
import { npr } from "../lib/format";
import {
  certificates,
  courseById,
  courseLength,
  courseProgress,
  courses,
  courseFaqs,
  enrollmentFor,
  freeLectures,
  myCourses,
  nextLecture,
  type Course,
  type CourseLevel,
  type Lecture,
} from "../lib/courses";
import { useApp } from "../lib/state";

/* The paid side of Learn. Objectives stay the free guided path; these screens
   are the catalogue, one course, what you already own, and the paperwork. */

/** Local copy of the desk header — the convention in this codebase is per-file. */
function ScreenHead({ title, action }: { title: string; action?: ReactNode }) {
  const { back, viewport } = useApp();
  if (viewport === "web") {
    return (
      <div className="desk-web-head">
        <button type="button" className="text-link web-back" onClick={back}>‹ Back</button>
        <div className="desk-web-title">
          <h1 className="t-h-xl">{title}</h1>
          {action}
        </div>
      </div>
    );
  }
  return (
    <div className="app-bar">
      <button type="button" className="icon-btn" onClick={back} aria-label="Back">
        <Icon name="back" />
      </button>
      <h1>{title}</h1>
      {action}
    </div>
  );
}

function levelDot(level: CourseLevel) {
  return level === "Beginner" ? "accent" : level === "Intermediate" ? "teal" : "violet";
}

/* ── Course cover ─────────────────────────────────────────────────────────
   No stock photography and no invented instructor portraits — the cover is
   the course title on its own tone, with Mitra teaching in the corner. */
function CourseCover({ course, size = "card" }: { course: Course; size?: "card" | "hero" | "mini" }) {
  return (
    <span className={`course-cover ${course.tone} cover-${size}`} aria-hidden>
      <span className="course-cover-copy">
        <em>{course.level}</em>
        <strong>{course.title}</strong>
      </span>
      {size !== "mini" && <img src={mitra[course.pose]} alt="" />}
    </span>
  );
}

function PriceTag({ course }: { course: Course }) {
  return (
    <span className="course-price">
      <b>Rs {npr(course.price)}</b>
      {course.wasPrice && <s>Rs {npr(course.wasPrice)}</s>}
    </span>
  );
}

function CourseCard({ course }: { course: Course }) {
  const { go } = useApp();
  const progress = courseProgress(course);
  return (
    <button type="button" className="course-card" onClick={() => go("course", { course: course.id })}>
      <CourseCover course={course} />
      <span className="course-card-body">
        <strong className="course-card-title">{course.title}</strong>
        <span className="course-card-facts">
          <span>{course.lectures.length} lectures</span>
          <i aria-hidden />
          <span className={`course-level ${levelDot(course.level)}`}>{course.level}</span>
        </span>
        <span className="course-card-facts">
          <span>Validity {course.validityDays} days</span>
        </span>
        {progress.owned ? (
          <span className="course-owned">
            <span className="course-bar" aria-hidden><i style={{ width: `${progress.pct}%` }} /></span>
            <em>{progress.pct === 100 ? "Finished" : `${progress.done} of ${progress.total} watched`}</em>
          </span>
        ) : (
          <PriceTag course={course} />
        )}
      </span>
    </button>
  );
}

/* ── 1. The catalogue ─────────────────────────────────────────────────────*/

type Filter = "all" | "Beginner" | "Intermediate" | "Advanced";
const filters: Filter[] = ["all", "Beginner", "Intermediate", "Advanced"];

export function CoursesScreen() {
  const { go, viewport } = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const q = query.trim().toLowerCase();

  const matches = courses.filter((course) => {
    if (filter !== "all" && course.level !== filter) return false;
    if (!q) return true;
    return `${course.title} ${course.blurb} ${course.short}`.toLowerCase().includes(q);
  });
  const browsing = Boolean(q) || filter !== "all";
  const popular = matches.filter((course) => course.popular);
  const inProgress = myCourses.filter((course) => courseProgress(course).pct < 100);

  return (
    <div className="desk-screen courses-desk">
      {viewport === "mobile" && <div className="page-title"><h1>Courses</h1></div>}
      {viewport === "web" && (
        <div className="desk-web-head">
          <div className="desk-web-title"><h1 className="t-h-xl">Courses</h1></div>
        </div>
      )}

      <div className="pad">
        <p className="t-body-m muted">
          Longer sittings than the free path, taught end to end. A course explains a method — it never tells you what to buy.
        </p>
      </div>

      <div className="desk-head-row">
        <div className="desk-controls">
          <div className="pad">
            <SearchField placeholder="Search courses" value={query} onChange={setQuery} />
          </div>
        </div>
        <div className="desk-tabs pad">
          <div className="course-filters" role="tablist" aria-label="Level">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={filter === item}
                className={`chip${filter === item ? " chip-on" : ""}`}
                onClick={() => setFilter(item)}
              >
                {item === "all" ? "All levels" : item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {browsing ? (
        <section className="market-block">
          <div className="market-block-head">
            <h2>{matches.length} {matches.length === 1 ? "course" : "courses"}</h2>
            {(q || filter !== "all") && (
              <button type="button" className="text-link" onClick={() => { setQuery(""); setFilter("all"); }}>
                Clear
              </button>
            )}
          </div>
          <div className="market-block-body">
            {matches.length === 0 ? (
              <p className="explore-empty t-h-s">Nothing matches that. Try a shorter word.</p>
            ) : (
              <div className="course-grid">
                {matches.map((course) => <CourseCard key={course.id} course={course} />)}
              </div>
            )}
          </div>
        </section>
      ) : (
        <>
          {inProgress.length > 0 && (
            <section className="market-block">
              <div className="market-block-head">
                <h2>Pick up where you stopped</h2>
                <button type="button" className="text-link" onClick={() => go("my-learning")}>My learning ›</button>
              </div>
              <div className="market-block-body">
                <div className="course-grid">
                  {inProgress.map((course) => <CourseCard key={course.id} course={course} />)}
                </div>
              </div>
            </section>
          )}

          <section className="market-block">
            <div className="market-block-head">
              <h2>Mitra's free path</h2>
              <button type="button" className="text-link" onClick={() => go("objectives")}>All sittings ›</button>
            </div>
            <div className="market-block-body course-path-body">
              <ObjectiveHero compact />
            </div>
          </section>

          <section className="market-block">
            <div className="market-block-head">
              <h2>Free lectures</h2>
              <span className="t-label-s c-muted">No account needed</span>
            </div>
            <div className="market-block-body">
              <div className="free-strip">
                {freeLectures.map((lecture) => (
                  <button
                    key={lecture.id}
                    type="button"
                    className={`free-card ${lecture.tone}`}
                    onClick={() => go("lesson", { lesson: lecture.title })}
                  >
                    <span className="free-card-art">
                      <em>Lecture {lecture.order}</em>
                      <strong>{lecture.title}</strong>
                    </span>
                    <span className="free-card-foot">
                      <span className="free-play" aria-hidden><i /></span>
                      <span>
                        <strong>{lecture.sub}</strong>
                        <small>{lecture.minutes} min · free</small>
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="market-block">
            <div className="market-block-head">
              <h2>Popular courses</h2>
              <button type="button" className="text-link" onClick={() => setFilter("Beginner")}>View all ›</button>
            </div>
            <div className="market-block-body">
              <div className="course-grid">
                {popular.map((course) => <CourseCard key={course.id} course={course} />)}
              </div>
            </div>
          </section>

          <section className="market-block">
            <div className="market-block-head">
              <h2>Every course</h2>
              <span className="t-label-s c-muted">{courses.length} in the library</span>
            </div>
            <div className="market-block-body">
              <div className="course-grid">
                {courses.filter((course) => !course.popular).map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          </section>

          <section className="market-block">
            <div className="market-block-body">
              <div className="course-links">
                <button type="button" className="course-link" onClick={() => go("my-learning")}>
                  <span className="ico-soft learn"><Icon name="book" size={17} /></span>
                  <span><strong>My learning</strong><small>{myCourses.length} courses bought</small></span>
                  <Icon name="chev" size={15} />
                </button>
                <button type="button" className="course-link" onClick={() => go("certificates")}>
                  <span className="ico-soft teal"><Icon name="ticket" size={17} /></span>
                  <span><strong>Certificates</strong><small>{certificates.length} earned</small></span>
                  <Icon name="chev" size={15} />
                </button>
                <button type="button" className="course-link" onClick={() => go("course-faq")}>
                  <span className="ico-soft saffron"><Icon name="info" size={17} /></span>
                  <span><strong>Questions</strong><small>Validity, refunds, certificates</small></span>
                  <Icon name="chev" size={15} />
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      <p className="foot-note">
        Prices include the full course for its validity window. MoneyMitra is not a broker and no course here is investment advice.
      </p>
    </div>
  );
}

/* ── 2. One course ────────────────────────────────────────────────────────*/

function LectureRow({ lecture, course, n }: { lecture: Lecture; course: Course; n: number }) {
  const { go, openSheet } = useApp();
  const owned = enrollmentFor(course.id);
  const done = owned?.done.includes(lecture.id) ?? false;
  const open = owned || lecture.free;

  const play = () => {
    if (open) {
      go("lesson", { lesson: lecture.title });
      return;
    }
    openSheet({
      kind: "quick",
      title: "Locked until you buy",
      body: `“${lecture.title}” is part of ${course.title}. The free lectures in this course play now — the rest open once the course is yours.`,
      note: "This prototype does not take payment.",
    });
  };

  return (
    <button type="button" className={`lecture-row${done ? " done" : ""}`} onClick={play}>
      <span className={`lecture-mark${open ? "" : " locked"}`} aria-hidden>
        {done ? <Icon name="check" size={15} /> : open ? <i className="lecture-play" /> : <Icon name="shield" size={14} />}
      </span>
      <span className="lecture-main">
        <strong>{n}. {lecture.title}</strong>
        <small>
          {lecture.minutes} min
          {lecture.free && !owned && <em className="lecture-free">Free</em>}
          {done && <em className="lecture-watched">Watched</em>}
        </small>
      </span>
      <Icon name="chev" size={15} />
    </button>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span className="course-stars" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <i key={n} className={n <= Math.round(value) ? "on" : ""} aria-hidden />
      ))}
    </span>
  );
}

export function CourseScreen() {
  const { courseId, courseTab, setCourseTab, go, openSheet, flash, viewport } = useApp();
  const course = courseById(courseId) ?? courses[0];
  const progress = courseProgress(course);
  const owned = progress.owned;
  const resume = nextLecture(course);

  const buy = () => {
    openSheet({
      kind: "quick",
      title: `Buy ${course.title}`,
      body: `Rs ${npr(course.price)} for ${course.validityDays} days of access to all ${course.lectures.length} lectures, and a certificate when you finish.`,
      note: "This prototype does not take payment. No money moves.",
    });
  };

  return (
    <div className="desk-screen course-screen">
      <ScreenHead title={course.title} />

      <div className="course-body">
        <div className="course-main">
          <div className="pad">
            <CourseCover course={course} size="hero" />
          </div>

          {/* The cover art and the app bar both carry the title already — a third
              copy here just pushed the lecture list down. */}
          <div className="pad course-titling">
            <p className="t-body-l">{course.blurb}</p>
            <div className="course-meta">
              <Badge tone={levelDot(course.level) as "accent" | "teal" | "violet"}>{course.level}</Badge>
              <span>{course.lectures.length} lectures</span>
              <span>{courseLength(course)}</span>
              <span>{course.validityDays}-day validity</span>
            </div>
            <div className="course-rating">
              <Stars value={course.rating} />
              <b>{course.rating.toFixed(1)}</b>
              <small>{course.reviewCount} ratings</small>
            </div>
          </div>

          <div className="tabs course-tabs" role="tablist" aria-label="Course">
            {(["Lectures", "Details", "Reviews"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={courseTab === tab}
                className={courseTab === tab ? "on" : ""}
                onClick={() => setCourseTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {courseTab === "Lectures" && (
            <div className="lecture-list">
              {course.lectures.map((lecture, i) => (
                <LectureRow key={lecture.id} lecture={lecture} course={course} n={i + 1} />
              ))}
              <p className="foot-note">
                The lecture list is the full course. Free lectures play before you buy.
              </p>
            </div>
          )}

          {courseTab === "Details" && (
            <div className="pad stack course-details" style={{ gap: 18 }}>
              <div>
                <Overline>What you'll be able to do</Overline>
                <ul className="course-points">
                  {course.takeaways.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </div>
              <div>
                <Overline>Before you start</Overline>
                <ul className="course-points quiet">
                  {course.needs.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </div>
              <div className="course-facts">
                <span className="kv"><span>Level</span><b>{course.level}</b></span>
                <span className="kv"><span>Lectures</span><b>{course.lectures.length}</b></span>
                <span className="kv"><span>Total length</span><b>{courseLength(course)}</b></span>
                <span className="kv"><span>Validity</span><b>{course.validityDays} days</b></span>
                <span className="kv"><span>Language</span><b>Nepali, with English terms</b></span>
                <span className="kv"><span>Certificate</span><b>On finishing every lecture</b></span>
              </div>
              <p className="disclaimer">
                This course teaches a method of reading the market. It does not recommend a stock, and no instructor here will give you a buy or sell call.
              </p>
            </div>
          )}

          {courseTab === "Reviews" && (
            <div className="pad stack" style={{ gap: 14 }}>
              <div className="review-summary">
                <b className="t-display-l">{course.rating.toFixed(1)}</b>
                <span>
                  <Stars value={course.rating} />
                  <small>{course.reviewCount} ratings from members who bought this course</small>
                </span>
              </div>
              {course.reviews.map((review) => (
                <div key={review.id} className="review-row">
                  <div className="review-head">
                    <strong>{review.who}</strong>
                    <Stars value={review.stars} />
                    <small>{review.when}</small>
                  </div>
                  <p className="t-body-m">{review.body}</p>
                </div>
              ))}
              <p className="foot-note">Reviews come from members who bought the course. Sample content in this prototype.</p>
            </div>
          )}
        </div>

        <div className="course-side">
          <div className="course-buy">
            {owned ? (
              <>
                <Overline>You own this</Overline>
                <div className="course-buy-progress">
                  <b>{progress.done} of {progress.total}</b>
                  <small>lectures watched</small>
                  <span className="course-bar" aria-hidden><i style={{ width: `${progress.pct}%` }} /></span>
                </div>
                <Button block onClick={() => go("lesson", { lesson: resume.title })}>
                  {progress.pct === 100 ? "Watch again" : "Continue"}
                </Button>
                {progress.pct === 100 ? (
                  <button type="button" className="text-link" onClick={() => go("certificates")}>See your certificate ›</button>
                ) : (
                  <p className="t-label-s c-muted">Next: {resume.title}</p>
                )}
              </>
            ) : (
              <>
                <PriceTag course={course} />
                <p className="t-label-s c-muted">{course.validityDays} days of access · certificate on finishing</p>
                <Button block onClick={buy}>Buy this course</Button>
                <button
                  type="button"
                  className="text-link"
                  onClick={() => flash({ message: "Saved to your list. A demo — nothing was sent." })}
                >
                  Save for later
                </button>
              </>
            )}
          </div>

          <div className="course-aside">
            <img src={mitra.namaste} alt="" />
            <p className="t-body-s">
              Take the free path first if you are new. It costs nothing and covers what every course assumes you know.
            </p>
            <button type="button" className="text-link" onClick={() => go("objectives")}>Open the free path ›</button>
          </div>

          <button type="button" className="course-link" onClick={() => go("course-faq")}>
            <span className="ico-soft saffron"><Icon name="info" size={17} /></span>
            <span><strong>Questions about buying</strong><small>Validity, refunds, certificates</small></span>
            <Icon name="chev" size={15} />
          </button>
        </div>
      </div>

      {!owned && viewport === "mobile" && (
        <div className="course-dock">
          <span>
            <PriceTag course={course} />
            <small>{course.validityDays} days</small>
          </span>
          <Button onClick={buy}>Buy course</Button>
        </div>
      )}
    </div>
  );
}

/* ── 3. My learning ───────────────────────────────────────────────────────*/

export function MyLearningScreen() {
  const { go } = useApp();
  const [tab, setTab] = useState<"progress" | "done">("progress");
  const active = myCourses.filter((course) => courseProgress(course).pct < 100);
  const finished = myCourses.filter((course) => courseProgress(course).pct === 100);
  const shown = tab === "progress" ? active : finished;

  const watched = myCourses.reduce((sum, course) => sum + courseProgress(course).done, 0);
  const totalLectures = myCourses.reduce((sum, course) => sum + course.lectures.length, 0);

  return (
    <div className="desk-screen courses-desk">
      <ScreenHead title="My learning" />

      {myCourses.length === 0 ? (
        <div className="watch-empty">
          <img src={mitra.sleepy} alt="" />
          <p className="t-h-m">No courses yet</p>
          <p className="t-body-s muted">
            Buy a course and it lives here, with your place in it kept. The free path costs nothing and is a good start.
          </p>
          <div className="watch-empty-acts">
            <button type="button" className="pf-quick-btn primary" onClick={() => go("learn")}>Browse courses</button>
            <button type="button" className="pf-quick-btn" onClick={() => go("objectives")}>Free path</button>
          </div>
        </div>
      ) : (
        <>
          <div className="pad">
            <div className="obj-progress">
              <p>
                <strong>{watched} of {totalLectures}</strong>
                <small>lectures watched across {myCourses.length} courses</small>
              </p>
              <span className="obj-progress-bar" aria-hidden>
                <i style={{ width: `${(watched / totalLectures) * 100}%` }} />
              </span>
            </div>
          </div>

          <div className="desk-tabs pad">
            <div className="home-feed-tabs duo" role="tablist" aria-label="Course state">
              {([
                { id: "progress" as const, label: "In progress", count: active.length },
                { id: "done" as const, label: "Finished", count: finished.length },
              ]).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === item.id}
                  className={tab === item.id ? "on" : ""}
                  onClick={() => setTab(item.id)}
                >
                  {item.label} <em>{item.count}</em>
                </button>
              ))}
            </div>
          </div>

          <section className="market-block">
            <div className="market-block-body">
              {shown.length === 0 ? (
                <p className="explore-empty t-h-s">
                  {tab === "progress" ? "Nothing part-watched right now." : "No course finished yet."}
                </p>
              ) : (
                <div className="course-grid">
                  {shown.map((course) => <CourseCard key={course.id} course={course} />)}
                </div>
              )}
            </div>
          </section>

          <p className="foot-note">
            Access runs for the validity on each course. Your progress and certificates stay even after it ends.
          </p>
        </>
      )}
    </div>
  );
}

/* ── 4. Certificates ──────────────────────────────────────────────────────*/

export function CertificatesScreen() {
  const { go, flash } = useApp();
  const unfinished = myCourses.filter((course) => courseProgress(course).pct < 100);

  return (
    <div className="desk-screen courses-desk">
      <ScreenHead title="Certificates" />

      {certificates.length === 0 ? (
        <div className="watch-empty">
          <img src={mitra.thinking} alt="" />
          <p className="t-h-m">Nothing issued yet</p>
          <p className="t-body-s muted">Finish every lecture in a course and the certificate arrives the same day.</p>
          <div className="watch-empty-acts">
            <button type="button" className="pf-quick-btn primary" onClick={() => go("my-learning")}>My learning</button>
          </div>
        </div>
      ) : (
        <>
          <div className="pad">
            <p className="t-body-m muted">
              Issued when every lecture in a course is watched. Each carries a code anyone can check against our records.
            </p>
          </div>

          <section className="market-block">
            <div className="market-block-body">
              <div className="cert-grid">
                {certificates.map((cert) => {
                  const course = courseById(cert.courseId);
                  if (!course) return null;
                  return (
                    <div key={cert.id} className="cert-card">
                      <div className="cert-top">
                        <span className="ico-soft learn"><Icon name="ticket" size={17} /></span>
                        <Badge tone="violet">Issued</Badge>
                      </div>
                      <strong className="t-h-s">{course.title}</strong>
                      <p className="t-label-s c-muted">Completed {cert.issued}</p>
                      <span className="cert-code">{cert.code}</span>
                      <div className="cert-acts">
                        <button
                          type="button"
                          className="pf-quick-btn primary"
                          onClick={() => flash({ message: "A demo — no file is produced." })}
                        >
                          Download
                        </button>
                        <button
                          type="button"
                          className="pf-quick-btn"
                          onClick={() => flash({ message: `Code ${cert.code} copied. A demo.` })}
                        >
                          Copy code
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {unfinished.length > 0 && (
            <section className="market-block">
              <div className="market-block-head">
                <h2>Close to one</h2>
              </div>
              <div className="market-block-body">
                <div className="course-grid">
                  {unfinished.map((course) => <CourseCard key={course.id} course={course} />)}
                </div>
              </div>
            </section>
          )}

          <p className="foot-note">
            A certificate records that you watched a course. It is not a licence, and it does not make anyone an adviser.
          </p>
        </>
      )}
    </div>
  );
}

/* ── 5. Questions ─────────────────────────────────────────────────────────*/

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="obj-fold faq-fold">
      <button
        type="button"
        className={`obj-fold-toggle${open ? " open" : ""}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{q}</span>
        <i aria-hidden />
      </button>
      {open && <p className="faq-answer t-body-m">{a}</p>}
    </div>
  );
}

export function CourseFaqScreen() {
  const { go } = useApp();
  return (
    <div className="desk-screen courses-desk course-faq">
      <ScreenHead title="Course questions" />
      <div className="tab-feed">
        <div className="pad">
          <p className="t-body-m muted">
            The things people ask before paying. If yours is not here, write to hello@moneymitra.com.
          </p>
        </div>
        <section className="market-block">
          <div className="market-block-body note-feed">
            {courseFaqs.map((item) => <FaqRow key={item.id} q={item.q} a={item.a} />)}
          </div>
        </section>
        <section className="market-block">
          <div className="market-block-body">
            <div className="course-links">
              <button type="button" className="course-link" onClick={() => go("learn")}>
                <span className="ico-soft learn"><Icon name="learn" size={17} /></span>
                <span><strong>Browse courses</strong><small>Eight in the library</small></span>
                <Icon name="chev" size={15} />
              </button>
              <button type="button" className="course-link" onClick={() => go("subscription")}>
                <span className="ico-soft accent"><Icon name="coin" size={17} /></span>
                <span><strong>Plans and subscription</strong><small>Separate from course purchases</small></span>
                <Icon name="chev" size={15} />
              </button>
            </div>
          </div>
        </section>
        <p className="foot-note">
          Courses are bought one at a time. A Plus or Pro plan covers the app's tools, not the course library.
        </p>
      </div>
    </div>
  );
}
