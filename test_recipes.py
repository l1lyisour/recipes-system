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