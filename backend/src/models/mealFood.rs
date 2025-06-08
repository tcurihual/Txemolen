use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "meal_food")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub meal_id: i32,
    #[sea_orm(primary_key)]
    pub food_code: String,
    pub servings: f32, // Cantidad de porciones consumidas
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::meal::Entity",
        from = "Column::MealId",
        to = "super::meal::Column::Id"
    )]
    Meal,
    #[sea_orm(
        belongs_to = "super::food::Entity",
        from = "Column::FoodCode",
        to = "super::food::Column::Code"
    )]
    Food,
}

impl ActiveModelBehavior for ActiveModel {}