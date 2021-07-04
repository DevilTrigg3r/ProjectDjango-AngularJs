/**
 * @file Worker in charge to generato a geojson
 * @author Gerard Garcia
 * @version 1.0
 * @date 21/05/2021
*/
/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  let geoJson = {"type":"FeatureCollection", "features": []}
  for (let index = 0; index < data.length; index++) {
    geoJson.features.push({
  "type": "Feature",
  "properties": {
    "time": `${data[index].date}`,
    "popupContent": "This is a B-Cycle Station. Come pick up a bike and pay by the hour. What a deal!"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [data[index].longitude, data[index].latitude, 1]
    }
  })
    }
  postMessage(geoJson);
});
