import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/template/header/header.component';

import { FooterComponent } from './components/template/footer/footer.component';
import { HomeComponent } from './views/home/home.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion'; 
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; 
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { PlanningItemListComponent } from './components/planning/planning-item-list/planning-item-list.component';
import { PlanningComponent } from './views/planning/planning.component';
import { PlanningListComponent } from './components/planning/planning-list/planning-list.component';
import { PlanningCreateComponent } from './components/planning/planning-create/planning-create.component';
import { VoteInfoDialogComponent } from './components/dialog/vote-info-dialog.component';
import { PlanningResumeDialogComponent } from './components/dialog/planing-resume-dialog.component';
import { EstoriesUploadDialogComponent } from './components/dialog/estories-upload-dialog.component';
import { SwitchThemeComponent } from './components/switch-theme/switch-theme.component';

import { environment } from 'src/environments/environment';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = {
  url: environment.socket,
	options: {
		transports: ['websocket']
	}
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    UserListComponent,
    PlanningItemListComponent,
    PlanningComponent,
    PlanningListComponent,
    PlanningCreateComponent,
    VoteInfoDialogComponent,
    PlanningResumeDialogComponent,
    EstoriesUploadDialogComponent,
    SwitchThemeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
