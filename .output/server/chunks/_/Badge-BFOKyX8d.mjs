import { jsx } from 'react/jsx-runtime';

var variantClasses = {
  default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  primary: "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  danger: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
  info: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300"
};
function Badge({ variant = "default", children, className = "" }) {
  return /* @__PURE__ */ jsx("span", {
    className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`,
    children
  });
}

export { Badge as B };
//# sourceMappingURL=Badge-BFOKyX8d.mjs.map
