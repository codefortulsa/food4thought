

  mapboxgl.accessToken = "pk.eyJ1IjoidmljYWdiYXNpIiwiYSI6ImNqY2lpcWE2aTNteGEycWxscDl2NzhpZWQifQ.KJIJ5fZsHtxebZwwROAc5w";
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/vicagbasi/cjcjqksly12r62rloz0ps1xmm'

  });

  // Add zoom and rotation controls to the map.
  map.addControl(new mapboxgl.NavigationControl());
