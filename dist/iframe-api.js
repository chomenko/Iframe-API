(function () {
	/**
	 * @param {{}} recipient iframe or window
	 * @constructor
	 */
	window.IframeAPI = function (recipient) {
		var the = this;
		var local = {
			dispatchers: {},
			replies: {}
		};

		/**
		 * Bind event
		 * @param {string} eventName
		 * @param {function} eventHandler
		 */
		local.bindEvent = function (eventName, eventHandler) {
			if (window.addEventListener) {
				window.addEventListener(eventName, eventHandler, false);
			} else if (window.attachEvent) {
				window.attachEvent('on' + eventName, eventHandler);
			}
		};

		/**
		 * @param {string} name
		 * @param {function} dispatcher
		 */
		this.addDispatcher = function (name, dispatcher) {
			local.dispatchers[name] = dispatcher;
		};

		/**
		 * @param {(string|null)} name Dispatcher name
		 * @param {{}} data Content data
		 * @param {(function)} result Callable function for data processing
		 */
		this.dispatch = function (name, data, result) {
			var body = {
				dispatcher: name,
				data: data,
				reply: false
			};

			if (typeof result === "function") {
				body.reply = Math.random().toString(36).substr(2, 9);
				local.replies[body.reply] = result
			} else if (typeof result === "string" && name === null) {
				body.reply = result;
			}
			recipient.postMessage(body, '*');

		};

		/**
		 * Constructor
		 */
		local.bindEvent('message', function (e) {
			var dispatcher = e.data.dispatcher;
			var data = e.data.data;
			var reply = e.data.reply;

			if (dispatcher === null && typeof local.replies[reply] !== "undefined") {
				local.replies[reply](data);
				delete local.replies[reply];
				return;
			}

			if (typeof dispatcher !== "undefined" && typeof local.dispatchers[dispatcher] !== "undefined") {
				var result = local.dispatchers[dispatcher](data);
				if (reply !== "undefined" && reply !== false) {
					the.dispatch(null, result, reply);
				}
			}
		});
	};
})();