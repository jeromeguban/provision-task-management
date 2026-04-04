import { jsx } from 'react/jsx-runtime';

function Card({ children, padding = true, className = "", ...props }) {
  return /* @__PURE__ */ jsx("div", {
    className: `provisioners-glass rounded-[24px] ${padding ? "p-6" : ""} ${className}`,
    ...props,
    children
  });
}

export { Card as C };
//# sourceMappingURL=Card-jDSerDDM.mjs.map
