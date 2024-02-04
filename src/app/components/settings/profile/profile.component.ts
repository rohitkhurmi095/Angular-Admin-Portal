import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { Global } from 'src/app/shared/utility/global';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  constructor(private _httpService:HttpService, private _toastr:ToastrService, private _authService:AuthService){}

  //userDetails:
  userDetails:any;
  userImagePath:string;

  //imageUploadDetails:
  fileToUpload:File;
  uploadPreviewImage:string = '/assets/images/user.png';

  ngOnInit(){
    this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
    console.log('Settings -> Profile: ',this.userDetails);
    this.userImagePath = this.userDetails.imagePath!=""? Global.BASE_USER_IMAGES_URL+this.userDetails.imagePath : '/assets/images/user.png';
    this.uploadPreviewImage = this.userDetails.imagePath!=""? Global.BASE_USER_IMAGES_URL+this.userDetails.imagePath : '/assets/images/user.png';
  }

  
  //====================
  //Upload ProfileImage
  //====================
  //accessing templateRef variable on component using @ViewChild
  @ViewChild('profileImage') elProfileImage: ElementRef;

  uploadProfileImage(event:any){
    let files = event.target.files;
    let file = files[0];
    let fileType = file.type;
    const imageTypeRegx = /image\/*/;
    // console.log(files);
    // console.log(file);
    // console.log(fileType);
    
    //if no file selected
    if(files.length === 0){
      return;
    }

    //if invalid fileSelected
    if(!fileType.match(imageTypeRegx)){
      this._toastr.error("Please upload a valid image file.","Profile");  
      
      //clear input
      this.elProfileImage.nativeElement.value = "";
      //reset preview image
      this.uploadPreviewImage = this.userDetails.imagePath!=""? Global.BASE_USER_IMAGES_URL+this.userDetails.imagePath : '/assets/images/user.png';
      return;
    }

    //UploadFile
    this.fileToUpload = file;

    //Preview File using javascript FileReaderAPI
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = ()=>{
      this.uploadPreviewImage = reader.result.toString();
    }
  }


  //=======================
  //Saving Uploaded Image 
  //======================
  update(){
    if(!this.fileToUpload){
      this._toastr.error("Please select a profile image to upload!");
      return;
    }

    const formData = new FormData();
    formData.append("id",this.userDetails.id);
    formData.append("image",this.fileToUpload,this.fileToUpload.name);

    //call Save Image API 
    this._httpService.postImage(Global.BASE_API_URL+'UserMaster/UpdateProfile/',formData).subscribe(res=>{
      console.log("Profile: ",res);
      if(res.isSuccess){
        this._toastr.success("Profile updated successfully!");
        
        //clear fileData
        this.elProfileImage.nativeElement.value = "";
        this.fileToUpload = null; 
        //set Preview Image Again!
        this.uploadPreviewImage = this.userDetails.imagePath!=""? Global.BASE_USER_IMAGES_URL+this.userDetails.imagePath : '/assets/images/user.png';

        //show re-login dialogue box!
        this.showProfileChangeConfirmationDialogue();
      }else{
        this._toastr.error(res.errors[0],"Profile");
      }
    })
  }

  //As we are getting userImage with userDetails at the time of login,
  //InOrder to see the updated image, we need to re-login into the system.
  showProfileChangeConfirmationDialogue(){
    //sweetAlert2 - confirmation Modal
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger mx-2"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You want be see this change right now?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Login Again!",
      cancelButtonText: "No, Keep It!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        //call logout method!
        this._authService.logout();
      }else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
          this._toastr.info("Please re-login to see the update profile image!","Profile");
      } 
    });
  }


  //NgbNav Tabset -> onTabChange 
  onTabChange(event:any){
    //clear fileData
    this.elProfileImage.nativeElement.value = "";
    this.fileToUpload = null; 
    
    //set Preview Image Again!
    this.uploadPreviewImage = this.userDetails.imagePath!=""? Global.BASE_USER_IMAGES_URL+this.userDetails.imagePath : '/assets/images/user.png';
  }
}
