import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
})
export class FilesComponent implements OnInit {
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
  constructor() {}

  ngOnInit(): void {}
}
