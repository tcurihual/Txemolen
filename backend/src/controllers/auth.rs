use axum::{
    extract::State,
    Extension, Json,
    http::StatusCode,
};
use serde::Deserialize;

use sea_orm::{
    ColumnTrait,
    EntityTrait,
    QueryFilter,
    ActiveModelTrait, 
    Set
};

use crate::models::user::{ 
    AuthResponse, Column as UserColumn, Entity as UserEntity, UserDTO, ActiveModel
};
use crate::AppState;
use crate::utils::{hash, jwt::{self, JwtConfig}, conversions};

#[derive(Debug, Deserialize)]
pub struct LoginDto {
    pub email: String,
    pub password: String,
}

pub async fn login(
    State(state): State<AppState>,
    Extension(jwt_config): Extension<JwtConfig>,
    Json(login_data): Json<LoginDto>,
) -> Result<Json<AuthResponse>, (StatusCode, String)> {
    // Buscar usuario por email
    let user = UserEntity::find()
        .filter(UserColumn::Email.eq(login_data.email))
        .one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::UNAUTHORIZED, "Credenciales inválidas".to_string()))?;

    // Verificar contraseña
    hash::verify_password(&login_data.password, &user.password)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .then_some(())
        .ok_or((StatusCode::UNAUTHORIZED, "Credenciales inválidas".to_string()))?;

    // Generar token JWT
    let token = jwt::generate_token(user.id, &jwt_config)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    
    Ok(Json(AuthResponse {
        user: conversions::to_response(&user),
        token,
    }))
}

pub async fn register(
    State(state): State<AppState>,
    Extension(jwt_config): Extension<JwtConfig>,
    Json(user_data): Json<UserDTO>,
    ) -> Result<Json<AuthResponse>, (StatusCode, String)> {
// verificar existencia de usuario  
    let existing_user = UserEntity::find()
        .filter(UserColumn::Email.eq(user_data.email.clone()))
        .one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    if existing_user.is_some() {
        return Err((StatusCode::CONFLICT, "El usuario ya existe".to_string()));
    }
    // Hashear la contraseña
    let hashed_password = hash::hash_password(&user_data.password)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let user = ActiveModel {
        name: Set(user_data.name),
        email: Set(user_data.email),
        password: Set(hashed_password),
        gender: Set(user_data.gender),
        age: Set(user_data.age),
        weight: Set(user_data.weight),
        height: Set(user_data.height),
        fat_percentage: Set(user_data.fat_percentage),
        daily_goal_id: Set(user_data.daily_goal_id),
        ..Default::default()
    }
    .insert(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let token = jwt::generate_token(user.id, &jwt_config)
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(AuthResponse {
        user: conversions::to_response(&user),
        token 
    }))
}
