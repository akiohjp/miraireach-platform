const CHANNEL = "gam-hq-dashboard";

/** DOM event for same-tab refresh (BroadcastChannel may not echo to the posting window in all browsers). */
export const GAM_DASHBOARD_REFRESH_EVENT = "gam-hq-dashboard-refresh";

/** Notify dashboards to refetch (same tab + other tabs / workers on the origin). */
export function broadcastGamDashboardRefresh(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(GAM_DASHBOARD_REFRESH_EVENT));
  if (typeof BroadcastChannel === "undefined") return;
  try {
    const bc = new BroadcastChannel(CHANNEL);
    bc.postMessage("refresh");
    bc.close();
  } catch {
    /* ignore */
  }
}

export function subscribeGamDashboardRefresh(onRefresh: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const handler = () => onRefresh();
  window.addEventListener(GAM_DASHBOARD_REFRESH_EVENT, handler);

  let bcClose: (() => void) | undefined;
  if (typeof BroadcastChannel !== "undefined") {
    try {
      const bc = new BroadcastChannel(CHANNEL);
      bc.onmessage = () => onRefresh();
      bcClose = () => bc.close();
    } catch {
      /* ignore */
    }
  }

  return () => {
    window.removeEventListener(GAM_DASHBOARD_REFRESH_EVENT, handler);
    bcClose?.();
  };
}
