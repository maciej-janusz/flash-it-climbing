import httpx
from app.models.routebase import Country

COUNTRIES_API_URL = "https://restcountries.com/v3.1/all?fields=name,cca2,flag"

async def seed_countries():
    count = await Country.count()
    if count > 0:
        print("Countries up to date, skipping seeding.")
        return
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(COUNTRIES_API_URL, timeout=10.0)
            response.raise_for_status()
            
            countries_data = response.json()
            
            to_insert = [
                Country(
                    name=item["name"]["common"],
                    flag=item.get("flag", "🏳️")
                ) for item in countries_data
            ]
    
            if to_insert:
                await Country.insert_many(to_insert)
                print(f"Inserted {len(to_insert)} countries with flags into the database!")
                
        except Exception as e:
            print(f"Error seeding countries: {e}")