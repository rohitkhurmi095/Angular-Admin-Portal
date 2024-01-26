//Regx:
// only alphanumeric & space : /^[0-9a-zA-Z ]+$/
// only numbers : /[0-9]+/
// char & space only : /^[a-zA-Z ]+$/
// Email Validation : /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/

import { FormControl, FormGroup } from "@angular/forms"

//AlphaNumericValidator
export class AlphaNumericFieldValidator{
    static ValidAlphaNumericField(fc: FormControl){
        if(fc.value!=null && fc.value!=undefined && fc.value!= ''){
            const regx = /^[0-9a-zA-Z ]+$/;
            if(regx.test(fc.value)){
                return null;
            }else{
                return {ValidAlphaNumericField:true}
            }
        }else{
            return null;
        }
    }
}

//CharFieldValidator
export class CharFieldValidator{
    static ValidCharField(fc:FormControl){
        if(fc.value!=null && fc.value!=undefined && fc.value!=''){
            const regx = /^[a-zA-Z ]+$/;
            if(regx.test(fc.value)){
                return null;
            }else{
                return {ValidCharField:true}
            }
        }else{
            return null;
        }
    }
}

//NumericFieldValidator
export class NumericFieldValidator{
    static ValidNumericField(fc:FormControl){
        if(fc.value!=null && fc.value!=undefined && fc.value!=''){
            const regx = /[0-9]+/;
            if(regx.test(fc.value)){
                return null;
            }else{
                return {ValidNumericField:true};
            }
        }else{
            return null;
        }
    }
}    

//EmailValidator
export class EmailFieldValidator{
    static ValidEmailField(fc:FormControl){
        if(fc.value!=null && fc.value!=undefined && fc.value!=''){
            const regx = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;
            if(regx.test(fc.value)){
                return null;
            }else{
                return {ValidEmailField:true};
            }
        }else{
            return null;
        }
    }
}

//NoWhiteSpaceValidator
export class NoWhiteSpaceFieldValidator{
    static ValidNoWhiteSpaceField(fc:FormControl){
        if(fc.value!=null && fc.value!=undefined && fc.value!=''){
            const value = fc.value.toString().trim();
            if(value.length != 0){
                return null;
            }else{
                return {ValidNoWhiteSpaceField:true};
            }
        }else{
            return null;
        }
    }
}


//MultiField validator
//To compare password and confirmPassword
//Apply validation on confirmPassword
export function MustMatchFieldValidator(fcName1:string,fcName2:string){
    return (fg:FormGroup)=>{
        const fc1 = fg.controls[fcName1];
        const fc2 = fg.controls[fcName2];

        if(fc2.errors && !fc2.errors['MustMatch']){
            return null;
        }

        if(fc1.value == fc2.value){
            fc2.setErrors(null);
        }else{
            fc2.setErrors({MustMatch:true});
        }
    }
}