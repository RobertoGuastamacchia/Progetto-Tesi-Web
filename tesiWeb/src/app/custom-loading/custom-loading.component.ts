import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-loading',
  standalone: true,
  imports: [],
  templateUrl: './custom-loading.component.html',
  styleUrl: './custom-loading.component.css'
})
export class CustomLoadingComponent {

  ngOnInit(){
    document.body!.append(document.getElementById("loader")!)
  }
}
