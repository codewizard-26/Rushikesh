from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import re
from rapidfuzz import process
from fastapi.middleware.cors import CORSMiddleware

# ======================
# INIT APP
# ======================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ======================
# LOAD DATA
# ======================
df = pd.read_csv("food_data.csv")

df = df.rename(columns={
    "Dish Name": "food_name",
    "Calories (kcal)": "calories",
    "Protein (g)": "protein",
    "Carbohydrates (g)": "carbs",
    "Fats (g)": "fats"
})

df = df[['food_name', 'calories', 'protein', 'carbs', 'fats']]
df = df.dropna()

df['food_name'] = (
    df['food_name']
    .str.lower()
    .str.replace('[^a-zA-Z0-9 ]', '', regex=True)
    .str.strip()
)

# ======================
# REQUEST MODEL
# ======================
class FoodRequest(BaseModel):
    meal: str

# ======================
# PREDICTION FUNCTION
# ======================
def predict_food(food_name):
    food_name = food_name.lower()

    # Exact match
    result = df[df['food_name'] == food_name]
    if not result.empty:
        return result.iloc[0][['calories', 'protein', 'carbs', 'fats']].to_dict()

    # Fuzzy match
    choices = df['food_name'].tolist()
    match = process.extractOne(food_name, choices)

    if match and match[1] > 80:
        best_match = match[0]
        result = df[df['food_name'] == best_match]
        return result.iloc[0][['calories', 'protein', 'carbs', 'fats']].to_dict()

    # Word-based fallback
    words = food_name.split()
    matched_rows = df[df['food_name'].str.contains('|'.join(words), case=False)]

    if not matched_rows.empty:
        avg_values = matched_rows[['calories', 'protein', 'carbs', 'fats']].mean()
        return avg_values.to_dict()

    # Final fallback
    return {
        "calories": 200,
        "protein": 10,
        "carbs": 25,
        "fats": 8
    }

# ======================
# API ENDPOINT
# ======================
@app.post("/predict")
def predict(req: FoodRequest):
    try:
        meal = req.meal.lower().strip()

        if not meal:
            raise HTTPException(status_code=400, detail="Meal cannot be empty")

        items = re.split(r',|and', meal)

        total = {"calories": 0, "protein": 0, "carbs": 0, "fats": 0}
        breakdown = []

        for item in items:
            item = item.strip()

            # Quantity extraction
            match = re.match(r'(\d+)\s+(.*)', item)
            if match:
                qty = int(match.group(1))
                food_name = match.group(2)
            else:
                qty = 1
                food_name = item

            result = predict_food(food_name)

            food_result = {
                "food": food_name,
                "quantity": qty,
                "calories": float(result.get("calories", 0)) * qty,
                "protein": float(result.get("protein", 0)) * qty,
                "carbs": float(result.get("carbs", 0)) * qty,
                "fats": float(result.get("fats", 0)) * qty
            }

            breakdown.append(food_result)

            for key in total:
                total[key] += food_result[key]

        return {
            "input": meal,
            "items": breakdown,
            "total": {k: round(v, 2) for k, v in total.items()}
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))