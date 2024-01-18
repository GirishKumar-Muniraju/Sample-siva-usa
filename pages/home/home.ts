import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ObrasPage } from '../obras/obras';
import { TestePage } from '../teste/teste';
import { AboutPage } from '../about/about';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  tab1Root = TestePage;
  tab2Root = ObrasPage;

  constructor(public navCtrl: NavController) {
    
  }
  pushPage(){
    // push another page on to the navigation stack
    // causing the nav controller to transition to the new page
    // optional data can also be passed to the pushed page.
    console.log("2");
    this.navCtrl.push(AboutPage);
    
  }




}
