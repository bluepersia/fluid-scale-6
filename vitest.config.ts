// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./test/setup.ts"], // <-- runs at start
    // or setupFilesAfterEnv: ['./test/setupAfterEnv.ts'],
  },
});
