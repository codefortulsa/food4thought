import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs';
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";
import { environment as env } from "environments/environment";

@Injectable()
export class MapService {
  // datasetToken: String = "cjcnxy2y11nq82pmr8qu3zu22";
  // mapToken: String = "pk.eyJ1IjoidmljYWdiYXNpIiwiYSI6ImNqY2lpcWE2aTNteGEycWxscDl2NzhpZWQifQ.KJIJ5fZsHtxebZwwROAc5w";
  // featureSet: UniFeature[] = [];
  mealSites: any;
  mealSites18: any;
  userGPS: [number, number]= [0, 0];
  env: any = env;
  constructor(private _http : Http, private _router : Router) {
    console.log("this is a test..")

  }

  getAllSites(){
    console.log("Getting all the sites.....");
    return this._http.get(`https://api.mapbox.com/datasets/v1/vicagbasi/${this.env.datasetToken}/features?access_token=${this.env.mapToken}`).toPromise();
  }

  getSites18(){
    console.log('Getting all the new 2018 sites from new data set....');
    return this._http.get(`https://api.mapbox.com/datasets/v1/vicagbasi/${this.env.ms18}/features?access_token=${this.env.mapToken}`).toPromise();
  }
  

  }
