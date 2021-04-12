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
  darkMode: boolean;
  
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
  ) {
    this.planningId = '';
    this.user = this.userStorage.user;
    this.planningUser = this.newUserInstance();
    this.action = {};
    this.uiMode = 'normal';
    this.darkMode = false;
  }

  ngOnInit(): void { 
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
  }

  receivePlanningUserEvent($event: User) {
    this.planningUser = $event;
  }

  receivePlanningConcludedEvent($event: boolean) {
    if (this.planning.concluded != $event) {
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

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
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
        }

        setTimeout(() => {
          this.findPlanningUser();  
        }, 10000);
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
      
      setTimeout(() => {
        this.getAction();  
      }, 2000);
    });
  }
}
