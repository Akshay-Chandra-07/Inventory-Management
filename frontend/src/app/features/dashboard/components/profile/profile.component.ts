import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { catchError, of } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userData: any | undefined;
  profileImage: any;
  name: string | undefined;
  image: string = '../../../../../assets/images/Group.svg';

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private toast: NgToastService,
    private errorHandler: ErrorHandlerService,
  ) {}

  ngOnInit(): void {
    this.fetchUser();
  }

  uploadProfilePic = new FormGroup({
    profilePic: new FormControl(),
  });

  fetchUser() {
    this.profileService
      .getUserData()
      .pipe(
        catchError((error) => {
          this.errorHandler.handleError(error);
          sessionStorage.clear();
          this.router.navigateByUrl('auth/login');
          return of();
        }),
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.userData = data.user[0];
          this.name = this.userData.first_name + ' ' + this.userData.last_name;
        },
        error: (error) => {
          this.errorHandler.handleError(error);
        },
      });
  }

  onLogout() {
    sessionStorage.removeItem('accesstoken');
    sessionStorage.removeItem('refreshtoken');
    this.router.navigateByUrl('/auth/login');
  }

  onImageFiles(event: Event) {
    const validFiletypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    const input = event.target as HTMLInputElement;
    if (input.files && validFiletypes.includes(input.files[0].type)) {
      this.profileImage = input.files[0];
    } else {
      input.value = '';
      this.toast.warning({
        detail: 'Only accepts .jpeg .jpg .png .svg files',
        duration: 2000,
      });
    }
  }

  onSubmitProfilePic() {
    const fileName = this.profileImage.name.replace(/\s+/g, '');
    const fileType = this.profileImage.type;

    this.profileService
      .getPresignedUrl(fileName, fileType)
      .pipe()
      .subscribe({
        next: (data1: any) => {
          this.profileService
            .uploadToUrl(this.profileImage, data1.url)
            .pipe()
            .subscribe({
              next: (data2: any) => {
                const url = data1.fileKey;
                console.log(url);
                this.profileService.uploadProfileUrlToServer(url).subscribe({
                  next: (data3: any) => {
                    console.log(data3);
                    this.toast.success({ detail: data3.msg });
                    this.fetchUser();
                  },
                  error: (error) => {
                    this.errorHandler.handleError(error);
                    this.toast.error({ detail: error.error.msg });
                  },
                });
              },
              error: (error) => {
                this.errorHandler.handleError(error);
              },
            });
        },
        error: (error) => {
          this.errorHandler.handleError(error);
        },
      });
  }

  cancel() {
    this.uploadProfilePic.reset();
  }
}
