const next=document.querySelector('#next')
const prev=document.querySelector('#prev')

function handleScrollNext (direction) {
  const cards = document.querySelector('.card-content')
  cards.scrollLeft=cards.scrollLeft += window.innerWidth / 2 > 600 ? window.innerWidth /2 : window.innerWidth -100
}

function handleScrollPrev (direction) {
  const cards = document.querySelector('.card-content')
  cards.scrollLeft=cards.scrollLeft -= window.innerWidth / 2 > 600 ? window.innerWidth /2 : window.innerWidth -100
}

next.addEventListener('click', handleScrollNext)
prev.addEventListener('click', handleScrollPrev)



var consoleValue = 1;
var targetCallWs = "https://jodostaging.avhan.com:4443/CustomerWebServices/handleCustomerWS";
var apiKey = "0BYGhEDGxHhNH2EeIwfE";
var serviceKey = "Y7d35cU5GfUhKuZfAFB7";
//var serviceKey = "jodoavhanservice_widgettest";
var serverPath = "https://jodostaging.avhan.com:4443";
var ajaxResponseTimeOut = 20000;

var jsonArrCommon = [];
var dataarrayCommon = "";

/*CP_getActiveCustList function*/

//function CP_getActiveCustList() {
var datarequest = {};
datarequest.flag = "2";
datarequest.method = "getActiveUserList";
datarequest.apikey = apiKey;
datarequest.servicekey = serviceKey;
var date = new Date();
var requestdate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
datarequest.reqdatetime = requestdate;
// console.log("writelogrequest..." + JSON.stringify(datarequest));
writelog3(datarequest);
//}

function writelog3(msg) {
    var xhttp = new XMLHttpRequest();
    var test = 'data=' + JSON.stringify(msg);
    xhttp.onreadystatechange = function () {
        clearTimeout(ajaxTimeout);
        if (this.readyState === 4 && this.status === 200) {
            var data = this.responseText;
            //  console.log("writelogresponse#####" +data);
            var res = JSON.parse(data);
            var activeuserlist = res.activeuserlist;

            //console.log("activeuserlist::::"+JSON.stringify(activeuserlist));
            displayIcon(activeuserlist);
        } else if (this.readyState === 404) {
        }
    };
    xhttp.open("POST", targetCallWs, true, "", "");
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhttp.send(test);
    var ajaxTimeout = setTimeout(function () {
        xhttp.abort();
        // console.log("Taking too long to get response from " + targetCallWs);
    }, 20000);
}

var elist = [];

function displayIcon(response) {		//  
//console.log("DisplayIcon:::::"+JSON.stringify(response));
    for (var i in response) {
        var datareq = {};
        var username = response[i].username;
        var uniqueuserid = response[i].uniqueuserid;
        var eid = response[i].username.toLowerCase();
        var removeSpace = eid.split(" ").join("");
        var userimage = response[i].userimage;
        var department = response[i].department;
        var department1 = {n: department, s: department};
        var elocation = "Mumbai, India";
        var edesignation = "";
        var ejoined = "2000";
        var edesc = " ";
        var epoint = "100";
        var elevel = "Level 1";
        var elang = "english";
        var color = "";
        var order = "";
        var statusid = response[i].currentstatusid;
        if (statusid == 0) {
            color = "gray";
            order = "4";
            //$("stats_id").hide();
        } else if (statusid == 1) {
            color = "green";
            order = "1";
            // $("stats_id").show();
        } else if (statusid >= 10 || statusid == -14) {
            color = "red";
            order = "2";
            // $("stats_id").hide();
        } else {
            color = "orange";
            order = "3";
            // $("stats_id").hide();
        }

        datareq.eid = removeSpace;
        datareq.ename = username;
        datareq.uniqueuserid = uniqueuserid;
        datareq.ephoto = userimage;
        datareq.edept = department1;
        datareq.edesignation = edesignation;
        datareq.elocation = elocation;
        datareq.ejoined = ejoined;
        datareq.edesc = edesc;
        datareq.epoint = epoint;
        datareq.elevel = elevel;
        datareq.elang = elang;
        datareq.color = color;
        datareq.order = order;
        datareq.statusid = statusid;
        elist.push(datareq);
    }
    elist.sort(GetSortOrder("order"));
    elistPrint(elist);
//console.log("elist::::::"+JSON.stringify(elist));
}

function GetSortOrder(prop) {
    return function (a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    }
}

function elistPrint(elist) {
    var i;
    for (i = 0; i < elist.length; i++) {
        var card = "";
        var eimg = "";
        eimg = elist[i].ephoto;
        var defaultimg = "/img/user-status.svg";

        if (eimg !== "") {
            try {
//                var http = new XMLHttpRequest();
//                http.open('HEAD', eimg, false);
//                http.send();

                $('img[id$=imgurl]').load(eimg, function (response, status, xhr) {
                    if (status === "error")
                        eimg = "/img/user-status.svg";
                });
            } catch (e) {
                eimg = "/img/user-status.svg";
            }
        }

//        if (eimg == "" || http.status == 404 || http.status == "404") {
//            eimg = "img/user-status.svg";
//        }

        var displayIcon = "";
        var showIcon = "";
        displayIcon = elist[i].color;
        if (displayIcon == "green") {
            showIcon = "display: block;";
        } else {
            showIcon = "display: none;";
        }

        card = '<div class="card">' +
                '<div class="additional ' + elist[i].color + '">' +
                '<div class="user-card">' +
                '<div class="level center"><!--' +
                elist[i].elevel +
                '--></div>' +
                '<div class="points center"><!--' +
                elist[i].epoint +
                '--></div>' +
                '<div class="prof-img"><img src="' + eimg + '" ></div>' +
                '</div>' +
                '<div class="more-info">' +
                '<h1>' + elist[i].ename + '</h1>' +
                '<div class="coords department">' +
                '<span>' + elist[i].edept.n + '</span>' +
                '<!-- <span>Joined ' + elist[i].ejoined + '</span> -->' +
                '</div>' +
                '<div class="coords">' +
                '<span>' + elist[i].edesignation + '</span>' +
                '<span>' + elist[i].elocation + '</span>' +
                '</div>' +
                '<div class="loader-container">' +
                '<div class="loader"></div>' +
                '</div>' +
                '<div class="loader-container">' +
                '<div class="loader"></div>' +
                '</div>' +
                '<div class="loader-container">' +
                '<div class="loader"></div>' +
                '</div>' +
                '<div class="loader-container">' +
                '<div class="loader"></div>' +
                '</div>' +
                '<div class="loader-container">' +
                '<div class="loader"></div>' +
                '</div>' +
                '<div class="loader-container">' +
                '<div class="loader"></div>' +
                '</div>' +
                '<div class="stats">' +
                '<div class="jodocall" style="' + showIcon + '">' +
                '<div class="title">JCall</div>' +
                '<i class="j-btn fa fa-phone" onclick="jodoCall([\'' + elist[i].elang + '\',\'' + elist[i].eid + '\',\'' + elist[i].edept.s + '\',\'' + elist[i].uniqueuserid + '\'])"></i>' +
                '</div>' +
                '<div class="jodovideo" style="' + showIcon + '">' +
                '<div class="title">JVideo</div>' +
                '<i class="j-btn fa fa-video-camera" onclick="jodoVideo([\'' + elist[i].elang + '\',\'' + elist[i].eid + '\',\'' + elist[i].edept.s + '\',\'' + elist[i].uniqueuserid + '\'])"></i>' +
                '</div>' +
                '<div class="jodochat" style="display: block;">' +
                '<div class="title">JChat</div>' +
                '<i class="j-btn fa fa-comments" onclick="jodoChat([\'' + elist[i].elang + '\',\'' + elist[i].eid + '\',\'' + elist[i].edept.s + '\',\'' + elist[i].uniqueuserid + '\'])"></i>' +
                '</div>' +
                '<div style ="display : none;">' +
                '<div class="title">JScreenshare</div>' +
                '<i class="j-btn fa fa-desktop" onclick="jodoScreenshare([\'' + elist[i].elang + '\',\'' + elist[i].eid + '\',\'' + elist[i].edept.s + '\',\'' + elist[i].uniqueuserid + '\'])" title="Not Available"></i>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="general">' +
                '<h1>' + elist[i].ename + '</h1>' +
                '<p>' + elist[i].edesc + '</p>' +
                '<span class="more">Mouse over the card for more info</span>' +
                '</div>' +
                '</div>';

        $("#teamcontainer").append(card);
    }
}


var jodoinitdone = false;
var __acstoolbar = {};
__acstoolbar.apikey = apiKey;
__acstoolbar.servicekey = serviceKey;
__acstoolbar.tracelevel = '1';
__acstoolbar.language = 'english';
__acstoolbar.target = serverPath;
__acstoolbar.visibility = "hide";
__acstoolbar.widgeticon = "hide";
__acstoolbar.visibility = "false";
__acstoolbar.theme = "theme_blue";
__acstoolbar.serverpath = "https://jodostaging.avhan.com:4443";
__acstoolbar.applicationpath = "https://jodostaging.avhan.com:4443";

(function ()
{
    var joinSC = document.createElement('script');
    joinSC.type = 'text/javascript';
    joinSC.src = __acstoolbar.target + '/jodowidgetapi/js/initfunctions.js';
    joinSC.onload = validateKey;
    var joinScript = document.getElementsByTagName('script')[0];
    joinScript.parentNode.insertBefore(joinSC, joinScript);
})();
function validateKey() {
    jodoInit = new jodoworld.initfunctions();
    jodoInit.initService();
}


function jodoCall(productobject) {
	console.log("clicked")
    var calldata = [];
    var calldataelement = {};
    if (jodoinitdone === true) {
        jodoInit.setLanguage(productobject[0]);
        calldataelement = new Object();
        calldataelement.parameterid = 4011;
        calldataelement.value = productobject[0];
        calldata.push(calldataelement);
        calldataelement = new Object();
        calldataelement.parameterid = 4031;
        calldataelement.value = productobject[1];
        calldata.push(calldataelement);
        calldataelement = new Object();
        calldataelement.parameterid = 4035;
        calldataelement.value = productobject[2];
        calldata.push(calldataelement);
        calldataelement = new Object();
        calldataelement.parameterid = 4045;
        calldataelement.value = productobject[3];
        calldata.push(calldataelement);
        jodoInit.SaveCustomerSessionData(calldata);
        jodoInit.showwidgetfromscript();
        jodoInit.showwidget_Voicefromscript();
    }

			// else 
			// {
			// 	alert ("Jodo is not initialized yet");
			// }
    openWidget();
}


function jodoChat(productobject) {
    var calldata = [];
    var calldataelement = {};
    if (jodoinitdone === true) {
        jodoInit.setLanguage(productobject[0]);
        calldataelement = new Object();
        calldataelement.parameterid = 4011;
        calldataelement.value = productobject[0];
        calldata.push(calldataelement);
        calldataelement = new Object();
        calldataelement.parameterid = 4031;
        calldataelement.value = productobject[1];
        calldata.push(calldataelement);
        calldataelement = new Object();
        calldataelement.parameterid = 4035;
        calldataelement.value = productobject[2];
        calldata.push(calldataelement);
        calldataelement = new Object();
        calldataelement.parameterid = 4045;
        calldataelement.value = productobject[3];
        calldata.push(calldataelement);
        jodoInit.SaveCustomerSessionData(calldata);
        jodoInit.showwidgetfromscript();
        jodoInit.showwidget_Chatfromscript();
    }
    openWidget();

}

function jodoVideo(productobject) {
    var calldata = [];
    var calldataelement = {};
    if (jodoinitdone === true) {
        jodoInit.setLanguage(productobject[0]);
        calldataelement = new Object();
        calldataelement.parameterid = 4011;
        calldataelement.value = productobject[0];
        calldata.push(calldataelement);
        calldataelement = new Object();
        calldataelement.parameterid = 4031;
        calldataelement.value = productobject[1];
        calldata.push(calldataelement);
        calldataelement = new Object();
        calldataelement.parameterid = 4035;
        calldataelement.value = productobject[2];
        calldata.push(calldataelement);
        calldataelement = new Object();
        calldataelement.parameterid = 4045;
        calldataelement.value = productobject[3];
        calldata.push(calldataelement);
        jodoInit.SaveCustomerSessionData(calldata);
        jodoInit.showwidgetfromscript();
        jodoInit.showwidget_Videofromscript();
    }
    openWidget();
}

function openWidget() {
    $('.team-container').css("width", "70%");
    $('#widget_close_icon').on("click", function () {
        $('.team-container').css("width", "100%");
    });
}

function jodoWidgetInitialized() {
    jodoinitdone = true;
}

//show button after UA registered
function waitForJodoInitDone() {
    if (jodoinitdone) {
        $('.loader-container').css("display", "none");
        //$('.jodocall,.jodochat,.jodovideo').css("display","block");

    } else {
        setTimeout(function () {
            waitForJodoInitDone();
        }, 1000);
    }
}
waitForJodoInitDone();

function showResult(str) {
    if (str.length == 0) {
        $('.card').each((index, element, current) => {
            element.style.display = "block";
        })
        return;
    }

    $('.card').hide();
    $('.general h1').each((index, element) => {
        var re = new RegExp(str.toUpperCase());
        if (re.test(element.innerText.toUpperCase())) {
            var current = index;
            $('.card').each((index, element) => {
                if (index == current) {
                    element.style.display = "block";

                }
            })
        }
    })
    $('.department span:first-child').each((index, element) => {
        //console.log(element);
        var re = new RegExp(str.toUpperCase());
        if (re.test(element.innerText.toUpperCase())) {
            var current = index;
            $('.card').each((index, element) => {
                if (index == current) {
                    element.style.display = "block";
                }
            })
        }
    })
}
