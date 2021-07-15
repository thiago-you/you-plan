import { Component } from '@angular/core';
import { ThemeStorage } from './components/switch-theme/theme.storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  title: string;
  isDarkTheme: boolean

  constructor(private themeStorage: ThemeStorage) { 
    this.title = 'frontend';
    this.isDarkTheme = this.themeStorage.isDarkTheme();
  }

  ngOnInit(): void {
    this.themeStorage.value.subscribe(theme => {
      this.isDarkTheme = theme == 'dark';

      console.log('is dark: ' + this.isDarkTheme ? 'true' : 'false')
    });
  }
}
