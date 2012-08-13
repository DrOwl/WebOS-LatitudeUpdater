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
function SettingsAssistant()
{
}

SettingsAssistant.prototype.setup = function()
{
    /* this function is for setup tasks that have to happen when the scene is first created */
    
    /* use Mojo.View.render to render view templates and add them to the scene, if needed */
    
    /* setup widgets here */
    
    /* add event handlers to listen to events from widgets */
    this.settings = load_settings();
    
    this.accValues = [{
        label: $L("High"),
        value: 1
    }, {
        label: $L("Medium"),
        value: 2
    }, {
        label: $L("Low"),
        value: 3
    }];
	
	  
    this.notifyValues = [{
        label: $L("None"),
        value: 0
    }, {
        label: $L("On position update"),
        value: 1
    }];
    
    this.timeValues = [{
        label: $L("< 5 seconds"),
        value: 1
    }, {
        label: $L("5 to 20 seconds"),
        value: 2
    }, {
        label: $L("> 20 seconds"),
        value: 3
    }];
	
	this.retryValues = [{
        label: $L("Do not retry"),
        value: 0
    }, {
        label: $L("Retry once"),
        value: 1
    }, {
        label: $L("Retry twice"),
        value: 2
    }, {
        label: $L("Retry thrice"),
        value: 3
    }];
     
	this.intervals = [
		{'label': $L("#{time} minutes").interpolate({
			'time': "5"
		}), value: 5},
		{'label': $L("#{time} minutes").interpolate({
			'time': "10"
		}), value: 10},
		{'label': $L("#{time} minutes").interpolate({
			'time': "15"
		}), value: 15},
		{'label': $L("#{time} minutes").interpolate({
			'time': "20"
		}), value: 20},
		{'label': $L("#{time} minutes").interpolate({
			'time': "25"
		}), value: 25},
		{'label': $L("#{time} minutes").interpolate({
			'time': "30"
		}), value: 30},
		{'label': $L("#{time} minutes").interpolate({
			'time': "35"
		}), value: 35},
		{'label': $L("#{time} minutes").interpolate({
			'time': "40"
		}), value: 40},
		{'label': $L("#{time} minutes").interpolate({
			'time': "45"
		}), value: 45},
		{'label': $L("#{time} minutes").interpolate({
			'time': "50"
		}), value: 50},
		{'label': $L("#{time} minutes").interpolate({
			'time': "55"
		}), value: 55},
		{'label': $L("#{time} minutes").interpolate({
			'time': "60"
		}), value: 60},
		{'label': $L("#{time} minutes").interpolate({
			'time': "70"
		}), value: 70},
		{'label': $L("#{time} minutes").interpolate({
			'time': "80"
		}), value: 80},
		{'label': $L("#{time} minutes").interpolate({
			'time': "90"
		}), value: 90},
		{'label': $L("#{time} minutes").interpolate({
			'time': "115"
		}), value: 115},
		{'label': $L("#{time} minutes").interpolate({
			'time': "120"
		}), value: 120},
		{'label': $L("#{time} minutes").interpolate({
			'time': "150"
		}), value: 150},
		{'label': $L("#{time} minutes").interpolate({
			'time': "180"
		}), value: 180}];
		
	this.ages = [
		{'label': $L("Always refresh").interpolate({
			'time': "0"
		}), value: 0},
		{'label': $L("#{time} seconds").interpolate({
			'time': "30"
		}), value: 30},
		{'label': $L("#{time} seconds").interpolate({
			'time': "60"
		}), value: 60},
		{'label': $L("#{time} seconds").interpolate({
			'time': "120"
		}), value: 120},
		{'label': $L("#{time} seconds").interpolate({
			'time': "180"
		}), value: 180},
		{'label': $L("#{time} seconds").interpolate({
			'time': "240"
		}), value: 240},
		{'label': $L("#{time} seconds").interpolate({
			'time': "300"
		}), value: 300},
		{'label': $L("#{time} seconds").interpolate({
			'time': "360"
		}), value: 360},
		{'label': $L("#{time} seconds").interpolate({
			'time': "480"
		}), value: 480},
		{'label': $L("#{time} seconds").interpolate({
			'time': "600"
		}), value: 600}];
	
	this.wakeupValues = [{
        label: $L("No wake-up"),
        value: 0
    }, {
        label: $L("Allow device to wake up"),
        value: 1
    }];
	
    this.controller.setupWidget('accuracy', {
        label: $L("Accuracy"),
        choices: this.accValues,
		'labelPlacement': "left",
        modelProperty: 'acc'
    }, this.settings);
	 this.controller.setupWidget('interval', {
        label: $L("Update Interval"),
        choices: this.intervals,
		'labelPlacement': "left",
        modelProperty: 'interval'
    }, this.settings);
    this.controller.setupWidget('responseTime', {
        label: $L("Response Time"),
        choices: this.timeValues,
		'labelPlacement': "left",
        modelProperty: 'time'
    }, this.settings);
    this.controller.setupWidget('notification', {
        label: $L("Notification"),
		choices: this.notifyValues,
		'labelPlacement': "left",
		modelProperty: 'notify'
    }, this.settings);
	this.controller.setupWidget('maxAge', {
        label: $L("Maximum Age"),
		choices: this.ages,
		'labelPlacement': "left",
		modelProperty: 'age'
    }, this.settings);
	this.controller.setupWidget('retry', {
        label: $L("Retry on failure"),
		choices: this.retryValues,
		'labelPlacement': "left",
		modelProperty: 'retry'
    }, this.settings);
	this.controller.setupWidget('wakeup', {
        label: $L("Wake-Up Options"),
		choices: this.wakeupValues,
		'labelPlacement': "left",
		modelProperty: 'wakeup'
    }, this.settings);
	this.controller.get("locationheader").update($L("Location Options"));
	this.controller.get("updateheader").update($L("Update Options"));
	this.controller.get("header").update($L("Preferences"));
	this.controller.get("daemonheader").update($L("Background Service Options"));
	this.controller.get("intro").update($L("Refer to the <a href=\"http://webos.laesche.net/manuals/latitude.html\">manual</a> for a detailed description of the parameters."));
};

SettingsAssistant.prototype.activate = function(event)
{
    /* put in event handlers here that should only be in effect when this scene is active. For
     example, key handlers that are observing the document */
};

SettingsAssistant.prototype.deactivate = function(event)
{
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
     this scene is popped or another scene is pushed on top */
    save_settings(this.settings);
};

SettingsAssistant.prototype.cleanup = function(event)
{
    /* this function should do any cleanup needed before the scene is destroyed as 
     a result of being popped off the scene stack */
};
