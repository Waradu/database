import type { DatabaseData, AnyTable, Overlay } from "~/types/types";

export const useOverlayStore = defineStore("overlayStore", {
  state: () =>
    ({
      isOverlayVisible: false,
      currentData: null,
      currentType: "rows"
    } as Overlay),

  actions: {
    showOverlay(type: DatabaseData, data: AnyTable) {
      this.currentType = type;
      this.currentData = data;
      this.isOverlayVisible = true;
    },
    hideOverlay() {
      this.isOverlayVisible = false;
      this.currentData = null;
    }
  },
});