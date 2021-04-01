import { ActivatedRoute } from '@angular/router';
import { PlanningService } from './../../components/planning/plannig.service';
import { UserStorage } from './../../components/user/user.storage';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/components/user/user';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {

  user: User;
  planningId: string;
  mode: string;

  /**
   * Child Events
   */
  planningUser: User;
  action: User;

  constructor(
    private userStorage: UserStorage, 
    private planningService: PlanningService,
    private route: ActivatedRoute, 
  ) {
    this.planningId = '';
    this.user = this.userStorage.user;
    this.planningUser = this.newUserInstance();
    this.mode = 'normal';
  }

  ngOnInit(): void { 
    if (this.user && this.user.id > 0) {
      this.route.params.subscribe(params => {
        this.planningId = params['id'];
        
        if (this.planningId && this.planningId.trim().length > 0) {
          this.findPlanningUser();
          this.getAction();
        }
      });
    }
  }

  receivePlanningUserEvent($event: User) {
    this.planningUser = $event;
  }

  toggleMode() {
    this.mode = this.mode == 'normal' ? 'simplified' : 'normal';
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
    this.planningService.getAction(this.planningId).subscribe(action => {
      this.action = action[0];

      setTimeout(() => {
        this.getAction();  
      }, 2000);
    });
  }
}
