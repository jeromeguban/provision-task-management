import { jsx } from "react/jsx-runtime";
//#region src/components/ui/Card.tsx
function Card({ children, padding = true, className = "", ...props }) {
	return /* @__PURE__ */ jsx("div", {
		className: `provisioners-glass rounded-[24px] ${padding ? "p-6" : ""} ${className}`,
		...props,
		children
	});
}
//#endregion
export { Card as t };
