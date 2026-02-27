import { showToast } from "../components/ui/Toast";

export function useToast() {
  return {
    success: (msg: string) => showToast(msg, "success"),
    error: (msg: string) => showToast(msg, "error"),
    info: (msg: string) => showToast(msg, "info"),
  };
}
