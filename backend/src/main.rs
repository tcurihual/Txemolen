//! Run with
//! systemfd --no-pid -s http::3000 -- cargo watch -x run

use axum::{Router, http::{header, Method}};
use dotenvy::dotenv;
use listenfd::ListenFd;
use sea_orm::{Database, DatabaseConnection};
use std::env;
use tokio::net::TcpListener;
use tower_http::cors::{CorsLayer, Any};

use crate::utils::jwt::{JwtConfig};

mod controllers;
mod middlewares;
mod models;
mod routes;
mod utils;

#[derive(Clone)]
pub struct AppState {
    pub db: DatabaseConnection,
    pub jwt_config: JwtConfig,
}

#[tokio::main]
async fn main() {
    
    dotenv().expect("Error al cargar el archivo .env");
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL no configurada");
    let conn = Database::connect(&database_url)
        .await
        .expect("Error al conectar con la base de datos");

    let jwt_config = JwtConfig {
        secret: std::env::var("JWT_SECRET").expect("JWT_SECRET no configurada"),
        expiration_hours: env::var("JWT_EXPIRATION_HOURS")
            .expect("JWT_EXPIRATION_HOURS no configurada")
            .parse()
            .unwrap_or(24),
    };

    let state = AppState {
        db: conn,
        jwt_config: jwt_config.clone(),
    };

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE, Method::OPTIONS])
        .allow_headers([
        header::AUTHORIZATION,
        header::CONTENT_TYPE,
        ]);

    let app = Router::new()
        .merge(routes::user_routes::user_routes(jwt_config.clone()))
        .merge(routes::auth_routes::auth_routes(jwt_config.clone()))
        .merge(routes::biometrics_routes::biometrics_routes(jwt_config))
        .with_state(state)
        .layer(cors);

    let mut listenfd = ListenFd::from_env();
    let listener = match listenfd.take_tcp_listener(0).unwrap() {
        Some(listener) => {
            listener.set_nonblocking(true).unwrap();
            TcpListener::from_std(listener).unwrap()
        }
        None => TcpListener::bind("127.0.0.1:3000").await.unwrap(),
    };

    println!("🚀 Servidor escuchando en {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}
