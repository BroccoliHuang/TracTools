var allTicket = document.getElementsByClassName("subtickets")[0].childNodes[0].childNodes;
var index = 0;
function run(index){
	var ticketNumber = allTicket[index].textContent.substring(1, 7);
	loadScript(ticketNumber, function(response) {
        if(response.indexOf("priority=minor") != -1) {
        	// do nothing
        } else if(response.indexOf("priority=major") != -1) {
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
    TODO Tickets url
    x.open('GET', 'https://trac.example.org/ticket/' + ticketNumber);
    x.send();
}

run(0);