import { module1, module2, module3 } from "./modules-1-3";
import { module4, module5, module6, module7 } from "./modules-4-7";
import type { ModuleVideo } from "./types";

export * from "./types";

/** Narrated module videos, keyed by module position (1–7). */
export const MODULE_VIDEOS: Record<number, ModuleVideo> = {
  1: module1,
  2: module2,
  3: module3,
  4: module4,
  5: module5,
  6: module6,
  7: module7,
};

/** Module 1's video is a free preview, like its first lesson. */
export const FREE_PREVIEW_VIDEO_MODULES = new Set([1]);
