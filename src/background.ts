chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!command.startsWith("copy-")) return;
    const tab = tabs[0];
    if (!tab || !tab.url || !tab.title || !tab.id) return;

    chrome.tabs.sendMessage(tab.id!, {
      action: "copy-link",
      url: tab.url,
      title: tab.title,
      type: command.substring(5),
    });
  });
});
