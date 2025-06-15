use axum::{
    async_trait,
    extract::{FromRequestParts, State},
    http::{request::Parts, StatusCode},
    RequestPartsExt,
};
use headers::Authorization;
use headers::authorization::Bearer;

use crate::utils::jwt::{validate_token, JwtConfig};

pub struct AuthenticatedUser(pub i32);

#[async_trait]
impl<S> FromRequestParts<S> for AuthenticatedUser
where
    S: Send + Sync,
{
    type Rejection = (StatusCode, String);

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let State(config) = parts
            .extract::<State<JwtConfig>>()
            .await
            .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "Missing JWT config".to_string()))?;

        let auth_header = parts
            .extract::<Authorization<Bearer>>()
            .await
            .map_err(|_| (StatusCode::UNAUTHORIZED, "Missing authorization header".to_string()))?;

        let claims = validate_token(auth_header.token(), &config)
            .map_err(|e| (StatusCode::UNAUTHORIZED, e.to_string()))?;

        Ok(AuthenticatedUser(claims.sub))
    }
}