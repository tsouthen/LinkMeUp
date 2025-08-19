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
  if (!isValidCopyType(type)) return;
  const linkData = getLinkData(tab.url, tab.title, type);
  await navigator.clipboard.write([linkData]);
}

chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!command.startsWith("copy-")) return;
    const tab = tabs[0];
    if (!tab || !tab.url || !tab.title) return;

    const copyType = command.substring(5) as CopyType;
    if (!isValidCopyType(copyType)) return;
    const clipboardItem = getLinkData(tab.url, tab.title, copyType);
    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: (itemData: ClipboardItem) => {
        navigator.clipboard.write([itemData]);
      },
      args: [clipboardItem],
    });
  });
});
