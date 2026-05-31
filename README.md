# Система управления рецептами

## Автор: Шакирова Лилия Денисовна, ТАДБ251

Это консольное приложение, которое позволяет создавать блюда, добавлять их в "рецепты", масштабировать порции и генерировать список покупок.

### Основные возможности:
1. Добавление и объединение ингредиентов в рецептах
2. Изменение количества порций в рецептах
3. Автоматическое формирование списка покупок с суммированием одинаковых ингредиентов

## Структура приложения:
1. `main.py` — реализация основных классов
2. `test_recipes.py` — тесты
3. `requirements.txt` — зависимости
4. `.gitignore` — исключения

## Установка, запуск и использование

```bash
# 1. Клонировать проект
git clone https://github.com/l1lyisour/recipes-system.git

# 2. Перейти в папку проекта
cd recipes-system

# 3. Установить зависимости
pip install -r requirements.txt

# 4. Запустить тесты
pytest -v

# 5. Использование

# Создание ингредиентов с использованием класса Ingredient
tomato = Ingredient("Помидор", 2, "шт")
cheese = Ingredient("Сыр", 150, "г")
flour = Ingredient("Мука", 300, "г")

# Создание рецепта с использованием класса Recipe
pizza = Recipe("Пицца", [flour, cheese, tomato])
# Масштабирование рецепта для 2 порций
scaled_pizza = pizza.scale(2)

# Изменение рецепта с использованием класса DietaryRecipe, который наследуется от Recipe
diet_pizza = DietaryRecipe("ПП Пицца", [flour, tomato], restricted_ingredient="Сыр")

# Создание списка покупок с использованием класса ShoppingList
shopping_list = ShoppingList()
# Добавление рецептов с список покупок
shopping_list.add_recipe(scaled_pizza, 1)
shopping_list.add_recipe(diet_pizza, 1)
# Получаем готовый список покупок с учетом одинаковых ингредиентов
total_shopping_list = shopping_list.get_list()