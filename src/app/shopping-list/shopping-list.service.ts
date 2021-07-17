import { Ingredient } from './../shared/ingredient.model';
import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  private ingredients: Ingredient[] = [
    new Ingredient('Appels', 2),
    new Ingredient('Tomatoes', 6),
  ];

  ingredientsArrayChanged = new EventEmitter<Ingredient[]>();

  constructor() {}

  getIngredients() {
    return this.ingredients.slice();
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsArrayChanged.emit(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientsArrayChanged.emit(this.ingredients.slice());
  }
}
