use sea_orm::entity::prelude::*;
use sea_orm::DeriveActiveEnum;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "meal")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub meal_type: MealType,
    pub day_id: i32, 
}

#[derive(Debug, Clone, PartialEq, EnumIter, DeriveActiveEnum, Serialize, Deserialize)]
#[sea_orm(
    rs_type = "String",
    db_type = "String(Some(20))",
    enum_name = "meal_type"
)]
pub enum MealType {
    #[sea_orm(string_value = "Desayuno")]
    Breakfast,
    #[sea_orm(string_value = "Almuerzo")]
    Lunch,
    #[sea_orm(string_value = "Cena")]
    Dinner,
    #[sea_orm(string_value = "Snack")]
    Snack,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::day::Entity",
        from = "Column::DayId",
        to = "super::day::Column::Id"
    )]
    Day,
    #[sea_orm(has_many = "super::meal_food::Entity")]
    MealFoods,
}

impl ActiveModelBehavior for ActiveModel {}