import { Component, OnInit } from '@angular/core';
import { MapService } from './../map.service';
import { GenericGeoJSONFeature, GenericGeoJSONFeatureCollection } from '@yaga/generic-geojson';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  mealSites: GenericGeoJSONFeatureCollection;
  editSite: GenericGeoJSONFeature;
  features: GenericGeoJSONFeature[] = [];


  constructor(private _mapService: MapService) { }

  ngOnInit() {
    this._mapService.getAllSites().then((geoData)=>{
      this.mealSites = geoData.json();
      console.log("ADMIN: ngOnInit........")
      console.log("UNO:.....");
      console.log(this.mealSites);
      this.features = this.mealSites.features;
      console.log("FEATURES...........")
      console.log(this.features);
    })
    $(document).ready(function() {
      $('#sites').DataTable();
    });
  }

}
