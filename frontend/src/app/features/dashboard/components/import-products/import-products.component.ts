import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FilesService } from '../../services/files.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-import-products',
  templateUrl: './import-products.component.html',
  styleUrls: ['./import-products.component.css']
})
export class ImportProductsComponent implements OnInit {

  excelProductFiles:any = []

  @Output() toggler = new EventEmitter<string>();

  constructor(
    private filesService:FilesService,
    private errorHandler:ErrorHandlerService,
    private socketService:SocketService,
    private toast:NgToastService
  ) { }

  ngOnInit(): void {
    this.fetchExcelProductFiles()
    this.socketService.onStatusUpdate().subscribe({
      next:(data:any)=>{
        this.excelProductFiles = this.excelProductFiles.map((file:any)=>{
          if(file.file_id == data.file_id){
            file.status = data.status
          }
          return file
        })
      },error:(error:Error)=>{
        this.errorHandler.handleError(error)
      }
    })
    this.socketService.onNotification().subscribe({
      next:(data:any)=>{
        console.log(data)
      },error:(error:Error)=>{
        this.errorHandler.handleError(error)
      }
    })
    this.socketService.onCountUpdate().subscribe({
      next:(data:any)=>{
        this.excelProductFiles = this.excelProductFiles.map((file:any)=>{
          if(file.file_id == data.file_id){
            file.accepted_rows = data.accepted_rows
            file.total_rows = data.total_rows
          }
          return file
        })
      },error:(error:Error)=>{
        this.errorHandler.handleError(error)
      }
    })
    this.socketService.reportUpdate().subscribe({
      next:(data:any)=>{
        console.log(data.error_file[0].error_file)
        this.excelProductFiles = this.excelProductFiles.map((file:any)=>{
          if(file.file_id == data.file_id){
            file.error_file = data.error_file[0].error_file
          }
          return file
        })
      },error:(error:Error)=>{
        this.errorHandler.handleError(error)
      }
    })
  }

  fetchExcelProductFiles(){
    this.filesService.getExcelProductFiles().subscribe({
      next:(data:any)=>{
        this.excelProductFiles = data
      },error:(error:Error)=>{
        this.errorHandler.handleError(error)
      }
    })
  }

  changeToInventoryComponent(){
    this.toggler.emit("Inventory")
  }

  changeToCartComponent(){
    this.toggler.emit("Cart")
  }

}
