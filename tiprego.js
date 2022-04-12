/* 
const { default: axios } = require("axios");
const { response } = require("express");
const { Router } = require("express");
const res = require("express/lib/response");

Router.get("/", function(req, res, next) {
    axios.get("http://opencitations.net/statistics/2022-01")
then(response => {
    res.send(response.data.result);
}).catch(error => {
    res.send(error.message);
})

}); */ // --> require not defined

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
        console.log(xhttp.responseText)
    if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:
       document.getElementById("demo").innerHTML = xhttp.responseText;
    } else {
      console.log("error")
    }
};
xhttp.open("GET", "https://cors-anywhere.herokuapp.com/http://opencitations.net/statistics/2022-01", true);
xhttp.send(); // --> tiprego.js:28          GET https://cors-anywhere.herokuapp.com/http://opencitations.net/statistics/2022-01 403 (Forbidden)