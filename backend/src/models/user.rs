use sea_orm::entity::prelude::*;
use serde::{Serialize, Deserialize};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "user")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub email: String,
    pub password: String,
    pub gender: String,
    pub age: i32,
    pub weight: f32,
    pub height: f32,
    pub fat_percentage: Option<f32>,
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
    pub gender: String,
    pub age: i32,
    pub weight: f32,
    pub height: f32,
    pub fat_percentage: Option<f32>,
    pub daily_goal_id: Option<i32>,  
}

#[derive(Serialize)]
pub struct AuthResponse {
    pub user: Model,
    pub token: String,
}