use axum::{
    async_trait, extract::{FromRequestParts}, http::{request::Parts, StatusCode}
};

use axum_extra::{
    headers::{authorization::Bearer, Authorization},
    TypedHeader,
};

use crate::utils::jwt::{validate_token};
use crate::AppState;

#[derive(Debug, Clone)]
pub struct AuthenticatedUser(pub i32);

#[async_trait]
impl FromRequestParts<AppState> for AuthenticatedUser {
    type Rejection = (StatusCode, String);

    async fn from_request_parts(parts: &mut Parts, state: &AppState) -> Result<Self, Self::Rejection> {
        let config = state.jwt_config.clone();

        let TypedHeader(auth_header) = TypedHeader::<Authorization<Bearer>>::from_request_parts(parts, &())
            .await
            .map_err(|_| (StatusCode::UNAUTHORIZED, "Missing authorization header".to_string()))?;

        let claims = validate_token(auth_header.token(), &config)
            .map_err(|e| (StatusCode::UNAUTHORIZED, e.to_string()))?;

        Ok(AuthenticatedUser(claims.sub))
    }
}
