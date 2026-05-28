from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
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

