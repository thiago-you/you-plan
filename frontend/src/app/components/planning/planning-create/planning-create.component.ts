import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanningService } from './../plannig.service';
import { UserStorage } from './../../user/user.storage';
import { Planning } from './../planning';
import { Component, OnInit } from '@angular/core';
import { User } from '../../user/user';

@Component({
  selector: 'app-planning-create',
  templateUrl: './planning-create.component.html',
  styleUrls: ['./planning-create.component.scss']
})
export class PlanningCreateComponent implements OnInit {

  user: User;

  planning: Planning = {
    id: "",
    name: ""
  };

  constructor(
    private userStorage: UserStorage, 
    private planningService: PlanningService, 
    private snackBar: MatSnackBar,
  ) {
    this.user = this.userStorage.user;
  }

  ngOnInit(): void {
    this.userStorage.value.subscribe(user => {
      this.user = user;
    });
  }

  saveItem() {
    if (this.user && this.user.id > 0) {
      if (this.planning.name == null || this.planning.name.trim().length == 0) {
        this.showMessage('O nome da planning é obrigatório!', 'danger');
      } else {
        if (this.planning.id != null && this.planning.id.trim().length > 0) {
          this.planningService.update(this.planning).subscribe(() => {
            this.resetItem();
            this.showMessage('Planning alterada com sucesso!');
          });
        } else {
          this.planning.created_by = this.user.id as number;

          this.planningService.create(this.planning).subscribe(() => {
            this.resetItem();
            this.showMessage('Planning cadastrada com sucesso!');
          });
        }
      }
    }
  }

  editItem(item: Planning) {
    this.planning = {
      id: item.id,
      name: item.name,
      concluded: item.concluded,
      created_by: item.created_by,
    };
  }

  resetItem() {
    this.planning = {
      id: null,
      name: "",
      concluded: "",
      created_by: null,
    };
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
