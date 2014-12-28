Geotagger
================

This is an interface for geotagging photos which have been posted to social networks

Project status
--------------
This project is in the earliest phase. I am going to start with a mobile-web optimized which will allow you to geotag, authenticate, and browse using [Flickr](http://www.flickr.com) photos. I aim to make this work for other social networks and support the desktop as time goes on. 

Installing
----------------------
You will need postgres running and have a database named `geotagger`. 
`cp envSample .env` (you will need to edit this file and add Flickr/Postgres credentials)
`npm install`

Running
----------------------
`npm start` (development - includes gulp tasks for building sass and raw js)
`foreman start` (production - make sure to change the value for the "environment" line in the .env file from "development" to "production")
