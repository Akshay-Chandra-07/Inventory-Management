import * as CryptoJS from "crypto-js";
import { environment } from "src/environments/environment";

export function decrypt(data:any){
    const key = environment.key
    console.log(data)
    const decryptedRole =  CryptoJS.AES.decrypt(data,key)
    return JSON.parse(decryptedRole.toString(CryptoJS.enc.Utf8));
}
