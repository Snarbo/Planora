// utils/getMealImage.ts

const MEAL_IMAGE_MAP: Record<string, string> = {
    "Greek Yoghurt & Berries":          "1488477181946-6428a0291777",
    "Protein Oats":                     "1517673400267-0251440c45dc",
    "Avocado Toast & Eggs":             "1525351484163-7529414344d8",
    "Banana Protein Smoothie":          "1740637372899-e27569049917",
    "Berry Chia Pudding":               "1620429194563-f97cffd3fa6a",
    "Veggie Omelette":                  "1510693206972-df098062cb71",
    "Mushroom Risotto":                 "1476124369491-e7addf5db371",
    "Spinach & Ricotta Pasta":          "1621996346565-e3dbc646d9a9",
    "Black Bean Tacos":                 "1565299585323-38d6b0865b47",
    "Mediterranean Pasta Salad":        "1473093295043-cdd812d0e601",
    "Salmon & Sweet Potato":            "1467003909585-2f8a72700288",
    "Teriyaki Salmon Rice":             "1732187582879-3ca83139c1b8",
    "Fish Tacos":                       "1552332386-f8dd00dc2f85",
    "Prawn Noodles":                    "1569718212165-3a8278d5f624",
    "Smoked Salmon Bagel":              "1730793680250-6c99bcb162c8",
    "Ribeye Steak & Asparagus":         "1546964124-0cce460f38ef",
    "Halloumi & Roasted Veg Wrap":      "1563282397-cdc218eccfda",
    "Avocado & Tomato Toast":           "1650092194571-d3c1534562be",
    "Tofu Stir Fry":                    "1680173073730-852e0ec93bec",
    "Lentil Curry":                     "1668236534990-73c4ed23043c",
    "Vegetable Soup & Bread":           "1654828819532-de14593c5552",
    "Coconut Vegetable Curry":          "1720949579179-b4d04403f548",
    "Teriyaki Tofu & Rice":             "1679279726946-a158b8bcaa23",
    "Bacon & Avocado Eggs":             "1633372171190-4eafd0ce8763",
    "Vegan Hummus & Veggie Bowl":       "1675092789086-4bd2b93ffc69",
    "Cream Cheese Omelette":            "1668283653825-37b80f055b05",
    "Smoked Salmon & Avocado Plate":    "1726514730791-2bfb3f472f90",
    "Egg & Bacon Cups":                 "1643410506454-909167a5930e",
    "Tuna & Avocado Lettuce Wraps":     "1574350211910-57ff8da5a209",
    "Chicken & Avocado Lettuce Wraps":  "1574350211910-57ff8da5a209",
    "Baked Salmon with Asparagus":      "1560717845-968823efbee1",
    "Beef & Broccoli Bowl":             "1723531055852-744d14ac00b4",
    "Tuna Pasta Salad":                 "1543161252-42609aa0e3d2",
    "Prawn & Avocado Salad":            "1659415402156-711521b67ebe",
    "Tuna Nicoise Salad":               "1578687388049-079580e6eb2d",
    "Smoked Salmon & Scrambled Eggs":   "1771698254255-e64331d09046",
    "Prawn & Avocado Toast":            "1629337419398-09ad0340e999",
};

// fallbacks by mealType
const MEAL_TYPE_FALLBACKS: Record<string, string> = {
  breakfast: "1494390248081-4e521a5940db",
  lunch:     "1512621776951-a57141f2eefd",
  dinner:    "1476224203421-9ac39bcb3327",
  snack:     "1547592166-23ac45744acd",
};

export function getMealImage(
    name: string,
    mealType: string,
    width = 680,
    height = 470,
    quality = 80,
): string {
  const photoId =
    MEAL_IMAGE_MAP[name] ??
    MEAL_TYPE_FALLBACKS[mealType] ??
    "1512621776951-a57141f2eefd"; // ultimate fallback

  return `https://images.unsplash.com/photo-${photoId}?w=${width}&h=${height}&auto=format&fit=crop&q=${quality}`;
}