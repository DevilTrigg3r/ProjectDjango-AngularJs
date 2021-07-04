/**
 * @file Component that holds all the logic for the display of the map with markers
 * @author Gerard Garcia
 * @version 1.0
 * @date 21/05/2021
*/
import { Component, DoCheck, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import * as EP from 'leaflet-easyprint';
import html2canvas from "html2canvas";

/* Incompatibility with Webpack
  https://github.com/Leaflet/Leaflet/issues/4968
  Aternative solutions:
    - Copy images to Angular assets folder
    - Map node_modules/leaflet/dist/images/ to assets
*/
import "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/images/layers.png";
import "../../../assets/SliderControl.js";

// Models
import { Marker } from '../../models/marker';
import { Specie } from '../../models/specie';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit, OnChanges, DoCheck {

  // Variables with values setted by other components
  @Input() markersList: Marker[];
  @Input() species: Specie[];

  // Finish flag to prevent multiple plots
  private finishFlag: boolean = false;

  // Leaflet map variable
  private map;

  // Map time slider variable
  sliderControl;

  constructor() { }

  /**
  * ngOnInit interface method
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof MapViewComponent
  */
  ngOnInit(): void {
    this.initMap();
  }

  /**
  * Sets the map basic config as style or origin coordinates
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof MapViewComponent
  */
  initMap() {
    this.map = L.map('map').setView([51.966, 7.6], 10);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 
    {attribution: 'Source: Esri, i-cubed, USDA, USGS, AEX,GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',ext:'jpg',
    }).
    addTo(this.map);
  }

  /**
  * Function triggered when a change is detected in input variables.Checks if the variables were updated, then updates her value.
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {SimpleChanges} changes
  * @memberof MapViewComponent
  */
  ngOnChanges(changes: SimpleChanges) {
    if (typeof changes.species !== 'undefined') {
      this.species = changes.species.currentValue;
    }

  }

  /**
  * Function triggered in every single change produced in variables
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {Marker[]} markerArray
  * @memberof MapViewComponent
  */
  ngDoCheck() {
    if(this.species.length != 0) {
      let checker = arr => arr.every(v => v.finished == true);

      if(checker(this.species) && !this.finishFlag) {
        this.finishFlag = true;

        this.initGeojsonWorker();
        
      }
    }
  }

  /**
  * Verify if the client browser supports WebWorkers. If it does, generates the geojson in the WebWorker, if not, generates the geojson in the main thread as fallback
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @memberof MapViewComponent
  */
  initGeojsonWorker() {
    if(typeof Worker !== "undefined") {
      const geoJsonWorker = new Worker("../../workers/geojson.worker", {type: "module", name: "geojson-worker"});
      geoJsonWorker.onmessage = data => {
        this.addMarkers(data.data);
      }
      geoJsonWorker.postMessage(this.markersList);
    } else {
      this.generateGeoJson(this.markersList);
    }
  }

  /**
  * Generates the geojson from marker array
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {Marker[]} markerArray
  * @memberof MapViewComponent
  */
  generateGeoJson(markerArray: Marker[]) {
    let geoJson = {"type":"FeatureCollection", "features": []}
    for (let index = 0; index < markerArray.length; index++) {
      geoJson.features.push({
		"type": "Feature",
		"properties": {
			"time": `${markerArray[index].date}`,
			"popupContent": "This is a B-Cycle Station. Come pick up a bike and pay by the hour. What a deal!"
		},
		"geometry": {
			"type": "Point",
			"coordinates": [markerArray[index].longitude, markerArray[index].latitude, 1]
		}
	})
    }

    this.addMarkers(geoJson);
  }

  /**
  * Sets the data to markers
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {json} geoJson
  * @memberof MapViewComponent
  */
  addMarkers(geoJson) {
    let myRenderer = L.canvas({ padding: 0.5 })
    for (var i = 0; i < this.markersList.length; i += 1) { // 100k points
      L.circleMarker([this.markersList[i].latitude, this.markersList[i].longitude], {
        renderer: myRenderer
      }).addTo(this.map).bindPopup('marker marker marker marker marker marker marker marker marker' + i);
    }

    var testlayer = L.geoJson(geoJson, {

      style: function (feature) {
        return feature.properties && feature.properties.style;
      },
      
      onEachFeature: this.onEachFeature,
      
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 8,
          fillColor: "rgba(255, 255, 255, 0)",
          color: "rgba(255, 0, 0, 1)",
          weight: 2,
          opacity: 0.5,
          fillOpacity: 0.8
        });
      }
      });

    this.outputMap(myRenderer, testlayer)
  }

  /**
  * Plots the markers to views
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {leaflet.L.canvas} myRenderer
  * @param {leaflet.L.geojson} layer
  * @memberof MapViewComponent
  */
  outputMap(myRenderer, testlayer) {
    console.log("aaa")
    
    EP.easyPrint = L.easyPrint({
      title: 'My awesome print button',
      position: 'bottomleft',
      sizeModes: ['A4Portrait', 'A4Landscape']
    }).addTo(this.map);
    console.log("aaa")
    this.sliderControl = L.control.sliderControl({
      position: "topright",
      layer: testlayer,
      range: true
      });
      //Make sure to add the slider to the map ;-)
      this.map.addControl(this.sliderControl);
      //An initialize the slider
      this.sliderControl.startSlider();
  
      let baseMaps = {
      }

      let overlayMaps = {
        "All time": myRenderer,
        "Time slider": testlayer
      }

      L.control.layers(baseMaps, overlayMaps).addTo(this.map);

      console.log("bbb")
      this.map = L.layerGroup([testlayer, myRenderer])
      L.control.layers(baseMaps, overlayMaps).addTo(this.map);
  }


  /**
  * Sets the data to geojson markers and adds it to layer
  * @author Gerard Garcia
  * @version 1.0
  * @date 21/05/2021
  * @param {json} feature
  * @param {leaflet.L} layer
  * @memberof MapViewComponent
  */
  onEachFeature(feature, layer) {
		var popupContent = "<p>I started out as a GeoJSON " +
				feature.geometry.type + ", but now I'm a Leaflet vector!</p>";

		if (feature.properties && feature.properties.popupContent) {
			popupContent += feature.properties.popupContent;
		}

		layer.bindPopup(popupContent);

	}

  test() {
    let mapCanvas = document.getElementById("map-frame");

    html2canvas(mapCanvas).then(canvas => {
      let link = document.createElement('a');
      link.download = 'download.png';
      link.href = canvas.toDataURL()
      link.click();
    })
  }
}