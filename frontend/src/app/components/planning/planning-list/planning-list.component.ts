import { Component, OnInit } from '@angular/core';
import { UserStorage } from './../../user/user.storage';
import { PlanningService } from './../plannig.service';
import { User } from '../../user/user';
import { Planning } from '../planning';

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
}
