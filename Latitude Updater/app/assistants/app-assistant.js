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
function AppAssistant(appController)
{
}

AppAssistant.prototype.setup = function()
{
}

AppAssistant.prototype.handleLaunch = function(params)
{
    if (!params) 
    { // App started manually
        var stageProxy = this.controller.getStageProxy('first');
        var stageController = this.controller.getStageController('first');
        if (stageProxy) 
        {
            if (stageController) 
            {
                stageController.window.focus();
            }
        } else 
        {
            var pushConfig = function(stageController)
            {
                stageController.pushScene('first');
            };
            this.controller.createStageWithCallback("first", pushConfig, "card");
        }
        return;
    }
	if (params.source !== undefined && params.source == 'ms') // Call from Mode Switcher
	{
		if (params.enable == true)
		{
			start_background_service();
		} else
		{
			stop_background_service();
		}
		var appController = Mojo.Controller.getAppController();
		appController.closeAllStages();
		return;
	}
    restart_background_service();
    var alarmStage = this.controller.getStageProxy("first");
    var stageController = this.controller.getStageController("first");
    if (alarmStage) 
    {
        if (stageController)
		
		{
			var scene = (stageController.getScenes())[0];
			if (stageController.topScene() !== scene) 
			{
				stageController.popScenesTo(scene);
			}
			if (app_is_authorized()) 
        	{
	            update_location(scene);
        	}
        }
    } else 
    {
        if (app_is_authorized()) 
        {
            update_location();
        }
    }
}