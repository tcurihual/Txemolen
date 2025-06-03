# Txemolen

Txemolen es un sistema para ayudar a cualquier persona que requiera de un sistema para registrar sus calorias,
este cuenta con una gran cantidad de alimentos obtenidos de:

- [Open Food Facts](https://world.openfoodfacts.org/)

### Stack:

Frontend:

- React + Typescript
- para ejecutar: pnpm install -> pnpm run dev

Backend:

- Rust + Axum
- para ejecutar: systemfd --no-pid -s http::3000 -- cargo watch -x run

Database

- PostgreSQL
