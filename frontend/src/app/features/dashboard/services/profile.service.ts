import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  apiUrl = environment.apiUrl;
  constructor(private _http: HttpClient) {}

  getUserData() {
    return this._http.get(`${this.apiUrl}/users/get-user-data`);
  }

  getPresignedUrl(fileName: string, fileType: string) {
    return this._http.get(
      `${this.apiUrl}/users/get-presigned-url?fileName=${fileName}&fileType=${fileType}`,
    );
  }

  uploadToUrl(file: File, url: string) {
    console.log(file, url);
    return this._http.put(url, file, {
      headers: { 'Content-Type': file.type },
    });
  }

  uploadProfileUrlToServer(url: string) {
    return this._http.patch(`${this.apiUrl}/users/upload-url-to-db`, { url });
  }

  uploadProfilePicture(file: FormData) {
    return this._http.post(`${this.apiUrl}/users/upload-profile-picture`, file);
  }
}
