import { Component, OnInit, ViewChild } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogboxComponent } from "../dialogbox/dialogbox.component";
import { Http, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';

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

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.css']
})
export class DirectoryComponent implements OnInit {
  e = environment;
  featureSet: UniFeature[] = [];
  condensedData: Object[];
  displayedColumns2 = ["Name", "Address1", "City", "State", "Zip", "Meals"];
  displayColumns = ["Name"];
  dataSource = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();
  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _http: Http, public dialog: MatDialog, private _mService: MapService ) {
    this._mService.getSites18().then(sites => {
      this.dataSource2.data = this.dataFormat(sites.json().features);

      // if(this._mService.userGPS[0] + this._mService.userGPS[1] !== 0)
      // {
      //   let units:Units = 'miles';
      //   // let searchResult = <Coord>locate;
      //   var options = { units: units};
      //   console.log("TURF WORK....");
      //   console.log(this.dataSource2.data);
      //   this.dataSource2.data.forEach((site) => {
      //     Object.defineProperty(site, 'distance', {
      //       value: turf.distance(<Coord>this._mService.userGPS, site.gps, options),
      //       writable: true,
      //       enumerable: true,
      //       configurable: true
      //     });
      //   });
      //   console.log("TURF Distance added", this.dataSource2.data);
      //   // DEFAULT SORT BY DISTANCE ONCE DISTANCE IS ADDED CORRECTLY
      //   if(this.dataSource2.data[0].distance !== null)
      //   {
      //     this.dataSource2.data.sort((a, b) => {
      //       if (a.distance > b.distance) {
      //         return 1;
      //       }
      //       if (a.distance < b.distance) {
      //         return -1;
      //       }
      //       // a must be equal to b
      //       return 0;
      //     });
      //   }
      // }

      console.log("DS2:", this.dataSource2.data);
      console.log("UserLocation: ", this._mService.userGPS);
      this.condensedData = this.dataSource2.data;
      for(let x = 0; x < this.dataSource2.data.length; x++){
        var mealString = '';
        if(this.dataSource2.data[x]['MealServed'].length === 1) {
          if(this.dataSource2.data[x]['MealServed'] == 'B'){
            this.dataSource2.data[x]['MealServed'] = 'Breakfast ';
          };
          if(this.dataSource2.data[x]['MealServed'] == 'L'){
            this.dataSource2.data[x]['MealServed'] = 'Lunch ';
          };
          if(this.dataSource2.data[x]['MealServed']=='S'){
            this.dataSource2.data[x]['MealServed'] = 'Snacks ';
          }
        }
        else {
          if(this.dataSource2.data[x]['MealServed'] == 'B L S'){
           this.dataSource2.data[x]['MealServed']= 'Breakfast, Lunch, Snacks';
          }
          else {
            if(this.dataSource2.data[x]['MealServed'] === 'B L'){
              this.dataSource2.data[x]['MealServed'] = 'Breakfast, Lunch';
            }
          }
        }
      }

  }) // Observable/Promise

  } // constructor

    ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
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

  // closeThis() {
  //  document.getElementById('hoverPopUp').classList.add('stayClosed');
  // }
}
