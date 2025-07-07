use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "food")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub code: String,
    pub name: String,
    pub serving_size: f32,      
    pub energy_kcal: f32,
    pub proteins: f32,
    pub fat: f32,
    pub carbohydrates: f32,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::meal_food::Entity")]
    MealFoods,
}

impl Related<super::meal::Entity> for Entity {
    fn to() -> RelationDef {
        super::meal_food::Relation::Meal.def()
    }
    fn via() -> Option<RelationDef> {
        Some(super::meal_food::Relation::Food.def().rev())
    }
}

impl ActiveModelBehavior for ActiveModel {}