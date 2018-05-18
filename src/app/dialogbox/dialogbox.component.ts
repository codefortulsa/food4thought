import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import * as mapboxgl from 'mapbox-gl';
import { environment } from "../../environments/environment";


@Component({
  selector: 'app-dialogbox',
  templateUrl: './dialogbox.component.html',
  styleUrls: ['./dialogbox.component.css']
})
export class DialogboxComponent implements OnInit {
  map: mapboxgl.Map;

  constructor(
    public dialogRef: MatDialogRef<DialogboxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    (mapboxgl as any).accessToken = environment.mapToken;

    this.map = new mapboxgl.Map({
          container: 'siteMap',
          style: './../assets/style.json',
          zoom: 8,
          center: this.data.gps
      });

    this.flyToStore();
    var marker = new mapboxgl.Marker()
      .setLngLat(this.data.gps)
      .addTo(this.map);

    console.log("DATA", this.data);
  }

  flyToStore() {
  console.log(this.map)
  this.map.flyTo({
      center: this.data.gps,
      zoom: 8
    });
  }

}
