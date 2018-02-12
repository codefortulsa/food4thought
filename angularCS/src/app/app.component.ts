import { Component, OnInit } from '@angular/core';
import { MapService } from './map.service';
import { NgForm } from "@angular/forms";
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from 'mapbox-gl-geocoder';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
// import { SITES } from '../assets/temp_sites'
import { UserLocation } from "./userLocation";
import * as turf from "@turf/turf";
import { Units, Coord, Feature } from '@turf/turf';
import { GeoJSONSource, GeoJSONGeometry } from 'mapbox-gl/dist/mapbox-gl';
import { FeatureCollection } from 'geojson';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userLoc : UserLocation = new UserLocation();
  mapToken : String;
  mealSites: any;
  map:mapboxgl.Map;
  mapService: MapService;
  userGPS: [number, number]= [0, 0];
  // geocoder: MapboxGeocoder;

  constructor(private _mapService: MapService) {
    // this.mealSites = this._mapService.mealSites;

  }

  ngOnInit(){
    // if(navigator.geolocation){
    //   navigator.geolocation.getCurrentPosition(position => {
    //     // this.location = position.coords;
    //     this.userGPS = [position.coords.latitude, position.coords.longitude];
    //   })
    // }

    (mapboxgl as any).accessToken = this._mapService.mapToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      // style: 'mapbox://styles/vicagbasi/cjcjqksly12r62rloz0ps1xmm'
      style: './assets/style.json'

    });
    // This little number loads the data points onto the map :)
    console.log(this._mapService)
    this.map.on('load', (e)=> {
      this._mapService.getAllSites().then((geoData)=>{

      this.mealSites = geoData.json();

      this.map.addSource('places', {
        type: 'geojson',
        data: this.mealSites
      })

      this.buildLocationList(this.mealSites);
      // directions module.......need to finish
      // map.addControl(new MapboxDirections({
      //     accessToken: this._mapService.mapToken
      // }), 'top-left');
      // add geocoder controls

      var geocoder = new MapboxGeocoder({
        accessToken: this._mapService.mapToken,
        // bbox: [[33.932536, -103.007813], [37.097360, -94.438477]]
      });

      this.map.addControl(geocoder, 'top-right');

      // Add zoom and rotation controls to the map.
      this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

      this.map.addSource('single-point', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [] // Notice that initially there are no features
        }
      });
      this.map.addLayer({
        id: 'point',
        source: 'single-point',
        type: 'circle',
        paint: {
          'circle-radius': 10,
          'circle-color': '#007cbf',
          'circle-stroke-width': 3,
          'circle-stroke-color': '#fff'
        }
      });
      var geobtn = document.getElementById("myGeo")
      geobtn.addEventListener("click", ()=>{this.nearbySites()});
      geocoder.on('result', (ev) => {
        var searchResult = ev.result.geometry;
        let source:mapboxgl.GeoJSONSource = <GeoJSONSource>this.map.getSource('single-point');

        source.setData(searchResult);
        let units:Units = 'miles';
        var options = { units: units};
        console.log(this.mealSites.features);
        this.mealSites.features.forEach((site) => {
          Object.defineProperty(site.properties, 'distance', {
            value: turf.distance(searchResult, site.geometry, options),
            writable: true,
            enumerable: true,
            configurable: true
          });
        });
        console.log(this.mealSites.features);
        this.mealSites.features.sort((a, b) => {
          if (a.properties.distance > b.properties.distance) {
            return 1;
          }
          if (a.properties.distance < b.properties.distance) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
        var listings = document.getElementById('listings');
          while (listings.firstChild) {
            listings.removeChild(listings.firstChild);
          }
        this.buildLocationList(this.mealSites);
      });

      console.log(this.mealSites);
      this.mealSites.features.forEach((marker, i) => {
        // Create a div element for the marker
        var el = document.createElement('div');
        // Add a class called 'marker' to each div
        el.id = "marker-"+i;
        el.className = 'marker';
        // By default the image for your custom marker will be anchored
        // by its center. Adjust the position accordingly
        // Create the custom markers, set their position, and add to map
        new mapboxgl.Marker(el, { offset: [0, -23] })
          .setLngLat(marker.geometry.coordinates)
          .addTo(this.map);

          el.addEventListener('click', (e) => {
            // 1. Fly to the point
            this.flyToStore(marker);
            // 2. Close all other popups and display popup for clicked store
            this.createPopUp(marker);
            // 3. Highlight listing in sidebar (and remove highlight for all other listings)
            var activeItem = document.getElementsByClassName('active');
            e.stopPropagation();
            if (activeItem[0]) {
              activeItem[0].classList.remove('active');
            }
            var listing = document.getElementById('listing-' + i);
            console.log(listing);
            listing.classList.add('active');
          });
      });

    });
  })





  // end ngOnInit

}
// This is where your interactions with the symbol layer used to be
 // Now you have interactions with DOM markers instead

  flyToStore(currentFeature) {
  console.log(this.map)
  this.map.flyTo({
      center: currentFeature.geometry.coordinates,
      zoom: 15
    });
  }

  createPopUp(currentFeature) {
    var popUps = document.getElementsByClassName('mapboxgl-popup');
    var mealsServed = '';
    for(var mealType = 0; mealType <= currentFeature.properties.Meals.length; mealType++){
      if(currentFeature.properties.Meals[mealType] === 'B'){
        mealsServed += 'Breakfast';
      }
      if(currentFeature.properties.Meals[mealType]==='L'){
        if(currentFeature.properties.Meals.length > 1) {
        mealsServed += ', Lunch';
      }
       else{
        mealsServed += 'Lunch'
      }
    }
    if(currentFeature.properties.Meals[mealType]==='S'){
      if(currentFeature.properties.Meals.length > 1) {
        mealsServed += ', Snacks';
      }
      else {
        mealsServed += 'Snacks';
      }
    }
  }
    // Check if there is already a popup on the map and if so, remove it
    if (popUps[0]) popUps[0].remove();
    console.log(String(this.userGPS[0]));
    var popup = new mapboxgl.Popup({ closeOnClick: false })

      .setLngLat(currentFeature.geometry.coordinates)

      .setHTML('<h3>'+currentFeature.properties.Name+'</h3>'+
      '<div class="placeInfo"><h5>' + currentFeature.properties.Address +
        "</h5><p>Serving: "+mealsServed+"</p>"+
        "<a class='directionslink' href='https://www.google.com/maps/dir/?api=1&origin="+String(this.userGPS[0])+"+"
        +String(this.userGPS[1])+"&destination="+currentFeature.properties.Address+"&travelmode=driving' target='_blank'>"+
          'Get Directions'+'</a></div>')
      //
      .addTo(this.map);

  };

  buildLocationList(data) {
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
      link.href = '#map';
      link.className = 'title';
      link.setAttribute("dataPosition", i.toString());
      // link.dataPosition = i;
      link.innerHTML = prop.Name;

      // ~*~*~*~*~*~*~* information about which meals are served per location...

      var details = listing.appendChild(document.createElement('div'));

      details.innerHTML = prop.Address;

      details.innerHTML += '<br><span class="meal serving">Serving : </span>'

      if(prop.Meals.length > 0){
        var mealType = [];
        for(let mt = 0; mt <= prop.Meals.length; mt++){
          if(prop.Meals[mt] === 'B') {
            details.innerHTML += '<span class="meal">Breakfast</span>';

          } if(prop.Meals[mt]==='L'){
            if(prop.Meals.length === 1){
            details.innerHTML += '<span class="meal">Lunch</span>';
            } else {
              details.innerHTML += '<span class="meal">, Lunch</span>'
            }
          }
          if(prop.Meals[mt] === 'S'){
            if(prop.Meals.length > 1) {
              details.innerHTML += '<span class="meal">, Snacks</span>'
            } else {
              details.innerHTML += '<span class="meal">Snacks</span>'
            }
          }
        }
        // this closes the section tag opened before the prop.Meals.length if statement...

      }
      if (prop.Phone) {
        details.innerHTML += '<section class="pnumber"><span class="pbold">Call : </span>' + prop.Phone +'</section>';
      }
      if (prop.distance) {
        var roundedDistance = Math.round(prop.distance * 100) / 100;
        details.innerHTML += '<p class="roundedDistance">' + roundedDistance + ' miles away</p>';
      }
      details.innerHTML += "<a class='getDirections' href='https://www.google.com/maps/dir/?api=1&origin="+String(this.userGPS[0])+"+"
      +String(this.userGPS[1])+"&destination="+currentFeature.properties.Address+"&travelmode=driving' target='_blank'>"+
        'Get Directions</a>'

      link.addEventListener('click', (e) => {
        // Update the currentFeature to the store associated with the clicked link
        console.log((<Element>e.target).getAttribute("dataPosition"));

        var clickedListing = data.features[Number.parseInt((<Element>e.target).getAttribute("dataPosition"))];

        // 1. Fly to the point associated with the clicked link
        this.flyToStore(clickedListing);

        // 2. Close all other popups and display popup for clicked store
        this.createPopUp(clickedListing);

        // 3. Highlight listing in sidebar (and remove highlight for all other listings)
        var activeItem = document.getElementsByClassName('active');

        if (activeItem[0]) {
          activeItem[0].classList.remove('active');
        }
        (<Element>e.target).parentElement.classList.add('active');

      });

    }
  }

  nearbySites(){
    console.log("getting here");
    console.log(this);
    console.log(this.map);
    let source:mapboxgl.GeoJSONSource = <GeoJSONSource>this.map.getSource('single-point');
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(position => {
        console.log(position.coords);
        // this.location = position.coords;
        let featureLocation:Feature<GeoJSONGeometry> = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [position.coords.longitude, position.coords.latitude]
          },
          properties: {
            timestamp: position.timestamp,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: null,
            heading: null,
            speed: null
          }
        }

        console.log(featureLocation)
        source.setData(featureLocation);
        let units:Units = 'miles';
        // let searchResult = <Coord>locate;
        var options = { units: units};
        console.log(this.mealSites.features);
        this.mealSites.features.forEach((site) => {
          Object.defineProperty(site.properties, 'distance', {
            value: turf.distance(<Coord>featureLocation, site.geometry, options),
            writable: true,
            enumerable: true,
            configurable: true
          });
        });
        console.log(this.mealSites.features);
        this.mealSites.features.sort((a, b) => {
          if (a.properties.distance > b.properties.distance) {
            return 1;
          }
          if (a.properties.distance < b.properties.distance) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
        var listings = document.getElementById('listings');
        while (listings.firstChild) {
          listings.removeChild(listings.firstChild);
        }
        this.flyToStore(featureLocation);
        this.buildLocationList(this.mealSites);
      });
    }
  }

  getLocation():Feature<GeoJSONGeometry>{
    console.log("location function is working");
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(position => {
        // this.location = position.coords;
        this.userGPS = [position.coords.latitude, position.coords.longitude];
        console.log(this.userGPS);
        let featureLocation:Feature = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [position.coords.latitude, position.coords.longitude]
          },
          properties: {
            timestamp: position.timestamp,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: null,
            heading: null,
            speed: null
          }
        }
        console.log(position);
        console.log(position.coords);
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
        return featureLocation;
      });
      return undefined;
   }
  }


}
