import React from "react";

type MotionDivProps = React.HTMLAttributes<HTMLDivElement> & {
  initial?: object;
  animate?: object;
  variants?: object;
  transition?: object;
  whileInView?: object;
  viewport?: object;
};

// Import motion; in some production bundles it can be mis-resolved and cause "e is not a function".
// We only use motion.div if it's a function component; otherwise fall back to a plain div.
import * as FramerMotion from "framer-motion";

const motionObj =
  (FramerMotion as { motion?: { div?: unknown }; default?: { motion?: { div?: unknown } } }).motion ??
  (FramerMotion as { default?: { motion?: { div?: unknown } } }).default?.motion ??
  (FramerMotion as { default?: { div?: unknown } }).default;

const rawDiv = motionObj && (motionObj as { div?: unknown }).div;
const motionDiv =
  typeof rawDiv === "function"
    ? (rawDiv as React.ComponentType<MotionDivProps>)
    : ("div" as unknown as React.ComponentType<MotionDivProps>);

export const motionSafe = {
  div: motionDiv,
};
