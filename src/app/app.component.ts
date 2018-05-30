import { Component, OnInit } from '@angular/core';
import { MapService } from './map.service';
import { NgForm } from "@angular/forms";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private _mapService: MapService) {}
}
