import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FilesService } from '../../services/files.service';
import { NgToastService } from 'ng-angular-popup';
import { ZipService } from 'src/app/core/services/zip.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
})
export class FilesComponent implements OnInit {
  files: any;
  selectedFiles: any = {};

  filesTableData: any;
  constructor(
    private filesService: FilesService,
    private toast: NgToastService,
    private zipService: ZipService,
  ) {}

  uploadUserFiles = new FormGroup({
    inputFiles: new FormControl(''),
  });

  ngOnInit(): void {
    this.fetchUserFiles();
  }

  onFiles(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.files = input.files[0];
    }
  }

  onSubmitUserFiles() {
    const fileName = this.files.name.replace(/\s+/g, '');
    const fileType = this.files.type;
    const fileSize = this.files.size;
    console.log(fileSize, typeof fileSize);
    this.filesService
      .getPresignedUrl(fileName, fileType)
      .pipe()
      .subscribe({
        next: (data1: any) => {
          console.log(data1);
          this.filesService
            .uploadToUrl(this.files, data1.url)
            .pipe()
            .subscribe({
              next: (data2: any) => {
                this.filesService
                  .uploadFileDataToDb(
                    data1.fileKey,
                    fileName,
                    fileType,
                    fileSize,
                  )
                  .pipe()
                  .subscribe({
                    next: (data3: any) => {
                      console.log(data3);
                      this.toast.success({ detail: data3.msg, duration: 2000 });
                      this.fetchUserFiles();
                    },
                    error: (error: any) => {
                      this.toast.error({
                        detail: error.error.msg,
                        duration: 2000,
                      });
                      console.log(error);
                    },
                  });
              },
              error(error: any) {
                console.log(error);
              },
            });
        },
        error(error: any) {
          console.log(error);
        },
      });
  }

  fetchUserFiles() {
    this.filesService
      .getUserFiles()
      .pipe()
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.filesTableData = data.userFiles;
        },
        error(error: any) {
          console.log(error);
        },
      });
  }

  onSelectFile(data: any) {
    if (!this.selectedFiles) {
      this.selectedFiles = {};
    }
    if (this.selectedFiles[data.file_id]) {
      delete this.selectedFiles[data.file_id];
    } else {
      this.selectedFiles[data.file_id] = data;
    }
  }

  downloadZip() {
    let fileUrls: any = [];
    Object.values(this.selectedFiles).forEach((file: any) => {
      fileUrls.push([file.file_name, file.file_url]);
    });
    this.zipService.downloadZip(fileUrls);
    this.selectedFiles = {};
  }
}
