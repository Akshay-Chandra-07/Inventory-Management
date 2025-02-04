import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  apiUrl = environment.apiUrl;

  constructor(private _http: HttpClient) {}

  uploadUserFiles(files: FormData) {
    return this._http.post(`${this.apiUrl}/users/upload-user-files`, files);
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

  uploadFileDataToDb(
    url: string,
    file_name: string,
    file_type: string,
    file_size: string,
    purpose : string
  ) {
    return this._http.post(`${this.apiUrl}/users/upload-file-to-db`, {
      url,
      file_name,
      file_type,
      file_size,
      purpose
    });
  }

  getUserFiles() {
    return this._http.get(`${this.apiUrl}/users/get-files-of-user`);
  }

  getExcelProductFiles(){
    return this._http.get(`${this.apiUrl}/users/get-excel-product-files`)
  }
}
