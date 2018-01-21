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
  mealSites: any;
  map: mapboxgl.Map;
  constructor(private _mapService: MapService) {
    // this.mealSites = this._mapService.mealSites;
    this._mapService.mealSitesObservable.subscribe(
      (sites)=>{
        this.mealSites = sites;
        // console.log(this.mealSites);
        if(this.map && this.map.isStyleLoaded() || this.mealSites ) {
         //  this.map.addLayer({
         //    id: 'locations',
         //    type: 'symbol',
         //    // Add a GeoJSON source containing place coordinates and information.
         //    source: {
         //    type: 'geojson',
         //
         //     //this is the hard coded data points...
         //     // this should be 'this.mealSites' if the data came through correctly :/
         //     data: this.mealSites
         //   },
         //   layout: {
         //     'icon-image': 'restaurant-15',
         //     'icon-allow-overlap': true,
         //  }
         // });
         // **************************************************
         // **************************************************

         //ADDING CUSTOM MARKERS: THIS CHANGING THE FORK AND KNIFE IMAGE TO SOMETHING UNIQUE
         while(!this.map){
         continue
       }
         this.map.addSource('places', {
           type: 'geojson',
           data: this.mealSites
         });

      } else { this._mapService.getAllSites(); }
    }
    )
    // this.map.addControl(new mapboxgl.NavigationControl());
    buildLocationList(this.mealSites);

  }

  ngOnInit(){
    (mapboxgl as any).accessToken = this._mapService.mapToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/vicagbasi/cjcjqksly12r62rloz0ps1xmm'

    });


    // Add zoom and rotation controls to the map.

    this.mealSites.features.forEach(function(marker) {
      // Create a div element for the marker
      var el = document.createElement('div');
      // Add a class called 'marker' to each div
      el.className = 'marker';
      // By default the image for your custom marker will be anchored
      // by its center. Adjust the position accordingly
      // Create the custom markers, set their position, and add to map
      new mapboxgl.Marker(el, { offset: [0, -23] })
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);


    });

    el.addEventListener('click', function(e) {
      var activeItem = document.getElementsByClassName('active');
      // 1. Fly to the point
      flyToStore(marker);
      // 2. Close all other popups and display popup for clicked store
      createPopUp(marker);
      // 3. Highlight listing in sidebar (and remove highlight for all other listings)
      e.stopPropagation();
      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }
      var listing = document.getElementById('listing-' + i);
      console.log(listing);
      listing.classList.add('active');
    });
    //ngOnInit finished
  }

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
      link.dataPosition = i;
      link.innerHTML = prop.Address;

      // Create a new div with the class 'details' for each store
      // and fill it with the city and phone number
      var details = listing.appendChild(document.createElement('div'));
      details.innerHTML = prop.City;
      if (prop.Phone) {
        details.innerHTML += ' &middot; ' + prop.Phone;
      }
    }
  }

  function flyToStore(currentFeature) {
    this.map.flyTo({
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
      .setHTML('<h3>'+currentFeature.properties.Name+'</h3>' +
        '<h4>' + currentFeature.properties.Address + '</h4>')
      .addTo(map);
  }



    /// component has ended
  }
