import * as CryptoJS from "crypto-js";
import { environment } from "src/environments/environment";

export function decrypt(data:any){
    const key = environment.key
    const decryptedRole =  CryptoJS.AES.decrypt(data,key)
    console.log(decryptedRole)
    return JSON.parse(decryptedRole.toString(CryptoJS.enc.Utf8));
}
