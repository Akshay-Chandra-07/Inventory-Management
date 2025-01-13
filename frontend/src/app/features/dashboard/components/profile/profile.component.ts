import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  data: any;
  profileImage: FormData | undefined;
  name: string = 'Akshay Chandra Bandi';
  username: string = 'akshay07';
  email: string = 'akshaybandi202@gmail.com';
  image: string = '../../../../../assets/images/Group.svg';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchUser();
  }

  uploadProfilePic = new FormGroup({
    profilePic: new FormControl(),
  });

  fetchUser() {
    this.data.name = 'Akshay Chandra Bandi';
    this.data.email = 'akshaybandi202@gmail.com';
    this.data.username = 'akshay07';
    this.data.image = '../../../../../assets/images/Group.svg';
  }

  changeProfilePic() {}

  onLogout() {}

  onFiles(event: Event) {
    this.profileImage = new FormData();
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.profileImage.append('picture', input.files[0]);
    }
  }

  onSubmitProfilePic() {}

  cancel() {
    this.uploadProfilePic.reset();
  }
}
