use axum::{
    routing::{post},
    Router,
    Extension,
};

use crate::{controllers::auth, AppState};
use crate::utils::jwt::JwtConfig;

pub fn auth_routes(jwt_config: JwtConfig) -> Router<AppState> {
    Router::new()
        .route("/auth/login", post(auth::login))
        .route("/auth/register", post(auth::register))
        .layer(Extension(jwt_config)) // Assuming JwtConfig has a default implementation
}
