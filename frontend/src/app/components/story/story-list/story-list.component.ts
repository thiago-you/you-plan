import { ActivatedRoute } from '@angular/router';
import { PlanningService } from './../../planning/plannig.service';
import { UserStorage } from './../../user/user.storage';
import { User } from './../../user/user';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss']
})
export class StoryListComponent implements OnInit {

  vote: string = ""
  user: User;

  private plannigId: string;

  constructor(
    private userStorage: UserStorage, 
    private planningService: PlanningService, 
    private route: ActivatedRoute, 
  ) {
    this.user = this.userStorage.user;

    this.userStorage.value.subscribe(user => {
      this.user = user;
      this.vote = user.vote || '';
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.plannigId = params['id'];
    });
  }

  setVote(vote: string) {
    if (this.user.planning == this.plannigId) {
      this.vote = this.vote == vote ? '' : vote;
      this.user.vote = this.vote;
  
      this.userStorage.user = this.user;
  
      this.planningService.updateUser(this.user).subscribe();
    }
  }
}
