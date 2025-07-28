import React from "react";

/**
 * VisuallyHidden component for accessibility.
 * Hides content visually but remains accessible to screen readers.
 */
const VisuallyHidden: React.FC<React.PropsWithChildren<object>> = ({
  children,
}) => (
  <span
    style={{
      border: 0,
      clip: "rect(0 0 0 0)",
      height: "1px",
      margin: "-1px",
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      width: "1px",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </span>
);

export default VisuallyHidden;
