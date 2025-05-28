import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Services } from '../services/services';
import { CustomLoadingComponent } from './custom-loading/custom-loading.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [CustomLoadingComponent,CommonModule,FormsModule],
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
  persone:string = "0";
  personetotal:string = "0";
  simboli:string = "0";
  simbolitotal:string = "0";
  result: string = "";
  noteFeedback:string = "";
  esitoFeedback:string = "";
  viewResult: boolean = false;
  feedbackSended: boolean = false;
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
    this.noteFeedback = "";
    this.esitoFeedback = "";
    this.feedbackSended = false
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
            context.persone = response.result.context.person_scores.terrorist.toFixed(2);            
            context.personetotal = (parseFloat(context.persone)+response.result.context.person_scores.no_terrorist).toFixed(2);       
            context.simboli = response.result.context.symbol_scores.terrorist.toFixed(2);            
            context.simbolitotal = (parseFloat(context.simboli)+response.result.context.symbol_scores.no_terrorist).toFixed(2);   
            context.result = response.result.context.context
            this.viewResult = true;
          })
      };
      reader.readAsDataURL(file);
    }
  }

  sendFeedback(){
    if(!this.noteFeedback){
      document.getElementById("notefeedbackTextArea")?.classList.add("is-invalid")
    }
    else{
      document.getElementById("notefeedbackTextArea")?.classList.remove("is-invalid")
    }
    if(!this.esitoFeedback){
      document.getElementById("esitoFeedback")?.classList.add("is-invalid")
    }
    else{
      document.getElementById("esitoFeedback")?.classList.remove("is-invalid")
    }

    if(this.esitoFeedback && this.noteFeedback){
      let obj:any={}
      obj.filename = this.fileName
      obj.esito = this.result
      obj.noteFeedback = this.noteFeedback
      obj.esitoFeedback = this.esitoFeedback
      obj.image = this.b64Uimg
      obj.imageprocessed = this.b64Aimg
      this.feedbackSended=true;
      Services.sendFeedback(obj)
        .then((response) => {
          console.log(response);
          this.noteFeedback = "";
          this.esitoFeedback = "";
          this.feedbackSended=true;
        })
        .catch((error) => {
          console.error("Error sending feedback:", error);
        });
    }
  }
}
