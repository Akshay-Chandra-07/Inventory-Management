import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FilesService } from '../../services/files.service';
import { NgToastService } from 'ng-angular-popup';
import { ZipService } from 'src/app/core/services/zip.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
})
export class FilesComponent implements OnInit {
  files: any;
  selectedFiles: any = {};
  previewData: any;

  filesTableData: any;
  constructor(
    private filesService: FilesService,
    private toast: NgToastService,
    private zipService: ZipService,
    private sanitize: DomSanitizer,
    private errorHandler : ErrorHandlerService
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
                      this.errorHandler.handleError(error);
                    },
                  });
              },
              error:(error: any)=>{
                this.errorHandler.handleError(error);
              },
            });
        },
        error:(error: any)=>{
          this.errorHandler.handleError(error);
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
        error:(error: any)=>{
          this.errorHandler.handleError(error);
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

  onPreviewing(data: any) {
    let newUrl;
    this.previewData = data;
    if (
      this.previewData.file_type ==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      this.previewData.file_type == 'application/msword' ||
      this.previewData.file_type ==
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ) {
      newUrl = this.sanitize.bypassSecurityTrustResourceUrl(
        'https://view.officeapps.live.com/op/embed.aspx?src=' +
          this.previewData.file_url,
      );
    } else {
      newUrl = this.sanitize.bypassSecurityTrustResourceUrl(
        this.previewData.file_url,
      );
    }
    this.previewData.preview_url = newUrl;
  }
}
