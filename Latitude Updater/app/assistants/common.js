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

var STATUS =
{
	MAYBENOT: 0,
	RUNNING: 1,
	STOPPED: 2
};

function manual_url()
{
	return "http://webos.laesche.net/manuals/latitude.html";
}

function website_url()
{
	return "http://webos.laesche.net/";
}

function donate_url()
{
	return "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KUT6CV23T8MEL";
}

function consumer_key()
{
	return 'webos.laesche.net';
}

function consumer_key_secret()
{
	return 'rdjga91H/CpVBEWGlaf1ncoE';
}

function latitude_page()
{
	return 'https://www.googleapis.com/latitude/v1/currentLocation';
}

function latitude_launch()
{
	return "http://maps.google.com/maps/m?mode=latitude";
}

function set_service_status(status)
{
	var statusCookie = new Mojo.Model.Cookie('latitudestatus');
	var interval = get_setting("interval");
	var obj = 
	{
		status: status,
		time: Math.round(new Date().getTime() / 1000),
		interval: interval
	}
    statusCookie.put(obj);
}

function get_service_status()
{
	var statusCookie = new Mojo.Model.Cookie('latitudestatus');
	var status = statusCookie.get();
	if (status === undefined)
	{
		return STATUS.MAYBENOT;
	}
	if (status.status == STATUS.STOPPED)
	{
		return STATUS.STOPPED;
	}
	if (status.status == STATUS.RUNNING)
	{
		var time = Math.round(new Date().getTime() / 1000);
		var diff = (time - status.time) / 60;
		if (diff <= status.interval) 
		{
			return STATUS.RUNNING;
		}
	}
	return STATUS.MAYBENOT;
}

function show_service_status(controller)
{
	if (controller === undefined)
	{
		return;
	}
	var status = get_service_status();
	var statusString = $L("Service might not be running.");
	switch(status)
	{
		case STATUS.RUNNING:
			statusString = $L("Service is running.");
			break;
		case STATUS.STOPPED:
			statusString = $L("Service is not running.");
			break;
	}
	controller.get("servicestatus").update(statusString);
}

function load_token()
{
	var authCookie = new Mojo.Model.Cookie('latitudetoken');
    return authCookie.get();
}

function app_is_authorized()
{
	return load_token() !== undefined;
}

function token_secret()
{
	if (!app_is_authorized()) 
	{
		return "";
	}
	return (load_token()).tokenSecret;
}

function token()
{
	if (!app_is_authorized()) 
	{
		return "";
	}
	return (load_token()).token;
}

function load_settings()
{
	var settingsCookie = new Mojo.Model.Cookie('latitudesettings');
    var settings = settingsCookie.get();
 
    if (settings !== undefined) 
    {
        if (settings.confVersion == 1)
		{
			settings.interval = 30;
			settings.age = 0;
			settings.notify = 0;
			settings.retry = 1;
			settings.wakeup = 1;
			settings.confVersion = 3;
		} else if (settings.confVersion == 2)
		{
			settings.wakeup = 1;
			settings.confVersion = 3;
		}
    } else
	{
		settings = {
			'interval': 30,
			'age': 0,
			'notify': 0,
			'acc': 2,
        	'time': 2,
			'retry': 1,
			'wakeup': 1,
			'confVersion': 3
		};
	}
	return settings;
}

function save_settings(settings)
{
	var settingsCookie = new Mojo.Model.Cookie('latitudesettings');
  	settings.confVersion = 3;
    settingsCookie.put(settings);
}

function set_update_cookie()
{
	var updateCookie = new Mojo.Model.Cookie('latitudeupdate');
	var obj = {
		date: Mojo.Format.formatDate(new Date(), {
				date: 'short'
			}) + "",
		time: Mojo.Format.formatDate(new Date(), {
				time: 'short'
			}) + ""
    };
    updateCookie.put(obj);
}

function get_update_string()
{
	var updateCookie = new Mojo.Model.Cookie('latitudeupdate');
	var updateTime = updateCookie.get();
	if (updateTime === undefined) 
	{
		return $L("Your position has not yet been updated.");
	}
	if (updateTime.date == Mojo.Format.formatDate(new Date(), {
				date: 'short'
			}) + "")
	{
		return $L("Last position update at #{time}.").interpolate({
		time: updateTime.time,
	});
	}
	return $L("Last position update on #{date} at #{time}.").interpolate({
		time: updateTime.time,
		date: updateTime.date
	});
}

function show_error(controller, message)
{
	if (controller === undefined)
	{
		return;
	}
	if (message === undefined)
	{
		controller.get("error").style.display = "none";
	}
	controller.get("error").style.display = "block";
	controller.get("error").update(message);
}

function get_setting(name)
{
	var settings = load_settings();
	return settings[name];
}

function start_background_service(controller)
{
	if (app_is_authorized()) 
	{
		var interval = get_setting("interval");
		var wakeup = get_setting("interval") == 1 ? true : false;
        new Mojo.Service.Request('palm://com.palm.power/timeout', {
            method: "clear",
            parameters: {
                "key": "latitude_update"
            }
        });
        new Mojo.Service.Request('palm://com.palm.power/timeout', {
            method: "set",
            parameters: {
                "key": "latitude_update",
                "in": "00:" + interval + ":00",
                "wakeup": wakeup,
                "uri": "palm://com.palm.applicationManager/open",
                "params": "{'id':'net.laesche.latitudeupdater','params':{'action': 'update', 'source': 'app'}}"
            }
        });
        notify($L("Background process started."), true);
		set_service_status(STATUS.RUNNING);
		show_service_status(controller);
    } else 
    {
        notify($L("Please authorize first."), true);
    }
}

function restart_background_service()
{
	var interval = get_setting("interval");
	var wakeup = get_setting("interval") == 1 ? true : false;
	new Mojo.Service.Request('palm://com.palm.power/timeout', {
        method: "set",
        parameters: {
            "key": "latitude_update",
            "in": "00:" + interval + ":00",
            "wakeup": wakeup,
            "uri": "palm://com.palm.applicationManager/open",
            "params": "{'id':'net.laesche.latitudeupdater','params':{'action': 'update', 'source': 'app'}}"
        }
    });
	set_service_status(STATUS.RUNNING);
}

function stop_background_service(controller)
{
	if (app_is_authorized()) 
    {
        new Mojo.Service.Request('palm://com.palm.power/timeout', {
            method: "clear",
            parameters: {
                "key": "latitude_update"
            }
        });
        notify($L("Background process stopped."), true);
		set_service_status(STATUS.STOPPED);
		show_service_status(controller);
    } else 
    {
        notify($L("Please authorize first."), true);
    }
}

function update_location(controller)

{
	if (!app_is_authorized())
	{
		 notify($L("Please authorize first."), true);
		 return;
	}
	var settings = load_settings();
	if (controller === undefined)
	{
		var appController = Mojo.Controller.getAppController();
		var stageName = "dashboardStage";
	    var f = function(stageController){
			stageController.pushScene({name: "dashboardStage",
				sceneTemplate: "first/dashboardStage-scene"},
				{
					message: $L("Updating position..."),
					stage: stageName
				});
		};
		appController.createStageWithCallback({
			name: stageName,
			lightweight: true
		}, f, 'dashboard');
	} else
	{
		show_error(controller, $L("Getting current location..."));
	}
	new Mojo.Service.Request('palm://com.palm.location', {
		method: "getCurrentPosition",
		parameters: {
			accuracy: settings.acc,
			maximumAge: settings.age,
			responseTime: settings.time
		},
		onSuccess: function(event)
		{
			if (event.errorCode == 0) 
    		{
		        var data = {
            		timestamp: event.timestamp,
            		latitude: event.latitude,
            		longitude: event.longitude,
            		accuracy: event.horizAccuracy
        		};
        		send_to_google(data, controller, settings.retry);
    		}
		},
		onFailure: function(event)
		{
			if (event.errorCode != 0) 
			{
				notify($L("Could not get current position."), false);
				if (controller === undefined) 
				{
					var appController = Mojo.Controller.getAppController();
					appController.closeAllStages();
				} else
				{
					show_error(controller, $L("Could not get current position."));
				}
    		}
		}
	});
}

function send_to_google(data, controller, retry)
{
	if (controller !== undefined)
	{
		show_error(controller, $L("Uploading position..."));
	}
    var accessor = {
        consumerSecret: consumer_key_secret(),
        tokenSecret: token_secret()
    };
    var timestamp = OAuth.timestamp();
    var nonce = OAuth.nonce(11);
    var message = {
        method: "POST",
        action: latitude_page(),
        parameters: {
            oauth_version: '1.0',
            oauth_nonce: null,
            oauth_timestamp: null,
            oauth_consumer_key: consumer_key(),
            oauth_token: token(),
            oauth_signature_method: 'HMAC-SHA1'
        }
    };
    OAuth.completeRequest(message, accessor);
    var authHeader = OAuth.getAuthorizationHeader("", message.parameters);
    var update = '{ "data": { "kind":"latitude#location", "latitude": ' + data.latitude + ', "longitude":' + data.longitude + ', "accuracy":' + data.accuracy + ' } }';
    new Ajax.Request(latitude_page(), {
        method: "POST",
        encoding: 'UTF-8',
        requestHeaders: ['Authorization', authHeader, 'Content-type', 'application/json'],
        postBody: update,
        onComplete: function(response)
		{
			if (response.status == 200)
			{
				set_update_cookie();
				if (controller !== undefined) 
				{
					controller.get("status").update(get_update_string());
					show_error(controller);
				} else
				{
					var appController = Mojo.Controller.getAppController();
					appController.closeAllStages();
				}
				notify($L("Position updated."), false);
			} else
			{
				var retry_string = (retry > 0) ? $L("Retrying.") : "";
				if (controller !== undefined)
				{
					show_error(controller, $L("Uploading position failed.")+" "+retry_string);
				}
				notify($L("Position update failed at #{time}.").interpolate({
						time: (Mojo.Format.formatDate(new Date(), {
							time: 'short'
						})) +
						""
					})+" "+retry_string, false);
				if (retry > 0)
				{
					send_to_google(data, controller, --retry)
				} else
				{
					if (controller === undefined) 
					{
						var appController = Mojo.Controller.getAppController();
						appController.closeAllStages();
					}
				}
			}
        }
    });
}

function notify(message, force)
{
	var notify = get_setting("notify");
	if (force)
	{
		notify = 1;
	}
	if (notify == 1) 
	{
		var bannerParams = {
			messageText: message
		};
		(new Mojo.Controller.AppController()).showBanner(bannerParams, {
			banner: message
		});
	}
}

function DashboardStageAssistant(argFromPusher) {
	  this.passedArgument = argFromPusher
 }
    

DashboardStageAssistant.prototype.setup = function() 
{
	this.controller.get('info').update(this.passedArgument.message)
}