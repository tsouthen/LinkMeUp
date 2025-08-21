// This will be true in Vite builds, false in plain scripts
declare const __VITE__: boolean | undefined;

function getLinkData(url: string, title: string, type: CopyType): ClipboardItem {
  if (type === "html") {
    const data = `<a href="${url}">${title}</a>`;
    return new ClipboardItem({
      "text/html": new Blob([data], { type: "text/html" }),
      "text/plain": new Blob([url], { type: "text/plain" }),
    });
  }

  const data = type === "markdown" ? `[${title}](${url})` : `${title} - ${url}`;
  return new ClipboardItem({ ["text/plain"]: new Blob([data], { type: "text/plain" }) });
}

type CopyType = "html" | "markdown" | "text";

function isValidCopyType(type: string): type is CopyType {
  return ["html", "markdown", "text"].includes(type);
}

export async function copyToClipboard(tab: { url: string; title: string }, type: string) {
  if (!isValidCopyType(type)) {
    console.error(`Invalid copy type: ${type}`);
    return;
  }
  console.log("Getting link data:", { url: tab.url, title: tab.title, type });
  const linkData = getLinkData(tab.url, tab.title, type);
  console.log("Copying to clipboard:", linkData);
  await navigator.clipboard.write([linkData]);
}

if (typeof __VITE__ === "undefined") {
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "copy-link") {
      const { url, title, type } = message;
      void copyToClipboard({ url, title }, type);
    }
  });
}
