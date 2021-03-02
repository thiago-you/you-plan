import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from './../user.service';
import { PlanningService } from '../../planning/plannig.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  users = [];

  constructor(private userService: UserService, private planningService: PlanningService, private route: ActivatedRoute, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      
      if (id && id.trim().length > 0) {
        this.getPlanning(id);
      }
    });
  }

  getPlanning(id: string) {
    console.log(id)
    this.planningService.get(id).subscribe(planning => {
      this.users = planning.users || [];

      setTimeout(() => {
        this.getPlanning(id);  
      }, 2000);
    });
  }
}
