import httpx
import asyncio

async def test_auth():
    async with httpx.AsyncClient() as client:
        print("Testing Registration...")
        try:
            res = await client.post("http://127.0.0.1:8000/api/auth/register", json={
                "email": "testbuyer2@gmail.com",
                "password": "Password123!",
                "name": "Test Buyer",
                "role": "buyer"
            })
            print(res.status_code)
            print(res.json())
        except Exception as e:
            print("Error in register:", e)

        print("\nTesting Login...")
        try:
            res = await client.post("http://127.0.0.1:8000/api/auth/login", json={
                "email": "testbuyer2@gmail.com",
                "password": "Password123!"
            })
            print(res.status_code)
            print(res.json())
        except Exception as e:
            print("Error in login:", e)

if __name__ == "__main__":
    asyncio.run(test_auth())
