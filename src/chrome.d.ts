// TypeScript types for Chrome Extensions API (minimal for tabs)
declare namespace chrome {
  namespace tabs {
    function query(queryInfo: { active: boolean; currentWindow: boolean }, callback: (tabs: Array<{ url?: string; title?: string }>) => void): void;
  }
}
