import {
  Links,
  LinksFunction,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigate,
  useNavigation as useRouterNavigation,
} from "react-router";
import "./tailwind.css";
import "./index.css";
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import {
  clearCachedAgentServerInfo,
  isAgentServerUnavailableError,
  isAgentServerAuthError,
} from "#/api/agent-server-compatibility";
import {
  getLockedCloudHost,
  isCompanyManagedFrontend,
} from "#/api/agent-server-config";
import {
  authenticateWithMainAppCookie,
  redirectToMainAppLogin,
  shouldUseMainAppCookieAuth,
} from "#/api/main-app-auth";
import { getEffectiveLocalBackend } from "#/api/backend-registry/active-store";
import { useActiveBackendContext } from "#/contexts/active-backend-context";
import {
  isCloudBackendApiKeyOrNetworkHealthError,
  isCloudBackendLoggedOutHealthError,
  useBackendsHealth,
} from "#/hooks/query/use-backends-health";
import { TOAST_OPTIONS } from "#/utils/custom-toast-handlers";
import { LoadingSpinner } from "#/components/shared/loading-spinner";
import { useConfig } from "#/hooks/query/use-config";
import { QUERY_KEYS } from "#/hooks/query/query-keys";
import { AgentServerUIRoot } from "#/components/providers";
import { TelemetryConsentBanner } from "#/components/features/analytics/telemetry-consent-banner";
import { buildAgentCanvasPath } from "#/utils/base-path";
import { NavigationProvider } from "#/context/navigation-context";
import {
  applyColorTheme,
  readPersistedColorTheme,
} from "#/themes/color-themes";

/** Applies the persisted color-theme palette to document.body on mount. */
function ColorThemeApplier() {
  React.useEffect(() => {
    applyColorTheme(readPersistedColorTheme());
  }, []);
  return null;
}

// Only rendered when the active backend is unreachable; keep the modal out of
// the default root graph.
const ManageBackendsModal = React.lazy(() =>
  import("#/components/features/backends/manage-backends-modal").then((m) => ({
    default: m.ManageBackendsModal,
  })),
);

// Rendered when the backend returns 401 (public mode — user must paste key).
const ApiKeyEntryScreen = React.lazy(
  () => import("#/components/features/backends/api-key-entry-screen"),
);

// Rendered only for first-run public/frontend-only bootstraps; keep the
// onboarding flow out of the root bundle until this rare gate is active.
const OnboardingModal = React.lazy(() =>
  import("#/components/features/onboarding/onboarding-modal").then((m) => ({
    default: m.OnboardingModal,
  })),
);

// Rendered for first-run in locked-to-Cloud mode; shows Cloud login directly
// without the onboarding progress bars.
const BackendFormModal = React.lazy(() =>
  import("#/components/features/backends/backend-form-modal").then((m) => ({
    default: m.BackendFormModal,
  })),
);

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body data-agent-server-ui="" className="m-0">
        <AgentServerUIRoot contentClassName="min-h-screen">
          <ColorThemeApplier />
          {children}
          <Toaster toastOptions={TOAST_OPTIONS} />
          <div id="modal-portal-exit" />
        </AgentServerUIRoot>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function AgentServerBootstrapLoading() {
  return (
    <main className="min-h-screen bg-base px-6 py-10 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center">
        <div className="rounded-3xl border border-white/10 bg-base/80 px-8 py-10 shadow-2xl">
          <LoadingSpinner size="large" />
        </div>
      </div>
    </main>
  );
}

/**
 * When the active backend is unreachable, the rest of the app cannot
 * render (most queries chain off of `/server_info`). Drop a minimal
 * placeholder behind the Manage Backends modal so the user can edit,
 * add, or pick another backend right away.
 */
function MissingAgentServerScreen() {
  const queryClient = useQueryClient();

  // The modal is the no-backend gate. Selecting or adding a reachable
  // backend must re-run the /server_info probe; otherwise the app stays
  // behind the recovery screen because the failed bootstrap query will not
  // re-fire on its own. Re-fetch only when a backend now exists.
  const handleClose = React.useCallback(() => {
    if (getEffectiveLocalBackend()) {
      clearCachedAgentServerInfo();
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.WEB_CLIENT_CONFIG,
      });
    }
  }, [queryClient]);

  return (
    <main
      data-testid="agent-server-onboarding-screen"
      className="min-h-screen bg-base"
    >
      <React.Suspense fallback={null}>
        <ManageBackendsModal onClose={handleClose} recoveryMode />
      </React.Suspense>
    </main>
  );
}
function FirstRunOnboardingScreen({ onClose }: { onClose: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const routerNavigation = useRouterNavigation();
  const conversationId =
    location.pathname.match(/^\/conversations\/([^/]+)/)?.[1] ?? null;
  const navigationValue = React.useMemo(
    () => ({
      currentPath: location.pathname,
      conversationId,
      isNavigating: Boolean(routerNavigation.location),
      navigate: (to: string, options?: { replace?: boolean }) =>
        navigate(to, options),
    }),
    [conversationId, location.pathname, navigate, routerNavigation.location],
  );

  const lockedCloudHost = getLockedCloudHost();
  const isLockedToCloud = lockedCloudHost !== null;

  // In locked-to-Cloud mode, show the Add Backend modal directly with Cloud
  // login, instead of the full onboarding flow with progress bars. This
  // matches the UX expectation for canvas.openhands.dev where Cloud is the
  // only backend option.
  if (isLockedToCloud) {
    return (
      <main
        data-testid="first-run-onboarding-screen"
        className="min-h-screen bg-base"
      >
        <React.Suspense fallback={<AgentServerBootstrapLoading />}>
          <BackendFormModal
            mode="add"
            onClose={onClose}
            source="manage_backends_modal"
            hideCloseButton
          />
        </React.Suspense>
      </main>
    );
  }

  return (
    <main
      data-testid="first-run-onboarding-screen"
      className="min-h-screen bg-base"
    >
      <NavigationProvider value={navigationValue}>
        <React.Suspense fallback={<AgentServerBootstrapLoading />}>
          <OnboardingModal onClose={onClose} />
        </React.Suspense>
      </NavigationProvider>
    </main>
  );
}

export const links: LinksFunction = () => [
  {
    rel: "icon",
    type: "image/svg+xml",
    href: buildAgentCanvasPath("/favicon.svg"),
  },
];

export const meta: MetaFunction = () => [
  { title: "Cubic AI" },
  {
    name: "description",
    content:
      "Workspace jurídico com inteligência artificial para pesquisa, análise e elaboração de documentos.",
  },
];

export default function App() {
  const companyManagedFrontend = isCompanyManagedFrontend();

  // The public Cubic AI product owns its agent connection; users never enter
  // backend credentials in this frontend.
  const authMissing = false;
  const { active } = useActiveBackendContext();
  const shouldCheckMainAppAuth =
    !companyManagedFrontend && shouldUseMainAppCookieAuth();
  // The legacy onboarding remains in the codebase for internal/local builds,
  // but is never mounted by the public company-owned product.
  const showFirstRunOnboarding = false;
  const mainAppAuth = useQuery({
    queryKey: QUERY_KEYS.MAIN_APP_COOKIE_AUTH,
    queryFn: authenticateWithMainAppCookie,
    enabled: shouldCheckMainAppAuth && !showFirstRunOnboarding,
    retry: false,
    staleTime: 1000 * 60 * 5,
    meta: { disableToast: true },
  });
  const waitingForMainAppAuth =
    shouldCheckMainAppAuth &&
    !showFirstRunOnboarding &&
    mainAppAuth.isPending &&
    !mainAppAuth.isError;
  const redirectingToMainAppLogin =
    shouldCheckMainAppAuth && mainAppAuth.data === false;
  const mainAppAuthAllowsBackendQueries =
    !shouldCheckMainAppAuth || mainAppAuth.data === true || mainAppAuth.isError;

  React.useEffect(() => {
    if (redirectingToMainAppLogin) redirectToMainAppLogin();
  }, [redirectingToMainAppLogin]);

  // Skip the /server_info probe entirely when we already know auth is
  // required and missing — it would just 401 and waste time. Also keep the
  // root bootstrap quiet while the first-run onboarding modal owns backend
  // collection; the onboarding steps issue their own backend-specific queries.
  const config = useConfig({
    enabled:
      !companyManagedFrontend &&
      !authMissing &&
      !showFirstRunOnboarding &&
      mainAppAuthAllowsBackendQueries,
  });
  const activeCloudHealth = useBackendsHealth(
    !companyManagedFrontend &&
      active.backend.kind === "cloud" &&
      mainAppAuthAllowsBackendQueries
      ? [active.backend]
      : [],
  )[active.backend.id];
  const activeCloudLoggedOut =
    active.backend.kind === "cloud" &&
    activeCloudHealth?.isConnected === false &&
    isCloudBackendLoggedOutHealthError(activeCloudHealth.lastError);
  // A cloud backend the health probe has given up on (disabled after repeated
  // CORS/network failures) is unreachable from this origin — most commonly a
  // self-hosted OHE that doesn't allow this frontend's origin. Route to the
  // same recovery screen as a logged-out backend so the user sees the real
  // connectivity error, not a misleading "LLM not configured" home page.
  const activeCloudUnreachable =
    active.backend.kind === "cloud" &&
    activeCloudHealth?.disabled === true &&
    isCloudBackendApiKeyOrNetworkHealthError(activeCloudHealth.lastError);

  if (showFirstRunOnboarding) {
    return (
      <>
        <FirstRunOnboardingScreen onClose={() => undefined} />
        <TelemetryConsentBanner />
      </>
    );
  }

  if (waitingForMainAppAuth || redirectingToMainAppLogin) {
    return <AgentServerBootstrapLoading />;
  }

  // No key at all after onboarding was skipped/completed → auth screen.
  // Stale key → /server_info 401 → auth screen (public mode only).
  if (authMissing || isAgentServerAuthError(config.error)) {
    return (
      <React.Suspense fallback={<AgentServerBootstrapLoading />}>
        <ApiKeyEntryScreen />
      </React.Suspense>
    );
  }

  if (!companyManagedFrontend && (config.isPending || config.isLoading)) {
    return <AgentServerBootstrapLoading />;
  }

  if (
    !companyManagedFrontend &&
    (activeCloudLoggedOut ||
      activeCloudUnreachable ||
      isAgentServerUnavailableError(config.error))
  ) {
    return <MissingAgentServerScreen />;
  }

  return (
    <>
      <Outlet />
      <TelemetryConsentBanner />
    </>
  );
}
