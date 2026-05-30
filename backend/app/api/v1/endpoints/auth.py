from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests
import os
import uuid

from app.core import security
from app.core.dependencies import get_db, get_current_user
from app.db import crud
from app.schemas import user as user_schemas

router = APIRouter()

@router.post("/register", response_model=user_schemas.AuthResponse)
def register(
    user_in: user_schemas.UserRegister, db: Session = Depends(get_db)
):
    # Email duplicate check
    email_user = crud.get_user_by_email(db, email=user_in.email)
    if email_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists.",
        )
        
    # Username duplicate check
    username_user = crud.get_user_by_username(db, username=user_in.username)
    if username_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this username already exists.",
        )

    user = crud.create_user(
        db, 
        email=user_in.email, 
        username=user_in.username,
        password_plain=user_in.password, 
        full_name=user_in.full_name
    )

    return {
        "access_token": security.create_access_token(subject=user.email),
        "refresh_token": security.create_refresh_token(subject=user.email),
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username
    }

# Retain signup alias for backward compatibility
@router.post("/signup", response_model=user_schemas.AuthResponse)
def signup(
    user_in: user_schemas.UserRegister, db: Session = Depends(get_db)
):
    return register(user_in, db)

@router.post("/login", response_model=user_schemas.AuthResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user:
        # Try finding by username as well for login flexibility
        user = crud.get_user_by_username(db, username=form_data.username)

    if not user or not security.verify_password(
        form_data.password, user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password.",
        )

    return {
        "access_token": security.create_access_token(subject=user.email),
        "refresh_token": security.create_refresh_token(subject=user.email),
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username
    }

@router.get("/me", response_model=user_schemas.UserResponse)
def get_me(current_user: user_schemas.UserResponse = Depends(get_current_user)):
    return current_user

@router.post("/google", response_model=user_schemas.AuthResponse)
def google_auth(auth_in: user_schemas.GoogleAuth, db: Session = Depends(get_db)):
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    if not client_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google Client ID is not configured on the server."
        )

    try:
        # Verify the token
        idinfo = id_token.verify_oauth2_token(auth_in.credential, requests.Request(), client_id)

        # Ensure it's a valid issuer
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')

        email = idinfo['email']
        name = idinfo.get('name', '')
        
        # Check if user exists
        user = crud.get_user_by_email(db, email=email)
        
        if not user:
            # Create a new user automatically
            # Generate a random username and password for oauth users
            random_suffix = str(uuid.uuid4())[:8]
            username = f"user_{random_suffix}"
            random_password = str(uuid.uuid4())
            
            user = crud.create_user(
                db,
                email=email,
                username=username,
                password_plain=random_password,
                full_name=name
            )

        return {
            "access_token": security.create_access_token(subject=user.email),
            "refresh_token": security.create_refresh_token(subject=user.email),
            "token_type": "bearer",
            "user_id": user.id,
            "username": user.username
        }
    except ValueError as e:
        # Invalid token
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google token: {str(e)}"
        )
