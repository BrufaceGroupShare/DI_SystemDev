function setupSSO(factory) {
	/* Respond to authentication challenges with popup login dialog */
	var basicHandler = new BasicChallengeHandler();
	basicHandler.loginHandler = function (callback) {
		popupLoginDialog(callback);
	}
	factory.setChallengeHandler(basicHandler);
}

function setup() {
	
	
	
		
	var locationURI = new URI("ws://localhost:3000/ws/websocket");
	var websocket;

	var consoleLog = document.getElementById("consoleLog");
	var clear = document.getElementById("clear");
	var wsurl = document.getElementById("wsurl");
	var message = document.getElementById("message");
	var connect = document.getElementById("connect");
	var sendText0 = document.getElementById("sendText0");
	var sendText1 = document.getElementById("sendText1");
	var sendText2 = document.getElementById("sendText2");
	var sendText3 = document.getElementById("sendText3");
	var sendText4 = document.getElementById("sendText4");
	
	//var sendBlob = document.getElementById("sendBlob");
	//var sendArrayBuffer = document.getElementById("sendArrayBuffer");
	//var sendByteBuffer = document.getElementById("sendByteBuffer");
	var close = document.getElementById("close");

	// Enable or disable controls based on whether or not we are connected.
	// For example, disable the Connect button if we're connected.
	var setFormState = function (connected) {
		wsurl.disabled = connected;
		connect.disabled = connected;
		close.disabled = !connected;
		//message.disabled = !connected;
		//sendText.disabled = !connected;
		//sendBlob.disabled = !connected;
		//sendArrayBuffer.disabled = !connected || (typeof(Uint8Array) === "undefined");
		//sendByteBuffer.disabled = !connected;
	}
	/*

	// As a convenience, connect when the user presses Enter
	// if no fields have focus, and we're not currently connected.
	$(window).keypress(function (e) {
		if (e.keyCode == 13) {
			if (e.target.nodeName == "BODY" && wsurl.disabled == false) {
				doConnect();
			}
		}
	});

	// As a convenience, connect when the user presses Enter
	// in the location field.
	$('#wsurl').keypress(function (e) {
		if (e.keyCode == 13) {
			doConnect();
		}
	});

	// As a convenience, send as text when the user presses Enter
	// in the message field.
	$('#message').keypress(function (e) {
		if (e.keyCode == 13) {
			doSendText();
		}
	});
	*/
	wsurl.value = locationURI.toString();
	setFormState(false);
	var log = function (message) {
		var pre = document.createElement("pre");
		pre.style.wordWrap = "break-word";
		pre.innerHTML = message;
		consoleLog.appendChild(pre);
		consoleLog.scrollTop = consoleLog.scrollHeight;
		while (consoleLog.childNodes.length > 25) {
			consoleLog.removeChild(consoleLog.firstChild);
		}
	};

	var logResponse = function (message) {
		log("<span style='color:blue'>" + message + "</span>");
	}

	// Takes a string and Returns an array of bytes decoded as UTF8
	var getBytes = function (str) {
		var buf = new ByteBuffer();
		Charset.UTF8.encode(str, buf);
		buf.flip();
		return buf.array;
	}
	/*
	var doSendText0 = function () {
		try {
			var text = "0";
			log("SEND TEXT: " + text);
			websocket.send(text);
		} catch (e) {
			log("EXCEPTION: " + e);
		}
	};

	sendText0.onclick = doSendText0;
	
	var doSendText1 = function () {
		try {
			var text = "1";
			log("SEND TEXT: " + text);
			websocket.send(text);
		} catch (e) {
			log("EXCEPTION: " + e);
		}
	};

	sendText1.onclick = doSendText1;
	
	var doSendText2 = function () {
		try {
			var text = "2";
			log("SEND TEXT: " + text);
			websocket.send(text);
		} catch (e) {
			log("EXCEPTION: " + e);
		}
	};

	sendText2.onclick = doSendText2;
	
	var doSendText3 = function () {
		try {
			var text = "3";
			log("SEND TEXT: " + text);
			websocket.send(text);
		} catch (e) {
			log("EXCEPTION: " + e);
		}
	};

	sendText3.onclick = doSendText3;
	
	var doSendText4 = function () {
		try {
			var text = "4";
			log("SEND TEXT: " + text);
			websocket.send(text);
		} catch (e) {
			log("EXCEPTION: " + e);
		}
	};

	sendText4.onclick = doSendText4;

	*/
	
	/*
	sendBlob.onclick = function () {
		try {
			// BlobUtils is implemented for all supported platforms
			var blob = BlobUtils.fromString(message.value, "transparent");
			log("SEND BLOB: " + blob);
			websocket.binaryType = "blob";
			websocket.send(blob);
		} catch (e) {
			log("EXCEPTION: " + e);
		}
	}

	sendArrayBuffer.onclick = function () {
		try {
			// ArrayBuffer is only supported on modern browsers
			var bytes = getBytes(message.value);
			var array = new Uint8Array(bytes);
			log("SEND ARRAY BUFFER: " + array.buffer);
			websocket.binaryType = "arraybuffer";
			websocket.send(array.buffer);
		} catch (e) {
			log("EXCEPTION: " + e);
		}
	}

	sendByteBuffer.onclick = function () {
		try {
			// Convert ByteBuffer to
			var buf = new ByteBuffer();
			buf.putString(message.value, Charset.UTF8);
			buf.flip();

			log("SEND BYTE BUFFER: " + buf);
			websocket.binaryType = "bytebuffer";
			websocket.send(buf);
		} catch (e) {
			log("EXCEPTION: " + e);
		}
	}
	*/
	var doConnect = function () {
		log("CONNECT: " + wsurl.value);
		connect.disabled=true;
		try {
			var factory = new WebSocketFactory();
			setupSSO(factory);
			websocket = factory.createWebSocket(wsurl.value);
			//websocket = new WebSocket(wsurl.value);

			websocket.onopen = function (evt) {
				log("CONNECTED");
				setFormState(true);
				message.focus();
			}

			websocket.onmessage = function (evt) {
				var data = evt.data;
				if (typeof(data) == "string") {
					//text
					logResponse("RECEIVED TEXT: " + data);
					//Update PC interface with correspinging 
					//if(data.slice(0, 1) == "A"){ 
						//logResponse("Letter 1: " + data.slice(0, 1));
						//Data sent from Applicaion
						//var valueLCD = data.substr(1,1);
						//logResponse("Letter 1: " + data.substr(1,1));
						//update the slider value
						//sliderDiv4.innerHTML = valueLCD;
						//$("#slide4").val(ParseInt(valueLCD));
					//}
					if(data == 'A1'){
						$("#slide4").val(1);
					} else if (data == "A2"){
						$("#slide4").val(2);
					} else if (data == "A3"){
						$("#slide4").val(3);
					} else if (data == "A4"){
						$("#slide4").val(4);
					}
					
					
				}
				/*
				else if (data.constructor == ByteBuffer) {
					//bytebuffer
					logResponse("RECEIVED BYTE BUFFER: " + data);
				}
				else if (data.byteLength) {
					//arraybuffer
					var u = new Uint8Array(data);
					var bytes = [];
					for (var i = 0; i < u.byteLength; i++) {
						bytes.push(u[i]);
					}
					logResponse("RECEIVED ARRAY BUFFER: " + bytes);
				}
				else if (data.size) {
					//blob
					var cb = function (result) {
						logResponse("RECEIVED BLOB: " + result);
					};
					BlobUtils.asNumberArray(cb, data);
				}
				else {
					logResponse("RECEIVED UNKNOWN TYPE: " + data);
				}
				*/
			}

			websocket.onclose = function (evt) {
				log("CLOSED: (" + evt.code + ") " + evt.reason);
				setFormState(false);
			}

		}
		catch (e) {
			connect.disabled=false;
			log("EXCEPTION: " + e);
			setFormState(true);
		}
	};

	connect.onclick = doConnect;

	close.onclick = function () {
		log("CLOSE");
		websocket.close();
	};

	clear.onclick = function () {
		//sliderDiv4.innerHTML = 4;
		//slide4
		
		//location.reload();
		//SLIDER UPDATE CODE
		//$("#slide4").on('change',function () {
		 //var value = $(this).val();
		   // console.log(value);
		//});
		//$("#slide4").val(parseInt($("#slide4").val())+1);  
        //$("#slide4").trigger('change');
		
		
		while (consoleLog.childNodes.length > 0) {
			consoleLog.removeChild(consoleLog.lastChild);
		}
	};
	
	
	//Sliders
	var slide1 = document.getElementById('slide1'),
    sliderDiv1 = document.getElementById("sliderAmount1");
	slide1.disabled = true;
	slide1.onchange = function() {
		sliderDiv1.innerHTML = this.value;
		log("PC"+"LCLV1"+this.value);
	}
	var slide2 = document.getElementById('slide2'),
    sliderDiv2 = document.getElementById("sliderAmount2");
	slide2.disabled = true;
	slide2.onchange = function() {
		sliderDiv2.innerHTML = this.value;
		log("PC"+"LCLV2"+this.value);
	}
	var slide3 = document.getElementById('slide3'),
    sliderDiv3 = document.getElementById("sliderAmount3");
	slide3.disabled = true;
	slide3.onchange = function() {
		sliderDiv3.innerHTML = this.value;
		log("PC"+"LCLV3"+this.value);
	}
	var slide4 = document.getElementById('slide4'),
    sliderDiv4 = document.getElementById("sliderAmount4");
	slide4.disabled = false;
	slide4.onchange = function() {
		sliderDiv4.innerHTML = this.value;
		log("PC"+"LCLVALL"+this.value);
		try {
			var text = "P" + this.value;
			log("SEND TEXT: " + text);
			websocket.send(text);
		} catch (e) {
			log("EXCEPTION: " + e);
		}
		//var reviewobject = document.getElementById("box");
		//reviewobject.style.opacity  =   0.25*ParseInt(this.value);
		//reviewobject.style.opacity  =   1.0 - (0.25*parseFloat(this.value));
		
		var reviewobject = document.getElementById("overlay");
		reviewobject.style.opacity = 0.25*parseFloat(this.value);
		reviewobject.style.display = "block";
	}
	
	
	
	
}



$(document).ready(function () {
	
	setup();
	
	/*
	
	*/
});
