const uniqid = require("uniqid");
document.querySelector("#result").innerHTML = uniqid();



const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

app.use(cors({
    origin: "*"
}))

app.get(":endpoint([\\/\\w\\.-]*)", function(req, res){
    let endpoint = "http://opencitations.net" + req.params.endpoint
    axios.get(endpoint).then(response => {
        res.send(response.data)
    }).catch(error => {
        res.send(error)

    })    
})

app.listen(3000)