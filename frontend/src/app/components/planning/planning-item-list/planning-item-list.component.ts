import { PlanningItem } from '../planningItem';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { PlanningService } from '../plannig.service';
import { UserStorage } from '../../user/user.storage';
import { User } from '../../user/user';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-planning-item-list',
  templateUrl: './planning-item-list.component.html',
  styleUrls: ['./planning-item-list.component.scss']
})
export class PlanningItemListComponent implements OnInit {

  user: User;
  vote: string;
  planningUser: User;

  items: any = [];

  estorie: PlanningItem = {
    id: null,
    planning: "",
    name: "",
    description: "",
    score: "",
  };

  private plannigId: string;

  constructor(
    private userStorage: UserStorage, 
    private planningService: PlanningService, 
    private route: ActivatedRoute, 
    private snackBar: MatSnackBar,
  ) {
    this.vote = "";
    this.user = this.userStorage.user;
    this.planningUser = this.newUserInstance();
  }

  ngOnInit(): void {
    this.userStorage.value.subscribe(user => {
      this.user = user;

      if (!this.user || this.user.id <= 0) {
        this.planningUser = this.newUserInstance();
      }
    });

    this.route.params.subscribe(params => {
      this.plannigId = params['id'];

      if (this.plannigId && this.plannigId.trim().length > 0) {
        this.getItems();
        this.validateUser();
      }
    });
  }

  setVote(vote: string) {
    if (this.planningUser.planning == this.plannigId && this.items && this.items.length > 0) {
      this.vote = this.vote == vote ? '' : vote;
      this.planningUser.vote = this.vote;
  
      this.planningService.updateUser(this.planningUser).subscribe();
    }
  }

  saveItem() {
    if (this.plannigId && this.plannigId.trim().length > 0) {
      if (this.estorie.name == null || this.estorie.name.trim().length == 0) {
        this.showMessage('O nome do estorie é obrigatório!', 'danger');
      } else {
        if (this.estorie.id != null && this.estorie.id > 0) {
          this.planningService.updateItem(this.estorie).subscribe(() => {
            this.resetItem();
            this.getItems();

            this.showMessage('Estorie alterada com sucesso!');
          });
        } else {
          this.planningService.createItem(this.plannigId, this.estorie).subscribe(() => {
            this.resetItem();
            this.getItems();

            this.showMessage('Estorie cadastrada com sucesso!');
          });
        }
      }
    }
  }

  editItem(item: PlanningItem) {
    this.estorie = {
      id: item.id,
      planning: item.planning,
      name: item.name,
      description: item.description,
      score: item.score,
    };
  }

  removeItem(item: PlanningItem) {
    this.items = this.items.filter((_item: PlanningItem) => _item.id != item.id);
    this.planningService.deleteItem(item.id).subscribe(() => {
      this.showMessage('Estorie deletado com sucesso!');
    });
  }

  clearItem(item: PlanningItem) {
    item.score = '';
    
    this.planningService.updateItem(item).subscribe(() => {
      this.getItems();
      this.showMessage('O voto da estorie foi removido com sucesso!');
    });
  }

  resetItem() {
    this.estorie = {
      id: null,
      planning: "",
      name: "",
      description: "",
      score: "",
    };
  }

  getScore(value: string = ''): string {
    let score = value || '';

    if (value == 'coffee') {
      score = '☕';
    }

    return score;    
  }

  private getItems() {
    this.planningService.getItems(this.plannigId).subscribe(items => {
      this.items = items || [];

      setTimeout(() => {
        this.getItems();  
      }, 5000);
    });
  }

  private validateUser() {
    this.planningService.findUser(this.plannigId, this.user.id).subscribe((users: User[]) => {
      this.vote = users[0]?.vote || '';
      this.planningUser = users[0] || this.newUserInstance();

      setTimeout(() => {
        this.validateUser();  
      }, 5000);
    });
  }

  private newUserInstance(): User {
    return { id: null, name: "" };
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
