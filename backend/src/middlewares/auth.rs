use axum::{
    async_trait, extract::{FromRequestParts, Path}, http::{request::Parts, StatusCode}
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

pub struct VerifiedOwner(pub i32);

#[async_trait]
impl FromRequestParts<AppState> for VerifiedOwner {
    type Rejection = (StatusCode, String);

    async fn from_request_parts(parts: &mut Parts, state: &AppState) -> Result<Self, Self::Rejection> {
        let AuthenticatedUser(authenticated_user_id) = AuthenticatedUser::from_request_parts(parts, state).await?;

        let Path(path_id) = Path::<i32>::from_request_parts(parts, &()).await
            .map_err(|_| (StatusCode::BAD_REQUEST, "Missing or invalid user ID in path".to_string()))?;

        if authenticated_user_id != path_id {
            return Err((StatusCode::FORBIDDEN, "Access denied: You can only modify your own data".to_string()));
        }

        Ok(VerifiedOwner(authenticated_user_id))
    }
}