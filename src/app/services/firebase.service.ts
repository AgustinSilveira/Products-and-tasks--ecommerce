import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile,
         sendPasswordResetEmail } from 'firebase/auth'
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, query, where, onSnapshot,
         DocumentData, updateDoc, deleteDoc } from '@angular/fire/firestore'
import { UtilsService } from './utils.service'; 
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from 'firebase/storage';
import { Subject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
 

  

  constructor(
  private auth : AngularFireAuth,
  private firestore : AngularFirestore,
  private utilsSvc : UtilsService,
  ) {
    
  }

  // ========= Autenticacion ============

  getAuth() {
    return getAuth();
  }

  // ACCEDER
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // CREAR USUARIO
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // ACTUALIZAR USUARIO
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, {displayName})
  }

  // ENVIAR EMAIL PARA RESTABLECER LA CONTRASENA
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  // CERRAR SESION
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

  //================ BASE DE DATOS ===============

  // obtener documentos de una coleccion
  getCollectionData(path: string, collectionQuery?: any) {
    const subject = new Subject();
  
    const collectionRef = collection(getFirestore(), path);
    const q = query(collectionRef, collectionQuery);
  
    onSnapshot(q, (snapshot) => {
      const dataWithIds = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data() as DocumentData, 
      }));
      subject.next(dataWithIds);
    });
  
    return subject.asObservable();
  }

  // crear un nuevo documento o reemplazarlo si existe
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  // actualizar un documento
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  // eliminar un documento
  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path));
  }

  // obtener un documento
   async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  // agregar un documento
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }
  //=============================================================================================================//
  // la diferencia de setdoc con addDoc: el setdoc se usa para guardar los datos de un usuario entonces nos pasa //
  // el id en el path. En el addDoc le tenemos que decir el nombre de la coleccion donde lo queremos guardar y   //
  // el addDoc se encarga de asignarle un id automaticamente a ese documento                                     //
  //=============================================================================================================//

// ================ ALMACENAMIENTO ================
//   ==== Productos ====
// subir imagen
async uploadImage(path: string, data_url: string) {
  return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
    return getDownloadURL(ref(getStorage(), path))
  })
}

// obtener ruta de la imagen con su url
async getFilePath(url: string) {
  return ref(getStorage(), url).fullPath
}
// Eliminar archivo de consola
deleteFile(path: string) {
  return deleteObject(ref(getStorage(), path));
}

// Firestore (base de datos)
//   ==================================== Tareas ====================================
// leer
getSubcollection(path: string, subcollectionName: string) {
  return this.firestore.doc(path).collection(subcollectionName).valueChanges({
    idField: `id`
  })
}

// nos crea una tarea con un id aleatorio
// agregar
addToSubcollection(path: string, subcollectionName: string, object: any) {
  return this.firestore.doc(path).collection(subcollectionName).add(object)
}

// actualizar
updateDocumentTask(path: string, object: any) {
  return this.firestore.doc(path).update(object);
}

// eliminar
deleteDocumentTask(path: string) {
  return this.firestore.doc(path).delete()
}















}
