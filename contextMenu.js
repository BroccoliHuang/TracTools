function genericOnClick(info, tab) {
  chrome.tabs.executeScript(tab.id, {file: "highlightMajor.js"});
}
var title = "Highlight major";
var id = chrome.contextMenus.create({"title": title, "contexts":["page"], "onclick": genericOnClick});