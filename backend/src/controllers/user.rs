use axum::{
    extract::{Path, State},
    {Json},
    http::StatusCode,
};

use sea_orm::{
    ActiveModelTrait, EntityTrait, Set
};

use crate::models::user::{ActiveModel, Entity, Model, UserDTO, UserResponse};
use crate::AppState;
use crate::utils::{hash, conversions};

pub async fn get(
    State(state): State<AppState>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    let users = Entity::find().all(&state.db).await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(serde_json::to_value(users).unwrap()))
}

pub async fn get_by_id(
    State(state): State<AppState>,
    Path(id): Path<i32>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    let user = Entity::find_by_id(id)
        .one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    match user {
        Some(u) => Ok(Json(serde_json::to_value(u).unwrap())),
        None => Err((StatusCode::NOT_FOUND, format!("User with id {} not found", id))),
    }
}

pub async fn create(
    State(state): State<AppState>,
    Json(user_data): Json<UserDTO>,
) -> Result<Json<UserResponse>, (StatusCode, String)> {

    let hashed_password = hash::hash_password(&user_data.password)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let gender_enum = user_data.gender.ok_or((
        StatusCode::BAD_REQUEST,
        "Gender is required".into(),
    ))?;


    let user = ActiveModel {
        name: Set(user_data.name),
        email: Set(user_data.email),
        password: Set(hashed_password),
        gender: Set(Some(gender_enum)),
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

    Ok(Json(conversions::to_response(&user)))
}

pub async fn update(
    State(state): State<AppState>,
    Path(id): Path<i32>,
    Json(user_data): Json<Model>,
) -> Result<Json<Model>, (StatusCode, String)> {
    let user = Entity::find_by_id(id)
        .one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::NOT_FOUND, "User not found".to_string()))?;

    let updated_user = ActiveModel {
        id: Set(user.id),
        name: Set(user_data.name),
        email: Set(user_data.email),
        password: Set(user_data.password),
        gender: Set(user_data.gender),
        age: Set(user_data.age),
        weight: Set(user_data.weight),
        height: Set(user_data.height),
        fat_percentage: Set(user_data.fat_percentage),
        daily_goal_id: Set(user_data.daily_goal_id),
    }
    .update(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(updated_user))
}

pub async fn delete(
    State(state): State<AppState>,
    Path(id): Path<i32>,
) -> Result<(), (StatusCode, String)> {
    let user = Entity::find_by_id(id)
        .one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::NOT_FOUND, "User not found".to_string()))?;

    ActiveModel {
        id: Set(user.id),
        ..Default::default()
    }
    .delete(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(())
}