import { Component, OnInit } from '@angular/core';
import { MapService } from './map.service';
import { NgForm } from "@angular/forms";
import * as mapboxgl from 'mapbox-gl';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import { SITES } from '../assets/temp_sites'
import { UserLocation } from "./userLocation";
import {
    BBox, Feature, FeatureCollection, GeometryCollection, LineString,
    MultiLineString, MultiPoint, MultiPolygon, Point, Polygon, GeometryObject
} from "geojson";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userLoc : UserLocation = new UserLocation();
  mapToken : String;
  script: String;
  mealSites: FeatureCollection<Point | LineString | Polygon | MultiPoint | MultiLineString | MultiPolygon | GeometryCollection> ;
  constructor(private _mapService: MapService) {
    // this.mealSites = this._mapService.mealSites;
    this._mapService.mealSitesObservable.subscribe(
      (sites)=>{
        this.mealSites = sites;
        console.log(this.mealSites);
      }
    )
  }

  ngOnInit(){
    this._mapService.getAllSites();


    (mapboxgl as any).accessToken = this._mapService.mapToken;
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/vicagbasi/cjcjqksly12r62rloz0ps1xmm'

    });
    // This little number loads the data points onto the map :)

    map.on('load', function(e) {
      // Add the data to your map as a layer with embedded fork and knife!
      // **************************************************

      map.addLayer({
        id: 'locations',
        type: 'symbol',
        // Add a GeoJSON source containing place coordinates and information.
        source: {
          type: 'geojson',

          //this is the hard coded data points...
          // this should be 'this.mealSites' if the data came through correctly :/
          data: this.mealSites;
        },
        layout: {
          'icon-image': 'restaurant-15',
          'icon-allow-overlap': true,
        }
      });
      // **************************************************

      // ADDING CUSTOM MARKERS: THIS CHANGING THE FORK AND KNIFE IMAGE TO SOMETHING UNIQUE
      // map.addSource('places', {
      //   type: 'geojson',
      //   data: SITES
      // });
      buildLocationList(SITES);

      // **************************************************

      // MAP FINISHED LOADING
    });


          // THIS FUNCTION BUILDS THE LIST OF ALL ADDRESS ON THE MAP :)

          function buildLocationList(data) {
            // Iterate through the list of stores
            for (let i = 0; i < data.features.length; i++) {
              var currentFeature = data.features[i];
              // Shorten data.feature.properties to just `prop` so we're not
              // writing this long form over and over again.
              var prop = currentFeature.properties;
              // Select the listing container in the HTML and append a div
              // with the class 'item' for each store
              var listings = document.getElementById('listings');
              var listing = listings.appendChild(document.createElement('div'));
              listing.className = 'item';
              listing.id = 'listing-' + i;

              // Create a new link with the class 'title' for each store
              // and fill it with the store address
              var link = listing.appendChild(document.createElement('a'));
              link.href = '#';
              link.className = 'title';
              // link.dataPosition = i;
              link.innerHTML = prop["Name"];

              // Create a new div with the class 'details' for each store
              // and fill it with the city and phone number
              var details = listing.appendChild(document.createElement('div'));
              details.innerHTML = prop["City"];
              if (prop["Phone"]) {
                details.innerHTML += ' &middot; ' + prop["Phone"] + '<hr>';
              }
            }
          }

          // NOW ITS TIME TO ADD SOME INTERACTIVE FEATURE ON OUR LOCATION LIST :)

          function flyToStore(currentFeature) {
            map.flyTo({
              center: currentFeature.geometry.coordinates,
              zoom: 15
            });
          }

          function createPopUp(currentFeature) {
            var popUps = document.getElementsByClassName('mapboxgl-popup');
            // Check if there is already a popup on the map and if so, remove it
            if (popUps[0]) popUps[0].remove();

            var popup = new mapboxgl.Popup({ closeOnClick: false })
              .setLngLat(currentFeature.geometry.coordinates)
              .setHTML('<h3>'+currentFeature.properties['Name']+'</h3>' +
                '<h4>' + currentFeature.properties['Address2'] + '</h4>')
              .addTo(map);
          }

          // Add an event listener for when a user clicks on the map

          // map.on('click', function(e) {
          //   // Query all the rendered points in the view
          //   var features = map.queryRenderedFeatures(e.point, { layers: ['locations'] });
          //   if (features.length) {
          //     var clickedPoint = features[0];
          //     // 1. Fly to the point
          //     flyToStore(clickedPoint);
          //     // 2. Close all other popups and display popup for clicked store
          //     createPopUp(clickedPoint);
          //     // 3. Highlight listing in sidebar (and remove highlight for all other listings)
          //     var activeItem = document.getElementsByClassName('active');
          //     if (activeItem[0]) {
          //       activeItem[0].classList.remove('active');
          //     }
          //     // Find the index of the store.features that corresponds to the clickedPoint that fired the event listener
          //     var selectedFeature = clickedPoint.properties['Site Address1'];
          //
          //     for (var i = 0; i < SITES.features.length; i++) {
          //       if (SITES.features[i].properties['Site Address1'] === selectedFeature) {
          //         selectedFeatureIndex = i;
          //       }
          //     }
          //     // Select the correct list item using the found index and add the active class
          //     var listing = document.getElementById('listing-' + selectedFeatureIndex);
          //     listing.classList.add('active');
          //   }
          // });


          // THIS IS FOR THE MAP IMG OBJECTS

          // SITES.features.forEach(function(marker, i) {
          //   // Create a div element for the marker
          //   var el = document.createElement('div');
          //   // Add a class called 'marker' to each div
          //   el.className = 'marker';
          //   // By default the image for your custom marker will be anchored
          //   // by its center. Adjust the position accordingly
          //   // Create the custom markers, set their position, and add to map
          //   new mapboxgl.Marker(el, { offset: [0, -23] })
          //     .setLngLat(marker.geometry.coordinates)
          //     .addTo(map);
          //
          //   el.addEventListener('click', function(e) {
          //     var activeItem = document.getElementsByClassName('active');
          //     // 1. Fly to the point
          //     flyToStore(marker);
          //     // 2. Close all other popups and display popup for clicked store
          //     createPopUp(marker);
          //     // 3. Highlight listing in sidebar (and remove highlight for all other listings)
          //     e.stopPropagation();
          //     if (activeItem[0]) {
          //       activeItem[0].classList.remove('active');
          //     }
          //     var listing = document.getElementById('listing-' + i);
          //     console.log(listing);
          //     listing.classList.add('active');
          //   });
          // });

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

  }

  findNearBy(){

  }
}
