import { ChevronDown, OctagonAlert, Wifi } from "lucide-react";
import {
  CONNECTION,
  CONNECTION_ICON_COLOR,
  ORG,
  USER,
} from "../../config/config";
import styles from "./Header.module.css";

interface HeaderProps {
  onReportClick: () => void;
}

export function Header({ onReportClick }: HeaderProps) {
  const connectionColor =
    CONNECTION_ICON_COLOR[CONNECTION.quality] ?? CONNECTION_ICON_COLOR.Excellent;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <img
          className={styles.orgLogo}
          src={ORG.logo}
          width={ORG.logoWidth}
          height={ORG.logoHeight}
          alt={ORG.name}
        />

        <div className={styles.right}>
          <button
            type="button"
            className={`${styles.item} ${styles.interactive}`}
            onClick={onReportClick}
          >
            <OctagonAlert
              className={styles.icon}
              size={16}
              strokeWidth={1.5}
              color="var(--header-text)"
              aria-hidden="true"
            />
            <span className={styles.collapsibleLabel}>Report</span>
          </button>

          <div
            className={`${styles.item} ${styles.connection}`}
            role="status"
            aria-label={`Connection: ${CONNECTION.quality}`}
          >
            <Wifi
              className={styles.icon}
              size={16}
              strokeWidth={1.5}
              color={connectionColor}
              aria-hidden="true"
            />
            <span className={styles.collapsibleLabel}>{CONNECTION.quality}</span>
          </div>

          <button
            type="button"
            className={`${styles.item} ${styles.interactive}`}
            aria-label={`Account: ${USER.name}`}
          >
            <span>{USER.name}</span>
            <ChevronDown
              className={styles.icon}
              size={16}
              strokeWidth={1.5}
              color="var(--header-text)"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
