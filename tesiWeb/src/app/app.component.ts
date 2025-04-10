import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Services } from '../services/services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tesiWeb';
  fileName: string = '';  
  filelength: number = 0;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.filelength = input.files.length;
      this.fileName = input.files[0].name;
    } else {
      this.fileName = '';
    }
  }

  selectFile(){
    this.fileInput.nativeElement.click();
  }

  analyzeImage() {
    let base64String = "";
    let filename = "";
    const input = this.fileInput.nativeElement;
    if (input.files && input.files.length > 0) {
      filename = input.files[0].name;
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        base64String = (e.target?.result as string).split(',')[1];
        Services.analyzeImage(base64String, filename)
          .then((response) => {
            console.log(response);
          })
      };
      reader.readAsDataURL(file);
    }
  }
}
