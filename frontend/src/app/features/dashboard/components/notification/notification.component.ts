import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  userNotifications:any = []
  constructor(
    private notificationService:NotificationService,
    private errorService:ErrorHandlerService,
    private socketService:SocketService,
    private toast:NgToastService
  ) { }

  ngOnInit(): void {
    this.fetchUserNotifications()
    this.socketService.onNotification().subscribe({
      next:(data:any)=>{
        this.userNotifications.push(data[0])
        this.toast.info({detail:data[0].message,duration:2000})
      },error:(error:Error)=>{
        this.errorService.handleError(error)
      }
    })
  }

  fetchUserNotifications(){
    this.notificationService.getUserNotifications().subscribe({
      next:(data:any)=>{
        if(data){
          this.userNotifications = data
        }
      },error:(error:Error)=>{
        this.errorService.handleError(error)
      }
    })
  }

  onClick(id:any){
    this.notificationService.updateNotificationStatus(id).subscribe({
      next:(data:any)=>{
        this.userNotifications = this.userNotifications.map((notification:any)=>{
          if(notification.notification_id == id){
            notification.status = "2"
          }
          return notification
        })
      },error:(error:Error)=>{
        this.errorService.handleError(error)
      }
    })
  }
}
