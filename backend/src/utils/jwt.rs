use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use chrono::{Duration, Utc};
use anyhow::{anyhow, Result};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: i32,   
    pub exp: usize, 
    pub iat: usize,  
}

#[derive(Debug, Clone)]
pub struct JwtConfig {
    pub secret: String,
    pub expiration_hours: i64,
}

pub fn generate_token(user_id: i32, config: &JwtConfig) -> Result<String> {
    let now = Utc::now();
    let exp = now + Duration::hours(config.expiration_hours);
    
    let claims = Claims {
        sub: user_id,
        exp: exp.timestamp() as usize,
        iat: now.timestamp() as usize,
    };
    
    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(config.secret.as_ref()),
    )
    .map_err(|e| anyhow!("Failed to generate token: {}", e))
}

pub fn validate_token(token: &str, config: &JwtConfig) -> Result<Claims> {
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(config.secret.as_ref()),
        &Validation::new(Algorithm::HS256),
    )
    .map_err(|e| anyhow!("Invalid token: {}", e))?;
    
    Ok(token_data.claims)
}