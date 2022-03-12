import { ThemeStorage } from './../switch-theme/theme.storage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
    selector: 'planning-resume-dialog',
    templateUrl: 'planning-resume-dialog.component.html',
    styleUrls: ['./base-dialog.component.scss']
})
export class PlanningResumeDialogComponent implements OnInit {

    planningId: string;
    items: any;

    constructor(
        private overlayContainer: OverlayContainer,
        private themeStorage: ThemeStorage,
        private dialogRef: MatDialogRef<PlanningResumeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.items = [];
        this.planningId = '';
    }

    ngOnInit() {
        this.items = this.data.items || [];
        this.planningId = this.data.planningId || '';

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

    export() {
        let filename = 'planning';

        if (this.planningId && this.planningId.trim().length > 0) {
            filename = `planning-${this.planningId}`;
        }

        this.downloadFile(this.items, filename);
    }

    getScore(value: string = ''): string {
        let score = value || '';
    
        if (value == 'coffee') {
          score = '☕';
        }
        if (value.trim().length == 0) {
            score = 'Pendente';
        }

        return score;    
    }

    private convertToCSV(objArray: any, headerList: any) {
        const array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

        let str = '';
        let row = '#,';

        let newHeaders = ["Name", "Description", "Score"];

        for (let index in newHeaders) {
            row += newHeaders[index] + ',';
        }

        row = row.slice(0, -1);
        str += row + '\r\n';
        
        for (let i = 0; i < array.length; i++) {
            let line = (i + 1) + '';
            
            for (let index in headerList) {
                let head = headerList[index];
                line += ',' + array[i][head];
            }

            str += line + '\r\n';
        }

        return str;
    }

    private downloadFile(data: any, filename = 'planning') {
        data = data.map((item: any) => {
            delete item['id'];
            delete item['planning'];

            return item;
        });

        const csvData = this.convertToCSV(data, ['name', 'description', 'score']);
        const blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
        const dwldLink = document.createElement("a");
        const url = URL.createObjectURL(blob);
        
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", filename + ".csv");
        dwldLink.style.visibility = "hidden";
        
        document.body.appendChild(dwldLink);
        
        dwldLink.click();
        
        document.body.removeChild(dwldLink);
    }

    strRep(data: any) {
        if (typeof data == "string") {
            return data.replace(/,/g, " ");
        }
        
        if (typeof data == "undefined") {
            return "-";
        }
        
        if (typeof data == "number") {
            return  data.toString();
        }

        return data;
    }
}