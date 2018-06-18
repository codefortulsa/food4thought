import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MapService } from './../map.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor( private translate: TranslateService, private ms: MapService) {}

  ngOnInit() {
  }

}
