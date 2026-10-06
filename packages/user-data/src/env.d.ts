interface ImportMetaEnv {
  readonly PUBLIC_REPO_DELAY?: string;
  readonly PUBLIC_REPO_FAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}