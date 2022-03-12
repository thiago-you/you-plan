import { ThemeStorage } from './../switch-theme/theme.storage';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
    selector: 'vote-info-dialog',
    templateUrl: 'vote-info-dialog.component.html',
    styleUrls: ['./base-dialog.component.scss']
})
export class VoteInfoDialogComponent implements OnInit {

    constructor(
        private overlayContainer: OverlayContainer,
        private themeStorage: ThemeStorage,
        private dialogRef: MatDialogRef<VoteInfoDialogComponent>
    ) {}

    ngOnInit() {
        if (this.themeStorage.isDarkTheme()) {
            this.overlayContainer.getContainerElement().classList.add('app-dark-theme');
        }

        this.themeStorage.value.subscribe(theme => {
            if (theme == 'dark') {
                this.overlayContainer.getContainerElement().classList.add('app-dark-theme');
            } else {
                this.overlayContainer.getContainerElement().classList.remove('app-dark-theme');
            }
        });
    }

    close() {
        this.dialogRef.close(true);
    }
}