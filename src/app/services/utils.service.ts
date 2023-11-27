import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, LoadingOptions, ModalController,
   ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl = inject(ModalController);
  router = inject(Router);
  alertCtrl = inject(AlertController);
  modalControler = inject(ModalController);




// API funcionalidad de la camara y galería
async takePicture(promptLabelHeader: string) {
  return await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Prompt,
    promptLabelHeader,
    promptLabelPhoto: 'Seleccione una imagen',
    promptLabelPicture: 'Toma una foto'
  });

};

// Alert
  async presentAlert(opts?: AlertOptions) {
    const alert = await this.alertCtrl.create(opts);
    await alert.present();
}

  // loading al ingresar los datos
  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' })
  }

  // funcion para mostrar mensajes de error
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  // enruta a cualquier pagina disponible
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  // guarda un elemento en localstorage
  // convierto el value en string, porque todo lo que se guarda en localStorage debe ser de tipo string
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value))
  }

  // obtiene un elemento desde localstorage
  // al estar en tipo string, necesitamos que vuelva al valor original. utilizo JSON.parse
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key))
  }

  // modal

  // present
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if(data) return data;
  
  }
  // dismiss

  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }

  // == loading ==
  // present
  async presentLoading(opts: LoadingOptions) {
    const loading = await this.loadingCtrl.create(opts);
    await loading.present();
  }
// dismiss
  async dismissLoading() {
    return await this.loadingCtrl.dismiss();
  }

  setElementInLocalstorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value))
  }

  // task
  getPercentage(task: Task) {
    let completedItems = task.items.filter(item => item.completed).length;
    let totalItems = task.items.length;
    let percentage = (100 / totalItems) * completedItems

    return parseInt(percentage.toString()) 
  }
 
  


  

 

 

}
