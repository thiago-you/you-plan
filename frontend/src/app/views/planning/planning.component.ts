import { MatSnackBar } from '@angular/material/snack-bar';
import { SocketService } from 'src/app/services/socket.service';
import { Planning } from './../../components/planning/planning';
import { ActivatedRoute } from '@angular/router';
import { PlanningService } from './../../components/planning/plannig.service';
import { UserStorage } from './../../components/user/user.storage';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/components/user/user';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {

  planningId: string;
  planning: Planning;

  user: User;

  uiMode: string;
  
  /**
   * Child Events
   */
  planningUser: User;
  action: any;
  concludedEvent: Subject<void> = new Subject<void>();

  constructor(
    private userStorage: UserStorage, 
    private planningService: PlanningService,
    private route: ActivatedRoute, 
    private snackBar: MatSnackBar,
    private socketService: SocketService,
  ) {
    this.planningId = '';
    this.user = this.userStorage.user;
    this.planningUser = this.newUserInstance();
    this.action = {};
    this.uiMode = 'normal';
  }

  ngOnInit(): void { 
    if (this.planningUser && this.planningUser.id > 0) {
      this.socketService.connectUser(this.planningUser.id.toString());
    }

    this.userStorage.value.subscribe(user => {
      this.user = user;

      if (this.user && this.user.id > 0) {

        if (this.planningId && this.planningId.trim().length > 0) {
          this.findPlanningUser();
        }
      } else {
        this.planningUser = this.newUserInstance();
      }
    });

    this.route.params.subscribe(params => {
      this.planningId = params['id'];
      
      if (this.planningId && this.planningId.trim().length > 0) {
        this.getPlanning();

        if (this.user && this.user.id > 0) {
          this.findPlanningUser();
          this.getAction();
        }
      }
    });

    this.setupListeners();
  }

  receivePlanningUserEvent($event: User) {
    this.planningUser = $event;
  }

  receivePlanningConcludedEvent($event: boolean) {
    if (this.planning) {
      this.planning.concluded = $event;
  
      this.planningService.update(this.planning).subscribe(() => {
        if ($event) {
          this.concludedEvent.next();
        }
      });
    }
  }

  toggleUiMode() {
    this.uiMode = this.uiMode == 'normal' ? 'simplified' : 'normal';
  }

  private setupListeners() {
    this.socketService.onFetchActions().subscribe(() => {
        this.getAction();
    });

    this.socketService.onFetchMessages().subscribe((message: string) => {
      this.showMessage(message);
    });
  }
  
  private getPlanning() {
    this.planningService.get(this.planningId).subscribe((planning: Planning) => {
      this.planning = planning;
    });
  }

  private findPlanningUser() {
    if (this.user && this.user.id > 0) {
      this.planningService.findUser(this.planningId, this.user.id).subscribe((users: User[]) => {
        if (users.length > 0) {
          this.planningUser = users[0] || this.newUserInstance();
          this.socketService.connectUser(this.planningUser.id.toString());
        }
      });
    }
  }

  private newUserInstance(): User {
    return { id: null, name: "" };
  }

  private getAction() {
    this.planningService.getAction(this.planningId).subscribe(actions => {
      if (actions && actions.length > 0) {
        this.action = actions[0];
      } else {
        this.planningService.createAction(this.planningId).subscribe((action: any) => {
          this.action = action;
        });
      }
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
      verticalPosition: 'bottom',
      panelClass: [ panelClass ]
    });
  }
}
