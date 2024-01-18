import { Component } from '@angular/core';
import { NavController,ViewController } from 'ionic-angular';

@Component({
  selector: 'page-second',
  templateUrl: 'second.html'
})
export class SecondPage {

  constructor(public navCtrl: NavController, public viewCtrl: ViewController) {}

  ionViewDidLoad() {
  }


  closeModal(){
  let data = {
    title: 'hello',
    message: 'how are you'
  }
    this.viewCtrl.dismiss(data);
  }
}
