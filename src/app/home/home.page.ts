import { Component, OnInit } from '@angular/core';
import {
  collectionData,
  collection,
  query,
  Firestore,
} from '@angular/fire/firestore';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public searchField: FormControl;

  public foodList$: Observable<FoodItem[]>;

  constructor(private readonly firestore: Firestore) {
    this.searchField = new FormControl('');
  }

  async ngOnInit() {
    const searchTerm$ = this.searchField.valueChanges.pipe(
      startWith(this.searchField.value)
    );

    const foodList$ = collectionData(
      query(collection(this.firestore, 'foodList'))
    ) as Observable<FoodItem[]>;

    this.foodList$ = combineLatest([foodList$, searchTerm$]).pipe(
      map(([foodList, searchTerm]) =>
        foodList.filter(
          (foodItem) =>
            searchTerm === '' ||
            foodItem.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }
}

interface FoodItem {
  name: string;
}
