import { Component, OnInit } from '@angular/core';
import { MapService } from './../map.service';
import { NgForm } from "@angular/forms";
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from 'mapbox-gl-geocoder';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
// import { DeviceDetectorService } from 'ngx-device-detector';
import * as turf from "@turf/turf";
import { Units, Coord, Feature } from '@turf/turf';
import { GeoJSONSource, GeoJSONGeometry } from 'mapbox-gl/dist/mapbox-gl';
import { FeatureCollection } from 'geojson';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
    isOpen : Boolean;

    mapToken : String;
    mealSites: any;
    map:mapboxgl.Map;
    mapService: MapService;
    userGPS: [number, number]= [0, 0];

    constructor(private _mapService: MapService, public snackBar: MatSnackBar, private translate: TranslateService) {
    }

    ngOnInit(){
      setTimeout(() => {
        var esNotif = this.snackBar.open("Would you like to view in Spanish?", "Click Here for Espanol!", {
          duration: 7000,
          extraClasses: ["snackBar"]
        });
        esNotif.onAction().subscribe(info => {
          console.log("Changing app to Spanish translation!!!!");
          this._mapService.switchLanguage("es");
        });
      });

      (mapboxgl as any).accessToken = this._mapService.env.mapToken;
      this.map = new mapboxgl.Map({
        container: 'map',
        style: './../assets/style.json',
      });

      // This little number loads the data points onto the map :)
      this.map.on('load', (e)=> {
        this._mapService.getSites18().then((geoData)=>{

        this.mealSites = geoData;

        this.map.addSource('places', {
          type: 'geojson',
          data: this.mealSites
        })

        this.buildLocationList(this.mealSites);

        var geocoder = new MapboxGeocoder({
          accessToken: this._mapService.env.mapToken,
          country: 'us',
          bbox: [-103.000, 33.370, -94.260, 37.000]
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

        // "Find Food" event listener..
        geobtn.addEventListener("click", ()=>{
          this.nearbySites();
          window.setTimeout(this.openSesame(), 1000);
        });

        // search for location in Oklahoma and order sites by proximity
        geocoder.on('result', (ev) => {
          var searchResult = ev.result.geometry;
          let source:mapboxgl.GeoJSONSource = <GeoJSONSource>this.map.getSource('single-point');

          source.setData(searchResult);
          let units:Units = 'miles';
          var options = { units: units};
          console.log("GeoCoder Searching....");

          this.mealSites.features.forEach((site) => {
            Object.defineProperty(site.properties, 'distance', {
              value: turf.distance(searchResult, site.geometry, options),
              writable: true,
              enumerable: true,
              configurable: true
            });
          });
          console.log("Adding Distance Property to all sites...");

          this.mealSites.features.sort((a, b) => {
            if (a.properties.distance > b.properties.distance) {
              return 1;
            }
            if (a.properties.distance < b.properties.distance) {
              return -1;
            }
            // a must be equal to b
            return 0;
          }); // Sort distance by closest descending...

          var listings = document.getElementById('listings');
            while (listings.firstChild) {
              listings.removeChild(listings.firstChild);
            }
          this.buildLocationList(this.mealSites);
        }); // GeoCoder.On


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
              // console.log(listing);
              listing.classList.add('active');
            });
        });

      });
    })
    // end ngOnInit

  }

  openSesame(){
    let dropDown = document.getElementById('listings');
    let dropWrap = document.getElementById('sbDrag');
    let icon = document.getElementById('vertical');

    if(dropDown.classList.contains('isOpen')){
      dropDown.classList.remove('isOpen');
      icon.setAttribute('d','M52.2,70.5a.74.74,0,0,0,.8-.66V54.92h0V45.08h0V30.16a.74.74,0,0,0-.8-.66H47.8a.74.74,0,0,0-.8.66V45.08h0v9.84h0V69.84a.74.74,0,0,0,.8.66Z');
      icon.setAttribute('transform','translate(-29.5 -29.5)');
      return
    }

    dropDown.classList.add('isOpen');
    icon.setAttribute('d','M52.2,52a2.56,2.56,0,0,0,.8-.06V50.48h0v-1h0V48.06a2.56,2.56,0,0,0-.8-.06H47.8a2.56,2.56,0,0,0-.8.06v1.46h0v1h0v1.46a2.56,2.56,0,0,0,.8.06Z');
    icon.setAttribute('transform','translate(-29.5, -29.5)');
  }

  // This is where your interactions with the symbol layer used to be
   // Now you have interactions with DOM markers instead

    flyToStore(currentFeature) {
      console.log(this.map)
      this.map.flyTo({
          center: currentFeature.geometry.coordinates,
          zoom: 12
        });
      }

    createPopUp(currentFeature) {
      var popUps = document.getElementsByClassName('mapboxgl-popup');
      var mealsServed;

      var res = currentFeature.properties.MealServed.trim().split(" ");
      var newArray = [];
      for(var x = 0; x < res.length; x++){
        newArray[x] = (res[x] === 'B') ? this.comTranslate('MAIN.breakfast')+" : "+currentFeature.properties.BreakfastTime :
                      (res[x] === 'L') ? this.comTranslate('MAIN.lunch')+" : "+currentFeature.properties.LunchTime :
                      this.comTranslate('MAIN.snacks')+" : "+currentFeature.properties.SnackTime;
      }
      mealsServed = newArray.join(", ");
      // Check if there is already a popup on the map and if so, remove it
      if (popUps[0]) popUps[0].remove();
      console.log(String(this.userGPS[0]));
      var popup = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(currentFeature.geometry.coordinates)

        .setHTML('<h3>'+currentFeature.properties.Name+'</h3>'+
        '<div class="placeInfo"><h5>' + currentFeature.properties.FullAddress +
          "</h5><p class=siteProp style='margin-bottom: 0rem'>"+this.comTranslate('MAIN.serving')+": "+mealsServed+"</p>"+
          "<p class=siteProp style='margin-bottom: 0rem'>"+this.comTranslate('MAIN.days_open')+": "+currentFeature.properties.DaysOpen+"</p>"+
          "<p class=siteProp style='margin-bottom: 0rem'>"+this.comTranslate('MAIN.contact')+": "+currentFeature.properties.Phone+"</p>"+
          "<a class='directionslink' href='https://www.google.com/maps/dir/?api=1&destination="+currentFeature.properties.FullAddress+"&travelmode=driving' target='_blank'>"+
            this.comTranslate('MAIN.get_directions')+'</a></div>')
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
        var listings : any = document.getElementById('listings');
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

        details.innerHTML = prop.FullAddress;

        details.innerHTML += '<br><span class="meal serving">'+this.comTranslate('MAIN.serving')+' : </span>';

        var res = prop.MealServed.trim().split(" ");
        var newArray = [];
        for(var x = 0; x < res.length; x++){
          newArray[x] = (res[x] === 'B') ? this.comTranslate('MAIN.breakfast'): (res[x] === 'L') ? this.comTranslate('MAIN.lunch') : this.comTranslate('MAIN.snacks');
        }
        var strMeals = newArray.join(", ");
        details.innerHTML += '<span class="meal">'+strMeals+'</span>';

        details.innerHTML += '<br><span class="meal serving">'+this.comTranslate('DIRECTORY.status')+' : </span><span class="meal">'+prop.Status+'</span>';

        if (prop.StartDate) {
          details.innerHTML += '<section class="pnumber"><span class="pbold">'+this.comTranslate('MAIN.start_date')+' : </span>' + prop.StartDate +'</section>';
        }

        if (prop.Phone) {
          details.innerHTML += '<section class="pnumber"><span class="pbold">'+this.comTranslate('MAIN.contact')+' : </span>' + prop.Phone +'</section>';
        }
        if (prop.distance) {
          var roundedDistance = Math.round(prop.distance * 100) / 100;
          details.innerHTML += '<p class="roundedDistance">' + roundedDistance + ' miles away</p>';
        }
        details.innerHTML += "<a class='getDirections' href='https://www.google.com/maps/dir/?api=1&origin="+String(this.userGPS[0])+"+"
        +String(this.userGPS[1])+"&destination="+currentFeature.properties.Address+"&travelmode=driving' target='_blank'>"+
          this.comTranslate('MAIN.get_directions')+'</a>'

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
    comTranslate(jsonKey: string): string | Object{
      return this.translate.instant(jsonKey);
    }
    nearbySites(){
      console.log("nearby Sites");

      let source:mapboxgl.GeoJSONSource = <GeoJSONSource>this.map.getSource('single-point');
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
          console.log(position);
          this._mapService.userGPS = [position.coords.latitude, position.coords.longitude];
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
          console.log("After adding distance attribute", this.mealSites.features);
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
          var listings : any = document.getElementById('listings');
          while (listings.firstChild) {
            listings.removeChild(listings.firstChild);
          }
          this.flyToStore(featureLocation);
          this.buildLocationList(this.mealSites);
        });
      }
    }

    getLocation():Feature<GeoJSONGeometry>{
      console.log(" getLocation() function is working");
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
          // this.location = position.coords;
          this.userGPS = [position.coords.latitude, position.coords.longitude];
          this._mapService.userGPS = [position.coords.latitude, position.coords.longitude];
          console.log("===============MapService Check==========");
          console.log(this._mapService);
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
