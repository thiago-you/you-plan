import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private route: ActivatedRoute, 
  ) {
    this.user = this.userStorage.user;
    this.plannings = [];
  }

  ngOnInit(): void {
    this.userStorage.value.subscribe(user => {
      this.user = user;
    });

    this.getPlannings();
  }

  private getPlannings() {
    this.planningService.getAll().subscribe(plannings => {
      this.plannings = plannings || [];

      setTimeout(() => {
        this.getPlannings();  
      }, 10000);
    });
  }
}
