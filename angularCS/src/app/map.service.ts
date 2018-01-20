import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs';
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";

@Injectable()
export class MapService {
  datasetToken: String = "cjcjroncb3ioz34mm87c9ldvc"
  mapToken: String = "pk.eyJ1IjoidmljYWdiYXNpIiwiYSI6ImNqY2lpcWE2aTNteGEycWxscDl2NzhpZWQifQ.KJIJ5fZsHtxebZwwROAc5w"
  mealSites: any;
  mealSitesObservable = new BehaviorSubject(this.mealSites);

  constructor(private _http : Http, private _router : Router) { }

  getAllSites(){
    this._http.get(`https://api.mapbox.com/datasets/v1/vicagbasi/cjcjroncb3ioz34mm87c9ldvc/features?access_token=pk.eyJ1IjoidmljYWdiYXNpIiwiYSI6ImNqY2lpcWE2aTNteGEycWxscDl2NzhpZWQifQ.KJIJ5fZsHtxebZwwROAc5w`).subscribe(
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
