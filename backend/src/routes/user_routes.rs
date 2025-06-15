use axum::{
    routing::{get, post, put, delete},
    Router,
    Extension,
};
use sea_orm::DatabaseConnection;

use crate::controllers::user;
use crate::utils::jwt::JwtConfig;

pub fn user_routes(jwt_config: JwtConfig) -> Router<DatabaseConnection> {
    Router::new()
        .route("/users", get(user::get))
        .route("/users/:id", get(user::get_by_id))
        .route("/users", post(user::create))
        .route("/users/:id", put(user::update))
        .route("/users/:id", delete(user::delete))
        .layer(Extension(jwt_config)) // Assuming JwtConfig has a default implementation
}
