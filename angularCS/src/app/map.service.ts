import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs';
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";
import {
    BBox, Feature, FeatureCollection, GeometryCollection, LineString, GeoJsonProperties
    MultiLineString, MultiPoint, MultiPolygon, Point, Polygon, GeometryObject
} from "geojson";
// import { GenericGeoJSONFeature, GenericGeoJSONFeatureCollection } from '@yaga/generic-geojson';
// import { TestInterface } from './myGeoJson';


@Injectable()
export class MapService {
  datasetToken: String = "cjcnxy2y11nq82pmr8qu3zu22"
  mapToken: String = "pk.eyJ1IjoidmljYWdiYXNpIiwiYSI6ImNqY2lpcWE2aTNteGEycWxscDl2NzhpZWQifQ.KJIJ5fZsHtxebZwwROAc5w"
  mealSites: FeatureCollection<Point | LineString | Polygon | MultiPoint | MultiLineString | MultiPolygon | GeometryCollection> ;
  mealSitesObservable = new BehaviorSubject(this.mealSites);

  constructor(private _http : Http, private _router : Router) { }

  getAllSites(){
    this._http.get(`https://api.mapbox.com/datasets/v1/vicagbasi/${this.datasetToken}/features?access_token=${this.mapToken}`).subscribe(
      (sites)=>{
        this.mealSites = sites.json();
        console.log(this.mealSites);
        this.mealSitesObservable.next(this.mealSites);
      },
      (errors)=>{
        console.log(errors);
      }
    )
  }

}
