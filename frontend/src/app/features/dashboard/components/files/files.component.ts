import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FilesService } from '../../services/files.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
})
export class FilesComponent implements OnInit {
  files: any;

  filesTableData: any;
  constructor(private filesService: FilesService) {}

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
              next: (data: any) => {
                this.filesService
                  .uploadFileDataToDb(
                    data1.fileKey,
                    fileName,
                    fileType,
                    fileSize,
                  )
                  .pipe()
                  .subscribe({
                    next: (data: any) => {
                      console.log(data);
                      this.fetchUserFiles();
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
}
