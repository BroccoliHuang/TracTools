window.addEventListener("load", function load(event){
	document.getElementById("field-duedate").value = window.location.toString().split("?")[2];
	document.getElementById("comment").value = decodeURI(window.location.toString().split("?")[3]).replace(/<br>/g, "\\\\");
	document.getElementsByClassName("trac-disable-on-submit")[0].click();
	setTimeout(function () {
        window.close();
    }, 300);
},false);