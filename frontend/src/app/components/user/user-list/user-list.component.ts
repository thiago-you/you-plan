import { UserStorage } from './../user.storage';
import { ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanningService } from '../../planning/plannig.service';
import { User } from '../user';
import { PlanningItem } from '../../planning/planningItem';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  users = [];
  user: User;
  
  @Input() planningUser: User;
  @Input() action: any;
  
  @Output() planningUserEvent: EventEmitter<User>;
  @Output() planningConcludedEvent: EventEmitter<boolean>;

  votes: any = [];
  votesCount = 0;

  private plannigId: string;

  constructor(
    private userStorage: UserStorage, 
    private planningService: PlanningService, 
    private route: ActivatedRoute, 
    private snackBar: MatSnackBar,
  ) {
    this.user = this.userStorage.user;
    this.users = [];
    this.votes = [];

    this.action = {};
    this.planningUser = this.newUserInstance();

    this.planningUserEvent = new EventEmitter<User>()
    this.planningConcludedEvent = new EventEmitter<boolean>()
  }

  ngOnInit(): void {
    this.userStorage.value.subscribe(user => {
      this.user = user;  
    });

    this.route.params.subscribe(params => {
      this.plannigId = params['id'];
      
      if (this.plannigId && this.plannigId.trim().length > 0) {
        this.getUsers();
      }
    });
  }

  hasUser(): Boolean {
    let hasUser = false

    if (this.users.length > 0) {
      hasUser = this.users.filter(user => user.id == this.planningUser.id).length > 0;
    }

    return hasUser;
  }

  insertUser() {
    this.validateAdmin();
    
    this.planningService.createUser(this.plannigId, this.user).subscribe(user => {
      this.planningUser = user;      
      this.users.push(user);
      this.planningUserEvent.emit(user);

      this.showMessage("Você esta participando da planning!");
    });
  }

  removeUser(user: User) {
    if (user && user.id > 0) {
      this.users = this.users.filter(_user => _user.id != user.id);
      
      this.planningService.deleteUser(user.id).subscribe(() => {
        if (this.planningUser.id == user.id) {
          this.planningUser = this.newUserInstance();
          this.planningUserEvent.emit(this.planningUser);
        }
      });
    }
  }

  setAction(value: string) {
    this.action.value = value;
    this.planningService.setAction(this.action).subscribe();
    this.calculateVotes();

    if (value == '') {
      this.clearUsersVote();
    }
  }

  selectVote(vote: string) {
    this.planningService.getItems(this.plannigId).subscribe((items: PlanningItem[]) => {
      const item: PlanningItem = items.find((item: PlanningItem) => item.score?.length == 0)

      if (item && item.id > 0) {
        item.score = vote;
  
        const concluded = items.filter((item: PlanningItem) => !item.score || item.score?.length == 0).length == 0;

        if (concluded) {
          this.planningConcludedEvent.emit(true);
        }

        this.planningService.updateItem(item).subscribe(() => {
          this.showMessage('O estorie foi votado com sucesso!');
          this.setAction('');
          this.clearUsersVote();
        });
      }
    });
  }

  private clearUsersVote() {
    if (this.users && this.users.length > 0) {
      this.users.forEach((user: any) => {
        user.vote = '';

        if (user.id == this.planningUser.id) {
          this.planningUser.vote = '';
        }
      });

      const users = JSON.parse(JSON.stringify(this.users))

      users.forEach((user: any) => {
        this.planningService.updateUser(user).subscribe();
      });
    }
  }

  private getUsers() {
    this.planningService.getUsers(this.plannigId).subscribe(users => {
      this.users = users || [];

      this.users.forEach(user => {
        if (this.planningUser.id == user.id) {
          this.planningUser = user;
        }
      });

      if (this.users.filter(user => user.id == this.planningUser.id).length == 0) {
        this.planningUser = this.newUserInstance();
      }

      this.calculateVotes();

      setTimeout(() => {
        this.getUsers();  
      }, 5000);
    });
  }

  private newUserInstance(): User {
    return { id: null, name: "" };
  }
  
  private calculateVotes() {
    this.votes = [];

    if (this.action.value == 'flip') {
      this.votesCount = 0;

      this.votes = [
        {
          'vote': '0',
          'name': '0',
          'count': 0,
        },
        {
          'vote': '1',
          'name': '0',
          'count': 0,
        },
        {
          'vote': '2',
          'name': '2',
          'count': 0,
        },
        {
          'vote': '3',
          'name': '3',
          'count': 0,
        },
        {
          'vote': '5',
          'name': '5',
          'count': 0,
        },
        {
          'vote': '8',
          'name': '8',
          'count': 0,
        },
        {
          'vote': '13',
          'name': '13',
          'count': 0,
        },
        {
          'vote': '20',
          'name': '20',
          'count': 0,
        },
        {
          'vote': '?',
          'name': '?',
          'count': 0,
        },
        {
          'vote': 'coffee',
          'name': '☕',
          'count': 0,
        },
      ];

      this.users.forEach(user => {
        if (user.vote && user.vote != '') {

          this.votes.forEach((item: any) => {
            if (item.vote == user.vote) {
              item.count += 1;
              this.votesCount += 1;
            }
          });
        }
      });

      this.votes = this.votes.filter((item: any) => item.count > 0);
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

  private validateAdmin() {
    if (this.planningUser.id > 0 && this.planningUser.name) {
      if (!this.planningUser.admin) {
        if (this.planningUser.name.toLocaleLowerCase().includes("jonathan")) {
          this.planningUser.admin = true;
        } else if (this.planningUser.name.toLocaleLowerCase().includes("cleve")) {
          this.planningUser.admin = true;
        } else if (this.planningUser.name.toLocaleLowerCase().includes("dario")) {
          this.planningUser.admin = true;
        } else if (this.planningUser.name.toLocaleLowerCase().includes("jhow")) {
          this.planningUser.admin = true;
        } else if (this.planningUser.name.toLocaleLowerCase().includes("admin")) {
          this.planningUser.admin = true;
        } else if (this.planningUser.name.toLocaleLowerCase().includes("jonas")) {
          this.planningUser.admin = true;
        } else if (this.planningUser.name.toLocaleLowerCase().includes("you")) {
          this.planningUser.admin = true;
        }
      }
    }
  }
}
