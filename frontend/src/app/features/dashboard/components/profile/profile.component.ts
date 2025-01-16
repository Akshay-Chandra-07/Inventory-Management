import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userData: any | undefined;
  profileImage: any;
  name: string | undefined;
  // username: string = 'akshay07';
  // email: string = 'akshaybandi202@gmail.com';
  image: string = '../../../../../assets/images/Group.svg';

  constructor(
    private router: Router,
    private profileService: ProfileService,
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
      .pipe()
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.userData = data.user[0];
          this.name = this.userData.first_name + ' ' + this.userData.last_name;
        },
        error(error) {
          console.log(error);
        },
      });
  }

  changeProfilePic() {}

  onLogout() {
    sessionStorage.removeItem('accesstoken');
    sessionStorage.removeItem('refreshtoken');
    this.router.navigateByUrl('/auth/login');
  }

  onFiles(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.profileImage = input.files[0];
    }
  }

  onSubmitProfilePic() {
    const fileName = this.profileImage.name.replace(/\s+/g, '');
    const fileType = this.profileImage.type;

    // this.profileService.uploadProfilePicture(this.profileImage!).subscribe({
    //   next:(data:any)=>{
    //     console.log(data);
    //     this.fetchUser();
    //   },
    //   error(error){
    //     console.log(error);
    //   }
    // })

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
                    this.fetchUser();
                  },
                  error(error) {
                    console.log(error);
                  },
                });
              },
              error(error) {
                console.log(error);
              },
            });
        },
        error(error) {
          console.log(error);
        },
      });
  }

  cancel() {
    this.uploadProfilePic.reset();
  }
}
