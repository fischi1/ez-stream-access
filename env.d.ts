/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DEBUG_CALLBACK_URL: string | undefined
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare const APP_VERSION: string;
