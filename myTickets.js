// My Tickets page loaded

chrome.storage.sync.get("data", function(items) {
  if (!chrome.runtime.error) {
    var allTicket = document.getElementsByClassName("listing tickets")[0].childNodes[3].childNodes;
    var inputTickets = String(items.data).split("\n");
    var ticketText = [];
    var highlightCheckbox = [];

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
