import { UserStorage } from './../user.storage';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanningService } from '../../planning/plannig.service';
import { User } from '../user';
import { Planning } from '../../planning/planning';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  users = [];
  user: User;

  private planning: Planning;
  private plannigId: string;

  constructor(
    private userStorage: UserStorage, 
    private planningService: PlanningService, 
    private route: ActivatedRoute, 
    private snackBar: MatSnackBar
  ) {
    this.user = this.userStorage.user;

    this.userStorage.value.subscribe(user => {
      this.user = user;  
      
      if (this.plannigId == this.user.planning && this.users.length > 0) {
        this.users.forEach(user => {
          if (this.user.id == user.id) {
            user.vote = this.user.vote;
          }
        })
      }
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.plannigId = params['id'];
      
      if (this.plannigId && this.plannigId.trim().length > 0) {
        this.getUsers();
      }
    });
  }

  hasUser(): Boolean {
    let hasUser = false

    if (this.users.length > 0) {
      hasUser = this.users.filter(user => user.id == this.user.id).length > 0;
    }

    return hasUser;
  }

  insertUser() {
    this.validateAdmin();

    this.users.push(this.user);
  
    this.planningService.createUser(this.plannigId, this.user).subscribe(() => {
      this.showMessage("Você esta participando da planning!");
    });
  }

  removeUser(user: User) {
    this.users = this.users.filter(_user => _user.id != user.id);
    
    if (user.id == this.user.id) {
      this.user.planning = '';
      this.userStorage.user = this.user;
    }

    this.planningService.deleteUser(user.id).subscribe(() => {
      if (this.user.id == user.id) {
        this.user.admin = false;
      }
    });
  }

  // private getPlanning() {
  //   this.planningService.get(this.plannigId).subscribe(planning => {
  //     this.planning = planning;
  //     this.users = planning.users || [];

  //     this.users.forEach(user => {
  //       if (this.user.id == user.id) {
  //         this.user.admin = user.admin;
  //       }
  //     });

  //     setTimeout(() => {
  //       this.getPlanning();  
  //     }, 2000);
  //   });
  // }

  private getUsers() {
    this.planningService.getUsers(this.plannigId).subscribe(users => {
      this.users = users || [];

      this.users.forEach(user => {
        if (this.user.id == user.id) {
          this.user.admin = user.admin;
          this.userStorage.user = this.user;
        }
      });

      if (this.users.filter(user => user.id == this.user.id).length == 0) {
        this.user.planning = '';
        this.userStorage.user = this.user;
      }

      setTimeout(() => {
        this.getUsers();  
      }, 2000);
    });
  }

  private showMessage(msg: string, type: string = 'success'): void {
    let panelClass = 'blue-snackbar';
    
    if (type == 'danger' || type == 'red') {
      panelClass = 'red-snackbar';
    }

    this.snackBar.open(msg, '', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [ panelClass, 'custom-snackbar' ]
    });
  }

  private validateAdmin() {
    if (this.user.id > 0 && this.user.name) {
      if (this.user.name.toLocaleLowerCase().includes("jonathan")) {
        this.user.admin = true;
      } else if (this.user.name.toLocaleLowerCase().includes("cleve")) {
        this.user.admin = true;
      } else if (this.user.name.toLocaleLowerCase().includes("dario")) {
        this.user.admin = true;
      } else if (this.user.name.toLocaleLowerCase().includes("jhow")) {
        this.user.admin = true;
      } else if (this.user.name.toLocaleLowerCase().includes("admin")) {
        this.user.admin = true;
      } else if (this.user.name.toLocaleLowerCase().includes("jonas")) {
        this.user.admin = true;
      } else if (this.user.name.toLocaleLowerCase().includes("you")) {
        this.user.admin = true;
      }
    }
  }
}
