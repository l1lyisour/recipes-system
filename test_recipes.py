from main import Ingredient, Recipe, DietaryRecipe, ShoppingList
import pytest

@pytest.fixture
def strawberry():
    return Ingredient("Клубника", 200, "г")

def test_ing_unit(strawberry):
    assert strawberry.name == "Клубника"
    assert strawberry.quantity == 200.0
    assert strawberry.unit == "г"

def test_ing_str(strawberry):
    assert str(strawberry) == "Клубника: 200.0 г"

def test_ing_eq(strawberry):
    i2 = Ingredient("Клубника", 500, "г")
    i3 = Ingredient("Клубника", 200, "шт")
    
    assert strawberry == i2  
    assert strawberry != i3 

def test_ing_quantity(strawberry):
    with pytest.raises(ValueError):
        Ingredient("Клубника", -50, "г")

@pytest.fixture
def strawberry_milkshake():
    ingredients = [
        Ingredient("Клубника", 200, "г"),
        Ingredient("Молоко", 300, "мл"),
        Ingredient("Сахар", 50, "г")
    ]
    return Recipe("Клубничный милкшейк", ingredients)

def test_recipe_add_new(strawberry_milkshake):
    new_ing = Ingredient("Мороженое", 100, "г")
    strawberry_milkshake.add_ingredient(new_ing)
    
    assert len(strawberry_milkshake.ingredients) == 4
    assert new_ing in strawberry_milkshake.ingredients

def test_recipe_add_exist(strawberry_milkshake):
    new_ing = Ingredient("Клубника", 100, "г")
    strawberry_milkshake.add_ingredient(new_ing)
    
    assert len(strawberry_milkshake.ingredients) == 3
    for ing in strawberry_milkshake.ingredients:
        if ing.name == "Клубника":
            assert ing.quantity == 300.0

def test_recipe_scale(strawberry_milkshake):
    scaled = strawberry_milkshake.scale(2)
    assert len(scaled.ingredients) == 3
    for ing in scaled.ingredients:
        if ing.name == "Клубника":
            assert ing.quantity == 400.0
        elif ing.name == "Молоко":
            assert ing.quantity == 600.0
        elif ing.name == "Сахар":
            assert ing.quantity == 100.0

def test_recipe_scale_error(strawberry_milkshake):
    with pytest.raises(ValueError):
        strawberry_milkshake.scale(-1)

@pytest.fixture
def shopping_list():
    return ShoppingList()

def test_shopping_list_add_recipe(shopping_list, strawberry_milkshake):
    shopping_list.add_recipe(strawberry_milkshake, 2)
    items = shopping_list.get_list()
    assert len(items) == 3
    for item in items:
        if item[0].name == "Клубника":
            assert item[0].quantity == 400.0
        elif item[0].name == "Молоко":
            assert item[0].quantity == 600.0
        elif item[0].name == "Сахар":
            assert item[0].quantity == 100.0

def test_shopping_list_remove_recipe(shopping_list, strawberry_milkshake):
    shopping_list.add_recipe(strawberry_milkshake, 2)
    shopping_list.remove_recipe("Клубничный милкшейк")
    items = shopping_list.get_list()
    assert len(items) == 0

def test_shopping_list_get_list(shopping_list, strawberry_milkshake):
    shopping_list.add_recipe(strawberry_milkshake, 1)
    items = shopping_list.get_list()
    assert len(items) == 3
    for item in items:
        if item[0].name == "Клубника":
            assert item[0].quantity == 200.0
        elif item[0].name == "Молоко":
            assert item[0].quantity == 300.0
        elif item[0].name == "Сахар":
            assert item[0].quantity == 50.0
def test_shopping_list_add(shopping_list, strawberry_milkshake):
    with pytest.raises(ValueError):
        shopping_list.add_recipe(strawberry_milkshake, -1)