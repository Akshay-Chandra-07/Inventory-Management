import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FilesService } from '../../services/files.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
})
export class FilesComponent implements OnInit {

  files : FormData | undefined

  filesTableData = [
    {
      name: 'File requirements.txt',
      size: '200Kb',
    },
    {
      name: 'File requirements.txt',
      size: '1Mb',
    },
    {
      name: 'File requirements.txt',
      size: '200Kb',
    },
    {
      name: 'File requirements.txt',
      size: '200Kb',
    },
  ];
  constructor(private filesService:FilesService) {}

  uploadUserFiles = new FormGroup({
    inputFiles : new FormControl('')
  })

  ngOnInit(): void {}

  onFiles(event: Event) {
    this.files = new FormData();
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.files.append('files', input.files[0]);
    }
  }

  onSubmitUserFiles(){
    console.log(this.files);
    this.filesService.uploadUserFiles(this.files!).subscribe({
      next:(data:any)=>{
        console.log(data);
        this.filesTableData = data
      },error(error){
        console.log(error)
      }
    })
  }
}
