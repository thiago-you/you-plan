import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-switch-theme',
  templateUrl: './switch-theme.component.html',
  styleUrls: ['./switch-theme.component.scss']
})
export class SwitchThemeComponent implements OnInit {

  isDarkTheme: boolean

  constructor() { 
    this.isDarkTheme = false;
  }

  ngOnInit(): void {
    this.isDarkTheme = localStorage.getItem('theme') == 'dark';
  }

  storeThemeSelection() {
    localStorage.setItem('theme', this.isDarkTheme ? 'dark': 'light');
  }
}
