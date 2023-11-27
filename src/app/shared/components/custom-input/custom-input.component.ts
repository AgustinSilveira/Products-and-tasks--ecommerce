import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent  implements OnInit {


  @Input() control!: FormControl;
  @Input() type!: string;
  @Input() label!: string;
  @Input() autocomplete!: string;
  @Input() icon!: string;

  // para ver la constrasena
  isPassword!: boolean;
  hide: boolean = true;

  constructor() { }

  // line 26; para mostrar la contrasena solo en el type password
  ngOnInit() {
    if (this.type == 'password') this.isPassword = true;
  }

  showOrHidePassword() {
    this.hide = !this.hide

    if (this.hide) this.type = 'password' 
    else this.type = 'text';
      
    
  }

}
