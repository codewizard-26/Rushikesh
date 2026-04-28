from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib




# Create FastAPI app
app = FastAPI()



# Enable CORS (so frontend can talk to backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load('model.pkl')
vectorizer = joblib.load('vectorizer.pkl')


# Define input structure
class FoodRequest(BaseModel):
    meal: str


# Create API endpoint 
@app.post("/predict")
def predict(req: FoodRequest):
    meal = req.meal.lower()
    input_vec = vectorizer.transform([meal])

    prediction = model.predict(input_vec)[0]
    return {
        "calories": float(prediction[0]),
        "protein": float(prediction[1]),
        "carbs": float(prediction[2]),
        "fats":  float(prediction[3]),
    }
