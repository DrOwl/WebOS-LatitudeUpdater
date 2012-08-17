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
function OauthDoneAssistant(doneConfig)
{
    /* this is the creator function for your scene assistant object. It will be passed all the 
     additional parameters (after the scene name) that were passed to pushScene. The reference
     to the scene controller (this.controller) has not be established yet, so any initialization
     that needs the scene controller should be done in the setup function below. */
    this.response = doneConfig.response;
}

OauthDoneAssistant.prototype.setup = function()
{
    /* this function is for setup tasks that have to happen when the scene is first created */
    
    /* use Mojo.View.render to render view templates and add them to the scene, if needed */
    
    /* setup widgets here */
    
    /* add event handlers to listen to events from widgets */
    //this.controller.get("hallo").update("You are authorized." + this.response);
    	Mojo.Log.info(this.TAG, 'TEST running SETUP');
	this.controller.get("status").update($L("Your authorization was successful."));
	this.controller.get("header").update($L("Authorization"));
    try 
    {
		Mojo.Log.info(this.TAG, 'starting');
        if (this.response.indexOf('access_token') == -1) 
        {
            var part = this.response.split(",");
            var token_section = part.split(":");
            var token = OAuth.decodePercent(token_section[1].replace("\"", ""));
            // var tokenSecret = OAuth.decodePercent(part[1].replace("oauth_token_secret=", ""));
            var obj = {
                token: token,
             //   tokenSecret: tokenSecret
            };
            var authCookie = new Mojo.Model.Cookie('latitudetoken');
            authCookie.put(obj);
            Mojo.Controller.stageController.popScenesTo(undefined);
            Mojo.Controller.stageController.pushScene('first');
            return;
        }
    } 
    catch (e) 
    {
    }

    	Mojo.Log.info(this.TAG, 'TEST after try in done ass');
    this.buttonAttributes = {};
    this.buttonModel = {
        "label": $L("OK"),
        "buttonClass": "",
        "disabled": false
    };
	var authCookie = new Mojo.Model.Cookie('latitudetoken');
	authCookie.remove();
	this.controller.get("status").update($L("The authorization has not been successful. This happens from time to time. Please try again."));
    this.controller.setupWidget("MyButton", this.buttonAttributes, this.buttonModel);
    Mojo.Event.listen(this.controller.get("MyButton"), Mojo.Event.tap, this.handleButtonPress.bind(this));
};

OauthDoneAssistant.prototype.handleButtonPress = function(event)
{
    Mojo.Controller.stageController.popScenesTo(undefined);
    Mojo.Controller.stageController.pushScene('first');
}

OauthDoneAssistant.prototype.activate = function(event)
{
    /* put in event handlers here that should only be in effect when this scene is active. For
     example, key handlers that are observing the document */
     	Mojo.Log.info(this.TAG, 'TEST running activate');
};

OauthDoneAssistant.prototype.deactivate = function(event)
{
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
     this scene is popped or another scene is pushed on top */
};

OauthDoneAssistant.prototype.cleanup = function(event)
{
    /* this function should do any cleanup needed before the scene is destroyed as 
     a result of being popped off the scene stack */
};
