use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "daily_goal")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub kcal: f32,
    pub protein: f32,
    pub carbos: f32,
    pub fat: f32,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::user::Entity")]
    Users,
    #[sea_orm(has_many = "super::day::Entity")]
    Days,
}



impl ActiveModelBehavior for ActiveModel {}