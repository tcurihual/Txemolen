use axum::{
    routing::{get, post},
    Extension, Router,
};

use crate::controllers::auth;
use crate::AppState;
use crate::utils::{jwt::JwtConfig};

pub fn auth_routes(jwt_config: JwtConfig) -> Router<AppState> {
    Router::new()
        .route("/auth/login", post(auth::login))
        .route("/auth/register", post(auth::register))
        .route("/auth/validate", get(auth::token_verify))
        .layer(Extension(jwt_config)) // Assuming JwtConfig has a default implementation
}

