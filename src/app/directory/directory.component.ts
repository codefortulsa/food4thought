import { Component, OnInit, ViewChild } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogboxComponent } from "../dialogbox/dialogbox.component";
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { TranslateService } from "@ngx-translate/core";

import { MapService } from './../map.service';
import { UniFeature } from '../models/uniFeature';
import * as turf from "@turf/turf";
import { Units, Coord, Feature } from '@turf/turf';
import { GeoJSONSource, GeoJSONGeometry } from 'mapbox-gl/dist/mapbox-gl';

import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { environment } from "../../environments/environment";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { Properties } from "../models/uniFeature";
@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.css']
})
export class DirectoryComponent implements OnInit {
  e = environment;
  featureSet: UniFeature[] = [];
  displayedColumns2 = ["Name", "Address1", "City", "State", "Zip", "Meals"];
  displayColumns = ["Name"];
  dataSource2 = new MatTableDataSource();
  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _http: HttpClient, public dialog: MatDialog, private _mService: MapService, private translate: TranslateService) {
    this._mService.getSites18().then((sites) => {

      this.dataSource2.data = this.dataFormat(sites.features);

      console.log("DS2:", this.dataSource2.data);
      console.log("UserLocation: ", this._mService.userGPS);
      for(let x = 0; x < this.dataSource2.data.length; x++){
        var res = this.dataSource2.data[x]["MealServed"].trim().split(" ");
        var newArray = [];
        for(var y = 0; y < res.length; y++){
          newArray[y] = (res[y] === 'B') ? this.comTranslate('MAIN.breakfast'):
                        (res[y] === 'L') ? this.comTranslate('MAIN.lunch'):
                        this.comTranslate('MAIN.snacks');
        }
        this.dataSource2.data[x]["MealServed"] = newArray.join(", ");

      } // end for loop
    }) // Observable/Promise
  } // constructor

    ngAfterViewInit() {
    this.dataSource2.paginator = this.paginator;
    this.dataSource2.sort = this.sort;

    }
    ngOnInit(): void {} // ends ngOnInit //


    applyFilter(filterValue: string) {
      filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
      this.dataSource2.filter = filterValue;
    }

    openDialog(id){
      const dialogRef = this.dialog.open(DialogboxComponent,{
        height: "100",
        width: "100%",
        data: this.pickOne(id, this.dataSource2.data)
      });
    }

    pickOne(id : string, dSet : any[]) {
      // console.log(dSet);
      var res: UniFeature;
      for (let f = 0; f < dSet.length; f++){
        if(dSet[f].id === id){
          // console.log("======================================");
          // console.log(`f.id = ${dSet[f].id}......id = ${id}`)
          res = dSet[f]
        }
      }
      // console.log("this is the result:", res);
      return res;
    }

  dataFormat(data : any[] ){
    let newData: any[] = [];
    for (let x = 0; x < data.length; x++){
      let new_obj = {};
      let data_obj = data[x];
      new_obj['id'] = data_obj['id'];
      new_obj['gps'] = data_obj.geometry.coordinates.reverse();
      let keys = Object.keys(data_obj['properties']);

      for (let j = 0; j < keys.length; j++) {
        new_obj[keys[j]] = data_obj['properties'][keys[j]];
      }
      newData.push(new_obj);
    }
    return newData;
  }
  comTranslate(jsonKey: string): string | Object{
    return this.translate.instant(jsonKey);
  }
  nearbySites(){
    console.log("nearby Sites");
    console.log("LOCATION B4 NS_GEOLOC: ", this._mService.userGPS);
    if(navigator.geolocation){
      console.log("CURRENT LOCATION!!!", this._mService.userGPS);
      navigator.geolocation.getCurrentPosition(position => {
        this._mService.userGPS = [position.coords.latitude, position.coords.longitude];

        let units:Units = 'miles';
        var options = { units: units};
        console.log(this.dataSource2.data);
        this.dataSource2.data.forEach((site:any) => {
          Object.defineProperty(site, 'Distance', {
            value: turf.distance(this._mService.userGPS, site.gps, options),
            writable: true,
            enumerable: true,
            configurable: true
          });
          site.Distance = Math.round(site.Distance);
        });
        console.log("After adding distance attribute", this.dataSource2.data);
        this.dataSource2.data.sort((a:any, b:any) => {
          if (a.Distance > b.Distance) {
            return 1;
          }
          if (a.Distance < b.Distance) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
      });
    };


    // this.mealSites.features.sort((a, b) => {
    //   if (a.properties.distance > b.properties.distance) {
    //     return 1;
    //   }
    //   if (a.properties.distance < b.properties.distance) {
    //     return -1;
    //   }
    //   // a must be equal to b
    //   return 0;
    // });

  }
}
