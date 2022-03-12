import { SocketService } from 'src/app/services/socket.service';
import { PlanningItem } from '../planningItem';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MatDialogState } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { PlanningService } from '../plannig.service';
import { User } from '../../user/user';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { VoteInfoDialogComponent } from '../../dialog/vote-info-dialog.component';
import { PlanningResumeDialogComponent } from '../../dialog/planing-resume-dialog.component';
import { Observable, Subscription } from 'rxjs';
import { EstoriesUploadDialogComponent } from '../../dialog/estories-upload-dialog.component';

@Component({
  selector: 'app-planning-item-list',
  templateUrl: './planning-item-list.component.html',
  styleUrls: ['./planning-item-list.component.scss']
})
export class PlanningItemListComponent implements OnInit, OnDestroy {

  items: any = [];

  private eventsSubscription: Subscription;

  @Input() planningUser: User;
  @Input() uiMode: string;
  @Input() planningConcluded: boolean;
  @Input() concludedEvent: Observable<void>;

  @Output() planningConcludedEvent: EventEmitter<boolean>;

  estorie: PlanningItem = {
    id: null,
    planning: "",
    name: "",
    description: "",
    score: "",
  };

  private planningId: string;
  private resumeDialogRef: MatDialogRef<PlanningResumeDialogComponent>;

  constructor(
    private planningService: PlanningService, 
    private route: ActivatedRoute, 
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private socketService: SocketService,
  ) {
    this.planningConcludedEvent = new EventEmitter<boolean>()
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.planningId = params['id'];

      if (this.planningId && this.planningId.trim().length > 0) {
        this.getItems();
      }
    });

    this.eventsSubscription = this.concludedEvent.subscribe(() => this.showConcludedDialog());

    this.setupListeners();
  }

  ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
  }

  setVote(vote: string) {
    if (this.planningUser.planning == this.planningId && this.items && this.items.length > 0) {
      this.planningUser.vote = this.planningUser.vote == vote ? '' : vote;

      this.planningService.updateUser(this.planningUser).subscribe(() => {
        this.socketService.fetchUsers();
        this.socketService.fetchPlanningUsers();
      });
    }
  }

  saveItem() {
    if (this.planningId && this.planningId.trim().length > 0) {
      if (this.estorie.name == null || this.estorie.name.trim().length == 0) {
        this.showMessage('O nome do estorie é obrigatório!', 'danger');
      } else {
        if (this.estorie.id != null && this.estorie.id > 0) {
          this.planningService.updateItem(this.estorie).subscribe(() => {
            this.resetItem();
            this.getItems();

            this.showMessage('Estorie alterada com sucesso!');
            this.socketService.fetchMessages('Um estorie foi alterado.');

            this.socketService.fetchItens();
          });
        } else {
          this.planningService.createItem(this.planningId, this.estorie).subscribe(() => {
            this.planningConcludedEvent.emit(false);

            this.resetItem();
            this.getItems();

            this.showMessage('Estorie cadastrada com sucesso!');
            this.socketService.fetchMessages('Um novo estorie foi cadastrado.');

            this.socketService.fetchItens();
          });
        }
      }
    }
  }

  editItem(item: PlanningItem) {
    this.estorie = {
      id: item.id,
      planning: item.planning,
      name: item.name,
      description: item.description,
      score: item.score,
    };
  }

  removeItem(item: PlanningItem) {
    this.items = this.items.filter((_item: PlanningItem) => _item.id != item.id);

    this.planningService.deleteItem(item.id).subscribe(() => {
      const concluded = this.items.filter((item: PlanningItem) => !item.score || item.score?.length == 0).length == 0;

      if (concluded) {
        this.planningConcludedEvent.emit(true);
      }

      this.showMessage('Estorie deletado com sucesso!');
      this.socketService.fetchMessages('Um estorie foi deletado.');

      this.socketService.fetchItens();
    });
  }

  clearItem(item: PlanningItem) {
    item.score = '';
    
    this.planningService.updateItem(item).subscribe(() => {
      this.planningConcludedEvent.emit(false);

      this.getItems();

      this.showMessage('O voto da estorie foi removido com sucesso!');
      this.socketService.fetchMessages('O voto de um estorie foi removido.');

      this.socketService.fetchItens();
    });
  }

  resetItem() {
    this.estorie = {
      id: null,
      planning: "",
      name: "",
      description: "",
      score: "",
    };
  }

  getScore(value: string = ''): string {
    let score = value || '';

    if (value == 'coffee') {
      score = '☕';
    }

    return score;    
  }

  showVotesInfo() {
    this.dialog.open(VoteInfoDialogComponent, {
      autoFocus: false,
    });
  }

  showConcludedDialog() {
    if(!this.resumeDialogRef || this.resumeDialogRef.getState() !== MatDialogState.OPEN) {
      this.planningService.getItems(this.planningId).subscribe(items => {
        if (items && items.length > 0) {
          this.items = items;

          this.resumeDialogRef = this.dialog.open(PlanningResumeDialogComponent, {
            autoFocus: false,
            data: {
              items: this.items,
              planningId: this.planningId,
            },
          });
        }
      });
    }
  }

  showUploadEstoriesDialog() {
    this.dialog.open(EstoriesUploadDialogComponent, {
      autoFocus: false,
      data: {
        planningId: this.planningId,
      },
    });
  }

  downloadJson() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.items));
    
    const dwldLink = document.createElement('a');
    dwldLink.setAttribute('href', dataStr);
    dwldLink.setAttribute('download', 'estories.json');
    dwldLink.style.visibility = 'hidden';
    
    document.body.appendChild(dwldLink);
    
    dwldLink.click();
  }

  private setupListeners() {
    this.socketService.onFetchItens().subscribe((data: any) => {
      this.getItems();
    });
  }

  private getItems() {
    this.planningService.getItems(this.planningId).subscribe(items => {
      this.items = items || [];

      const concluded = items.filter((item: PlanningItem) => !item.score || item.score?.length == 0).length == 0;

      if (concluded != this.planningConcluded) {
        this.planningConcludedEvent.emit(concluded);
      }
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
      panelClass: [ panelClass ]
    });
  }
}
