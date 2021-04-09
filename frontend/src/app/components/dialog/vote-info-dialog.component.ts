import { MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/core';

@Component({
    selector: 'vote-info-dialog',
    templateUrl: 'vote-info-dialog.component.html',
    styleUrls: ['./base-dialog.component.scss']
})
export class VoteInfoDialogComponent {

    constructor(private dialogRef: MatDialogRef<VoteInfoDialogComponent>) {}

    close() {
        this.dialogRef.close(true);
    }
}