import { ShoppingListService } from './../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';
import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe(
      'Tasty Schnitzel',
      'This is a super tasty Schnitzel - just awesome',
      'https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG',
      [new Ingredient('Meat', 1), new Ingredient('French fries', 15)]
    ),
    new Recipe(
      'Big tasty Cheeseburger',
      'This is a very tasty Cheeseburger - Very cheesy',
      'https://via.placeholder.com/600/771796',
      [new Ingredient('Cheese', 5), new Ingredient('Meat', 3)]
    ),
  ];

  recipeSelected = new EventEmitter<Recipe>();

  constructor(private shopListService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShopList(ingredients: Ingredient[]) {
    this.shopListService.addIngredients(ingredients);
  }
}
