import { toast } from "react-hot-toast";

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      style: {
        background: "#1a1a1a",
        color: "#fff",
        border: "1px solid #22c55e",
      },
    });
  },
  error: (message: string) => {
    toast.error(message, {
      style: {
        background: "#1a1a1a",
        color: "#fff",
        border: "1px solid #ef4444",
      },
    });
  },
}; 