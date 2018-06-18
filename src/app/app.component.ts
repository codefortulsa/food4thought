import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    // console.log("this is a test..");
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('en');
  }


}
