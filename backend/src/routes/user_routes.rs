use axum::{
    routing::{get, post, put, delete},
    Router,
};
use sea_orm::DatabaseConnection;


use crate::controllers::user;

pub fn user_routes() -> Router<DatabaseConnection> {
    Router::new()
        .route("/users", get(user::get))
        .route("/users/:id", get(user::get_by_id))
        .route("/users", post(user::create))
        .route("/users/:id", put(user::update))
        .route("/users/:id", delete(user::delete))
}
