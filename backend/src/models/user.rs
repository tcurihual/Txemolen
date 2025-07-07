use sea_orm::entity::prelude::*;
use serde::{Serialize, Deserialize};
use crate::models::daily_goal::Model as DailyGoal;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "user")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub email: String,
    pub password: String,
    pub gender: Option<Gender>,
    pub age: Option<i32>,
    pub weight: Option<f32>,
    pub height: Option<f32>,
    pub fat_percentage: Option<f32>,
    pub activity_level: Option<ActivityLevel>,
    pub daily_goal_id: Option<i32>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::daily_goal::Entity",
        from = "Column::DailyGoalId",
        to = "super::daily_goal::Column::Id"
    )]
    DailyGoal,
    #[sea_orm(has_many = "super::day::Entity")]
    Days,
}

impl Related<super::daily_goal::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::DailyGoal.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}

#[derive(Serialize, Deserialize, Debug)]
pub struct UserDTO {
    pub name: String,
    pub email: String,
    pub password: String,
    pub gender: Option<Gender>,
    pub age: Option<i32>,
    pub weight: Option<f32>,
    pub height: Option<f32>,
    pub fat_percentage: Option<f32>,
    pub activity_level: Option<ActivityLevel>,
    pub daily_goal_id: Option<i32>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct UserResponse {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub gender: Option<Gender>,
    pub age: Option<i32>,
    pub weight: Option<f32>,
    pub height: Option<f32>,
    pub fat_percentage: Option<f32>,
    pub activity_level: Option<ActivityLevel>,
    pub daily_goal_id: Option<i32>, 
}

#[derive(Serialize, Deserialize, Debug)]
pub struct UserRegister {
    pub name: String,
    pub email: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct AuthResponse {
    pub user: UserResponse,
    pub token: String,
}

#[derive(Debug, Clone, PartialEq, EnumIter, DeriveActiveEnum, Serialize, Deserialize)]
#[sea_orm(
    rs_type = "String",
    db_type = "Enum",
    enum_name = "gender_type"
)]
pub enum Gender {
    #[sea_orm(string_value = "Male")]
    Male, 
    #[sea_orm(string_value = "Female")]
    Female, 
}

#[derive(Serialize, Deserialize, Debug)]
pub struct BiometricUpdateDTO {
    pub gender: Gender,
    pub age: i32, 
    pub weight: f32, 
    pub height: f32,
    pub fat_percentage: Option<f32>,
    pub activity_level: ActivityLevel
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveActiveEnum, Serialize, Deserialize, PartialEq)]
#[sea_orm(
    rs_type = "String",
    db_type = "Enum",
    enum_name = "activity_level_type" 
)]
pub enum ActivityLevel {
    #[sea_orm(string_value = "Sedentary")]
    Sedentary, 
    #[sea_orm(string_value = "Light")]
    Light,
    #[sea_orm(string_value = "Moderate")]
    Moderate, 
    #[sea_orm(string_value = "Heavy")]
    Heavy, 
    #[sea_orm(string_value = "Intense")]
    Intense, 
}

impl ActivityLevel {
    pub fn get_factor(&self) -> f32 {
        match self {
            ActivityLevel::Sedentary => 1.2,
            ActivityLevel::Light => 1.375,
            ActivityLevel::Moderate => 1.55,
            ActivityLevel::Heavy => 1.725,
            ActivityLevel::Intense => 1.9,
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct BiometricManagementResponse {
    pub user: UserResponse,
    pub daily_goal: DailyGoal
}