from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sql import get_user
from fastapi.security import OAuth2PasswordRequestForm
from authentication.authentication import get_current_active_user, authenticate_user, create_access_token
from custom_types import Token
from datetime import datetime, timedelta, timezone
from fastapi.responses import JSONResponse

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/users")
async def get_users(subcategory_id: int, current_user=Depends(get_current_active_user)):
    return get_user(subcategory_id)


@app.post("/api/v1/signUp")
async def sign_up(form_data: OAuth2PasswordRequestForm = Depends()):
    return create_new_user(form_data.username, form_data.password)

@app.post("/api/v1/login", response_model=Token)
async def access_token_login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="incorrect username or password", headers={"WWW-Authenticate": "Bearer"})
    access_token_expires = timedelta(hours=8)
    access_token = create_access_token(
        data={"sub": user['user_name']}, expires_delta=access_token_expires)
    response = JSONResponse(content={"access_token": access_token,
                            "expires_in": access_token_expires.seconds, "token_type": "Bearer"})
    expiry = datetime.now() + timedelta(seconds=access_token_expires.seconds)
    expiry_utc = expiry.replace(tzinfo=timezone.utc)
    return response
