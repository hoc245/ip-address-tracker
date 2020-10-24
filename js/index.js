// SET MARGIN BOTTOM FOR HEADER
const header = $('#header');
const resultContainer = document.getElementById('result');
document.body.onresize = function(){
    margin();
}
function margin() {
    var val = resultContainer.offsetHeight;
    header.css('margin-bottom',val * (-1) / 2);
}
margin();
// IP Geolocation API

const ipResult = $('#ip .result-text');
const locaResult = $('#location .result-text');
const timezoneResult = $('#timezone .result-text');
const ispResult = $('#isp .result-text');
const inputText = $('#input-text');
const inputSubmit = $('#input-submit');
const mUrl = "https://geo.ipify.org/api/v1?apiKey=at_aiX64XAwmqexYugotNumg3yV1TOIk&ipAddress=8.8.8.8";
const apiKey = "at_aiX64XAwmqexYugotNumg3yV1TOIk";

inputText.keypress(function(e){
    var keyCode = e.keyCode;
    var val = inputText.val();
    var type = checkVal(val);
    ip = "";
    domain = "";
    if (keyCode === 13) {
        if (type === "invalid") {
            inputText.attr('data-status','error')
            inputText.attr('placeholder','Whoops, make sure it is an IP or a domain')
        } else {
            inputText.attr('data-status','valid');
            getData(type, val);
            callAJAX();
        }
    }
})
inputSubmit.click(function(){
    var val = inputText.val();
    var type = checkVal(val);
    if (type === "invalid") {
        inputText.attr('data-status','error')
        inputText.attr('placeholder','Whoops, make sure it is an IP or a domain')
    } else {
        inputText.attr('data-status','valid');
        getData(type, val);
        callAJAX();
    }
})
function checkVal(n) {
    var type = "";
    if(/\A(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\z/.test(n)) {
        type = "ip"
    } else if(/^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/g.test(n)){
        type = "domain";
    } else {
        type = "invalid"
    }
    return type;
}

var ip = "";
var domain = "";

function getData(type, val) {
    if (type === "ip") {
        ip = val;
    } else if (type === "domain") {
        domain = val;
    }
}
var myLocation = {
    region : "",
    city : "",
    postal : "",
    timezone : "",
    isp : "",
    lat : "",
    lng : "",
}

function callAJAX() {
    $.ajax({
        url: mUrl,
        data: {apiKey: apiKey, ipAddress: ip, domain: domain},
        success : function(data) {
            myLocation.region = data.location.region;
            myLocation.city = data.location.city;
            myLocation.postal = data.location.postalCode;
            myLocation.timezone = data.location.timezone;
            myLocation.isp = data.isp;
            myLocation.lat = data.location.lat;
            myLocation.lng = data.location.lng;
            sendData();
            mymap.setView([myLocation.lat, myLocation.lng],13);
            var marker = L.marker([myLocation.lat, myLocation.lng],{icon : iconMarker}).addTo(mymap);
            margin();
        },
        error : function() {
            inputText.attr('data-status','error');
            inputText.attr('placeholder','Whoops, make sure it is an IP or a domain');
        }
    })
}
function clientIP() {
    $.getJSON('http://ipinfo.io',function(data){
        ip = data.ip;
        callAJAX();
    })
}
clientIP();
function sendData() {
    if (ip === "") {
        $('#ip .result-title').html('DOMAIN ADDRESS');
        ipResult.html(domain);
    } else {
        $('#ip .result-title').html('IP ADDRESS');
        ipResult.html(ip);
    }
    locaResult.html(myLocation.region + ", " + myLocation.city + ", " + myLocation.postal);
    timezoneResult.html("UTC"+myLocation.timezone);
    ispResult.html(myLocation.isp);
}
// MAP Create
const accessToken = "pk.eyJ1IjoiaG9jMjQ1IiwiYSI6ImNrZ2w3ajF1MjA4a3QyeW8xMTIyNXdmOTgifQ.kfG_yzEgsZeyTHh00HKX5g";
var mymap = L.map('map');
const iconMarker = L.icon({
    iconUrl : "./assets/icon-location.svg",
    iconSize: [46,56],
    iconAnchor : [23, 0],
    popupAnchor : [-3, 0],
})
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: accessToken,
}).addTo(mymap);