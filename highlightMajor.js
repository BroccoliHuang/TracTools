var allTicket = document.getElementsByClassName("subtickets")[0].childNodes[0].childNodes;
var index = 0;
function run(index){
	var ticketNumber = allTicket[index].textContent.substring(1, 7);
	loadScript(ticketNumber, function(response) {
        if(response.indexOf("priority=minor") != -1) {
        	// do nothing
            allTicket[index].childNodes[0].childNodes[0].text = "[minor]" + allTicket[index].childNodes[0].childNodes[0].text;
        } else if(response.indexOf("priority=major") != -1) {
            allTicket[index].childNodes[0].childNodes[0].text = "[MAJOR!!]" + allTicket[index].childNodes[0].childNodes[0].text;
        	allTicket[index].style.backgroundColor = "#ee766e";
        }
        if(index < allTicket.length - 1){
        	run(++index);	
        }
	});
}

function loadScript(ticketNumber, callback) {
    var x = new XMLHttpRequest();
    x.onload = function() {
        callback(x.responseText);
    };
    TODO TICKET_URL
    x.open('GET', "TICKET_URL/" + ticketNumber);
    x.send();
}

run(0);
