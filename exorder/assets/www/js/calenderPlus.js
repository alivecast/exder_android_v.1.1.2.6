var params = new Array();

arrM = new Array(0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
var dayT = new Date;
var strY = dayT.getYear();
var strM = dayT.getMonth();
var strD = dayT.getDate();
if (strY < 1900) {
	strY += 1900;
}//NN系対策

window.onload = function() {

	setEvent_to_OBJ("document.getElementById('year')", "change", "iniD")
	setEvent_to_OBJ("document.getElementById('month')", "change", "iniD")
	params = getCaldate();

	if (params != null) {
		// alert('hoge');
		strY = params['year'];
		strM = params['month'] - 1;
		strD = params['date'];
	}
	ini();
}
function DebugPrint(str) {
	var out = document.getElementById("debug");
	if (!out)
		return;
	out.value += str;
}

function setEvent_to_OBJ(objNameStr, eventTypeNameStr, fncNameStr) {
	eval(objNameStr + ".on" + eventTypeNameStr + "=" + fncNameStr);
}

function ini() {
	iniY();
	iniM();
	iniD();
}

function iniY() {
	var yr = document.getElementById("year");
	yr.options[0].text = '年';
	yr.options[0].value = '';
	yr.options.length = 10;
	for(var i = 1; i < yr.options.length; i++){
		yr.options[i].text = parseInt(strY) + i - 1;
		yr.options[i].value = parseInt(strY) +  i - 1;
	}
	yr.options[0].selected = "selected";
}

function iniM() {
	var mt = document.getElementById("month");
	mt.options[0].text = '月';
	mt.options[0].value = '';
	mt.options.length = 12 + 1;
	for (var i = 0; i < 12; i++) {
		mt.options[i + 1].text = i + 1;
		mt.options[i + 1].value = i + 1;
		if (i == strM) {
			mt.options[i].selected = "selected";
		}
	}
	//mt.options[0].selected = "selected";
}

function iniD() {
	var yr = document.getElementById("year");
	var dt = document.getElementById("date");
	var mt = document.getElementById("month");
	var u_flg = 0;
	//うるう年か否か
	var d_flg = 0;
	//年月が現在と同じか否か
	//月末の日数
	var lngD = arrM[mt.options[mt.selectedIndex].value];
	if (mt.options[mt.selectedIndex].value == 2) {
		u_flg = uruu(yr.options[yr.selectedIndex].value);
	}
	if (u_flg != 0) {
		lngD++;
	}
	if (mt.options[mt.selectedIndex].value == strM + 1 && yr.options[yr.selectedIndex].value == strY) {
		d_flg = 1;
	}
	
	//dt.options[0].text = '日';
	//dt.options[0].value = '';
	//dt.options.length = lngD + 1;
	//for (var i = 0; i < lngD; i++) {
	//	dt.options[i + 1].text = i + 1;
	//	dt.options[i + 1].value = i + 1;
	//	if (i == strD - 1 && d_flg == 1) {
	//		dt.options[i].selected = "selected";
	//	}
	//}
	//if (d_flg == 0) {
	//	dt.options[0].selected = "selected";
	//}
	//dt.options[0].selected = "selected";
}

function uruu(year) {
	if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
		return 1;
	} else {
		return 0;
	}
}

var caldates = new Array();
function getCaldate() {
	var query = window.location.search.substring(1);
	var parms = query.split('&');
	if (parms.length > 0) {
		for (var i = 0; i < parms.length; i++) {
			var pos = parms[i].indexOf('=');
			if (pos > 0) {
				var key = parms[i].substring(0, pos);
				var val = parms[i].substring(pos + 1);
				caldates[key] = val;
			}
		}
	}
	if (caldates['caldate']) {
		var part = caldates['caldate'].split('-');
		caldates['year'] = part[0];
		caldates['month'] = part[1];
		caldates['date'] = part[2];
		return caldates;
	}
	return null;
}
