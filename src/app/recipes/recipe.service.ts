import { ShoppingListService } from './../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

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
      'data:image/jpeg;base64,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',
      [new Ingredient('Cheese', 5), new Ingredient('Meat', 3)]
    ),
  ];

  recipesArraySubject = new Subject<Recipe[]>();

  constructor(private shopListService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesArraySubject.next(this.getRecipes());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesArraySubject.next(this.getRecipes());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesArraySubject.next(this.getRecipes());
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesArraySubject.next(this.getRecipes());
  }

  addIngredientsToShopList(ingredients: Ingredient[]) {
    this.shopListService.addIngredients(ingredients);
  }
}
