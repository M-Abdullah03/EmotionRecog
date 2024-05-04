import uvicorn
from os import getenv

if __name__ == "__main__":
    # Run the FastAPI app
    port = int(getenv("PORT", 8000))
    uvicorn.run("deploy:app", host="0.0.0.0", port=port, reload=True)

