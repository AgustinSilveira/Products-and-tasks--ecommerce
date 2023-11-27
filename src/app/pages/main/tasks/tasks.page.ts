import { Component, OnInit, inject } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateTaskComponent } from 'src/app/shared/components/add-update-task/add-update-task.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit {
addUpdateProduct() {
throw new Error('Method not implemented.');
}

  user = {} as User
  tasks: Task[] = []
  loading: boolean = false;

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService)

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.getTasks();
    this.getUser();
  }

  getUser(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }
 

  getPercentage(task: Task) {
    return this.utilsSvc.getPercentage(task)
}

doRefresh(event) {
  setTimeout(() => {
    this.getTasks()
    event.target.complete();
  }, 1000);
}

async addOrUpdateTask(task?: Task) {
  let res = await this.utilsSvc.presentModal({
    component: AddUpdateTaskComponent,
    componentProps: { task },
    cssClass: 'add-update-modal'
  })
  if(res && res.success){
    this.getTasks()
  }
}

// obtener las tareas del usuario autenticado
getTasks() {
  let user : User = this.utilsSvc.getFromLocalStorage('user');
  let path = `users/${user.uid}`

  this.loading = true;

  // solo voy a hacer una consulta, cuando el usuario entre a la pagina (ionViewWillEnter)
  let sub = this.firebaseSvc.getSubcollection(path, 'tasks').subscribe({
    next: (res: Task[]) => {
      console.log(res);
      this.tasks = res
      sub.unsubscribe()
      this.loading = false;
    }
  })
}


// eliminar tarea
async deleteTask(task: Task) {
  let path = `users/${this.getUser().uid}/tasks/${task.id}`

   const loading = await this.utilsSvc.loading();
   await loading.present();


   this.firebaseSvc.deleteDocumentTask(path).then(async res => {

    this.tasks = this.tasks.filter(t => t.id !== task.id)

    this.utilsSvc.presentToast({
      message: 'Producto eliminado exitosamente',
      duration: 1500,
      color: 'success',
      position: 'middle',
      icon: 'checkmark-circle-outline'
    });

  }).catch(error => {
    console.log(error);

    this.utilsSvc.presentToast({
      message: error.message,
      duration: 2500,
      color: 'primary',
      position: 'middle',
      icon: 'alert-circle-outline'
    });


  }).finally(() => {
    loading.dismiss();
  })
}

// confirmar eliminacion
confirmDeleteTask(task: Task) {
  this.utilsSvc.presentAlert({
    header: 'Eliminar tarea',
    message: 'Quieres eliminar esta tarea?',
    mode: 'ios',
    buttons: [
      {
        text: 'Cancelar',
      }, {
        text: 'Si, eliminar',
        handler: () => {
          this.deleteTask(task)
        }
      }
    ]
  });

}



}