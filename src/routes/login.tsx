import {
  Link,
  createFileRoute,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import {
  startTransition,
  useEffect,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { CheckSquare, Lock, LogIn, Mail } from "lucide-react";
import { loginFn } from "@/server/auth";

const LOADER_DURATION_MS = 2400;

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessLoader, setShowSuccessLoader] = useState(false);
  const [dailyPulse, setDailyPulse] = useState<ReturnType<typeof createDailyPulseSnapshot>>({
    count: 24,
    heights: [34, 52, 48, 76, 62, 72],
  })

  useEffect(() => {
    setDailyPulse(createDailyPulseSnapshot())
  }, []);

  useEffect(() => {
    if (!showSuccessLoader) {
      return;
    }

    const timer = window.setTimeout(() => {
      startTransition(() => {
        void navigate({ to: "/dashboard" });
      });
    }, LOADER_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [navigate, showSuccessLoader]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await loginFn({ data: { email, password } });

      if (result.error) {
        setError(result.error);
        return;
      }

      setShowSuccessLoader(true);
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const isBusy = loading || showSuccessLoader;

  return (
    <>
      <div className="min-h-screen bg-[#f4f5fb] text-slate-900">
        <div className="grid min-h-screen lg:grid-cols-[minmax(0,560px)_1fr]">
          <section className="relative flex items-center justify-center overflow-hidden px-6 py-10 sm:px-10 lg:px-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(170,184,255,0.22),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(255,115,179,0.12),_transparent_32%)]" />

            <div className="relative z-10 w-full max-w-[430px]">
              <div className="mb-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#7c3aed_0%,#ec4899_100%)] text-white shadow-[0_18px_40px_rgba(124,58,237,0.32)]">
                    <CheckSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                      TaskFlow
                    </p>
                    <p className="text-lg font-semibold text-slate-900">
                      ProVisioners
                    </p>
                  </div>
                </div>

                <Link
                  to="/signup"
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                >
                  Sign up
                </Link>
              </div>

              <div className="rounded-[30px] border border-white/80 bg-white/95 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-10">
                <div className="mb-8">
                  <div className="mb-4 inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
                    Login
                  </div>
                  <h1 className="text-4xl font-semibold tracking-[-0.04em] text-slate-950">
                    Welcome back
                  </h1>
                  <p className="mt-3 text-base leading-7 text-slate-500">
                    Sign in to manage projects, approvals, and delivery across
                    the ProVisioners workspace.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-600">
                      Email address
                    </span>
                    <span className="relative block">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@provisioners.com"
                        required
                        className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                      />
                    </span>
                  </label>

                  <label className="block">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">
                        Password
                      </span>
                      <span className="text-sm font-medium text-slate-400">
                        Secure access
                      </span>
                    </div>
                    <span className="relative block">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        minLength={6}
                        className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                      />
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isBusy}
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#7c3aed_0%,#ec4899_100%)] px-4 text-base font-semibold text-white shadow-[0_18px_34px_rgba(168,85,247,0.32)] transition hover:scale-[1.01] hover:shadow-[0_20px_38px_rgba(168,85,247,0.38)] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <LogIn className="h-5 w-5" />
                    )}
                    {showSuccessLoader
                      ? "Preparing workspace..."
                      : loading
                        ? "Signing in..."
                        : "Log in"}
                  </button>
                </form>

                <div className="mt-8 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <p>
                    Protected workspace access with secure session management
                    and project visibility controls.
                  </p>
                </div>

                <p className="mt-6 text-center text-sm text-slate-500">
                  New to ProVisioners?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold text-violet-600 transition hover:text-violet-700"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </section>

          <aside className="relative hidden overflow-hidden bg-[#0c1021] px-8 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(126,90,255,0.45),transparent_28%),radial-gradient(circle_at_78%_24%,rgba(247,114,182,0.3),transparent_24%),linear-gradient(180deg,#131933_0%,#090d1d_100%)]" />
            <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-position:center_center] [background-size:88px_88px]" />
            <div className="absolute right-[-140px] top-[-120px] h-[360px] w-[360px] rounded-full bg-fuchsia-500/20 blur-3xl" />
            <div className="absolute bottom-[-180px] left-[-90px] h-[320px] w-[320px] rounded-full bg-violet-500/30 blur-3xl" />

            <div className="relative z-10 mx-auto w-full max-w-[720px]">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/80 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Teams stay aligned in one command center
              </div>

              <h2 className="max-w-[10ch] text-5xl font-semibold leading-[1.02] tracking-[-0.05em] text-white xl:text-6xl">
                Run every project with calm control.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/68">
                A ClickUp-inspired workspace for briefs, timelines, approvals,
                and progress tracking without scattered updates.
              </p>

              <div className="mt-12 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="provisioners-auth-float rounded-[28px] border border-white/12 bg-white/10 p-5 shadow-[0_32px_80px_rgba(8,12,24,0.5)] backdrop-blur-xl">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                        Delivery Board
                      </p>
                      <p className="mt-1 text-xl font-semibold text-white">
                        Campaign Launch
                      </p>
                    </div>
                    <div className="rounded-full bg-emerald-400/18 px-3 py-1 text-xs font-semibold text-emerald-200">
                      On track
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      ["Content Review", "84%", "bg-violet-400"],
                      ["Client Approval", "63%", "bg-fuchsia-400"],
                      ["QA Handoff", "91%", "bg-cyan-400"],
                    ].map(([label, value, accent], index) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-white/8 bg-slate-950/25 p-4"
                      >
                        <div className="mb-3 flex items-center justify-between text-sm">
                          <span className="text-white/85">{label}</span>
                          <span className="text-white/50">{value}</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10">
                          <div
                            className={`provisioners-metric-fill h-full rounded-full ${accent}`}
                            style={
                              {
                                width: value,
                                animationDelay: `${index * 140}ms`,
                              } as CSSProperties
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="provisioners-auth-float rounded-[28px] border border-white/12 bg-white/10 p-5 shadow-[0_28px_70px_rgba(8,12,24,0.42)] backdrop-blur-xl [animation-delay:140ms]">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                      Daily Pulse
                    </p>
                    <div className="mt-4 flex items-end gap-3">
                      <span className="text-5xl font-semibold tracking-[-0.05em]">
                        {dailyPulse.count}
                      </span>
                      <span className="pb-2 text-sm text-emerald-200">
                        tasks cleared today
                      </span>
                    </div>
                    <div className="mt-5 flex gap-2">
                      {dailyPulse.heights.map((height, index) => (
                        <div
                          key={`${height}-${index}`}
                          className="flex-1 rounded-full bg-white/8 p-1"
                        >
                          <div
                            className={`provisioners-column-bar w-full rounded-full ${
                              index % 2 === 0
                                ? "bg-violet-400"
                                : "bg-fuchsia-400"
                            }`}
                            style={
                              {
                                height: `${height}px`,
                                animationDelay: `${index * 110}ms`,
                              } as CSSProperties
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="provisioners-auth-float rounded-[28px] border border-white/12 bg-slate-950/30 p-5 shadow-[0_28px_70px_rgba(8,12,24,0.42)] backdrop-blur-xl [animation-delay:260ms]">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                      Core Stack
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {["Projects", "Approvals", "Timelines", "Assets"].map(
                        (item) => (
                          <span
                            key={item}
                            className="rounded-full border border-white/10 bg-white/8 px-3 py-2 text-sm text-white/80"
                          >
                            {item}
                          </span>
                        ),
                      )}
                    </div>
                    <div className="mt-5 rounded-2xl border border-white/10 bg-white/8 p-4">
                      <div className="flex items-center justify-between text-sm text-white/80">
                        <span>Workspace coverage</span>
                        <span>94%</span>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-white/10">
                        <div className="h-full w-[94%] rounded-full bg-[linear-gradient(90deg,#8b5cf6_0%,#ec4899_100%)]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mx-auto flex w-full max-w-[720px] items-center justify-between text-sm text-white/45">
              <span>&copy; 2026 ProVisioners</span>
              <span>Focused delivery for modern teams</span>
            </div>
          </aside>
        </div>
      </div>

      {showSuccessLoader && <SuccessLoader />}
    </>
  );
}

function SuccessLoader() {
  const progress = useRandomLoaderProgress();
  const stageLabel =
    progress < 24
      ? "Checking access"
      : progress < 52
        ? "Syncing workspace"
        : progress < 82
          ? "Loading active projects"
          : progress < 100
            ? "Finalizing session"
            : "Ready";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#070b17] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.35),transparent_34%),radial-gradient(circle_at_bottom,rgba(236,72,153,0.28),transparent_28%)]" />
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:90px_90px]" />

      <div className="relative flex min-h-screen items-center justify-center px-6">
        <div className="provisioners-loader-shell w-full max-w-4xl rounded-[36px] border border-white/10 bg-white/6 px-6 py-10 shadow-[0_40px_120px_rgba(3,6,18,0.7)] backdrop-blur-2xl sm:px-10 sm:py-12">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-white/50">
              Access granted
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              Launching ProVisioners
            </h2>
            <p className="mt-3 text-base text-white/60">
              Preparing your workspace and syncing the latest project context.
            </p>
          </div>

          <svg
            viewBox="0 0 920 300"
            className="mx-auto w-full max-w-3xl overflow-visible"
            role="img"
            aria-label="ProVisioners loading animation"
          >
            <defs>
              <linearGradient
                id="provisioners-loader-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="55%" stopColor="#c026d3" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
              <filter
                id="provisioners-loader-glow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="7" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              id="provisioners-loader-track"
              d="M78 86C153 22 253 25 353 78C466 137 568 213 699 184C777 167 840 120 879 88"
              fill="none"
              stroke="url(#provisioners-loader-gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              className="provisioners-loader-track"
            />

            <circle
              r="7"
              fill="#fff"
              filter="url(#provisioners-loader-glow)"
              className="provisioners-loader-dot"
            >
              <animateMotion dur="1.9s" repeatCount="indefinite" rotate="auto">
                <mpath href="#provisioners-loader-track" />
              </animateMotion>
            </circle>

            <circle
              r="18"
              fill="url(#provisioners-loader-gradient)"
              opacity="0.22"
            >
              <animateMotion dur="1.9s" repeatCount="indefinite">
                <mpath href="#provisioners-loader-track" />
              </animateMotion>
            </circle>

            <text
              x="460"
              y="182"
              textAnchor="middle"
              className="provisioners-loader-word-outline"
              fill="none"
              stroke="url(#provisioners-loader-gradient)"
              strokeWidth="2"
              paintOrder="stroke"
            >
              ProVisioners
            </text>
            <text
              x="460"
              y="182"
              textAnchor="middle"
              className="provisioners-loader-word-fill"
              fill="url(#provisioners-loader-gradient)"
            >
              ProVisioners
            </text>

            <path
              d="M248 228H672"
              fill="none"
              stroke="url(#provisioners-loader-gradient)"
              strokeLinecap="round"
              strokeWidth="3"
              className="provisioners-loader-underline"
            />
          </svg>

          <div className="mx-auto mt-8 w-full max-w-xl">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
              <span>{stageLabel}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="provisioners-loader-progress h-full rounded-full bg-[linear-gradient(90deg,#8b5cf6_0%,#d946ef_55%,#22d3ee_100%)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function useRandomLoaderProgress() {
  const [milestones] = useState(() => createLoaderMilestones());
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frameId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = Math.min(now - start, LOADER_DURATION_MS);
      let nextProgress = 100;

      for (let index = 1; index < milestones.length; index += 1) {
        const previous = milestones[index - 1];
        const current = milestones[index];

        if (elapsed <= current.at) {
          const segmentDuration = current.at - previous.at || 1;
          const rawProgress = (elapsed - previous.at) / segmentDuration;
          const eased = 1 - Math.pow(1 - Math.max(0, rawProgress), 3);
          nextProgress =
            previous.value + (current.value - previous.value) * eased;
          break;
        }
      }

      setProgress(Math.min(100, Math.round(nextProgress)));

      if (elapsed < LOADER_DURATION_MS) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [milestones]);

  return progress;
}

function createLoaderMilestones() {
  const randomBetween = (min: number, max: number) =>
    Math.round(min + Math.random() * (max - min));

  return [
    { at: 0, value: 0 },
    { at: randomBetween(180, 260), value: randomBetween(8, 14) },
    { at: randomBetween(520, 760), value: randomBetween(24, 37) },
    { at: randomBetween(980, 1240), value: randomBetween(46, 61) },
    { at: randomBetween(1420, 1710), value: randomBetween(68, 82) },
    { at: randomBetween(1880, 2120), value: randomBetween(88, 96) },
    { at: LOADER_DURATION_MS, value: 100 },
  ];
}

function createDailyPulseSnapshot() {
  const randomBetween = (min: number, max: number) =>
    Math.round(min + Math.random() * (max - min));

  return {
    count: randomBetween(18, 36),
    heights: Array.from({ length: 6 }, (_, index) => {
      const base = [34, 52, 48, 76, 62, 72][index] ?? 48;
      return Math.max(24, Math.min(98, base + randomBetween(-10, 12)));
    }),
  };
}
