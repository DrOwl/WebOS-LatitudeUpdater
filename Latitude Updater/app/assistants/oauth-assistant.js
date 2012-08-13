function OauthAssistant(oauthConfig) {
	this.TAG = 'OauthAssistant';
	this.method = null;
	this.callbackScene = oauthConfig.callbackScene;
	this.requestTokenUrl = oauthConfig.requestTokenUrl;
	this.authorizeUrl = oauthConfig.authorizeUrl;
	this.accessTokenUrl = oauthConfig.accessTokenUrl;
	this.client_id = oauthConfig.client_id;
	this.client_secret = oauthConfig.client_secret;
	if (oauthConfig.redirect_uri != undefined) this.redirect_uri = oauthConfig.redirect_uri;
	else this.redirect_uri = 'oob';
	this.response_type = oauthConfig.response_type;
	if (oauthConfig.accessTokenMethod != undefined) this.accessTokenMethod = oauthConfig.accessTokenMethod;
	else this.accessTokenMethod = 'GET';
	this.scope = oauthConfig.scope;
	this.url = '';
	this.requested_token = '';
	this.exchangingToken = false;
}

OauthAssistant.prototype.setup = function() {
	Mojo.Log.info(this.TAG, 'setup');
	this.controller.setupWidget('browser', {},
	this.storyViewModel = {});
	this.reloadModel = {
		label: $L('Reload'),
		icon: 'refresh',
		command: 'refresh'
	};
	this.stopModel = {
		label: $L('Stop'),
		icon: 'load-progress',
		command: 'stop'
	};
	this.cmdMenuModel = {
		visible: true,
		items: [{},
		this.reloadModel]
	};
	this.controller.setupWidget(Mojo.Menu.commandMenu, {
		menuClass: 'no-fade'
	},
	this.cmdMenuModel);
	Mojo.Event.listen(this.controller.get('browser'), Mojo.Event.webViewLoadProgress, this.loadProgress.bind(this));
	Mojo.Event.listen(this.controller.get('browser'), Mojo.Event.webViewLoadStarted, this.loadStarted.bind(this));
	Mojo.Event.listen(this.controller.get('browser'), Mojo.Event.webViewLoadStopped, this.loadStopped.bind(this));
	Mojo.Event.listen(this.controller.get('browser'), Mojo.Event.webViewLoadFailed, this.loadStopped.bind(this));
	Mojo.Event.listen(this.controller.get('browser'), Mojo.Event.webViewTitleUrlChanged, this.titleChanged.bind(this));
}
OauthAssistant.prototype.titleChanged = function(event) {
	var callbackUrl = event.url;
	var responseVars = callbackUrl.split("?");
	if (!this.exchangingToken && (responseVars[0] == this.redirect_uri + '/' || responseVars[0] == this.redirect_uri)) {
		Mojo.Log.info(this.TAG, 'code got');
		this.controller.get('browser').hide();
		var response_param = responseVars[1];
		var result = response_param.match(/code=*/g);
		if (result != null) {
			var params = response_param.split("&");
			var code = params[0].replace("code=", "");
			Mojo.Log.info(this.TAG, 'code is ' + code);
			this.codeToken(code);
		}
	}
}

OauthAssistant.prototype.requestGrant = function() {
	Mojo.Log.info(this.TAG, 'requestGrant');
	
	var scope = '';
	for(var now in this.scope) {
		if(typeof(this.scope[now]) == 'function')continue;
		if(scope != '') scope = scope + '+';
		scope = scope + this.scope[now];
	}
	
	var url = this.authorizeUrl + '?client_id=' + this.client_id + '&redirect_uri=' + this.redirect_uri + '&response_type=' + this.response_type;
	if(scope != '') url = url + '&scope=' + scope;
	Mojo.Log.info(this.TAG, 'requestGrant opening'+url);
	this.controller.get('browser').mojo.openURL(url);
};

OauthAssistant.prototype.codeToken = function(code) {
	this.exchangingToken = true;
	this.url = this.accessTokenUrl;
	this.code = code;
	this.method = this.accessTokenMethod;
	var postParams = {
		client_id: this.client_id,
		client_secret: this.client_secret,
		code: this.code,
		grant_type: 'authorization_code',
		redirect_uri: this.redirect_uri
	};
	var postBody = '';
	for (var name in postParams) {
		if (postBody == '') {
			postBody = name + '=' + postParams[name];
		}
		else {
			postBody = postBody + '&' + name + '=' + postParams[name];
		}
	}
	Mojo.Log.info(this.TAG, 'posting ' + postBody);
	new Ajax.Request(this.url, {
		method: this.method,
		encoding: 'UTF-8',
		postBody: postBody,
		onComplete: function(response) {
			var response_text = response.responseText;
			Mojo.Log.info(this.TAG, 'accesstoken: ' + response.status + response_text);
			this.controller.stageController.swapScene({
				name: this.callbackScene,
				transition: Mojo.Transition.none
			},
			{
				source: 'oauth',
				response: response_text
			});
		}.bind(this)
	});
}

OauthAssistant.prototype.instanceBrowser = function(oauthBrowserParams) {
	this.storyURL = oauthBrowserParams.authUrl;
	this.callbackURL = oauthBrowserParams.callbackUrl
	this.controller.get('browser').mojo.openURL(oauthBrowserParams.authUrl);
}
OauthAssistant.prototype.handleCommand = function(event) {
	if (event.type == Mojo.Event.command) {
		switch (event.command) {
		case 'refresh':
			this.controller.get('browser').mojo.reloadPage();
			break;
		case 'stop':
			this.controller.get('browser').mojo.stopLoad();
			break;
		}
	}
};
//  loadStarted - switch command button to stop icon & command
//
OauthAssistant.prototype.loadStarted = function(event) {
	this.cmdMenuModel.items.pop(this.reloadModel);
	this.cmdMenuModel.items.push(this.stopModel);
	this.controller.modelChanged(this.cmdMenuModel);
	this.currLoadProgressImage = 0;
};
//  loadStopped - switch command button to reload icon & command
OauthAssistant.prototype.loadStopped = function(event) {
	this.cmdMenuModel.items.pop(this.stopModel);
	this.cmdMenuModel.items.push(this.reloadModel);
	this.controller.modelChanged(this.cmdMenuModel);
};
//  loadProgress - check for completion, then update progress
OauthAssistant.prototype.loadProgress = function(event) {
	var percent = event.progress;
	try {
		if (percent > 100) {
			percent = 100;
		}
		else if (percent < 0) {
			percent = 0;
		}
		// Update the percentage complete
		this.currLoadProgressPercentage = percent;
		// Convert the percentage complete to an image number
		// Image must be from 0 to 23 (24 images available)
		var image = Math.round(percent / 4.1);
		if (image > 23) {
			image = 23;
		}
		// Ignore this update if the percentage is lower than where we're showing
		if (image < this.currLoadProgressImage) {
			return;
		}
		// Has the progress changed?
		if (this.currLoadProgressImage != image) {
			// Cancel the existing animator if there is one
			if (this.loadProgressAnimator) {
				this.loadProgressAnimator.cancel();
				delete this.loadProgressAnimator;
			}
			// Animate from the current value to the new value
			var icon = this.controller.select('div.load-progress')[0];
			if (icon) {
				this.loadProgressAnimator = Mojo.Animation.animateValue(Mojo.Animation.queueForElement(icon), "linear", this._updateLoadProgress.bind(this), {
					from: this.currLoadProgressImage,
					to: image,
					duration: 0.5
				});
			}
		}
	}
	catch(e) {
		Mojo.Log.logException(e, e.description);
	}
};
OauthAssistant.prototype._updateLoadProgress = function(image) {
	// Find the progress image
	image = Math.round(image);
	// Don't do anything if the progress is already displayed
	if (this.currLoadProgressImage == image) {
		return;
	}
	var icon = this.controller.select('div.load-progress');
	if (icon && icon[0]) {
		icon[0].setStyle({
			'background-position': "0px -" + (image * 48) + "px"
		});
	}
	this.currLoadProgressImage = image;
};
OauthAssistant.prototype.activate = function(event) {
	this.requestGrant();
}

OauthAssistant.prototype.deactivate = function(event) {

}
OauthAssistant.prototype.cleanup = function(event) {
	Mojo.Event.stopListening(this.controller.get('browser'), Mojo.Event.webViewLoadProgress, this.loadProgress);
	Mojo.Event.stopListening(this.controller.get('browser'), Mojo.Event.webViewLoadStarted, this.loadStarted);
	Mojo.Event.stopListening(this.controller.get('browser'), Mojo.Event.webViewLoadStopped, this.loadStopped);
	Mojo.Event.stopListening(this.controller.get('browser'), Mojo.Event.webViewLoadFailed, this.loadStopped);
	Mojo.Event.stopListening(this.controller.get('browser'), Mojo.Event.webViewTitleUrlChanged, this.titleChanged);
}

