/**
 * Created by user on 2016-12-05.
 */


var DAY_TIME = {"월":0, "화":100, "수":200, "목":300, "금":400, "토":500};
var AB_TIME = {"A":0, "B":1};

var depDict = {};
var divDict = {};


function doOnLoad()
{
    $("#fileInput").change(doOpenFile);
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function doOpenFile() {
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = reader.result;
        var output = processData(data);
        download("output.jsd", output);
        //console.log("res = " + reader.result);
    }
    reader.onerror = function(evt) {
        console.log(evt.target.error.code);
    }
    reader.readAsText(this.files[0]);
}

function splitLectureTM(str){
	if(!str){
		return [];
	}
	let output = [];
	let unit = str.split(',');
	for (var j = 0; j < unit.length; j++) {
            if (unit[j].length == 8) {
                var startStr = unit[j].substr(1, 3);
                var endStr = unit[j].substr(5, 3);
                var startTime = DAY_TIME[unit[j].charAt(0)] + 2 * (parseInt(startStr.substr(0, 2)) - 1) + AB_TIME[startStr.charAt(2)];
                var endTime = DAY_TIME[unit[j].charAt(0)] + 2 * (parseInt(endStr.substr(0, 2)) - 1) + AB_TIME[endStr.charAt(2)];

                for (var k = startTime; k <= endTime; k++) {
                    output.push(k);
                }
            } else if (unit[j].length == 4) {
                var startStr = unit[j].substr(1, 3);
                var startTime = DAY_TIME[unit[j].charAt(0)] + 2 * (parseInt(startStr.substr(0, 2)) - 1) + AB_TIME[startStr.charAt(2)];
				output.push(startTime);
            } else {
                // console.log(subject);
            }
        }
		return output;
}

function processData(data)
{
    var xmlDoc = $.parseXML(data);
    var xmlData = xmlDoc.documentElement.children;
	let db = [...xmlData[1].children[1].children].map(r=>[...r.children].reduce((a,c)=>(a[c.id]=c.textContent,a),{}));
	db = db.map(e=>(e.LECT_TMA = splitLectureTM(e.LECT_TM), e));
	let KEYS = ["CORS_CD", "CORS_NM", "CLS_NO", "UNKNOWN1", "LECT_RM", "CREDIT", "UNKNOWN2", "DEPT_NM", "PROF_NM", "CLS_CNT", "LECT_TMA"];
	db = db.map(e=>KEYS.map(k=>e[k]));
	db = db.map(e=>e.map(v=>v?String(v):''));
    var output = "var SUBJECT_DATA = \r\n" + JSON.stringify(db);
    return output;
}

function packSpace(str)
{
    var len = str.length;
    var i;
    for(i=len-1; i>=0; --i) {
        if(str[i] != ' ') break;
    }
    return str.substr(0, i+1);
}

