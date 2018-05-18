import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor() { }


    ngOnInit() {
      
      

      window.addEventListener("scroll", function(e){
        let clientHeight = document.documentElement.clientHeight;
        if(document.getElementById('first')){
          let  landingOverlay = document.getElementById('first').scrollHeight;
          let  scrollSnap = landingOverlay -200; 
          let yOffSet = window.pageYOffset;
          if(yOffSet > clientHeight-200){
            document.getElementById('appNavBar').classList.remove('landing');
          }
          if (document.getElementById('first') === null){
            return;
          }else {
          

          if(yOffSet > scrollSnap){
          window.scrollTo(0,landingOverlay);
      
          
        

          
        }
      }
      }
      else{
       
          document.getElementById('appNavBar').classList.add('landing');
        
      }
  })


    // })


}

}




