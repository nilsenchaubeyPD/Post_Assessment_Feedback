import { LINKEDIN_URL, TOPIN } from "../../config/config";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <a
        className={styles.item}
        href={TOPIN.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>Powered by</span>
        <img className={styles.topinLogo} src={TOPIN.logo} alt="topin.tech" />
      </a>

      <span className={styles.dot} aria-hidden="true" />

      <a
        className={styles.item}
        href={LINKEDIN_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="topin.tech on LinkedIn"
      >
        <span>Follow us on</span>
        <span className={styles.linkedin} aria-hidden="true">
          <span className={styles.linkedinText}>Linked</span>
          <span className={styles.linkedinBadge}>
            <span className={styles.linkedinIn}>in</span>
          </span>
        </span>
      </a>
    </footer>
  );
}
