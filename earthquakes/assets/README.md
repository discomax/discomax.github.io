## Visualizing Earthquake Data with Leaflet


![1-Logo](../images/1-Logo.png)

For this project I collectd data from the [USGS GeoJSON Feed](http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) page. The USGS provides earthquake data in a number of different formats, updated every 5 minutes. I chose the 'last 24 hours' timeframe and used the URL for this geoJSON.

I then created a map using Leaflet that plots all of the earthquakes from the data set based on their longitude and latitude.

![4-JSON](../images/4-JSON.png)
*example*

The color and size of each marker shows reflects the magnitude of the earthquake.

Click on a marker for additional information about that individual earthquake.

