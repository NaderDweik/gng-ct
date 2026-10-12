/*
 * Which page and button brought a visitor to the register form, so register_started / _error /
 * _sent can say so (from_page, from_placement). Kept for the tab's session only.
 */

const KEY = "gc-register-source";

export function rememberRegisterSource(placement: string) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ page: window.location.pathname, placement }));
  } catch {
    // Private mode / storage blocked: the events just go without it.
  }
}

/** { from_page, from_placement }; "direct" when the visitor opened the form page itself. */
export function registerSource(): { from_page: string; from_placement: string } {
  try {
    const saved = JSON.parse(sessionStorage.getItem(KEY) ?? "null") as { page: string; placement: string } | null;
    if (saved) return { from_page: saved.page, from_placement: saved.placement };
  } catch {
    // Fall through.
  }
  return { from_page: "direct", from_placement: "direct" };
}
