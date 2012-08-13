WebOS-LatitudeUpdater
=====================

Google Latitude Updater for WebOS


Clone of Original work by - Christoph Laesche - webos.laesche.net
Starting withg code from version 0.7.0

Google have made some changes to there URL's and API'
This is an attempt to update the app to make it work again



==========================================================================
From the original site:
==========================================================================
Description

Screenshot version 0.7.0 Google Latitude is a nice way to track the location of your friends.

Unfortunately, it is currently not officially supported with webOS. But it can be enabled by calling a special URL. But to update your position Google Maps has to be running.

This application makes it possible to start Google Latitude and to update your location on you Pre or Pixi without having Google Maps running. You can start a background process which updates your location in a configurable interval. It will automatically detect your position and update it in Google Latitude in the configured interval.
License

The application is free and open source. It is licensed using the two clause BSD license.
Download

The application is not available through the official Palm App Catalog but via Preware and Precentral. It is recommended that you install the app via Preware. Alternatively you can download it from the homebrew app gallery or by clicking here.
Notes

When authorizing the application you will be redirected to a Google website. There you will be asked to authorize webos.laesche.net to read and update your location. This is because anonymous users do not work with Google Latitude. All authentication tokens and other authentication information will be stored on the device only. The site webos.laesche.net will not be involved in the authorization process.
Known problems

    Authorization sometimes fails.

Future improvements

    Add Mode Switcher support
    Add translations for more languages

Translators wanted

Contact me if you are interested in translating the app into your native language. You don't need to have any programming skills to do a translation.
Changelog

    0.2.0:
        Inital version
    0.2.2:
        Selected interval is now saved
    0.4.0:
        Settings dialog for configuring location parameters
        Notification when position updated in background
    0.4.2:
        Added German translation
    0.5.0:
        Code cleanup
        Added a button to launch Latitude in Maps
        More preferences available
        Moved interval selection to preferences
    0.5.1:
        Fixed bug with loading config of old version
    0.6.0
        App now has a dashboard stage to prevent being killed when update takes more than 10 seconds
        New option that allows the device to wake up when updating
    0.7.0
        Fixed a bug that causes the dashboard stage not to disappear
        Fixed a bug causing the whole app to disappear
        Added a manual link (work in progress)
        Position is not any more updated on app start; a button to update the position manually has been added.
        Status of background service is now guessed
        App now display the time (and date) of last successful position update
        App displays a status while updating position
        Preparation for Mode Switcher support
        Beautification of update dashboard

