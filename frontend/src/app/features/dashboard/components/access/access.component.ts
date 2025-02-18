import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CryptoService } from 'src/app/core/services/crypto.service';
import { AccessService } from '../../services/access.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.css']
})
export class AccessComponent implements OnInit {

  role:number | undefined;
  locationUsers:any;
  @Input() allowedFeatures:any
  @Input() allFeatures:any
  @Output() toggler = new EventEmitter<string>();

  constructor(
    private cryptoService:CryptoService,
    private accessService:AccessService,
    private errorService:ErrorHandlerService
  ) { }

  ngOnInit(): void {
    this.role = this.cryptoService.getRole()['role']
    this.getAllUsersFromLocation()
  }

  changeToInventoryComponent(){
    this.toggler.emit("Inventory")
  }

  changeToCartComponent(){
    this.toggler.emit("Cart")
  }

  changeToChatsComponent(){
    this.toggler.emit("Chats")
  }

  changeToExcelFilesComponent(){
    this.toggler.emit("Files")
  }

  getAllUsersFromLocation(){
    this.accessService.getAllUsersFromLocation().subscribe({
      next:(data:any)=>{
        console.log(data)
        this.locationUsers = data
      },error:(error:Error)=>{
        this.errorService.handleError(error)
      }
    })
  }

  onRemoveUserFeature(feature_id:number,user_id:number,i:number){
    this.accessService.removeUserFeature(feature_id,user_id).subscribe({
      next:(data:any)=>{
        console.log(data)
        this.locationUsers[i].feature_ids = this.locationUsers[i].feature_ids.filter((id:any)=>{
          if(id!=feature_id){
            return true
          }else{
            return false
          }
        })
      },error:(error:Error)=>{
        this.errorService.handleError(error)
      }
    })
  }
  onAddUserFeature(feature_id:number,user_id:number,i:number){
    this.accessService.addUserFeature(feature_id,user_id).subscribe({
      next:(data:any)=>{
        console.log(data)
        this.locationUsers[i].feature_ids.push(feature_id)
      },error:(error:Error)=>{
        this.errorService.handleError(error)
      } 
    })
  }

}
