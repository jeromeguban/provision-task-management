import { s as signupFn } from './routeTree.gen-B1ahvekk.mjs';
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { useNavigate, Link } from '@tanstack/react-router';
import { useState, useEffect, startTransition } from 'react';
import { CheckSquare, User, Mail, Lock, UserPlus } from 'lucide-react';
import '@tanstack/react-router/ssr/server';
import '@tanstack/history';
import '@tanstack/router-core/ssr/client';
import '@tanstack/router-core';
import 'tiny-invariant';
import 'tiny-warning';
import 'node:async_hooks';
import '@tanstack/router-core/ssr/server';
import './nitro.mjs';
import 'node:crypto';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'vite';
import '@vitejs/plugin-react';
import '@tanstack/react-start/plugin/vite';
import '@tailwindcss/vite';
import 'node:fs';
import 'node:path';
import '@supabase/ssr';
import '@prisma/client';

var LOADER_DURATION_MS = 2400;
function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessLoader, setShowSuccessLoader] = useState(false);
  const [firstWeek] = useState(() => createFirstWeekSnapshot());
  useEffect(() => {
    if (!showSuccessLoader) return;
    const timer = window.setTimeout(() => {
      startTransition(() => {
        navigate({ to: "/login" });
      });
    }, LOADER_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [navigate, showSuccessLoader]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const result = await signupFn({ data: {
        email,
        password,
        fullName
      } });
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
    className: "min-h-screen bg-[#f4f5fb] text-slate-900",
    children: /* @__PURE__ */ jsxs("div", {
      className: "grid min-h-screen lg:grid-cols-[minmax(0,560px)_1fr]",
      children: [/* @__PURE__ */ jsxs("section", {
        className: "relative flex items-center justify-center overflow-hidden px-6 py-10 sm:px-10 lg:px-14",
        children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(170,184,255,0.22),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(255,115,179,0.12),_transparent_32%)]" }), /* @__PURE__ */ jsxs("div", {
          className: "relative z-10 w-full max-w-[430px]",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "mb-10 flex items-center justify-between",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-3",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#7c3aed_0%,#ec4899_100%)] text-white shadow-[0_18px_40px_rgba(124,58,237,0.32)]",
                children: /* @__PURE__ */ jsx(CheckSquare, { className: "h-5 w-5" })
              }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
                className: "text-xs font-semibold uppercase tracking-[0.28em] text-slate-400",
                children: "TaskFlow"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-lg font-semibold text-slate-900",
                children: "ProVisioners"
              })] })]
            }), /* @__PURE__ */ jsx(Link, {
              to: "/login",
              className: "rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900",
              children: "Log in"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "rounded-[30px] border border-white/80 bg-white/95 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-10",
            children: [
              /* @__PURE__ */ jsxs("div", {
                className: "mb-8",
                children: [
                  /* @__PURE__ */ jsx("div", {
                    className: "mb-4 inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700",
                    children: "Signup"
                  }),
                  /* @__PURE__ */ jsx("h1", {
                    className: "text-4xl font-semibold tracking-[-0.04em] text-slate-950",
                    children: "Create your workspace access"
                  }),
                  /* @__PURE__ */ jsx("p", {
                    className: "mt-3 text-base leading-7 text-slate-500",
                    children: "Set up your ProVisioners account to manage projects, approvals, and delivery from one focused workspace."
                  })
                ]
              }),
              error && /* @__PURE__ */ jsx("div", {
                className: "mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700",
                children: error
              }),
              /* @__PURE__ */ jsxs("form", {
                onSubmit: handleSubmit,
                className: "space-y-5",
                children: [
                  /* @__PURE__ */ jsxs("label", {
                    className: "block",
                    children: [/* @__PURE__ */ jsx("span", {
                      className: "mb-2 block text-sm font-medium text-slate-600",
                      children: "Full name"
                    }), /* @__PURE__ */ jsxs("span", {
                      className: "relative block",
                      children: [/* @__PURE__ */ jsx(User, { className: "pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" }), /* @__PURE__ */ jsx("input", {
                        id: "fullName",
                        type: "text",
                        autoComplete: "name",
                        value: fullName,
                        onChange: (e) => setFullName(e.target.value),
                        placeholder: "John Doe",
                        required: true,
                        className: "h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                      })]
                    })]
                  }),
                  /* @__PURE__ */ jsxs("label", {
                    className: "block",
                    children: [/* @__PURE__ */ jsx("span", {
                      className: "mb-2 block text-sm font-medium text-slate-600",
                      children: "Email address"
                    }), /* @__PURE__ */ jsxs("span", {
                      className: "relative block",
                      children: [/* @__PURE__ */ jsx(Mail, { className: "pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" }), /* @__PURE__ */ jsx("input", {
                        id: "email",
                        type: "email",
                        autoComplete: "email",
                        value: email,
                        onChange: (e) => setEmail(e.target.value),
                        placeholder: "name@provisioners.com",
                        required: true,
                        className: "h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                      })]
                    })]
                  }),
                  /* @__PURE__ */ jsxs("label", {
                    className: "block",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "mb-2 flex items-center justify-between",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "text-sm font-medium text-slate-600",
                        children: "Password"
                      }), /* @__PURE__ */ jsx("span", {
                        className: "text-sm font-medium text-slate-400",
                        children: "Minimum 6 characters"
                      })]
                    }), /* @__PURE__ */ jsxs("span", {
                      className: "relative block",
                      children: [/* @__PURE__ */ jsx(Lock, { className: "pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" }), /* @__PURE__ */ jsx("input", {
                        id: "password",
                        type: "password",
                        autoComplete: "new-password",
                        value: password,
                        onChange: (e) => setPassword(e.target.value),
                        placeholder: "Create a password",
                        required: true,
                        minLength: 6,
                        className: "h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                      })]
                    })]
                  }),
                  /* @__PURE__ */ jsxs("label", {
                    className: "block",
                    children: [/* @__PURE__ */ jsx("span", {
                      className: "mb-2 block text-sm font-medium text-slate-600",
                      children: "Confirm password"
                    }), /* @__PURE__ */ jsxs("span", {
                      className: "relative block",
                      children: [/* @__PURE__ */ jsx(Lock, { className: "pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" }), /* @__PURE__ */ jsx("input", {
                        id: "confirmPassword",
                        type: "password",
                        autoComplete: "new-password",
                        value: confirmPassword,
                        onChange: (e) => setConfirmPassword(e.target.value),
                        placeholder: "Repeat your password",
                        required: true,
                        minLength: 6,
                        className: "h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                      })]
                    })]
                  }),
                  /* @__PURE__ */ jsxs("button", {
                    type: "submit",
                    disabled: loading || showSuccessLoader,
                    className: "flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#7c3aed_0%,#ec4899_100%)] px-4 text-base font-semibold text-white shadow-[0_18px_34px_rgba(168,85,247,0.32)] transition hover:scale-[1.01] hover:shadow-[0_20px_38px_rgba(168,85,247,0.38)] disabled:cursor-not-allowed disabled:opacity-70",
                    children: [loading ? /* @__PURE__ */ jsx("span", { className: "h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" }) : /* @__PURE__ */ jsx(UserPlus, { className: "h-5 w-5" }), showSuccessLoader ? "Preparing sign in..." : loading ? "Creating account..." : "Create account"]
                  })
                ]
              }),
              /* @__PURE__ */ jsxs("div", {
                className: "mt-8 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500",
                children: [/* @__PURE__ */ jsx("div", { className: "mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" }), /* @__PURE__ */ jsx("p", { children: "Secure account creation with team-ready access controls and workspace onboarding." })]
              }),
              /* @__PURE__ */ jsxs("p", {
                className: "mt-6 text-center text-sm text-slate-500",
                children: [
                  "Already have an account?",
                  " ",
                  /* @__PURE__ */ jsx(Link, {
                    to: "/login",
                    className: "font-semibold text-violet-600 transition hover:text-violet-700",
                    children: "Sign in"
                  })
                ]
              })
            ]
          })]
        })]
      }), /* @__PURE__ */ jsxs("aside", {
        className: "relative hidden overflow-hidden bg-[#0c1021] px-8 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-16",
        children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(126,90,255,0.45),transparent_28%),radial-gradient(circle_at_78%_24%,rgba(247,114,182,0.3),transparent_24%),linear-gradient(180deg,#131933_0%,#090d1d_100%)]" }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-position:center_center] [background-size:88px_88px]" }),
          /* @__PURE__ */ jsx("div", { className: "absolute right-[-140px] top-[-120px] h-[360px] w-[360px] rounded-full bg-fuchsia-500/20 blur-3xl" }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-[-180px] left-[-90px] h-[320px] w-[320px] rounded-full bg-violet-500/30 blur-3xl" }),
          /* @__PURE__ */ jsxs("div", {
            className: "relative z-10 mx-auto w-full max-w-[720px]",
            children: [
              /* @__PURE__ */ jsxs("div", {
                className: "mb-8 inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/80 backdrop-blur-md",
                children: [/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-emerald-400" }), "One place for briefs, delivery, and approvals"]
              }),
              /* @__PURE__ */ jsx("h2", {
                className: "max-w-[10ch] text-5xl font-semibold leading-[1.02] tracking-[-0.05em] text-white xl:text-6xl",
                children: "Start with structure, then move fast."
              }),
              /* @__PURE__ */ jsx("p", {
                className: "mt-6 max-w-xl text-lg leading-8 text-white/68",
                children: "Give every project a clear home from day one with a ClickUp-inspired workspace tailored for ProVisioners teams."
              }),
              /* @__PURE__ */ jsxs("div", {
                className: "mt-12 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "provisioners-auth-float rounded-[28px] border border-white/12 bg-white/10 p-5 shadow-[0_32px_80px_rgba(8,12,24,0.5)] backdrop-blur-xl",
                  children: [/* @__PURE__ */ jsxs("div", {
                    className: "mb-5 flex items-center justify-between",
                    children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
                      className: "text-xs uppercase tracking-[0.24em] text-white/45",
                      children: "Workspace Setup"
                    }), /* @__PURE__ */ jsx("p", {
                      className: "mt-1 text-xl font-semibold text-white",
                      children: "Team Launch"
                    })] }), /* @__PURE__ */ jsx("div", {
                      className: "rounded-full bg-cyan-400/18 px-3 py-1 text-xs font-semibold text-cyan-200",
                      children: "Guided"
                    })]
                  }), /* @__PURE__ */ jsx("div", {
                    className: "space-y-3",
                    children: [
                      [
                        "Account created",
                        "100%",
                        "bg-emerald-400"
                      ],
                      [
                        "Projects configured",
                        "72%",
                        "bg-violet-400"
                      ],
                      [
                        "Team invited",
                        "48%",
                        "bg-fuchsia-400"
                      ]
                    ].map(([label, value, accent], index) => /* @__PURE__ */ jsxs("div", {
                      className: "rounded-2xl border border-white/8 bg-slate-950/25 p-4",
                      children: [/* @__PURE__ */ jsxs("div", {
                        className: "mb-3 flex items-center justify-between text-sm",
                        children: [/* @__PURE__ */ jsx("span", {
                          className: "text-white/85",
                          children: label
                        }), /* @__PURE__ */ jsx("span", {
                          className: "text-white/50",
                          children: value
                        })]
                      }), /* @__PURE__ */ jsx("div", {
                        className: "h-2 rounded-full bg-white/10",
                        children: /* @__PURE__ */ jsx("div", {
                          className: `provisioners-metric-fill h-full rounded-full ${accent}`,
                          style: {
                            width: value,
                            animationDelay: `${index * 140}ms`
                          }
                        })
                      })]
                    }, label))
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-5",
                  children: [/* @__PURE__ */ jsxs("div", {
                    className: "provisioners-auth-float rounded-[28px] border border-white/12 bg-white/10 p-5 shadow-[0_28px_70px_rgba(8,12,24,0.42)] backdrop-blur-xl [animation-delay:140ms]",
                    children: [
                      /* @__PURE__ */ jsx("p", {
                        className: "text-xs uppercase tracking-[0.24em] text-white/45",
                        children: "First Week"
                      }),
                      /* @__PURE__ */ jsxs("div", {
                        className: "mt-4 flex items-end gap-3",
                        children: [/* @__PURE__ */ jsx("span", {
                          className: "text-5xl font-semibold tracking-[-0.05em]",
                          children: firstWeek.multiplier
                        }), /* @__PURE__ */ jsx("span", {
                          className: "pb-2 text-sm text-emerald-200",
                          children: "faster onboarding flow"
                        })]
                      }),
                      /* @__PURE__ */ jsx("div", {
                        className: "mt-5 flex gap-2",
                        children: firstWeek.heights.map((height, index) => /* @__PURE__ */ jsx("div", {
                          className: "flex-1 rounded-full bg-white/8 p-1",
                          children: /* @__PURE__ */ jsx("div", {
                            className: `provisioners-column-bar w-full rounded-full ${index % 2 === 0 ? "bg-violet-400" : "bg-fuchsia-400"}`,
                            style: {
                              height: `${height}px`,
                              animationDelay: `${index * 110}ms`
                            }
                          })
                        }, `${height}-${index}`))
                      })
                    ]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "provisioners-auth-float rounded-[28px] border border-white/12 bg-slate-950/30 p-5 shadow-[0_28px_70px_rgba(8,12,24,0.42)] backdrop-blur-xl [animation-delay:260ms]",
                    children: [
                      /* @__PURE__ */ jsx("p", {
                        className: "text-xs uppercase tracking-[0.24em] text-white/45",
                        children: "Included Views"
                      }),
                      /* @__PURE__ */ jsx("div", {
                        className: "mt-4 flex flex-wrap gap-2",
                        children: [
                          "Boards",
                          "Lists",
                          "Timeline",
                          "Reports"
                        ].map((item) => /* @__PURE__ */ jsx("span", {
                          className: "rounded-full border border-white/10 bg-white/8 px-3 py-2 text-sm text-white/80",
                          children: item
                        }, item))
                      }),
                      /* @__PURE__ */ jsxs("div", {
                        className: "mt-5 rounded-2xl border border-white/10 bg-white/8 p-4",
                        children: [/* @__PURE__ */ jsxs("div", {
                          className: "flex items-center justify-between text-sm text-white/80",
                          children: [/* @__PURE__ */ jsx("span", { children: "Setup completion" }), /* @__PURE__ */ jsx("span", { children: "82%" })]
                        }), /* @__PURE__ */ jsx("div", {
                          className: "mt-3 h-2 rounded-full bg-white/10",
                          children: /* @__PURE__ */ jsx("div", { className: "h-full w-[82%] rounded-full bg-[linear-gradient(90deg,#8b5cf6_0%,#ec4899_100%)]" })
                        })]
                      })
                    ]
                  })]
                })]
              })
            ]
          }),
          /* @__PURE__ */ jsxs("div", {
            className: "relative z-10 mx-auto flex w-full max-w-[720px] items-center justify-between text-sm text-white/45",
            children: [/* @__PURE__ */ jsx("span", { children: "\xA9 2026 ProVisioners" }), /* @__PURE__ */ jsx("span", { children: "Focused delivery for modern teams" })]
          })
        ]
      })]
    })
  }), showSuccessLoader && /* @__PURE__ */ jsx(SignupSuccessLoader, {})] });
}
function SignupSuccessLoader() {
  const progress = useRandomLoaderProgress();
  const stageLabel = progress < 24 ? "Creating account" : progress < 52 ? "Configuring workspace" : progress < 82 ? "Preparing sign in" : progress < 100 ? "Finalizing access" : "Ready";
  return /* @__PURE__ */ jsxs("div", {
    className: "fixed inset-0 z-50 overflow-hidden bg-[#070b17] text-white",
    children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.35),transparent_34%),radial-gradient(circle_at_bottom,rgba(236,72,153,0.28),transparent_28%)]" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:90px_90px]" }),
      /* @__PURE__ */ jsx("div", {
        className: "relative flex min-h-screen items-center justify-center px-6",
        children: /* @__PURE__ */ jsxs("div", {
          className: "provisioners-loader-shell w-full max-w-4xl rounded-[36px] border border-white/10 bg-white/6 px-6 py-10 shadow-[0_40px_120px_rgba(3,6,18,0.7)] backdrop-blur-2xl sm:px-10 sm:py-12",
          children: [
            /* @__PURE__ */ jsxs("div", {
              className: "mb-8 text-center",
              children: [
                /* @__PURE__ */ jsx("p", {
                  className: "text-sm font-semibold uppercase tracking-[0.34em] text-white/50",
                  children: "Account created"
                }),
                /* @__PURE__ */ jsx("h2", {
                  className: "mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl",
                  children: "Welcome to ProVisioners"
                }),
                /* @__PURE__ */ jsx("p", {
                  className: "mt-3 text-base text-white/60",
                  children: "Finalizing your account and preparing the sign-in flow."
                })
              ]
            }),
            /* @__PURE__ */ jsxs("svg", {
              viewBox: "0 0 920 300",
              className: "mx-auto w-full max-w-3xl overflow-visible",
              role: "img",
              "aria-label": "ProVisioners signup animation",
              children: [
                /* @__PURE__ */ jsxs("defs", { children: [/* @__PURE__ */ jsxs("linearGradient", {
                  id: "provisioners-signup-gradient",
                  x1: "0%",
                  y1: "0%",
                  x2: "100%",
                  y2: "0%",
                  children: [
                    /* @__PURE__ */ jsx("stop", {
                      offset: "0%",
                      stopColor: "#8b5cf6"
                    }),
                    /* @__PURE__ */ jsx("stop", {
                      offset: "55%",
                      stopColor: "#c026d3"
                    }),
                    /* @__PURE__ */ jsx("stop", {
                      offset: "100%",
                      stopColor: "#22d3ee"
                    })
                  ]
                }), /* @__PURE__ */ jsxs("filter", {
                  id: "provisioners-signup-glow",
                  x: "-50%",
                  y: "-50%",
                  width: "200%",
                  height: "200%",
                  children: [/* @__PURE__ */ jsx("feGaussianBlur", {
                    stdDeviation: "7",
                    result: "coloredBlur"
                  }), /* @__PURE__ */ jsxs("feMerge", { children: [/* @__PURE__ */ jsx("feMergeNode", { in: "coloredBlur" }), /* @__PURE__ */ jsx("feMergeNode", { in: "SourceGraphic" })] })]
                })] }),
                /* @__PURE__ */ jsx("path", {
                  id: "provisioners-signup-track",
                  d: "M78 90C178 18 280 33 380 92C481 152 576 214 700 182C778 162 842 115 879 84",
                  fill: "none",
                  stroke: "url(#provisioners-signup-gradient)",
                  strokeWidth: "4",
                  strokeLinecap: "round",
                  className: "provisioners-loader-track"
                }),
                /* @__PURE__ */ jsx("circle", {
                  r: "7",
                  fill: "#fff",
                  filter: "url(#provisioners-signup-glow)",
                  className: "provisioners-loader-dot",
                  children: /* @__PURE__ */ jsx("animateMotion", {
                    dur: "1.9s",
                    repeatCount: "indefinite",
                    rotate: "auto",
                    children: /* @__PURE__ */ jsx("mpath", { href: "#provisioners-signup-track" })
                  })
                }),
                /* @__PURE__ */ jsx("circle", {
                  r: "18",
                  fill: "url(#provisioners-signup-gradient)",
                  opacity: "0.22",
                  children: /* @__PURE__ */ jsx("animateMotion", {
                    dur: "1.9s",
                    repeatCount: "indefinite",
                    children: /* @__PURE__ */ jsx("mpath", { href: "#provisioners-signup-track" })
                  })
                }),
                /* @__PURE__ */ jsx("text", {
                  x: "460",
                  y: "182",
                  textAnchor: "middle",
                  className: "provisioners-loader-word-outline",
                  fill: "none",
                  stroke: "url(#provisioners-signup-gradient)",
                  strokeWidth: "2",
                  paintOrder: "stroke",
                  children: "ProVisioners"
                }),
                /* @__PURE__ */ jsx("text", {
                  x: "460",
                  y: "182",
                  textAnchor: "middle",
                  className: "provisioners-loader-word-fill",
                  fill: "url(#provisioners-signup-gradient)",
                  children: "ProVisioners"
                }),
                /* @__PURE__ */ jsx("path", {
                  d: "M248 228H672",
                  fill: "none",
                  stroke: "url(#provisioners-signup-gradient)",
                  strokeLinecap: "round",
                  strokeWidth: "3",
                  className: "provisioners-loader-underline"
                })
              ]
            }),
            /* @__PURE__ */ jsxs("div", {
              className: "mx-auto mt-8 w-full max-w-xl",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.22em] text-white/55",
                children: [/* @__PURE__ */ jsx("span", { children: stageLabel }), /* @__PURE__ */ jsxs("span", { children: [progress, "%"] })]
              }), /* @__PURE__ */ jsx("div", {
                className: "h-2 overflow-hidden rounded-full bg-white/10",
                children: /* @__PURE__ */ jsx("div", {
                  className: "provisioners-loader-progress h-full rounded-full bg-[linear-gradient(90deg,#8b5cf6_0%,#d946ef_55%,#22d3ee_100%)]",
                  style: { width: `${progress}%` }
                })
              })]
            })
          ]
        })
      })
    ]
  });
}
function useRandomLoaderProgress() {
  const [milestones] = useState(() => createLoaderMilestones());
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frameId = 0;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = Math.min(now - start, LOADER_DURATION_MS);
      let nextProgress = 100;
      for (let index = 1; index < milestones.length; index += 1) {
        const previous = milestones[index - 1];
        const current = milestones[index];
        if (elapsed <= current.at) {
          const segmentDuration = current.at - previous.at || 1;
          const rawProgress = (elapsed - previous.at) / segmentDuration;
          const eased = 1 - Math.pow(1 - Math.max(0, rawProgress), 3);
          nextProgress = previous.value + (current.value - previous.value) * eased;
          break;
        }
      }
      setProgress(Math.min(100, Math.round(nextProgress)));
      if (elapsed < LOADER_DURATION_MS) frameId = window.requestAnimationFrame(tick);
    };
    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [milestones]);
  return progress;
}
function createLoaderMilestones() {
  const randomBetween = (min, max) => Math.round(min + Math.random() * (max - min));
  return [
    {
      at: 0,
      value: 0
    },
    {
      at: randomBetween(180, 260),
      value: randomBetween(7, 13)
    },
    {
      at: randomBetween(520, 760),
      value: randomBetween(22, 35)
    },
    {
      at: randomBetween(980, 1240),
      value: randomBetween(45, 59)
    },
    {
      at: randomBetween(1420, 1710),
      value: randomBetween(66, 80)
    },
    {
      at: randomBetween(1880, 2120),
      value: randomBetween(87, 95)
    },
    {
      at: LOADER_DURATION_MS,
      value: 100
    }
  ];
}
function createFirstWeekSnapshot() {
  const randomBetween = (min, max) => Math.round(min + Math.random() * (max - min));
  return {
    multiplier: `${(2.6 + Math.random() * 1.6).toFixed(1)}x`,
    heights: Array.from({ length: 6 }, (_, index) => {
      var _a;
      const base = (_a = [
        30,
        46,
        64,
        82,
        60,
        74
      ][index]) != null ? _a : 52;
      return Math.max(22, Math.min(96, base + randomBetween(-10, 12)));
    })
  };
}

export { SignupPage as component };
//# sourceMappingURL=signup-Buaug__b.mjs.map
