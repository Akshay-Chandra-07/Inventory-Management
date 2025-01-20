import { Injectable } from '@angular/core';
import * as jsZip from 'jszip';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ZipService {
  constructor(private _http: HttpClient) {}

  downloadZip = async (files: any) => {
    console.log(files);
    const zip = new jsZip();
    for (const singleFile of files) {
      console.log(singleFile[1]);
      try {
        const response = await fetch(singleFile[1]);
        const blob = response.blob();
        const fileName = singleFile[0];
        zip.file(fileName, blob);
      } catch (err) {
        console.log(err);
      }
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `Inventory_files.zip`);
  };
}
