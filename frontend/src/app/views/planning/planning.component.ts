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

  constructor(
    private userStorage: UserStorage, 
    private planningService: PlanningService,
    private route: ActivatedRoute, 
  ) {
    this.user = this.userStorage.user;
  }

  ngOnInit(): void { 
    if (this.user && this.user.id > 0) {
      this.route.params.subscribe(params => {
        const plannigId = params['id'];
        
        if (plannigId && plannigId.trim().length > 0) {
          this.planningService.findUser(plannigId, this.user.id).subscribe((users: User[]) => {
            if (users.length > 0) {
              this.user.planning = users[0].planning;
              this.user.vote = users[0].vote;
              this.userStorage.user = this.user;
            }
          });
        }
      });
    }
  }
}
