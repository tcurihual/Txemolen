use crate::models::user::{Model, UserDTO, UserResponse};

pub fn to_dto(user: &Model) -> UserDTO {
    UserDTO {
        name: user.name.clone(),
        email: user.email.clone(),
        password: user.password.clone(),
        gender: user.gender.clone(),
        age: user.age,
        weight: user.weight,
        height: user.height,
        fat_percentage: user.fat_percentage,
        daily_goal_id: user.daily_goal_id,
    }
}

pub fn to_response(user: &Model) -> UserResponse {
    UserResponse {
        id: user.id,
        name: user.name.clone(),
        email: user.email.clone(),
        gender: user.gender.clone(),
        age: user.age,
        weight: user.weight,
        height: user.height,
        fat_percentage: user.fat_percentage,
        daily_goal_id: user.daily_goal_id,
    }
}
