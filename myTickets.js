// My Tickets page loaded

chrome.storage.sync.get("data", function(items) {
  if (!chrome.runtime.error) {
    var allTicket = document.getElementsByClassName("listing tickets")[0].childNodes[3].childNodes;
    var inputTickets = String(items.data).split("\n");
    var ticketText = [];
    var highlightCheckbox = [];
    var postponeDateText = [];
    var postponeUpdateText = [];
    var postponeButton = [];

    postponeDate = new Date().addDays(30);

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

      // ticket postpone date text
      ticket.childNodes[1].appendChild(document.createElement("BR"));
      postponeDateText[index] = document.createElement("INPUT");
      postponeDateText[index].type = "text";
      postponeDateText[index].id = index;
      postponeDateText[index].name = ticketText[index].textContent.substring(1);
      postponeDateText[index].value = postponeDate
      postponeDateText[index].size = 9
      ticket.childNodes[1].appendChild(postponeDateText[index]);

      // ticket postpone update text
      ticket.childNodes[1].appendChild(document.createElement("BR"));
      postponeUpdateText[index] = document.createElement("TEXTAREA");
      postponeUpdateText[index].type = "textarea";
      postponeUpdateText[index].id = index;
      postponeUpdateText[index].name = ticketText[index].textContent.substring(1);
      postponeUpdateText[index].value = ""
      postponeUpdateText[index].style = "margin: 2px; width: 77px; height: 17px;"
      postponeUpdateText[index].placeholder = "延票說明"
      ticket.childNodes[1].appendChild(postponeUpdateText[index]);

      // ticket postpone button
      ticket.childNodes[1].appendChild(document.createElement("BR"));
      postponeButton[index] = document.createElement("INPUT");
      postponeButton[index].type = "button";
      postponeButton[index].id = index;
      postponeButton[index].name = ticketText[index].textContent.substring(1);
      postponeButton[index].value = "延票"
      postponeButton[index].addEventListener("click", function() {
        window.open("https://issue.kkinternal.com/trac/ticket/" + this.name + "?do_postpone_ticket?" + postponeDateText[this.id].value + "?" + postponeUpdateText[this.id].value.replace(/\r?\n/g, "<br>"), '_blank');
      });
      ticket.childNodes[1].appendChild(postponeButton[index]);

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