// src/routes/user.rs

use axum::{
    routing::put,
    Router,
    Extension,
};

use crate::controllers::{ biometrics}; 
use crate::AppState;
use crate::utils::jwt::JwtConfig;

pub fn biometrics_routes(jwt_config: JwtConfig) -> Router<AppState> {
    Router::new()
        .route("/biometrics/user/:id", put(biometrics::biometrics_management))
        .layer(Extension(jwt_config))
}