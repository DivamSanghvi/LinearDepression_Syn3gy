import { toast as sonnerToast } from "sonner"; // Sonner for Next.js

export const toast = (message, type = "success") => {
  sonnerToast(message, {
    type, // Options: 'success', 'error', 'info'
  });
};
