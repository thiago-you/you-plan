import { Planning } from './../../components/planning/planning';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  planning: Planning;
  isSaved: Subject<void>;
  
  constructor() {
    this.isSaved = new Subject<void>();
    
    this.planning = {
      id: "",
      name: ""
    };
  }

  ngOnInit(): void {
  }

  receiveSaveEvent() {
    this.isSaved.next();
  }

  receiveEditEvent($event: Planning) {
    this.planning = JSON.parse(JSON.stringify($event));
  }
}
