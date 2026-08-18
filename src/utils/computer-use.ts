/**
 * Computer-use is deliberately not part of Cubic AI's first legal-workspace
 * experience. It can be enabled for a future controlled deployment only with
 * an explicit build-time opt-in.
 */
export function isComputerUseEnabled(): boolean {
  return import.meta.env.VITE_ENABLE_COMPUTER_USE === "true";
}
