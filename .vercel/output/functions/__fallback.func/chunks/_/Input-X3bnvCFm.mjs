import { jsxs, jsx } from 'react/jsx-runtime';
import { forwardRef } from 'react';

var Input = forwardRef(({ label, error, id, className = "", ...props }, ref) => {
  return /* @__PURE__ */ jsxs("div", { children: [
    label && /* @__PURE__ */ jsx("label", {
      htmlFor: id,
      className: "block text-sm font-medium text-text-secondary mb-1.5",
      children: label
    }),
    /* @__PURE__ */ jsx("input", {
      ref,
      id,
      className: `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface text-text-primary placeholder:text-text-tertiary ${error ? "border-rose-400" : "border-border"} ${className}`,
      ...props
    }),
    error && /* @__PURE__ */ jsx("p", {
      className: "mt-1 text-sm text-rose-500",
      children: error
    })
  ] });
});
Input.displayName = "Input";

export { Input as I };
//# sourceMappingURL=Input-X3bnvCFm.mjs.map
