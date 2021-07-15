import { Component, OnInit } from '@angular/core';
import { ThemeStorage } from './theme.storage';

@Component({
  selector: 'app-switch-theme',
  templateUrl: './switch-theme.component.html',
  styleUrls: ['./switch-theme.component.scss']
})
export class SwitchThemeComponent implements OnInit {

  isDarkTheme: boolean

  constructor(private themeStorage: ThemeStorage) { 
    this.isDarkTheme = this.themeStorage.isDarkTheme();
  }

  ngOnInit(): void { }

  storeThemeSelection() {
    this.themeStorage.theme = this.isDarkTheme ? 'dark': 'light';
  }
}
