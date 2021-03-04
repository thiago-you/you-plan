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
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.plannigId = params['id'];
      
      if (this.plannigId && this.plannigId.trim().length > 0) {
        this.getPlanning();
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
    this.planning.users = this.users;

    this.planningService.update(this.planning).subscribe(() => {
      this.showMessage("Você esta participando da planning!");
    });
  }

  exitUser() {
    this.users = this.users.filter(user => user.id != this.user.id);
    this.planning.users = this.users;

    this.planningService.update(this.planning);
  }

  private getPlanning() {
    this.planningService.get(this.plannigId).subscribe(planning => {
      this.planning = planning;
      this.users = planning.users || [];

      setTimeout(() => {
        this.getPlanning();  
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
