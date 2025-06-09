use axum::{
    extract::{Path, State},
    Json, 
};

use sea_orm::{
    DatabaseConnection,
    EntityTrait,
    ActiveModelTrait, 
    Set
};

use crate::models::user::{Entity, Model, ActiveModel};

#[axum::debug_handler]
pub async fn get(
    State(conn): State<DatabaseConnection>,
) -> Result<Json<serde_json::Value>, (axum::http::StatusCode, String)> {
    let users = Entity::find().all(&conn).await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(serde_json::to_value(users).unwrap()))
}

#[axum::debug_handler]
pub async fn get_by_id(
    State(conn): State<DatabaseConnection>,
    Path(id): Path<i32>,
) -> Result<Json<serde_json::Value>, (axum::http::StatusCode, String)> {
    let user = Entity::find_by_id(id)
        .one(&conn)
        .await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    match user {
        Some(u) => Ok(Json(serde_json::to_value(u).unwrap())),
        None => Err((axum::http::StatusCode::NOT_FOUND, format!("User with id {} not found", id))),
    }
}

#[axum::debug_handler]
pub async fn create(
    State(conn): State<DatabaseConnection>,
    Json(user_data): Json<Model>,
) -> Result<Json<Model>, (axum::http::StatusCode, String)> {
    let user = ActiveModel {
        name: Set(user_data.name),
        email: Set(user_data.email),
        password: Set(user_data.password),
        gender: Set(user_data.gender),
        age: Set(user_data.age),
        weight: Set(user_data.weight),
        height: Set(user_data.height),
        fat_percentage: Set(user_data.fat_percentage),
        daily_goal_id: Set(user_data.daily_goal_id),
        ..Default::default()
    }
    .insert(&conn)
    .await
    .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(user))
}

#[axum::debug_handler]
pub async fn update(
    State(conn): State<DatabaseConnection>,
    Path(id): Path<i32>,
    Json(user_data): Json<Model>,
) -> Result<Json<Model>, (axum::http::StatusCode, String)> {
    let user = Entity::find_by_id(id)
        .one(&conn)
        .await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((axum::http::StatusCode::NOT_FOUND, "User not found".to_string()))?;

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
    .update(&conn)
    .await
    .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(updated_user))
}

#[axum::debug_handler]
pub async fn delete(
    State(conn): State<DatabaseConnection>,
    Path(id): Path<i32>,
) -> Result<(), (axum::http::StatusCode, String)> {
    let user = Entity::find_by_id(id)
        .one(&conn)
        .await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((axum::http::StatusCode::NOT_FOUND, "User not found".to_string()))?;

    ActiveModel {
        id: Set(user.id),
        ..Default::default()
    }
    .delete(&conn)
    .await
    .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(())
}