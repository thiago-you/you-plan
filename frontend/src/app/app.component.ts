import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  title: string;
  isDarkTheme: boolean

  constructor() { 
    this.title = 'frontend';
    this.isDarkTheme = false;
  }

  ngOnInit(): void {
    this.isDarkTheme = localStorage.getItem('theme') == 'dark';
  }
}
