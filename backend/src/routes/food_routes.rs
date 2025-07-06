use axum::{
    routing::{get, post},
    Router,
    Extension,
};

use crate::controllers::food; 
use crate::AppState;
use crate::utils::jwt::JwtConfig;

pub fn food_routes(jwt_config: JwtConfig) -> Router<AppState> {
    Router::new()
        .route("/food/", get(food::get_foods))
        .route("/food/add", post(food::add_food))
        .route("/food/consumed/:user_id", get(food::get_consumed))
        .layer(Extension(jwt_config))
}