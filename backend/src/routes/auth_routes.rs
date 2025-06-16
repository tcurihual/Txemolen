use axum::{
    routing::{get, post},
    Router,
    Extension,
    http::StatusCode,
};

use crate::{controllers::auth, middlewares::auth::AuthenticatedUser, AppState};
use crate::utils::jwt::JwtConfig;

pub fn auth_routes(jwt_config: JwtConfig) -> Router<AppState> {
    Router::new()
        .route("/auth/login", post(auth::login))
        .route("/auth/register", post(auth::register))
        .route("/auth/validate", get(token_verify))
        .layer(Extension(jwt_config)) // Assuming JwtConfig has a default implementation
}

async fn token_verify(
    user: AuthenticatedUser
) -> (StatusCode, String) {
    (
        StatusCode::OK,
        format!("Token válido para el usuario {}", user.0),
    )
}