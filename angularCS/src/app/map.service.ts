import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs';
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";
// import {
//     BBox, Feature, FeatureCollection, GeometryCollection, LineString, GeoJsonProperties
//     MultiLineString, MultiPoint, MultiPolygon, Point, Polygon, GeometryObject
// } from "geojson";
// import { GenericGeoJSONFeature, GenericGeoJSONFeatureCollection } from '@yaga/generic-geojson';
// import { TestInterface } from './myGeoJson';


@Injectable()
export class MapService {
  datasetToken: String = "cjcjroncb3ioz34mm87c9ldvc"
  mapToken: String = "pk.eyJ1IjoidmljYWdiYXNpIiwiYSI6ImNqY2lpcWE2aTNteGEycWxscDl2NzhpZWQifQ.KJIJ5fZsHtxebZwwROAc5w"
  mealSites: any;
  mealSitesObservable = new BehaviorSubject(this.mealSites);

  constructor(private _http : Http, private _router : Router) { }

  getAllSites(){
    this._http.get(`https://api.mapbox.com/datasets/v1/vicagbasi/${this.datasetToken}/features?access_token=${this.mapToken}`).subscribe(
      (sites)=>{
        this.mealSites = sites.json();
        // console.log(this.mealSites);
        this.mealSitesObservable.next(this.mealSites);
      },
      (errors)=>{
        console.log(errors);
      }
    )
  }

}
