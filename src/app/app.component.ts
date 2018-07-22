import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private translate: TranslateService) {
      this.translate.addLangs(['en', 'es']);
      if(document.domain.toLowerCase().includes("meal")){
        this.translate.setDefaultLang('en');
      }
      else{
        this.translate.setDefaultLang("es");
      }
    }
}
