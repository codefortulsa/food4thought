import { Component, OnInit } from '@angular/core';
import { MapService } from './map.service';
import { NgForm } from "@angular/forms";
import * as mapboxgl from 'mapbox-gl';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import { SITES } from '../assets/temp_sites'
import { UserLocation } from "./userLocation";


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
  map:mapboxgl.Map;
  mapService: MapService


  constructor(private _mapService: MapService) {
    // this.mealSites = this._mapService.mealSites;
  }

  ngOnInit(){


    (mapboxgl as any).accessToken = this._mapService.mapToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/vicagbasi/cjcjqksly12r62rloz0ps1xmm'

    });
    // This little number loads the data points onto the map :)
    console.log(this._mapService)
    this.map.on('load', (e)=> {
      this._mapService.getAllSites().then((geoData)=>{

      // Add the data to your map as a layer with embedded fork and knife!
      // **************************************************
      this.mealSites = geoData.json();
      this.map.addLayer({
        id: 'locations',
        type: 'symbol',
        // Add a GeoJSON source containing place coordinates and information.
        source: {
          type: 'geojson',
          data: this.mealSites
        },
        layout: {
          'icon-image': 'restaurant-15',
          'icon-allow-overlap': true,
        }
      });
      buildLocationList(this.mealSites);
      // Add zoom and rotation controls to the map.
      this.map.addControl(new mapboxgl.NavigationControl());
    });
  })
    // Add an event listener for the links in the sidebar listing
    this.map.on('click', function(e) {
      var features = map.queryRenderedFeatures(e.point, {
        layers: ['locations']
      });

      if (features.length) {
        var clickedPoint = features[0];


        // 2. Close all other popups and display popup for clicked store
        createPopUp(clickedPoint);

        // 1. Fly to the point
        flyToStore(clickedPoint);

        // 3. Highlight listing in sidebar (and remove highlight for all other listings)
       var activeItem = document.getElementsByClassName('active');
        if (activeItem[0]) {
          activeItem[0].classList.remove('active');
        }

        var selectedFeature = clickedPoint.properties.Address;

        for (var i = 0; i < stores.features.length; i++ ) {
          if (stores.features[i].properties.Address === selectedFeature) {
              selectedFeatureIndex = i;
          }
        }

        var listing = document.getElementById('listing-' + selectedFeatureIndex);
        listing.classList.add('active');

      }
    });

  // end ngOnInit

},

  function flyToStore(currentFeature) {
  console.log(this.map)
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
      .addTo(this.map);
  }

  function buildLocationList(data) {
    for (var i = 0; i < data.features.length; i++) {
      // Create an array of all the stores and their properties
      var currentFeature = data.features[i];
      // Shorten data.feature.properties to just `prop` so we're not
      // writing this long form over and over again.
      var prop = currentFeature.properties;
      // Select the listing container in the HTML
      var listings = document.getElementById('listings');
      // Append a div with the class 'item' for each store
      var listing = listings.appendChild(document.createElement('div'));
      listing.className = 'item';
      listing.id = "listing-" + i;

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


      link.addEventListener('click', function(e) {
        // Update the currentFeature to the store associated with the clicked link
        var clickedListing = data.features[this.dataPosition];

        // 1. Fly to the point associated with the clicked link
        flyToStore(clickedListing);

        // 2. Close all other popups and display popup for clicked store
        createPopUp(clickedListing);

        // 3. Highlight listing in sidebar (and remove highlight for all other listings)
        var activeItem = document.getElementsByClassName('active');

        if (activeItem[0]) {
          activeItem[0].classList.remove('active');
        }
        this.parentNode.classList.add('active');

      });
    }
  }



}
