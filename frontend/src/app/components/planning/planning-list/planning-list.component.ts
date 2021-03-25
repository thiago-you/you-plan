import { Planning } from './../planning';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { UserStorage } from './../../user/user.storage';
import { PlanningService } from './../plannig.service';
import { User } from '../../user/user';

@Component({
  selector: 'app-planning-list',
  templateUrl: './planning-list.component.html',
  styleUrls: ['./planning-list.component.scss']
})
export class PlanningListComponent implements OnInit {

  user: User;
  plannings: Planning[];

  constructor(
    private userStorage: UserStorage, 
    private planningService: PlanningService,
    private snackBar: MatSnackBar,
  ) {
    this.user = this.userStorage.user;
    this.plannings = [];
  }

  ngOnInit(): void {
    this.userStorage.value.subscribe(user => {
      this.user = user;

      if (this.user && this.user.id > 0) {
        this.getPlannings();
      } else {
        this.plannings = [];
      }
    });

    this.getPlannings();
  }

  removeItem(item: Planning) {
    this.plannings = this.plannings.filter((_item: Planning) => _item.id != item.id);

    this.planningService.delete(item.id).subscribe(() => {
      this.showMessage('Planning deletada com sucesso!');
    });
  }

  private getPlannings() {
    if (this.user && this.user.id > 0) {
      this.planningService.getFromUser(this.user.id).subscribe(plannings => {
        this.plannings = plannings || [];
  
        setTimeout(() => {
          this.getPlannings();  
        }, 10000);
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
      verticalPosition: 'top',
      panelClass: [ panelClass ]
    });
  }
}
