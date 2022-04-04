import { SocketService } from 'src/app/services/socket.service';
import { ThemeStorage } from './../switch-theme/theme.storage';
import { PlanningItem } from './../planning/planningItem';
import { PlanningService } from './../planning/plannig.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
    selector: 'estories-upload-dialog',
    templateUrl: 'estories-upload-dialog.component.html',
    styleUrls: ['./base-dialog.component.scss']
})
export class EstoriesUploadDialogComponent implements OnInit {

    private hasFile: boolean = false;
    private uploadDone: boolean = false;

    fileContent: any = [];

    planningId: string;

    constructor(
        private overlayContainer: OverlayContainer,
        private themeStorage: ThemeStorage,
        private dialogRef: MatDialogRef<EstoriesUploadDialogComponent>,
        private planningService: PlanningService, 
        private snackBar: MatSnackBar,
        private socketService: SocketService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.planningId = '';
    }

    ngOnInit() {
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

    onFileChanged(event: any) {
        const selectedFile: File = event.target.files[0];

        const fileReader = new FileReader();

        fileReader.readAsText(selectedFile, 'UTF-8');

        fileReader.onload = () => {
            this.hasFile = true;

            if (typeof fileReader.result == 'string') {
                this.fileContent = JSON.parse(fileReader.result);
            }
        }

        fileReader.onerror = (error) => {
            this.fileContent = {};
            this.showMessage(error.toString(), 'danger');
        }
    }

    close() {
        this.dialogRef.close(true);
    }

    import() {
        if (!this.hasFile) {
            return;
        }

        if (this.fileContent == undefined || !Array.isArray(this.fileContent) || this.fileContent.length == 0) {
            this.showMessage('Nenhum arquivo válido foi carregado para importação!', 'danger');
        } else {
            this.hasFile = false;

            this.uploadItems(this.fileContent);

            this.fileContent = [];
        }
    }

    private uploadItems(items: PlanningItem[]) {
        if (items.length == 0) {
            if (!this.uploadDone) {
                this.uploadDone = true;
                this.showMessage('Importação realizada com sucesso!');
                this.socketService.fetchVotedItem();
                this.close();
            }

            return;
        }

        const _item = items[0];
        this.planningService.uploadItem(this.planningId, _item).subscribe(() => {
            this.uploadItems(items.filter(value => value != _item));
        });
    }

    private showMessage(msg: string, type: string = 'success'): void {
        let panelClass = 'blue-snackbar';
        
        if (type == 'danger' || type == 'red') {
          panelClass = 'red-snackbar';
        }
    
        this.snackBar.open(msg, '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: [ panelClass, 'custom-snackbar' ]
        });
    }
}