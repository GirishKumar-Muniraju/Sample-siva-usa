import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { SecondPage } from '../second/second';

@Component({
  selector: 'page-obras',
  templateUrl: 'obras.html'
})
export class ObrasPage {

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {}

  abrir_second(){
    let modal = this.modalCtrl.create(SecondPage);

    modal.onDidDismiss((data) => {
      console.log(data);
    });

    modal.present();

  }

}
