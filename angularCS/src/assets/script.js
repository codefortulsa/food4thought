

  mapboxgl.accessToken = "pk.eyJ1IjoidmljYWdiYXNpIiwiYSI6ImNqY2lpcWE2aTNteGEycWxscDl2NzhpZWQifQ.KJIJ5fZsHtxebZwwROAc5w";
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/vicagbasi/cjcjqksly12r62rloz0ps1xmm'

  });

  // Add zoom and rotation controls to the map.
  map.addControl(new mapboxgl.NavigationControl());

  // 
  // document.getElementById.("myGeo").addEventListener("click", nearbySites());
  //
  // nearbySites(){
  //   let source:mapboxgl.GeoJSONSource = <GeoJSONSource>this.map.getSource('single-point');
  //   var locate = getLocation()
  //   source.setData(locate);
  //   let units:Units = 'miles';
  //   var options = { units: units};
  //   console.log(this.mealSites.features);
  //   this.mealSites.features.forEach((site) => {
  //     Object.defineProperty(site.properties, 'distance', {
  //       value: turf.distance(searchResult, site.geometry, options),
  //       writable: true,
  //       enumerable: true,
  //       configurable: true
  //     });
  //   });
  //   console.log(this.mealSites.features);
  //   this.mealSites.features.sort((a, b) => {
  //     if (a.properties.distance > b.properties.distance) {
  //       return 1;
  //     }
  //     if (a.properties.distance < b.properties.distance) {
  //       return -1;
  //     }
  //     // a must be equal to b
  //     return 0;
  //   });
  //   var listings = document.getElementById('listings');
  //     while (listings.firstChild) {
  //       listings.removeChild(listings.firstChild);
  //     }
  //   this.buildLocationList(this.mealSites);
  // });
  //
  //
  //
  // }
