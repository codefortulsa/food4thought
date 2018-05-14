import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs';
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";


@Injectable()
export class MapService {
  datasetToken: String = "cjcnxy2y11nq82pmr8qu3zu22"
  mapToken: String = "pk.eyJ1IjoidmljYWdiYXNpIiwiYSI6ImNqY2lpcWE2aTNteGEycWxscDl2NzhpZWQifQ.KJIJ5fZsHtxebZwwROAc5w"
  featureSet: UniFeature[] = [];


  constructor(private _http : Http, private _router : Router) {
    console.log("this is a test..")
  }

  getAllSites(){
    console.log("Getting all the sites.....");
    return this._http.get(`https://api.mapbox.com/datasets/v1/vicagbasi/${this.datasetToken}/features?access_token=${this.mapToken}`).toPromise();
  }
  getAllSites2(){
    console.log("Getting all the sitez.....");
    return this._http.get(`https://api.mapbox.com/datasets/v1/vicagbasi/${this.datasetToken}/features?access_token=${this.mapToken}`);
    }
  }
  export interface UniFeature {
  id: string;
  Name: string;
  Address1: string;
  City: string;
  State: string;
  Zip: string;
  Meals: string;
}
