# IFrame API

This is simple api for communicating with iframes

## Install

````bash
bower install iframeapi
````

## Use

The principle is simple. Iframe or parent to create a listener that will be called by sending a message.

First to include a script in the header.

````html
<script type="text/javascript" src="/bower/iframeapi/dist/iframe-api.js"></script>
````

Create dispatcher in iframe page.
````html
<script>
	document.addEventListener("DOMContentLoaded", function(event) {
		var API = new window.IframeAPI(window.parent);
		API.addDispatcher("myData", function (data) {
			console.log('Dispatch myData');
			return {
				foo: "bar"
			};
		});
	});
</script>
````

Created iframe and data processing.
````html
<iframe id="my-iframe" src="https://domain.com"></iframe>

<script>
	var iframe = document.getElementById("my-iframe");
	iframe.onload = function(){
		var API = new window.IframeAPI(iframe.contentWindow);
		API.dispatch("myData", {}, function(result){
			console.log(result);
		});
	};
</script>
````