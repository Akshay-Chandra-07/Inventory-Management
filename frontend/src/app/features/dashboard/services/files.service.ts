import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  apiUrl = environment.apiUrl

  constructor(private _http:HttpClient) { }

  uploadUserFiles(files:FormData){
    return this._http.post(`${this.apiUrl}/users/upload-user-files`,files)
  }
}
