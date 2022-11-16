/*
-------------------------------------------------------------------------------------------------------------------------------
~~[AUTOLOADER V2.0]~~

~ AUTOLOADER is a JS Plugin designed to keep a web page refreshed and updated in given intervals .
~ Autoloader is designed to be a plug and play type javascript plugin which has NO effect on the page DOM or Functionality.
~ AutoLoader heavily relies on COOKIES to keep track of neccasary variables and program states. So disabling or limiting the
  use of cookies CAN affect Autoloader's functionality.
~ AutoLoader uses System Time and Time relient functions (ex: setInterval, setTimeout, etc.) for refreshing pages which will
  effect system resources. NOT Suitable for HEAVY WEB APPLICATIONS!!
~ Autoloader is intended for Development and Designing Stage of a web application and NOT recommended to use for functionality
  of the application.

**__DISCLAIMER__** 
~ Developers will NOT be held responsible for any changes done to client Web Pages during usage. Use at your Own RISK!!








~ Designed & Developed By   : Dhanika Weerasekara
~ Original Project          : https://github.com/DhakiWeere09/AutoLoader


** all rights reserved **
---------------------------------------------------------------------------------------------------------------------------------
*/



//main continer variable
var container
// reload Function status variables
var isRefreshing;
var notPaused;
var statusButton;
// reload Interval variable
var reloadInterval;
//scrollSave status variables
var isSavingScroll;
var scrollButton;
// cacheAllow status variables
var allowCache;
var cacheButton;
// scrolling element that triggers the [scroll] event 
var scrollCheck;
// reset button
var resetButton;
// giu status variables
var collapseTimer;
var iscollapsed;
var exCollapseButton;


//Adding scroll Event listeners to scrollable elements
function eventAttach(rElem = document.body){

    // Adding scroll Event listeners to scrollable elements
    // Recursive function to going down the DOM tree

    console.log("Checking DOM Element.. \nType : " + rElem + " | ID : " + rElem.id + " | children : " + rElem.childElementCount)

    if (rElem.scrollWidth > rElem.clientWidth || rElem.scrollHeight > rElem.clientHeight){
        console.log("Scrollable Element found :" + rElem.id);  // Debugging output

        if(rElem.id != ""){
            console.log("Scrollable Cookie Created"); // Debugging output
            
            // Adding Scroll Event Listeners
            rElem.addEventListener("scroll", () => {
                createCookie(rElem.id + "_scrollPos", rElem.scrollTop);
            })
            createCookie(rElem.id + "_scrollPos", rElem.scrollTop);

        }else {
            console.log("Scrollable has no ID");  // Debugging output
        }
    }else{
        console.log("not scrollable");  // Debugging output
    }

    if (rElem.childElementCount == 0){
        // recursion Endpoint
        return;

    }else {
        for (let i=0; i < rElem.children.length; i++){
            eventAttach(rElem.children[i]); 
        }
    }
    console.log("\n \n Recursion Level Done") // Debugging output
}



// create cookies with given expiration times
function createCookie(name, value, expireInterval=5) {
    // give the expire inerval in minutes
    
    var date = new Date();
    date.setTime(date.getTime()+(expireInterval*60*1000));
    var expires = "; expires="+date.toGMTString();

    document.cookie = "AL_" + name+"="+value+expires;
}

// delete created cookies and restart the script
function deleteCookies() {
    var allCookies = document.cookie.split(';');
    
    // The "expire" attribute of every cookie is 
    // Set to "Thu, 01 Jan 1970 00:00:00 GMT"
    for (var i = 0; i < allCookies.length; i++){
        document.cookie = allCookies[i] + "=;expires="
        + new Date(0).toUTCString();
    }

    location.reload();


}


// hiding process of the main container [DIV]
function mainColapse(){
    var childElemArr = container.children; // technically NOT AN ARRAY. BUT A COLLECTION. CAN BE INDEXED
    for(let i = 0; i < childElemArr.length; i++){
        if(i == 0){
            childElemArr[i].innerHTML = childElemArr[i].innerHTML.split(" ")[1];
        }else if (i == childElemArr.length-1){
            childElemArr[i].innerHTML = "<";
            childElemArr[i].style.height = "35px";
            childElemArr[i].style.width = "35px";
            childElemArr[i].style.fontSize = "20px";
        }else{
            childElemArr[i].style.display = "none";
        }
    }
    container.style.width = "auto";
    container.style.marginBottom = "0px";

    iscollapsed = true;
    createCookie("isCollapsed", iscollapsed); 
}


// expanding process the main container [DIV]
function mainExpand(){
    var childElemArr = container.children; // technically NOT AN ARRAY. BUT A COLLECTION. CAN BE INDEXED
    for(let i = 0; i < childElemArr.length; i++){
        var txt;
        if(i == 0){
            if(String(isRefreshing) == "true"){
                txt = "Refreshing &#8634;";
            }else{
                txt = "Static &#9776;";
            }
            childElemArr[i].innerHTML = txt
        }else if (i == childElemArr.length-1){
            childElemArr[i].innerHTML = ">";
            childElemArr[i].style.height = "50px";
            childElemArr[i].style.width = "50px";
            childElemArr[i].style.fontSize = "30px";
        }else{
            childElemArr[i].style.display = "inline";
        }
    }
    container.style.width = "400px";
    // container.style.height = "auto";
    container.style.marginBottom = "15px";

    iscollapsed = false;
    // document.cookie = "isCollapsed=" + iscollapsed;
    createCookie("isCollapsed", iscollapsed);
}


function createGUI(){
    container = document.createElement("div");
    container.style = "width: 400px; background-color: rgba(18, 17, 17, 0.725); padding: 10px; gap:30px; border-radius: 13px 0px 0px 10px; border: solid 2px orangered;  position: fixed; z-index: 15; right: 0px; top: 65vh;"
    container.addEventListener("mouseleave", () => {
        if (String(iscollapsed) == "false"){
            collapseTimer = setTimeout(mainColapse, 2500);
        } 
    })
    container.addEventListener("mouseenter", () => {
        if(collapseTimer != null){
            clearTimeout(collapseTimer);
            collapseTimer = null;
        }
    })

    // main status button
    statusButton = document.createElement("button");
    statusButton.style = "display: block; height: 40px; font-size: 20px; font-weight: bold; color: limegreen; margin-bottom: 15px;";
    
    statusButton.addEventListener("click", () => {
        if(String(isRefreshing) == "true"){
            if(String(iscollapsed) == "true"){
                statusButton.innerHTML = "&#9776;"
            }else{
                statusButton.innerHTML = "Static &#9776;"
            }
            statusButton.style.color = "blue";
            isRefreshing = false;
        }else{
            if(String(iscollapsed) == "true"){
                statusButton.innerHTML = "&#8634;"
            }else{
                statusButton.innerHTML = "Refreshing &#8634;"
            }
            statusButton.style.color = "green";
            isRefreshing = true;
        }
        createCookie("isRefreshing", isRefreshing);
    })

    statusButton.addEventListener("mouseover", () => {
        if(String(isRefreshing) == "true"){
            statusButton.style.backgroundColor = "green";
        }else{
            statusButton.style.backgroundColor = "blue";
        }
        statusButton.style.color = "white";
    })

    statusButton.addEventListener("mouseleave", () => {
        if(String(isRefreshing) == "true"){
            statusButton.style.color = "green";
        }else{
            statusButton.style.color = "blue";
        }
        statusButton.style.backgroundColor = "white"
    })
    container.appendChild(statusButton);

    // refreshInterval element
    var t = document.createElement("input");
    t.type = "text";
    t.max = "5000";
    t.min = "200";
    t.value = "\u23F1" + reloadInterval + "ms";
    t.style = "display: inline; width: 85px; border: solid 2px black;";
    
    t.addEventListener("focusin", () => {
        notPaused = false;
        t.type="number";
        t.value=reloadInterval;
        if(String(isRefreshing) == "true"){
            statusButton.innerHTML = "Paused \u23F8";
            statusButton.style.color = "orangered";
        }
    });
    
    t.addEventListener("focusout", () => {
        if(t.value < 200){
            t.value = parseInt(t.min);
        }else if(t.value > 5000){
            t.value = parseInt(t.max); 
        }
        reloadInterval = t.value;
        createCookie("rInterval", reloadInterval);
        notPaused = true;
        if(t.value < 1000){
            alert("CAUTION! Refresh times lower than 1000ms (1 Sec) will make interactions with elements such as button presses much bit unresponsive.")
        }
    });
    
    container.appendChild(t);


    // scrollSave element
    scrollButton = document.createElement("button");
    scrollButton.style = "display: inline; margin-left: 6px;";

    scrollButton.addEventListener("click", () => {
        if(String(isSavingScroll) == "true"){
            scrollButton.innerHTML = "\u250B" + " No Scrolling"
            isSavingScroll = false;
        }else{
            scrollButton.innerHTML = "\u250B" + " Auto Scrolling"
            isSavingScroll = true;
        }
    createCookie("isSavingScroll", isSavingScroll);
    })
    container.appendChild(scrollButton);


    // cacheAllow element
    cacheButton = document.createElement("button");
    cacheButton.style = "display: inline; margin-left: 6px;" 
    cacheButton.addEventListener("click", () => {
        if(String(allowCache) == "true"){
            cacheButton.innerHTML = "&#128194;" + " Clearing Cache"
            allowCache = false;
        }else {
            cacheButton.innerHTML = "&#128194;" + " Allow Cache"
            allowCache = true;
        }
        createCookie("allowCache", allowCache);
    })
    container.appendChild(cacheButton);


    // reset Button
    resetButton = document.createElement("Button");
    resetButton.style = "color: red; height: 40px; border-radius: 8px;"
    resetButton.innerHTML = "Reset";
    eventHover =  resetButton.addEventListener("mouseover", () => {
        resetButton.style.backgroundColor = "rgb(207, 41, 35)";
        resetButton.style.color = "white";
    })
    resetButton.addEventListener("mouseleave", () => {
        resetButton.style.backgroundColor = "white";
        resetButton.style.color = "red";
    })
    resetButton.addEventListener("click", () => {
        deleteCookies();
    })
    container.appendChild(resetButton);


    // expand collapse button
    exCollapseButton = document.createElement("button");
    exCollapseButton.style = "height: 50px; width : 50px; font-size: 30px; font-weight: bold; text-align: center; color: white; background-color: transparent; border: none 1px white; margin-top: 5px;"
    exCollapseButton.innerHTML = ">";
    exCollapseButton.addEventListener("mouseover", () => {
        exCollapseButton.style.borderStyle = "Solid";
    })
    exCollapseButton.addEventListener("mouseleave", () => {
        exCollapseButton.style.borderStyle = "none";
    })
    exCollapseButton.addEventListener("click", () => {
        if(String(iscollapsed) == "true"){
            mainExpand();
        }else{    
            mainColapse();
        }
    })
    container.appendChild(exCollapseButton);

    document.body.appendChild(container);
    
}





// main Page loadup function
window.addEventListener("load", () => {
    
    // Assigning The default values
    isRefreshing = false;
    notPaused = true;
    reloadInterval = 1500; // High Refresh Rates may make it harder to interact with Ui Elements such as BUTTONS
    isSavingScroll = true;
    allowCache = true;
    iscollapsed = true;
    scrollCheck = false;

    var cookieArr = document.cookie.split(";");

    for(let n =0; n < cookieArr.length; n++){
        var cookieData = cookieArr[n].split("="); 
        var cookieName = cookieData[0].replace(" ", "");
        var cookieValue = cookieData[1];
        
        if(cookieName == "AL_isRefreshing"){
            isRefreshing = cookieValue;
        }else if(cookieName == "AL_rInterval"){
            reloadInterval = cookieValue;
        }else if(cookieName == "AL_isSavingScroll"){
            isSavingScroll = cookieValue;
        }else if(cookieName == "AL_allowCache"){
            allowCache = cookieValue;
        }else if(cookieName == "AL_isCollapsed"){
            iscollapsed = cookieValue;
        }else if(cookieName == "AL_scrollCheck"){
            scrollCheck = cookieValue;
        }else if(cookieName.split("_")[2] == "scrollPos"){
            // Assigning ScrollTop Property values for Scrollable elements
            let elem = document.getElementById(cookieName.split("_")[1]);
            elem.scrollTop = cookieValue;
            // Adding scroll Event Listeners
            elem.addEventListener("scroll", () => {
                createCookie(elem.id + "_scrollPos", elem.scrollTop);
            })
        }
    }


    // Creating GUI elements in the HTML DOM
    createGUI();

    // calling scrollable elem checking function on the first time
    if (String(scrollCheck) == "false"){
        eventAttach();
        
        // Creating a cookie stating scrollable elements have been checked with a longer expiration [60 Mins]
        createCookie("scrollCheck", true, 60);
        scrollCheck = true;
    }

    // assigning the values to main status button
    if(String(isRefreshing) == "true" && String(notPaused) == "true"){
        statusButton.innerHTML = "Refreshing &#8634;"
        statusButton.style.color = "green";
    }else{
        if(String(notPaused) == "false"){
            statusButton.innerHTML = "Paused \u23F8"
            statusButton.style.color = "orangered";
        }else{
            statusButton.innerHTML = "Static &#9776;"
            statusButton.style.color = "blue";
        }
    }

    // assigning values to scrollSave element
    if(String(isSavingScroll) == "true"){
        scrollButton.innerHTML = "\u250B" + " Auto Scrolling"
    }else{
        scrollButton.innerHTML = "\u250B" + " No Scrolling"
    }

    // assigning values to cacheAllow element 
    if(String(allowCache) == "true"){
        cacheButton.innerHTML = "&#128194;" + " Allow Cache"
    }else {
        cacheButton.innerHTML = "&#128194;" + " Clearing Cache"
    }

    // assigning values to the expand and collapse button
    if(String(iscollapsed) == "true"){
        mainColapse();
    }else{
        mainExpand();
    }
    

    // page reloarding event
    setInterval(() => {
        if(String(isRefreshing) == "true" && notPaused){
            if(String(allowCache) == "true"){
                location.reload();
            }else{
                window.location.href = window.location.href;
            }
        }
    }, reloadInterval);

});


