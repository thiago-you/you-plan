import { MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/core';

@Component({
    selector: 'planning-resume-dialog',
    templateUrl: 'planning-resume-dialog.component.html',
    styleUrls: ['./base-dialog.component.scss']
})
export class PlanningResumeDialogComponent {

    constructor(private dialogRef: MatDialogRef<PlanningResumeDialogComponent>) {}

    close() {
        this.dialogRef.close(true);
    }
}