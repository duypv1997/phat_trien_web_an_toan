var fbTab = new Array();
var timeStart = 0;
var timeLimit = 30;
var status = false;
var counter = 0

chrome.tabs.onRemoved.addListener(onRemove);
chrome.tabs.onUpdated.addListener(onUpdate);
chrome.tabs.onCreated.addListener(onCreate);

function onCreate(tab){
  	// Update Cookie
  	updateCookie();
    // Kiểm tra có phải tab Facebook không
	if (tab.url.indexOf("facebook.com") !== -1){
	    // Thêm tab vào list fbTab
        fbTab.push(tab.id);
        // Thêm count vào Cookie
        counter++;
        setCookie("count", counter, 30);
     	updateStatus();
    }
}

function onUpdate(id, info, tab){
  	// Update Cookie
  	updateCookie();
	// Kiểm tra có phải tab Facebook không
	if (tab.url.indexOf("facebook.com") !== -1){
		var currentTab = findTabId(id);
     	if (currentTab == -1)
        {
          	fbTab.push(id);
        	counter++;
          	setCookie("count", counter, 30);
          	status = true;
          	setCookie("status", status, 30);
          	updateStatus();
        }
    }
    else
    {
        var currentTab = findTabId(tab.id);
        if (currentTab != -1)
        {
            // Từ tab Facebook, chuyển sang tab không phải Facebook
            // Xoá tab này khỏi list fbTab
            fbTab.splice(currentTab, 1);
            updateStatus();
        }
    }
}

function onRemove(id, info){
  	// Update Cookie
  	updateCookie();
    // Kiểm tra có phải tab này có trong danh sách fbTab không
	var currentTab = findTabId(id);
	if (currentTab !=-1)
	{
	    fbTab.slice(id, 1);
	    updateStatus();
	}
}

function findTabId(tabID){
    for (var i=0;i< fbTab.length;i++)
    {
        if (tabID == fbTab[i])
        {
            return i;
        }
    }
    return -1;
}

function updateCookie(){
    timeStart = getCookie("timeStart");
    timeLimit = getCookie("timeLimit");
    status = getCookie("status");
    if ((status=="")||(status=="false"))
    {
        status=false;
    }
    else
    {
        status=true;
    }
  	counter = getCookie("count");
  	if (counter == "")
    {
      	counter = 0;
    }
}

function updateStatus(){
    // Get timeStart, timeLimit, status
    if (fbTab.length == 0)
    {
        // Đã tắt hết các tab Facebook
        if (status){
            // Trạng thái lưu trong Cookie vẫn là Online
            // Modify status
            setCookie("status", "offline", 30);
        }
    }
    else
    {
        // Chưa tắt hết các tab Facebook
        if(status){
            // Trạng thái lưu trong Cookie là Online
            updateCookie();
            var timeStop = timeStart+(timeLimit*60);
            var time = new Date();
            var timeNow = time.getTime();
            if (timeStop<timeNow)
            {
                // Cảnh báo khi hết time
                alert("Time limit!");
            }
        }
        else
        {
            // Trạng thái lưu trong Cookie là Offline
            // Cập nhật status trong Cookie
            setCookie("status", "online", 30);
            var time = new Date();
            var start = time.getTime();
            setCookie("timeStart", startTime, 30);
        }
    }
}

// Thêm một cookie
function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Lấy cookie
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}