import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
  icon?: ReactNode;
}

export function Button({
  variant = "primary",
  fullWidth = false,
  icon,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = [
    styles.button,
    variant === "primary" ? styles.primary : styles.secondary,
    fullWidth ? styles.fullWidth : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...rest}>
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      {children}
    </button>
  );
}
