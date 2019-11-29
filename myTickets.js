// My Tickets page loaded

chrome.storage.sync.get("data", function(items) {
  if (!chrome.runtime.error) {
    var allTicket = document.getElementsByClassName("listing tickets")[0].childNodes[3].childNodes;
    var inputTickets = String(items.data).split("\n");
    var ticketText = [];
    var highlightCheckbox = [];
    var extensionDateText = [];
    var extensionButton = [];

    extensionDate = new Date().addDays(30);

    for (var index = 1; index <= allTicket.length - 2; index += 2) {
      var ticket = allTicket[index].childNodes[1];

      ticketText[index] = document.createElement("SPAN");
      ticketText[index].innerHTML = ticket.outerText;

      // remove ticket's link
      ticket.replaceChild(ticketText[index], ticket.childNodes[1]);

      // ticket checkbox
      highlightCheckbox[index] = document.createElement("INPUT");
      highlightCheckbox[index].type = "checkbox";
      highlightCheckbox[index].id = index;
      highlightCheckbox[index].name = ticketText[index].textContent.substring(1);
      ticket.childNodes[1].appendChild(highlightCheckbox[index]);
      highlightCheckbox[index].addEventListener("change", function() {
        if(this.checked) {
          addHighlight(this.name);
          allTicket[this.id].style.backgroundColor = "#ee766e";
        } else {
          removeHighlight(this.name);
          allTicket[this.id].style.backgroundColor = "#ffffff";
        }
      });

      // ticket extension date text
      extensionDateText[index] = document.createElement("INPUT");
      extensionDateText[index].type = "text";
      extensionDateText[index].id = index;
      extensionDateText[index].name = ticketText[index].textContent.substring(1);
      extensionDateText[index].value = extensionDate
      extensionDateText[index].maxlength=10
      extensionDateText[index].size=10
      ticket.childNodes[1].appendChild(extensionDateText[index]);

      // ticket extension button
      extensionButton[index] = document.createElement("INPUT");
      extensionButton[index].type = "button";
      extensionButton[index].id = index;
      extensionButton[index].name = ticketText[index].textContent.substring(1);
      extensionButton[index].value = "延票"
      extensionButton[index].addEventListener("click", function() {
        window.open("https://issue.kkinternal.com/trac/ticket/" + this.name + "?do_extension_ticket?" + extensionDateText[this.id].value, '_blank');
      });
      ticket.childNodes[1].appendChild(extensionButton[index]);

      // click to copy
      ticketText[index].onclick = function(){
        document.execCommand("copy");
      }
      ticketText[index].addEventListener("copy", function(event) {
        event.preventDefault();
        if (event.clipboardData) {
          event.clipboardData.setData("text/plain", this.textContent.substring(1));
        }
      });

      //add due diff
      var due = allTicket[index].childNodes[7];
      due.outerText += "\n(" + timeStampToDate(dateToTimeStamp(due.outerText) - Date.now()) + ")"

      //upcase priority
      var priority = allTicket[index].childNodes[11];
      if (priority.outerText == "major"){
        priority.outerText = "MAJOR!!";
      }

      //check and highlight
      highlightCheckbox[index].checked = false;
      for (var inputIndex = 0; inputIndex < inputTickets.length; inputIndex++) {
        if (ticket.outerText == ("#" + inputTickets[inputIndex])) {
          allTicket[index].style.backgroundColor = "#ee766e";
          highlightCheckbox[index].checked = true;
          break;
        }
      }
    }
  }
});


function addHighlight(ticket){
  chrome.storage.sync.get("data", function(items) {
    if (!chrome.runtime.error) {
      chrome.storage.sync.set({ "data" : (items.data == undefined ? "" : items.data + "\n") + ticket}, function() {
        if (chrome.runtime.error) {
          console.log("Runtime error.");
        }
      });
    }
  });
}

function removeHighlight(ticket){
  chrome.storage.sync.get("data", function(items) {
    if (!chrome.runtime.error) {
      chrome.storage.sync.set({ "data" : (items.data == undefined ? "" : items.data.replace("\n" + ticket, "").replace(ticket + "\n", "").replace(ticket, ""))}, function() {
        if (chrome.runtime.error) {
          console.log("Runtime error.");
        }
      });
    }
  });
}

function timeStampToDate(timeStamp){
  return parseInt(timeStamp / 86400000);
}

function dateToTimeStamp(date){
  date = date.split("-");
  var newDate = date[1] + "/" + date[2] + "/" + date[0];
  return new Date(newDate).getTime();
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return formatDate(date);
}

function formatDate(d){
  return d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2)
}