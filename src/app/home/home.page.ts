import { Component, OnInit } from '@angular/core';
import {
  collectionData,
  collection,
  query,
  Firestore,
} from '@angular/fire/firestore';
import { first } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public foodList: any[];
  public foodListBackup: any[];

  constructor(private readonly firestore: Firestore) {}

  async ngOnInit() {
    this.foodList = await this.initializeItems();
  }

  async initializeItems(): Promise<any> {
    const foodListQuery = query(collection(this.firestore, 'foodList'));

    const foodList: any[] = await lastValueFrom(
      collectionData(foodListQuery).pipe(first())
    );

    this.foodListBackup = foodList;
    return foodList;
  }

  async filterList(evt) {
    this.foodList = this.foodListBackup;
    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.foodList = this.foodList.filter((currentFood) => {
      if (currentFood.name && searchTerm) {
        return currentFood.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      }
    });
  }
}
