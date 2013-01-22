// base64 encode ---------------------------------------------------------------
function encBase64(str) {
	b64_str = base64.encode(str, 1);
	return b64_str;
}

// base64 decode ----------------------------------------------------------------
function decBase64(b64_str) {
	str = base64.decode(b64_str, 1);
	return str;
}

// JSON encode ------------------------------------------------------------------
function encJson(obj) {
	json = JSON.stringify(obj);
	return json;
}

// JSON decode ------------------------------------------------------------------
function decJson(json) {
	obj = JSON.parse(json);
	return obj;
	// obj.params = value
}

// ランダム文字列 -------------------------------------------------------------
function randPass(length) {
	length = length || '';
	// var rand = 'abcdefghijklmnopqrstuvwxyz' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + '0123456789';
	var rand = 'abcdef' + '0123456789';
	rand = rand.split('');
	var pass = '';
	for (var i = 0; i < length; i++) {
		pass += rand[Math.floor(Math.random() * rand.length)];
	}
	return pass;
}

// htmlでのGET受け取り -------------------------------------------------------------
function getQuery() {
	if (1 < document.location.search.length) {
		// 最初の1文字(?記号)を除いた文字列を取得する
		var query = document.location.search.substring(1);

		// クエリの区切り記号(&)で文字列を配列に分割する
		var parameters = query.split('&');
		var result = new Object();
		for (var i = 0; i < parameters.length; i++) {
			// パラメータ名とパラメータ値に分割する
			var element = parameters[i].split('=');
			var paramKey = decodeURIComponent(element[0]);
			console.log("paramKey " + paramKey);
			var paramValue = decodeURIComponent(element[1]);
			console.log("paramValue " + paramValue);
			// パラメータ名をキーとして連想配列に追加する
			result[paramKey] = paramValue;
		}
		return result;
	}
	return null;
}

//
function getDate(timestamp) {
	var ts = parseInt(timestamp);
	var d = new Date(ts * 1000);
	var year = d.getFullYear();
	var month = d.getMonth() + 1;
	var day = d.getDate();
	return String(year) + '年' + String(month) + '月' + String(day) + '日';
}

function getDateTime(timestamp) {
	var ts = parseInt(timestamp);
	var d = new Date(ts * 1000);
	var year = d.getFullYear();
	var month = d.getMonth() + 1;
	var day = d.getDate();
	var hour = (d.getHours() < 10 ) ? '0' + d.getHours() : d.getHours();
	var min = (d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
	var sec = (d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();
	// return String(year) + '年' + String(month) + '月' + String(day) + '日 ' + String(hour) + ':' + String(min) + ':' + String(sec);
	return String(year) + '年' + String(month) + '月' + String(day) + '日 ' + String(hour) + ':' + String(min);
}

// 桁区切り
function currency(str) {
	var num = new String(str).replace(/,/g, "");
	while (num != ( num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
	return num;
}

// fnが関数ならそのまま返し、文字列なら関数名にして返す
function $FN(fn) {
	return ( typeof fn == 'function') ? fn : Function('x', 'return ' + fn);
}

// ファイル書込処理(書き込み成功ならokfn関数を実行、失敗ならerrfn関数を実行)
function setFile(fname, jsonObj, okfn, errfn) {
	// 暗号化
	var encText = encAesObj(jsonObj);
	// localstorageに保存
	setLocalStorage(fname, encText);
	var data = getLocalStorage(fname);
	if(data != '' && data != null){
		console.log("書き込みOK: " + fname);
		callback = $FN(okfn);
		return callback(encText);
	} else {
		console.log("書き込みNG: " + fname);
		callback = $FN(errfn);
		return callback();
	}
}

// ファイル読み込み処理(読み込み成功ならokfn関数を実行、失敗ならerrfn関数を実行)
function getFile(fname, okfn, errfn) {
	var encText = getLocalStorage(fname);
	if(encText != '' && encText != null){
		var obj = decAesObj(encText);
		callback = $FN(okfn);
		return callback(obj);
	} else {
		noFile();
	}
	function noFile(error) {
		console.log("ファイルを読み込めませんでした。");
		callback = $FN(errfn);
		return callback()
	}
}

// 設定ファイルの読み込み
function getonOrdering(callfn) {
	// ファイルの読み込み
	//console.log("Start ordering");
	var fname = 'ordering';
	getFile(fname, getonOrderingOK, getonOrderingNG);

	function getonOrderingOK(json) {
		//alert('getonOrderingOK::json = ' + JSON.stringify(json));
		//console.log("OK : ordering");
		getonMSG(json, callfn);
	}

	function getonOrderingNG() {
		//console.log("NG : ordering");
		location.href = "index.html";
		return false;
	}
}

// 超重要メッセージの出力
function getonMSG(json, callfn) {
	// URLの取得
	var callback = $FN(callfn);

	$.ajax({
		type : "POST",
		url : "http://exorder.jp/app/msg.php",
		data : "id1=alivecast&id2=sugoi&app_code=" + json.app_code + "&app_ver=" + json.app_ver,
		success : function(data) {
			console.log('重要メッセージ：success');
			if (data) {
				console.log("重要ＭＳＧ");
				var button = 'OK';
				var title = '【重要メッセージ】';
				navigator.notification.alert(data, callback(json), title, button);
			} else {
				console.log('callback: ' + JSON.stringify(json));
				return callback(json);
			}
		},
		error : function() {
			$.ajax({
				type : "POST",
				url : "http://www.alivecast.jp/exorder/msg.php",
				data : "id1=alivecast&id2=sugoi&app_code=" + json.app_code + "&app_ver=" + json.app_ver,
				success : function(data) {
					console.log('重要メッセージ：error-success');
					if (data) {
						console.log("重要ＭＳＧ");
						var button = 'OK';
						var title = '【重要メッセージ】';
						navigator.notification.alert(data, callback(json), title, button);
					} else {
						return callback(json);
					}
				},
				error : function() {
					console.log('callback: ' + JSON.stringify(json));
					return callback(json);
				}
			});
		}
	});
}

// 通信エラーメッセージ文
function networdERR(callfn, title) {
	message = '通信が混み合っているか、通信環境がよくないため、しばらく時間をおいて操作を行ってください。';
	button = 'OK';
	callback = $FN(callfn);
	if (title == '' || title == null) {
	} else {
		title = '通信エラー';
	}
	// navigator.notification.alert(message, callback, title, button);
	navigator.notification.alert(
		message, 
		function(){
			window.location.href = 'netError.html'
		}, 
		title, 
		button
	);
}

// ネットワーク状態を調べる
function check_network() {
	var domain = 'exorder.jp';
	navigator.network.isReachable(domain, reachableCallback);
}

// ネットワーク状態を受け取るlコールバック
function reachableCallback(reachability) {
	// 現状では各プラットフォーム間でのreachabilityのフォーマットに関しての一貫性はありません
	var networkState = reachability.code || reachability;

	var states = {};
	states[NetworkStatus.NOT_REACHABLE] = '接続可能なネットワークが見つかりません';
	states[NetworkStatus.REACHABLE_VIA_CARRIER_DATA_NETWORK] = 'データ接続';
	states[NetworkStatus.REACHABLE_VIA_WIFI_NETWORK] = 'WiFi接続';

	console.log('接続の形式: ' + states[networkState]);
}

// 郵便番号の取得 //////////////////////////////////////////////////////////////////////
function getAddress() {
	var zipcode = $('#ordering\\[customer_zipcode\\]').val();
	$.get('/app/Ordering/get_address?zip=' + zipcode);
}

function setPref(data) {
	$('#ordering\\[customer_pref\\]').val(data);
	//	var select = $('#ordering\\[customer_pref\\]');
	//	select.val(40);
}

function setAddress(data) {
	$('#ordering\\[customer_address1\\]').val(data);
}

// 合計金額の取得 //////////////////////////////////////////////////////////////////////
function getCarriage(price, carriage, non_carriage_price) {
	var amount = document.getElementById('#order_amount').value;
	var total = (price * amount) + carriage;
	var neoCarriage = carriage;
	if (total >= non_carriage_price) {
		total = (price * amount);
		neoCarriage = 0;
	}
	// 桁区切り
	str = String(total);
	var num = new String(str).replace(/,/g, "");
	while (num != ( num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
	//	return num;
	// 送料無料を反映
	setCarriage(neoCarriage);
	document.getElementById('#total').innerHTML = num + '円(税込)';
}

function setCarriage(carriage) {
	// 桁区切り
	var str = String(carriage);
	var num = new String(str).replace(/,/g, "");
	while (num != ( num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
	if ( num = '0') {
		num = '無料';
	} else {
		num + '円';
	}
	document.getElementById('#carriage').innerHTML = String(num);
}

// 桁区切りを戻す
function setPrice(price) {
	// 桁区切り
	var str = String(price);
	var num = new String(str).replace(/,/g, "");
	while (num != ( num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
	num += '円';
	return num;
}

function timeout() {
	// タイムアウト処理設定
	// $.ajaxSetup({timeout: 3000});
}

// AES128 encode CBC ------------------------------------------------------------
function encAesObj(obj) {
	console.log('::encAesObj::');
	var key = CryptoJS.enc.Hex.parse(randPassWord(32));
	var iv = CryptoJS.enc.Hex.parse(randPassWord(32));
	var str = JSON.stringify(obj);
	var encrypted = CryptoJS.AES.encrypt(str, key, {
		iv : iv
	});
	var enc = {};
	enc['key'] = encrypted.key;
	enc['iv'] = encrypted.iv;
	// enc['enc'] = encrypted;
	enc['enc'] = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
	var encText = encBase64(JSON.stringify(enc));
	return encText;
}

// AES128 decode CBC -------------------------------------------------------------
function decAesObj(encText) {
	console.log('::decAesObj::encText: ' + encText);
	// base64エンコードされてないファイル読み込みの暫定処置
	var objText = '';
	if (encText.match(/^{/)) {
		objText = encText;
	} else {
		var enc = JSON.parse(decBase64(encText));
		var key = enc.key;
		var iv = enc.iv;
		var enc = enc.enc;
		objText = CryptoJS.AES.decrypt(enc, key, {
			iv : iv
		});
		objText = objText.toString(CryptoJS.enc.Utf8);
	}
	console.log("objText: " + objText);
	var obj = JSON.parse(objText);
	return obj;
}

// ランダム文字列 -------------------------------------------------------------
function randPassWord(length) {
	length = length || '';
	var rand = 'abcdefghijklmnopqrstuvwxyz' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + '0123456789';
	// var rand = 'abcdef' + '0123456789';
	rand = rand.split('');
	var pass = '';
	for (var i = 0; i < length; i++) {
		pass += rand[Math.floor(Math.random() * rand.length)];
	}
	return pass;
}

function getLocalStorage(fname) {
	// prefix
	fname += 'exorder'
	var value = window.localStorage.getItem(fname);
	return value;
}

function setLocalStorage(fname, value) {
	// prefix
	fname += 'exorder'
	window.localStorage.removeItem(fname);
	window.localStorage.setItem(fname, value);
}

function delFile(fname) {
	// prefix
	fname += 'exorder'
	window.localStorage.removeItem(fname);
}

function remLocalStorage(fname) {
	window.localStorage.removeItem(fname);
}

function popup(type, title, message) {
		new $pop(message, {
			type : type,
			title : title,
			width : 220,
			height : 120,
			close : false,
			modal : true
		});
}

function errorFocus(obj){
	var p = obj.offset();
//	alert(JSON.stringify(p));
	$.mobile.silentScroll(-56 + -100 + p.top);
}

