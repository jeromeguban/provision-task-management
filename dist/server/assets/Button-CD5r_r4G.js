import { forwardRef } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/components/ui/Button.tsx
var variantClasses = {
	primary: "bg-[linear-gradient(135deg,#7c3aed_0%,#ec4899_100%)] text-white shadow-[0_18px_34px_rgba(168,85,247,0.24)] hover:shadow-[0_20px_38px_rgba(168,85,247,0.32)]",
	secondary: "provisioners-glass text-text-primary hover:bg-surface-tertiary shadow-sm",
	ghost: "hover:bg-surface-tertiary text-text-secondary",
	danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
};
var sizeClasses = {
	sm: "px-3 py-1.5 text-sm",
	md: "px-4 py-2 text-sm",
	lg: "px-5 py-2.5 text-base"
};
var Button = forwardRef(({ variant = "primary", size = "md", className = "", disabled, children, ...props }, ref) => {
	return /* @__PURE__ */ jsx("button", {
		ref,
		disabled,
		className: `inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`,
		...props,
		children
	});
});
Button.displayName = "Button";
//#endregion
export { Button as t };
