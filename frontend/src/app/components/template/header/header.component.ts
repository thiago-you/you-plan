import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from './../../user/user.service';
import { UserStorage } from './../../user/user.storage';
import { Component, OnInit } from '@angular/core';
import { User } from '../../user/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user: User;
  isLoadingUser: boolean;
  public version = 'v2.1';
  
  constructor(private userStorage: UserStorage, private userService: UserService, private snackBar: MatSnackBar) { 
    this.isLoadingUser = false;
    this.user = this.userStorage.user;

    this.userStorage.value.subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit(): void {
    // revalidate logged user
    if (this.user && this.user.id != null) {
      this.isLoadingUser = true;
      
      this.userService.find(this.user.name).subscribe(users => {
        if (users.length > 0) {
          this.userStorage.user = users[0];
          this.isLoadingUser = false;
        } else {
          this.userService.create(this.user).subscribe(user => {
            this.userStorage.user = user;
            this.isLoadingUser = false;
          });
        }
      });
    }
  }

  logout() {
    this.userStorage.clear();
  }

  login() {
    if (this.user.name && this.user.name.trim().length > 0) {
      this.user.name = this.user.name.toLocaleLowerCase();

      this.userService.find(this.user.name).subscribe(users => {
        if (users.length > 0) {
          this.userStorage.user = users[0];
        } else {
          this.userService.create(this.user).subscribe(user => {
            this.userStorage.user = user;
          });
        }

        this.showMessage("O login foi realizado com sucesso!");
      });
    }
  }

  private showMessage(msg: string, type: string = 'success'): void {
    let panelClass = 'blue-snackbar';
    
    if (type == 'danger' || type == 'red') {
      panelClass = 'red-snackbar';
    }

    this.snackBar.open(msg, '', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: [ panelClass, 'custom-snackbar' ]
    });
  }
}
