import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
    plugins: [solidPlugin()],
    optimizeDeps: {
        include: ["common"],
    },
    build: {
        commonjsOptions: {
            include: [],
            exclude: ["commons"],
        },
    },
});
