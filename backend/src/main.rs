//! Run with
//! systemfd --no-pid -s http::3000 -- cargo watch -x run

use axum::{response::Html, routing::get, Router};
use dotenvy::dotenv;
use listenfd::ListenFd;
use sea_orm::Database;
use std::env;
use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    
    dotenv().expect("Error al cargar el archivo .env");
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL no configurada");
    let conn = Database::connect(&database_url)
        .await
        .expect("Error al conectar con la base de datos");

    let app = Router::new()
        .route("/", get(handler))
        .with_state(conn); 

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

async fn handler() -> Html<&'static str> {
    Html("<h1>Hola Mundo!</h1>")
}