import { Component, OnInit } from '@angular/core';
import { ItemService } from './../item.service';
import { Item } from '../item';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-items-crud',
  templateUrl: './items-crud.component.html',
  styleUrls: ['./items-crud.component.scss']
})
export class ItemsCrudComponent implements OnInit {

  public item: Item = {
    id: null,
    name: ""
  }

  public dataSource: Item[];
  public items: Item[];

  public displayedColumns = ['id', 'name', 'action'];

  public formTitle: string = 'Novo Item';
  public formButtonLabel: string = 'Cadastrar';
  public action: string = 'create';

  constructor(private itemService: ItemService, private snackBar: MatSnackBar) { 

  }

  ngOnInit(): void {
    this.getItems();
  }

  getItems() {
    this.itemService.getAll().subscribe(items => {
      this.dataSource = items;
      this.items = [...this.dataSource];
    });
  }

  saveItem() {
    if (this.item.name == null || this.item.name.trim().length == 0) {
      this.showMessage('O nome do item é obrigatório!', 'danger');
    } else {
      if (this.item.id != null && this.item.id > 0) {
        this.itemService.update(this.item).subscribe(() => {
          this.resetItem();
          this.getItems();
  
          this.showMessage('Item alterado com sucesso!');
        });
      } else {
        this.itemService.create(this.item).subscribe(() => {
          this.resetItem();
          this.getItems();
  
          this.showMessage('Item cadastrado com sucesso!');
        });
      }
    }
  }

  setItemToUpdate(itemId: Number) {
    this.itemService.get(itemId).subscribe(item => {
      this.item = item;

      this.action = 'update';
      this.formTitle = 'Alterar Item';
      this.formButtonLabel = 'Alterar';
    });
  }
  
  deleteItem(itemId: Number) {
    this.itemService.delete(itemId).subscribe(() => {
      this.getItems();
      this.showMessage('Item deleetado com sucesso!');
    });
  }

  resetItem() {
    this.item = {
      id: null,
      name: ""
    };

    this.action = 'create';
    this.formTitle = 'Novo Item';
    this.formButtonLabel = 'Cadastrar';
  }

  filterList(value: string) {
    if (value.trim().length > 0) {
      this.items = this.dataSource.filter(item => {  
        return (item.name || '').toLocaleLowerCase().includes(value.trim().toLocaleLowerCase());
      });
    } else {
      this.items = [...this.dataSource];
    }
  }

  showMessage(msg: string, type: string = 'success'): void {
    let panelClass = 'blue-snackbar';
    
    if (type == 'danger' || type == 'red') {
      panelClass = 'red-snackbar';
    }

    this.snackBar.open(msg, '', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [ panelClass ]
    });
  }
}
