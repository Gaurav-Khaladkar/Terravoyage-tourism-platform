"""
TerraVoyage AI Tourism Intelligence Microservice
Author: TerraVoyage Engineering
Description: Provides AI itinerary generation, dynamic seasonal pricing forecasting, and review sentiment analytics.
"""

from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import datetime

app = FastAPI(
    title="TerraVoyage AI Tourism Microservice",
    version="1.0.0",
    description="Intelligent trip planning, pricing optimization, and sentiment analysis engine."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ItineraryRequest(BaseModel):
    destination: str
    durationDays: int
    budget: float
    travelStyle: str = "ADVENTURE" # ADVENTURE, LUXURY, CULTURAL, RELAXATION
    travelers: int = 2

class ItineraryDayPlan(BaseModel):
    day: int
    title: str
    morningActivity: str
    afternoonActivity: str
    eveningExperience: str
    recommendedDining: str
    estimatedDailySpend: float

class ItineraryResponse(BaseModel):
    destination: str
    durationDays: int
    style: str
    totalEstimatedCost: float
    budgetStatus: str
    dailyPlan: List[ItineraryDayPlan]
    aiPackingAdvice: List[str]
    sustainabilityScore: float

class PricingForecastRequest(BaseModel):
    packageId: int
    month: int
    basePrice: float
    currentOccupancyRate: float # 0.0 to 1.0

class SentimentRequest(BaseModel):
    reviewText: str

@app.get("/")
def root():
    return {"status": "ONLINE", "service": "TerraVoyage AI Copilot", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "UP", "timestamp": datetime.datetime.utcnow().isoformat()}

@app.post("/api/ai/plan-itinerary", response_model=ItineraryResponse)
def plan_itinerary(req: ItineraryRequest):
    if req.durationDays < 1 or req.durationDays > 30:
        raise HTTPException(status_code=400, detail="Duration must be between 1 and 30 days")

    daily_plans: List[ItineraryDayPlan] = []
    daily_budget = req.budget / req.durationDays

    activities = {
        "ADVENTURE": [
            ("Alpine sunrise trailhead trek", "Whitewater river rafting & canyoning", "Campfire storytelling under starlit sky", "Artisanal mountain smokehouse"),
            ("Glacial crevasse exploration", "Off-road 4x4 ridge trail exploration", "Sunset cliffside panoramic overlook", "Local rustic village tavern"),
            ("High-altitude suspension bridge crossing", "Mountain bike descent through pine forests", "Thermal hot spring rejuvenation", "Organic farm-to-table bistro")
        ],
        "LUXURY": [
            ("Helicopter panoramic flyover", "Private vineyard tasting & cellar tour", "Sunset yacht charter with vintage Champagne", "Michelin-starred seaside dining"),
            ("Exclusive museum VIP private viewing", "Bespoke perfumery masterclass", "Classical opera performance", "Rooftop caviar & lounge cocktail club"),
            ("Chauffeured scenic coastal drive", "Private wellness spa hydrotherapy ritual", "Candlelit courtyard private chef tasting", "Five-star grand salon dining")
        ],
        "CULTURAL": [
            ("Historic temple dawn meditation", "Traditional artisan pottery workshop", "Heritage theater & folk dance performance", "Ancient tea house ceremony"),
            ("Imperial palace walking expedition", "Ancient calligraphy & origami session", "Lantern floating along the canal", "Traditional family-run Kaiseki inn"),
            ("UNESCO heritage fortress tour", "Spice market sensory walking walk", "Evening architectural night walk", "Street food night market discovery")
        ]
    }

    style_key = req.travelStyle.upper() if req.travelStyle.upper() in activities else "ADVENTURE"
    activity_pool = activities[style_key]

    for d in range(1, req.durationDays + 1):
        act = activity_pool[(d - 1) % len(activity_pool)]
        spend = round(daily_budget * random.uniform(0.85, 1.15), 2)
        daily_plans.append(ItineraryDayPlan(
            day=d,
            title=f"Day {d}: {act[0].split()[0]} & {act[1].split()[-1]} Exploration",
            morningActivity=act[0],
            afternoonActivity=act[1],
            eveningExperience=act[2],
            recommendedDining=act[3],
            estimatedDailySpend=spend
        ))

    total_est = sum(p.estimatedDailySpend for p in daily_plans)
    budget_status = "Optimal (Within Budget)" if total_est <= req.budget else "Slightly Exceeds Target (Premium Experience)"

    packing = [
        "Moisture-wicking all-weather base layers",
        "Universal plug adapter (Type C/G) & surge protector",
        "Waterproof lightweight daypack (20L)",
        "Noise-canceling headphones & offline e-Sim profiles"
    ]

    return ItineraryResponse(
        destination=req.destination,
        durationDays=req.durationDays,
        style=req.travelStyle,
        totalEstimatedCost=round(total_est, 2),
        budgetStatus=budget_status,
        dailyPlan=daily_plans,
        aiPackingAdvice=packing,
        sustainabilityScore=8.9
    )

@app.post("/api/ai/predict-demand")
def predict_demand(req: PricingForecastRequest):
    # High season peak multiplier
    peak_months = [6, 7, 8, 12]
    is_peak = req.month in peak_months

    multiplier = 1.0
    if is_peak:
        multiplier += 0.25
    if req.currentOccupancyRate > 0.8:
        multiplier += 0.15
    elif req.currentOccupancyRate < 0.3:
        multiplier -= 0.10

    recommended_price = round(req.basePrice * multiplier, 2)
    demand_level = "VERY HIGH" if multiplier >= 1.3 else ("HIGH" if multiplier >= 1.1 else "NORMAL")

    return {
        "packageId": req.packageId,
        "basePrice": req.basePrice,
        "recommendedPrice": recommended_price,
        "priceDelta": round(recommended_price - req.basePrice, 2),
        "demandLevel": demand_level,
        "suggestedAction": "Increase early-bird discounts" if req.currentOccupancyRate < 0.3 else "Apply dynamic surge pricing"
    }

@app.post("/api/ai/sentiment-analysis")
def analyze_sentiment(req: SentimentRequest):
    text = req.reviewText.lower()
    positive_words = ["amazing", "breathtaking", "seamless", "excellent", "superb", "luxury", "unforgettable", "friendly", "clean"]
    negative_words = ["delayed", "dirty", "rude", "poor", "crowded", "expensive", "disappointed", "bad"]

    pos_score = sum(1 for w in positive_words if w in text)
    neg_score = sum(1 for w in negative_words if w in text)

    sentiment = "POSITIVE" if pos_score >= neg_score else "NEGATIVE"
    confidence = min(0.98, max(0.60, 0.70 + (pos_score * 0.05)))

    return {
        "sentiment": sentiment,
        "confidence": round(confidence, 2),
        "detectedHighlights": [w for w in positive_words if w in text],
        "actionRequired": sentiment == "NEGATIVE"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
