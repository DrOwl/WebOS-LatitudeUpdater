/*
 * Copyright 2010 Christoph Laesche. All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 *
 *    1. Redistributions of source code must retain the above copyright notice, this list of
 *       conditions and the following disclaimer.
 *    2. Redistributions in binary form must reproduce the above copyright notice, this list
 *       of conditions and the following disclaimer in the documentation and/or other materials
 *       provided with the distribution.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER ``AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
function FirstAssistant()
{
    /* this is the creator function for your scene assistant object. It will be passed all the 
     
     additional parameters (after the scene name) that were passed to pushScene. The reference
     
     to the scene controller (this.controller) has not be established yet, so any initialization
     
     that needs the scene controller should be done in the setup function below. */
}

FirstAssistant.prototype.setup = function()
{
    /* this function is for setup tasks that have to happen when the scene is first created */
    
    /* use Mojo.View.render to render view templates and add them to the scene, if needed */
    
    this.controller.get("latitudelabel").update($L("Latitude"));
	this.controller.get("statuslabel").update($L("Status"));
    this.controller.get("status").update(get_update_string());
    this.controller.get("backgroundlabel").update($L("Background service"));
    this.controller.get("authlabel").update($L("Authorization"));
    this.controller.get("auth").update($L("Your are not authorized. Please click the button below."));
    
    /* setup widgets here */
	
	 this.buttonAttributes = {};
	 this.controller.setupWidget("LatitudeButton", this.buttonAttributes, {
        "label": $L("Launch Latitude in Maps"),
        "buttonClass": "",
        "disabled": false
    });
	
	this.controller.setupWidget("UpdateButton", this.buttonAttributes, {
        "label": $L("Update position now..."),
        "buttonClass": "",
        "disabled": false
    });

    this.buttonModel = {
        "label": $L("Authorize application"),
        "buttonClass": "",
        "disabled": false
    };
	
    this.controller.setupWidget("AuthorizeButton", this.buttonAttributes, this.buttonModel);
    
    this.controller.setupWidget("BackButton", this.buttonAttributes, {
        "label": $L("start"),
        "buttonClass": "",
        "disabled": false
    });
    
    this.controller.setupWidget("StopButton", this.buttonAttributes, {
        "label": $L("stop"),
        "buttonClass": "",
        "disabled": false
    });

    /* update the app info using values from our app */
    
    /* add event handlers to listen to events from widgets */
	Mojo.Event.listen(this.controller.get("LatitudeButton"), Mojo.Event.tap, this.handleLatitude.bind(this));
	Mojo.Event.listen(this.controller.get("UpdateButton"), Mojo.Event.tap, this.handleUpdate.bind(this));
    Mojo.Event.listen(this.controller.get("AuthorizeButton"), Mojo.Event.tap, this.handleButtonPress.bind(this));
    Mojo.Event.listen(this.controller.get("BackButton"), Mojo.Event.tap, this.handleStartAlarm.bind(this));
    Mojo.Event.listen(this.controller.get("StopButton"), Mojo.Event.tap, this.handleStopAlarm.bind(this));
    
    this.appController = Mojo.Controller.getAppController();
    if (app_is_authorized()) 
    {
        this.controller.get("auth").update($L("You are authorized."));
        this.buttonModel.label = $L("Re-authorize application");
        //this.updateLocation(this.controller);
    } else 
    {
        this.controller.get("status").update($L("Please authorize the application to use your latitude account."));
    }
    this.controller.setupWidget(Mojo.Menu.appMenu, this.attributes = {
        omitDefaultItems: true
    }, this.model = {
        visible: true,
        items: [{
            label: $L("About Latitude Updater ..."),
            command: 'do-myAbout'
        }, Mojo.Menu.editItem, {
            label: $L("Preferences"),
            command: 'do-myPrefs'
        }, {
            label: $L("Manual"),
            command: 'do-myManual'
        }]
    });
	show_service_status(this.controller);
};

FirstAssistant.prototype.activate = function(event)
{
    /* put in event handlers here that should only be in effect when this scene is active. For
     example, key handlers that are observing the document */
};

FirstAssistant.prototype.deactivate = function(event)
{
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
     this scene is popped or another scene is pushed on top */
};

FirstAssistant.prototype.cleanup = function(event)
{
    /* this function should do any cleanup needed before the scene is destroyed as 
     a result of being popped off the scene stack */
};

FirstAssistant.prototype.handleButtonPress = function(event)
{
    this.controller.showDialog({
        template: 'alert/alert-scene',
        assistant: new AlertAssistant(this, this.authorizeApp.bind(this)),
        preventCancel: true
    });
}

FirstAssistant.prototype.handleLatitude = function(event)
{
	this.controller.serviceRequest("palm://com.palm.applicationManager", {
   		method:"open",
    	parameters:{target: latitude_launch()}
	});
}

FirstAssistant.prototype.handleUpdate = function(event)
{
	this.updateLocation(this.controller);
}

FirstAssistant.prototype.authorizeApp = function(event)
{
    var oauthConfig = {
		callbackScene:'oauth-done', //Name of the assistant to be called on the OAuth Success
		authorizeUrl:'https://accounts.google.com/o/oauth2/auth',
		accessTokenUrl:'https://www.googleapis.com/oauth2/v1/userinfo',
		accessTokenMethod:'GET', // Optional - 'GET' by default if not specified
		client_id: consumer_key(),
		client_secret: consumer_key_secret(),
		redirect_uri:'http://www.google.com/oauth2callback', // Optional - 'oob' by default if not specified
        response_type:'code', // now only support code
        scope: ['https://www.googleapis.com/auth/latitude.current.best']
        
//        callbackScene: 'oauth-done', //Name of the assistant to be called on the OAuth Success
//        requestTokenUrl: 'https://www.google.com/accounts/OAuthGetRequestToken',
//        requestTokenMethod: 'GET', // Optional - 'GET' by default if not specified
//        authorizeUrl: 'https://accounts.google.com/OAuthAuthorizeToken',
//        accessTokenUrl: 'https://www.google.com/accounts/OAuthGetAccessToken',
//        accessTokenMethod: 'GET', // Optional - 'GET' by default if not specified
//        consumer_key: consumer_key(),
//        consumer_key_secret: consumer_key_secret(),
//        callback: 'http://webos.laesche.net', // Optional - 'oob' by default if not specified
//        requestParams: {
//            scope: "https://www.googleapis.com/auth/latitude.current.best",
//        },
//        authorizeParams: {
//            domain: "webos.laesche.net",
//            location: "current",
//            granularity: "best",
//            btmpl: "mobile"
//        }
    };
    Mojo.Controller.stageController.pushScene('oauth', oauthConfig);
}

FirstAssistant.prototype.handleStartAlarm = function(event)
{
	start_background_service(this.controller);
}

FirstAssistant.prototype.handleStopAlarm = function(event)
{
    stop_background_service(this.controller);
}

FirstAssistant.prototype.updateLocation = function()
{
    update_location(this.controller);
}

FirstAssistant.prototype.handleCommand = function(event)
{
    if (event.type === Mojo.Event.command) 
    {
        switch (event.command)
        {
            case "do-myAbout":
                Mojo.Controller.stageController.pushScene('about');
                break;
            case "do-myPrefs":
                Mojo.Controller.stageController.pushScene('settings');
                break;
			case "do-myManual":
				this.controller.serviceRequest("palm://com.palm.applicationManager", {
   					method:"open",
    				parameters:{target: manual_url()}
				});
				break;
        }
    }
}
