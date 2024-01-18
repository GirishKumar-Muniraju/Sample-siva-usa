import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ContactPage } from '../contact/contact';


@Component({
  selector: 'page-teste',
  templateUrl: 'teste.html'
})
export class TestePage {

  constructor(public navCtrl: NavController) {}
  pushPage(){
    // push another page on to the navigation stack
    // causing the nav controller to transition to the new page
    // optional data can also be passed to the pushed page.
    console.log("2");
    this.navCtrl.push(ContactPage);
    
  }
}
