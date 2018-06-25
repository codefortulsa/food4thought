import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs';
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";
import { environment as env } from "environments/environment";

@Injectable()
export class MapService {

  mealSites: any;
  mealSites18: any;
  userGPS: [number, number]= [0, 0];
  env: any = env;
  constructor(private _http : Http, private _router : Router) {}

  getSites18(){
    console.log('Getting all the new 2018 sites from new data set....');
    return this._http.get(`https://api.mapbox.com/datasets/v1/vicagbasi/${this.env.ms18_062218}/features?access_token=${this.env.mapToken}`).toPromise();
  }
}
