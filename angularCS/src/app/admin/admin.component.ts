import { Component, OnInit } from '@angular/core';
import { MapService } from './../map.service';
import { GenericGeoJSONFeature, GenericGeoJSONFeatureCollection } from '@yaga/generic-geojson';
import { MatTableDataSource } from '@angular/material';
import { Element } from './tableheader';
import { DataTableResource } from 'angular-2-data-table';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  displayedColumns = ['Name', 'Address', 'City', 'State', 'Zip', 'Meals'];
  dataSource = new MatTableDataSource();
  mealSites: GenericGeoJSONFeatureCollection<any, any>;
  editSite: GenericGeoJSONFeature<any, any>;
  features: GenericGeoJSONFeature<any, any>[] = [];
  fmtData: any[] = [];
  siteResource: any;
  sites = [];
  siteCount = 0;


  constructor(private _mapService: MapService) { }

  ngOnInit() {


    this._mapService.getAllSites().then((geoData)=>{

      this.mealSites = geoData.json();

      this.features = this.mealSites.features;
      console.log("FEATURES...........")
      console.log(this);
      console.log("this is in the map service", this.features);
      this.fmtData = this.dataFormat(geoData.json().features);
      this.siteResource = new DataTableResource(this.fmtData);
      this.siteResource.count().then(count => this.siteCount = count);
      console.log("SiteCount: ", this.siteCount);
      console.log("This is fmtData: ", this.fmtData);

    })

  } //closes ngOnIt
  dataFormat(data : GenericGeoJSONFeature<any, any>[] ){
    let newData: any[] = [];
    for (let x = 0; x < data.length; x++){
      let new_obj = {};
      let data_obj = data[x];
      new_obj['id' ] = data_obj['id'];

      let keys = Object.keys(data_obj['properties']);
      for (let j = 0; j < keys.length; j++) {
        new_obj[keys[j]] = data_obj['properties'][keys[j]];
      }
      newData.push(new_obj);
    }
    console.log("This is newData: ", newData);
    return newData;
  }

  reloadItems(params) {
      this.siteResource.query(params).then(sites => this.sites = sites);
  }
  //
  // // special properties:
  //
  rowClick(rowEvent) {
      console.log('Clicked: ' + rowEvent.row.site.name);
  }
  //
  rowDoubleClick(rowEvent) {
      alert('Double clicked: ' + rowEvent.row.site.name);
  }
  //
  // // rowTooltip(site) { return site.Zip; }
}
