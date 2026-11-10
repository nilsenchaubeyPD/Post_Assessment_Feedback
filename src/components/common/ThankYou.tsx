import type { ReactNode, Ref } from "react";
import { Check } from "lucide-react";
import styles from "./ThankYou.module.css";

interface ThankYouProps {
  title: string;
  text: string;
  headingRef?: Ref<HTMLHeadingElement>;
  children?: ReactNode;
}

export function ThankYou({ title, text, headingRef, children }: ThankYouProps) {
  return (
    <>
      <div className={styles.check} aria-hidden="true">
        <Check size={24} strokeWidth={2.25} />
      </div>
      <div className={styles.textGroup}>
        <h2 ref={headingRef} tabIndex={-1} className={`${styles.title} ${styles.heading}`}>
          {title}
        </h2>
        <p className={styles.text}>{text}</p>
      </div>
      {children ? <div className={styles.extra}>{children}</div> : null}
    </>
  );
}
