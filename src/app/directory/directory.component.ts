import { Component, OnInit, ViewChild } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogboxComponent } from "../dialogbox/dialogbox.component";
import { Http, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';

import { MapService } from './../map.service';
import { UniFeature } from '../models/uniFeature';

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

  displayedColumns2 = ["Name", "Address1", "City", "State", "Zip", "Meals"];

  dataSource = new MatTableDataSource();

  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _http: Http, public dialog: MatDialog, private _mService: MapService ) {
    this._mService.getAllSites2().subscribe(sites => {
      this.dataSource.data = this.dataFormat(sites.json().features);
    })

  } // constructor

    ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    let top = document.getElementById('top');
    if (top != null) {
      top.scrollIntoView();
      top = null;
    }
    }
    ngOnInit(): void {} // ends ngOnInit //

    applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    }

    openDialog(id){
      console.log("TESTING!....");

      const dialogRef = this.dialog.open(DialogboxComponent,{
        height: "75%",
        width: "75%",
        data: this.pickOne(id, this.dataSource.data)
      });
    }

    pickOne(id : string, dSet : any[]) {
      console.log(dSet);
      var res: UniFeature;
      for (let f = 0; f < dSet.length; f++){
        if(dSet[f].id === id){
          console.log("======================================");
          console.log(`f.id = ${dSet[f].id}......id = ${id}`)
          res = dSet[f]
        }
      }
      console.log("this is the result:", res);
    return res;
    }


  dataFormat(data : any[] ){
    let newData: any[] = [];
    for (let x = 0; x < data.length; x++){
      let new_obj = {};
      let data_obj = data[x];
      new_obj['id'] = data_obj['id'];

      new_obj['gps'] = data_obj.geometry.coordinates;

      let keys = Object.keys(data_obj['properties']);
      for (let j = 0; j < keys.length; j++) {
        new_obj[keys[j]] = data_obj['properties'][keys[j]];
      }
      newData.push(new_obj);
    }

    console.log("dataFormatting");
    console.log(data);
    return newData;
  }
}
