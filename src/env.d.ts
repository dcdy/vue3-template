/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

// 声明环境变量
interface ImportMetaEnv {
    VITE_BASE_URL: string;
}
interface ImportMeta {
    readonly env: ImportMetaEnv;
}
