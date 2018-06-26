import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";
import { environment as env } from "environments/environment";
import { Properties, Geometry, UniFeature, FeatureCollection } from "./models/uniFeature";
import { TranslateService } from "@ngx-translate/core";


@Injectable()
export class MapService {

  mealSites: any;
  mealSites18: any;
  userGPS: [number, number]= [0, 0];
  env: any = env;
  constructor(private _http : HttpClient, private _router : Router, private translate: TranslateService) {}

  getSites18(): Promise<any> {
    console.log('Getting all the new 2018 sites from new data set....');
    return this._http.get(`https://api.mapbox.com/datasets/v1/vicagbasi/${this.env.ms18_062218}/features?access_token=${this.env.mapToken}`).toPromise();
  }

  switchLanguage(language: string) {
    var lang = (language == 'en') ? "English" : "Spanish";
    console.log(`Changing language to ${lang}!`)
    this.translate.use(language);
  }
}
