class Ingredient:
    def __init__(self,name,quantity,unit):
        self.name = name
        self.quantity = quantity
        self.unit = unit
    
    @property
    def quantity(self):
        return self._quantity
    
    @quantity.setter
    def quantity(self,value):
        try:
            value = float(value)
        except (TypeError,ValueError):
            raise ValueError('Количество должно быть положительным')
        if value <= 0:
            raise ValueError('Количество должно быть положительным')
        self._quantity = value

    def __str__(self):
        return f'{self.name}: {self.quantity} {self.unit}'
    
    def __repr__(self):
        return f"Ingredient('{self.name}', {self.quantity}, '{self.unit}')"
        
    def __eq__(self,other):
        if not isinstance(other,Ingredient):
            return False
        return self.name == other.name and self.unit == other.unit

class Recipe:
    def __init__(self,title,ingredients):
        self.title = title
        self.ingredients = ingredients if ingredients else []
    
    def add_ingredient(self,ingredient: Ingredient):
        for item in self.ingredients:
            if item == ingredient:
                item.quantity += ingredient.quantity
                return 
                
        self.ingredients.append(ingredient)

    @staticmethod
    def is_valid_ratio(ratio):
        return isinstance(ratio,(int,float)) and ratio > 0

    def scale(self,ratio):
        if not self.is_valid_ratio(ratio):
            raise ValueError('Коэффициент должен быть положительным')
        new_ingredients = []
        for i in self.ingredients:
            new_ing = Ingredient(i.name,i.quantity*ratio,i.unit)
            new_ingredients.append(new_ing)
        
        return Recipe(self.title,new_ingredients)

    def __len__(self):
        return len(self.ingredients)
    
    def __str__(self):
        ingredients_line = ', '.join(str(i) for i in self.ingredients)
        return f'{self.title} : {ingredients_line}'