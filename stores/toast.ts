import type { ToastType, Toasts } from "~/types/types";

export const useToastStore = defineStore("toastStore", {
  state: () =>
    ({
      index: 0,
      toasts: [],
    } as Toasts),

  actions: {
    getToasts() {
      return this.toasts;
    },
    toast(type: ToastType, title: string, message: string) {
      const toast = {
        id: this.index++,
        type: type,
        title: title,
        message: message,
      };

      setTimeout(function (this: any) {
        this.remove(toast.id);
      }.bind(this), 6000);

      this.toasts.push(toast);
    },
    success(title: string, message: string) {
      this.toast("success", title, message);
    },
    error(title: string, message: string) {
      this.toast("error", title, message);
    },
    info(title: string, message: string) {
      this.toast("info", title, message);
    },
    clear() {
      this.toasts = [];
    },
    remove(id: number) {
      this.toasts = this.toasts.filter((toast) => toast.id !== id);
    },
    getIcon(type: string): string {
      switch (type) {
        case "success":
          return "TickCircle";
        case "error":
          return "CloseCircle";
        case "info":
          return "InfoCircle";
      }
      return "";
    },
  },
});
