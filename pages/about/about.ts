import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ObrasPage } from '../obras/obras';
import { TestePage } from '../teste/teste';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {


  tab1Root = TestePage;
  tab2Root = ObrasPage;

  constructor(public navCtrl: NavController) {

  }

}
