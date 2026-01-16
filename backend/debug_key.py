import httpx
import asyncio

API_KEY = "7feb024671974a59ba4172217261601"

async def test():
    async with httpx.AsyncClient() as client:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat=28.6139&lon=77.2090&appid={API_KEY}"
        print(f"Testing URL: {url.replace(API_KEY, 'HIDDEN_KEY')}")
        resp = await client.get(url)
        print(f"Status: {resp.status_code}")
        print(f"Body: {resp.text}")

if __name__ == "__main__":
    asyncio.run(test())
