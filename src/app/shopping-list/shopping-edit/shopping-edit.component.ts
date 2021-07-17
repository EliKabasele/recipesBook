import { ShoppingListService } from './../shopping-list.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss'],
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('nameInput', { static: true }) nameIpt: ElementRef;
  @ViewChild('amountInput', { static: true }) amountIpt: ElementRef;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {}

  onAddItem() {
    const ingredientName = this.nameIpt.nativeElement.value;
    const ingredientAmount = this.amountIpt.nativeElement.value;
    const newIngredient = new Ingredient(ingredientName, ingredientAmount);

    this.shoppingListService.addIngredient(newIngredient);
  }
}
