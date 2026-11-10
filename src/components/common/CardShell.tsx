import type { ReactNode } from "react";
import styles from "./CardShell.module.css";

interface CardShellProps {
  children: ReactNode;
  /** Thank-you variant: centred content, tighter gap, roomier padding. */
  centered?: boolean;
  className?: string;
}

export function CardShell({ children, centered = false, className }: CardShellProps) {
  const classes = [styles.card, centered ? styles.centered : "", className ?? ""]
    .filter(Boolean)
    .join(" ");
  return <div className={classes}>{children}</div>;
}
