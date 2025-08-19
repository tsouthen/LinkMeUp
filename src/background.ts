function getCopyFormats(url: string, title: string) {
  return {
    html: `<a href="${url}">${title}</a>`,
    markdown: `[${title}](${url})`,
    text: `${title} - ${url}`,
  };
}

type CopyType = "html" | "markdown" | "text";

function isValidCopyType(type: string): type is CopyType {
  return ["html", "markdown", "text"].includes(type);
}

export async function copyToClipboard(tab: { url: string; title: string }, type: string) {
  if (!isValidCopyType(type)) return;
  const formats = getCopyFormats(tab.url, tab.title);
  await navigator.clipboard.writeText(formats[type]);
}

chrome.commands.onCommand.addListener(async (command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    if (!command.startsWith("copy-")) return;
    const tab = tabs[0];
    if (!tab || !tab.url || !tab.title) return;

    await copyToClipboard({ url: tab.url, title: tab.title }, command.substring(5));
  });
});
