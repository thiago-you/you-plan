import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
    selector: 'planning-resume-dialog',
    templateUrl: 'planning-resume-dialog.component.html',
    styleUrls: ['./base-dialog.component.scss']
})
export class PlanningResumeDialogComponent implements OnInit {

    items: any;

    constructor(
        private dialogRef: MatDialogRef<PlanningResumeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.items = [];
    }

    ngOnInit() {
        this.items = this.data.items || [];
    }

    close() {
        this.dialogRef.close(true);
    }

    getScore(value: string = ''): string {
        let score = value || '';
    
        if (value == 'coffee') {
          score = '☕';
        }
    
        return score;    
      }
}