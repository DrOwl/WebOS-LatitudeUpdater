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
function AlertAssistant(sceneAssistant, callbackFunc)
{
    this.callbackFunc = callbackFunc;
    this.sceneAssistant = sceneAssistant;
    this.controller = sceneAssistant.controller;
}

AlertAssistant.prototype.setup = function(widget)
{
    this.widget = widget;
    this.buttonAttributes = {};
    this.buttonModel = {
        "label": $L("I understand"),
        "buttonClass": "",
        "disabled": false
    };
    this.controller.setupWidget("OKButton", this.buttonAttributes, this.buttonModel);
    Mojo.Event.listen(this.controller.get("OKButton"), Mojo.Event.tap, this.handleOKPress.bind(this));
	this.controller.get("infomessage").update($L("<h3>Please note:</h3>You will now be redirected to a Google website.<br />There you will be asked to authorize <em>webos.laesche.net</em> to read and update your location. This is because anonymous users do not work with Google Latitude. All authentication tokens and other authentication information will be stored <strong>on the device only</strong>. The site <em>webos.laesche.net</em> will <strong>not</strong> be used."));
};

AlertAssistant.prototype.activate = function(event)
{
    /* put in event handlers here that should only be in effect when this scene is active. For
     example, key handlers that are observing the document */
};

AlertAssistant.prototype.deactivate = function(event)
{
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
     this scene is popped or another scene is pushed on top */
};

AlertAssistant.prototype.cleanup = function(event)
{
    /* this function should do any cleanup needed before the scene is destroyed as 
     a result of being popped off the scene stack */
};

AlertAssistant.prototype.handleOKPress = function(event)

{
    this.callbackFunc();
	this.widget.mojo.close();
};
