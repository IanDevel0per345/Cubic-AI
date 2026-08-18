import { useTranslation } from "react-i18next";
import CubicAiLogo from "#/assets/branding/cubic-ai-logo-transparent.png";
import { NavigationLink } from "#/components/shared/navigation-link";
import { I18nKey } from "#/i18n/declaration";
import { cn } from "#/utils/utils";

const DEFAULT_LOGO_WIDTH = 46;
const DEFAULT_LOGO_HEIGHT = 30;

export type OpenHandsLogoButtonProps = {
  className?: string;
  /** Applied to the root `<img>` (e.g. `max-w-none` so Tailwind preflight doesn’t clamp wide marks inside a narrow flex slot). */
  logoClassName?: string;
  logoWidth?: number;
  logoHeight?: number;
  showWordmark?: boolean;
};

export function OpenHandsLogoButton({
  className,
  logoClassName,
  logoWidth = DEFAULT_LOGO_WIDTH,
  logoHeight = DEFAULT_LOGO_HEIGHT,
  showWordmark = false,
}: OpenHandsLogoButtonProps = {}) {
  const { t } = useTranslation("openhands");

  const ariaLabel = t(I18nKey.BRANDING$OPENHANDS_LOGO);
  const wordmark = t(I18nKey.BRANDING$OPENHANDS).replace(/\s+AI$/i, "");

  return (
    <NavigationLink
      to="/conversations"
      aria-label={ariaLabel}
      className={cn(className)}
    >
      <img
        src={CubicAiLogo}
        alt=""
        width={logoWidth}
        height={logoHeight}
        className={cn("shrink-0 object-contain", logoClassName)}
      />
      {showWordmark ? (
        <span
          aria-hidden="true"
          className="whitespace-nowrap text-[22px] leading-none text-white"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          {wordmark}
        </span>
      ) : null}
    </NavigationLink>
  );
}
