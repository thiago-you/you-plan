import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private route: ActivatedRoute) { 

    console.log('home')

    this.route.params.subscribe(params => {
      console.log(params)
    });

  }

  ngOnInit(): void {
  }

}
