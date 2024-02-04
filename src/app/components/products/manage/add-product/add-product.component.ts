import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { DbOperations } from 'src/app/shared/utility/db-operations';
import { Global } from 'src/app/shared/utility/global';
import { CharFieldValidator, NoWhiteSpaceFieldValidator, NumericFieldValidator } from 'src/app/shared/validations/validation.validator';
//CkEditor5
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit,OnDestroy {

  componentName:string = "Add Product"
  buttonText:string = "";
  dbOperation:DbOperations;

  //CKEditor
  editor = ClassicEditor;

  objRow:any;
  editId:number;
  categories:any[];
  colors:any[];
  tags:any[];
  sizes:any[];
  quantityCounter:number = 1; //Atleast 1 quantity

  //Images (1 ZoomImage + multiple small Images)
  fileToUpload = [];
  zoomImagePreview: string = '/assets/images/product-noimage.jpg';
  smallImagePreviews:any[] = [
    {src: '/assets/images/noimage.png'},
    {src: '/assets/images/noimage.png'},
    {src: '/assets/images/noimage.png'},
    {src: '/assets/images/noimage.png'},
    {src: '/assets/images/noimage.png'},
  ]

  //Form Data
  fData:FormGroup;

  //Form Validations
  formErrors = {
    name: '',
    title: '',
    code: '',
    price: '',
    salePrice: '',
    discount: '',
    sizeId: '',  
    categoryId: '', 
    tagId: '',      
    colorId: ''
  };
  validationMessages = {
    name: {
      required:'Name is required',
      minlength:'Name must be minimum of 3 character',
      maxlength:'Name cannot exceed 20 characters',
      ValidCharField:'Name must be contains char and space only!',
      ValidNoWhiteSpaceField: 'Only whitespace characters not allowed!'
    },
    title: {
      required:'Title is required',
      minlength:'Title must be minimum of 3 character',
      maxlength:'Title cannot exceed 20 characters',
      ValidCharField:'Title must be contains char and space only!',
      ValidNoWhiteSpaceField: 'Only whitespace characters not allowed!'
    },
    code: {
      required:'Code is required',
      minlength:'Code must be minimum of 3 character',
      maxlength:'Code cannot exceed 12 characters',
      ValidNoWhiteSpaceField: 'Only whitespace characters not allowed!'
    },
    price: {
      required: 'Price is required',
      minlength:'Price must be minimum of 2 character',
      maxlength:'Price cannot exceed 5 characters',
      ValidNumericField:'Please enter a valid numeric value!',
      ValidNoWhiteSpaceField:'Only whitespace characters not allowed!'
    },
    salePrice: {
      required: 'Sale price is required',
      minlength:'Sale Price must be minimum of 2 character',
      maxlength:'Sale Price cannot exceed 5 characters',
      ValidNumericField:'Please enter a valid numeric value!',
      ValidNoWhiteSpaceField:'Only whitespace characters not allowed!'
    },
    discount: {
      required:'Discount is required',
      minlength:'Discount must be minimum of 1 character',
      maxlength:'Discount cannot exceed 3 characters',
      ValidNumericField:'Please enter a valid numeric value!',
      ValidNoWhiteSpaceField: 'Only whitespace characters not allowed!'
    },
    sizeId: {
      required:'Size is required!'
    },  
    categoryId: {
      required:'Category is required!'
    }, 
    tagId: {
      required:'Tag is required!'
    },      
    colorId: {
      required:'Color is required!'
    }
  }

  constructor(private _route:ActivatedRoute, private _router:Router, private _toastr:ToastrService, private _httpService:HttpService,private _fb:FormBuilder){
    //1. Receive state using navigationExtras of router
    this.editId = this._router.getCurrentNavigation()?.extras?.state?.['id'];
    console.log('Edit Id received from products-list -> ',this.editId);

    //2. Receive queryParams using queryParamsMap property of the Activated Route
    // this._route.queryParamMap.subscribe(res=>{
    //   this.editId = parseInt(res.get('id'));
    // })
  }

  ngOnInit(){
    //setFormData
    this.setFormData();

    //Bind other items
    this.getCategories();
    this.getColors();
    this.getSizes();
    this.getTags();

    //If EditId is received -> EditMode
    if(this.editId && this.editId!=null && this.editId>0){
      //Get single record using this Id + bind data in form
      this.buttonText = "Update";
      this.dbOperation = DbOperations.update;
      this.getRecord(this.editId);
    }
  }

  setFormData(){
    //default formState
    this.buttonText = "Add";
    this.dbOperation = DbOperations.create;

    //formControls
    this.fData = this._fb.group({
      id: [0],
      name: ['',Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(20),NoWhiteSpaceFieldValidator.ValidNoWhiteSpaceField,CharFieldValidator.ValidCharField])],
      title: ['',Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(20),NoWhiteSpaceFieldValidator.ValidNoWhiteSpaceField,CharFieldValidator.ValidCharField])],
      code: ['',Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(12),NoWhiteSpaceFieldValidator.ValidNoWhiteSpaceField])],
      price: ['',Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(5),NoWhiteSpaceFieldValidator.ValidNoWhiteSpaceField,NumericFieldValidator.ValidNumericField])],
      salePrice: ['',Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(5),NoWhiteSpaceFieldValidator.ValidNoWhiteSpaceField,NumericFieldValidator.ValidNumericField])],
      discount: ['',Validators.compose([Validators.required,Validators.minLength(1),Validators.maxLength(3),NoWhiteSpaceFieldValidator.ValidNoWhiteSpaceField,NumericFieldValidator.ValidNumericField])],
      quantity: [''],                            //disabling this formControl
      sizeId: ['',[Validators.required]],       //dropdown
      categoryId: ['',[Validators.required]],  //dropdown
      tagId: ['',[Validators.required]],      //dropdown
      colorId: ['',[Validators.required]],   //dropdown
      isNew: [false], //checkbox
      isSale: [false], //checkbox
      shortDetails: [''],
      description: [''], 
    });

    //Set TotalProducts Counter
    this.fData.controls['quantity'].setValue(this.quantityCounter);

    //Apply dynamic formValidation on valueChanges
    this.fData.valueChanges.subscribe(()=>{
      this.onValueChanges();
    })
  }

  //Get formControl
  get fc(){
    return this.fData.controls;
  }

  resetFormData(){
    //reset formData
    this.fData.reset({
      id:0,
      name: '',
      title: '',
      code: '',
      price: '',
      salePrice: '',
      discount: '',
      quantity:'',
      sizeId: '',  
      categoryId: '', 
      tagId: '',      
      colorId: '',
      isNew: false,
      isSale: false, 
      shortDetails: '',
      description: '', 
    });

    //reset formState
    this.buttonText = "Add";
    this.dbOperation = DbOperations.create;
    
    //Reset Images
    this.fileToUpload = [];
    this.zoomImagePreview = '/assets/images/product-noimage.jpg';
    this.smallImagePreviews = [
      {src: '/assets/images/noimage.png'},
      {src: '/assets/images/noimage.png'},
      {src: '/assets/images/noimage.png'},
      {src: '/assets/images/noimage.png'},
      {src: '/assets/images/noimage.png'},
    ]

    //reset quantityCounter
    this.quantityCounter = 1;
  }

  cancel(){
    //reset form and navigate to products-list page
    this.resetFormData();
    this._router.navigate(['/products/manage/products-list']);
  }

  //Dynamic FormValidations
  onValueChanges(){
    for(let field of Object.keys(this.formErrors)){
      //check if form is valid -> all formControls are set
      if(!this.fData){
        return;
      }

      //set formErrors[field] -> ''
      this.formErrors[field] = '';
      //get formControlInstance (field = formControlName)
      let formControl = this.fData.get(field);

      if(formControl && ((formControl.touched || formControl.dirty) && formControl.errors)){
        //loop through each error on formControl
        for(let key of Object.keys(formControl.errors)){
          //skip required validation
          if(key != 'required'){
            this.formErrors[field] = this.formErrors[field] + this.validationMessages[field][key] + '<br/>';
          }
        }
      }
    }
  };

  //--------
  //Counter
  //--------
  counter(type:any){
    if(type == 'decrement'){
      if(this.quantityCounter>1){
        this.quantityCounter --;
        this.fData.controls['quantity'].setValue(this.quantityCounter);
      }
    }else{
      this.quantityCounter ++
      this.fData.controls['quantity'].setValue(this.quantityCounter);
    }
  }

  //-------------
  //ImageUpload
  //-------------
  //Get templateRef variable using @ViewChild()
  @ViewChild('image') elImage:ElementRef;
  uploadImages(event:any,index:number){
    //console.log('Event: ',event.target.files);

    let files = event.target.files;
    let file = event.target.files[0];
    let fileType = file.type;
    const imageTypeRegx = /image\/*/;

    //if no image to upload
    if(files.length === 0){
      return;
    }

    //if invalid file
    if(!fileType.match(imageTypeRegx)){
      this._toastr.error("'Please upload a valid image file.",this.componentName);

      //clear fileInput and setDefaultPreviewImage (for that particular fileIndex)
      this.elImage.nativeElement.value = "";
      this.smallImagePreviews[index].src = '/assets/images/noimage.png';
      this.zoomImagePreview = '/assets/images/product-noimage.jpg';
      return;
    }

    //Set FileDate in smallImagePreviews Array
    this.fileToUpload[index] = file;

    //Read FileData for Preview (smallImage | zoomImage) using javascript FileReader API
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = ()=>{
      this.smallImagePreviews[index].src = reader.result.toString();
      this.zoomImagePreview = reader.result.toString();
    }
  }


  //====
  //Get
  //====
  getRecord(id:number){
    this._httpService.get(Global.BASE_API_URL+'ProductMaster/GetById/'+id).subscribe(res=>{
      console.log("Products -> GetById "+id+": ",res);
      if(res.isSuccess){
        this.objRow = res.data;

        //Fill EditForm data
        this.fData.patchValue({
          id: this.objRow.id,
          name: this.objRow.name,
          title: this.objRow.title,
          code: this.objRow.code,
          price: this.objRow.price,
          salePrice: this.objRow.salePrice,
          discount: this.objRow.discount,
          quantity: this.objRow.quantity,
          sizeId: this.objRow.sizeId,  
          categoryId: this.objRow.categoryId, 
          tagId: this.objRow.tagId ,      
          colorId: this.objRow.colorId, 
          isNew: this.objRow.isNew === 1? true: false,
          isSale: this.objRow.isSale === 1? true: false, 
          shortDetails: this.objRow.shortDetails,
          description: this.objRow.description,
        });

        //set quantityCounter
        this.quantityCounter = this.objRow.quantity;

        //GetProductImages
        this.getRecordImages(id);
      }else{
        this._toastr.error(res.errors[0],this.componentName)
      }
    });
  }


  //==================
  //Get ProductImages
  //=================
  //Get and Set product images
  getRecordImages(id:number){
    //check product CreatedDate -> call GetProductAPI
    this._httpService.get(Global.BASE_API_URL+'ProductMaster/GetById/'+id).subscribe(res1=>{
      if(res1.isSuccess){
          console.log(res1.data.createdOn);

          //cal get productImage API
          this._httpService.get(Global.BASE_API_URL+'ProductMaster/GetProductPicturebyId/'+id).subscribe(res=>{
            if(res.isSuccess && res.data.length>0){
              console.log(res.data);

              //**Note: For Products created before '07/12/2019' data is stored in '/Images/Shop' root path not '/Images'
              if(res1.data.createdOn !== "07/12/2019"){
                console.log('BaseImagePath: /Images');

                //set ZoomImage as 1st image in res.data
                this.zoomImagePreview =  res.data[0].name!=null? Global.BASE_IMAGES_URL + res.data[0].name : '/assets/images/product-noimage.jpg';
                //set smallImages
                this.smallImagePreviews = [
                  {src: res.data[0].name!=null? Global.BASE_IMAGES_URL +res.data[0].name : '/assets/images/noimage.png'},
                  {src: res.data[1].name!=null? Global.BASE_IMAGES_URL +res.data[1].name : '/assets/images/noimage.png'},
                  {src: res.data[2].name!=null? Global.BASE_IMAGES_URL +res.data[2].name : '/assets/images/noimage.png'},
                  {src: res.data[3].name!=null? Global.BASE_IMAGES_URL +res.data[3].name : '/assets/images/noimage.png'},
                  {src: res.data[4].name!=null? Global.BASE_IMAGES_URL +res.data[4].name : '/assets/images/noimage.png'},
                ]
              }
              else{
                console.log('BaseImagePath: /Images/Shop');

                //set ZoomImage as 1st image in res.data
                this.zoomImagePreview =  res.data[0].name!=null? Global.BASE_IMAGES_URL.replace('images/','images/shop/') + res.data[0].name : '/assets/images/product-noimage.jpg';
                //set smallImages
                this.smallImagePreviews = [
                  {src: res.data[0].name!=null? Global.BASE_IMAGES_URL.replace('images','images/shop/') +res.data[0].name : '/assets/images/noimage.png'},
                  {src: res.data[1].name!=null? Global.BASE_IMAGES_URL.replace('images','images/shop/') +res.data[1].name : '/assets/images/noimage.png'},
                  {src: res.data[2].name!=null? Global.BASE_IMAGES_URL.replace('images','images/shop/') +res.data[2].name : '/assets/images/noimage.png'},
                  {src: res.data[3].name!=null? Global.BASE_IMAGES_URL.replace('images','images/shop/') +res.data[3].name : '/assets/images/noimage.png'},
                  {src: res.data[4].name!=null? Global.BASE_IMAGES_URL.replace('images','images/shop/') +res.data[4].name : '/assets/images/noimage.png'},
                ]
              }

            }else{
              this._toastr.error(res.errors[0],this.componentName);
            }
          });
      }
      else{
        this._toastr.error(res1.errors[0],this.componentName);
      }
    });
  }


  //Category Master
  //----------------
  getCategories(){
    this._httpService.get(Global.BASE_API_URL+'Category/GetAll').subscribe(res=>{
      console.log('Products -> Category/GetAll: ',res.data);
      if(res.isSuccess){
        this.categories = res.data;
      }else{
        this._toastr.error(res.errors[0],this.componentName);
      }
    });
  }

  //Tag Master
  //----------
  getTags(){
    this._httpService.get(Global.BASE_API_URL+'TagMaster/GetAll').subscribe(res=>{
      console.log('Products -> TagMaster/GetAll: ',res.data);
      if(res.isSuccess){
        this.tags = res.data;
      }else{
        this._toastr.error(res.errors[0],this.componentName);
      }
    });
  }

  //Size Master
  //------------
  getSizes(){
    this._httpService.get(Global.BASE_API_URL+'SizeMaster/GetAll').subscribe(res=>{
      console.log('Products -> SizeMaster/GetAll: ',res.data);
      if(res.isSuccess){
        this.sizes = res.data;
      }else{
        this._toastr.error(res.errors[0],this.componentName);
      }
    });
  }

  //Color Master
  //------------
  getColors(){
    this._httpService.get(Global.BASE_API_URL+'ColorMaster/GetAll').subscribe(res=>{
      console.log('Products -> ColorMaster/GetAll: ',res.data);
      if(res.isSuccess){
        this.colors = res.data;
      }else{
        this._toastr.error(res.errors[0],this.componentName);
      }
    });
  }


  //=============
  //Add | Update
  //=============
  submit(){
    if(!this.fData.valid){
      return;
    }
    console.log("Product: ",this.fData.value);

    //check if file(productImage) has been uploaded
    if(this.dbOperation == DbOperations.create && this.fileToUpload.length<5){
      this._toastr.error("Please upload 5 images per product!",this.componentName);
      return;
    }
    else if(this.dbOperation == DbOperations.update && (this.fileToUpload.length>0 && this.fileToUpload.length<5)){
      //if single image is changed -> change all 5 images in update (to maintain indexing)
      this._toastr.error("Please upload 5 images per product!",this.componentName);
      return;
    }

    //send formData and images using FormData and postImage
    const formData = new FormData();
    formData.append("Id",this.fData.value.id);
    formData.append("Name",this.fData.value.name);
    formData.append("Title",this.fData.value.title);
    formData.append("Code",this.fData.value.code);
    formData.append("Price",this.fData.value.price);
    formData.append("SalePrice",this.fData.value.salePrice);
    formData.append("Discount",this.fData.value.discount);
    formData.append("Quantity",this.fData.value.quantity);
    formData.append("SizeId",this.fData.value.sizeId);
    formData.append("ColorId",this.fData.value.colorId);
    formData.append("TagId",this.fData.value.tagId);
    formData.append("CategoryId",this.fData.value.categoryId);
    formData.append("IsSale", this.fData.value.isSale? '1': '0');
    formData.append("IsNew", this.fData.value.isNew? '1': '0');
    formData.append("ShortDetails",this.fData.value.shortDetails);
    formData.append("Description",this.fData.value.description);
    //Images
    if(this.fileToUpload){
      for(var i=0;i<this.fileToUpload.length;i++){
        let imageFile = this.fileToUpload[i];
        formData.append("Image",imageFile,imageFile.name);
      }  
    }
 
    // console.log("FormData content:");
    // formData.forEach((value, key) => {
    //   console.log(`${key}: ${value}`, typeof `${value}`);
    // });
   
    switch(this.dbOperation){
      case DbOperations.create:
        this._httpService.postImage(Global.BASE_API_URL+'ProductMaster/Save/', formData).subscribe(res=>{
          console.log("Products -> Save: ",res);
          if(res.isSuccess){
            this._toastr.success("Product Added Successfully!",this.componentName);

            //reset form
            this.resetFormData();
            //navigate to ProductsList page
            this._router.navigate(['/products/manage/products-list']);
          }else{
            this._toastr.error(res.errors[0],this.componentName);
          }
        })
        break;

      case DbOperations.update:
        //call Update API
        this._httpService.postImage(Global.BASE_API_URL+'ProductMaster/Update/', formData).subscribe(res=>{
          console.log("Products -> Update: ",res);
          if(res.isSuccess){
            this._toastr.success("Product Updated Successfully!",this.componentName);

            //reset form
            this.resetFormData();
            //navigate to ProductsList page
            this._router.navigate(['/products/manage/products-list']);
          }else{
            this._toastr.error(res.errors[0],this.componentName);
          }
        })
        break;
    }
  }


  ngOnDestroy(){
    this.colors = null;
    this.sizes = null;
    this.tags = null;
    this.categories = null;
    this.fileToUpload = null;
  }
}
