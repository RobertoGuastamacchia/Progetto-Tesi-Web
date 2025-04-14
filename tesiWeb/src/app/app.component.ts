import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Services } from '../services/services';
import { CustomLoadingComponent } from './custom-loading/custom-loading.component';
import { CommonModule } from '@angular/common';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [CustomLoadingComponent,CommonModule],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'tesiWeb'
  isLoading: boolean = false;
  b64Uimg: string = "";
  b64Aimg: string = "";
  imgExt: string = "";
  armi:string = "0";
  armitotal:string = "0";
  persone:number = 0;
  personetotal:number = 0;
  simboli:number = 0;
  simbolitotal:number = 0;
  result: string = "";
  viewResult: boolean = false;
  constructor(private cd: ChangeDetectorRef) { }

  fileName: string = '';  
  filelength: number = 0;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  startLoading() {
    this.isLoading = true;
    this.cd.detectChanges();
    document.body.style.overflow = "hidden";
  }
  endLoading() {
    this.isLoading = false;
    this.cd.detectChanges();
    document.body.style.overflow = "auto";
  }

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
    this.viewResult = false;
    let context = this;
    let base64String = "";
    let filename = "";
    const input = this.fileInput.nativeElement;
    if (input.files && input.files.length > 0) {
      context.startLoading()
      filename = input.files[0].name;
      context.imgExt = filename.split('.').pop()!;
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        base64String = (e.target?.result as string).split(',')[1];
        context.b64Uimg = base64String;
        Services.analyzeImage(base64String, filename)
          .then((response) => {
            console.log(response);
            context.b64Aimg = response.result.analyzedImage;
            context.endLoading();
            context.armi = response.result.context.weapon_scores.terrorist.toFixed(2);            
            context.armitotal = (parseFloat(context.armi)+response.result.context.weapon_scores.no_terrorist).toFixed(2);            
            context.persone = response.result.context.count_terrorist_person;            
            context.personetotal = context.persone+response.result.context.count_no_terrorist_person;       
            context.simboli = response.result.context.count_terrorist_symbol;            
            context.simbolitotal = context.simboli+response.result.context.count_no_terrorist_symbol;   
            context.result = response.result.context.context
            this.viewResult = true;
          })
      };
      reader.readAsDataURL(file);
    }
  }
}
