use sea_orm::entity::prelude::*;
use chrono::NaiveDate;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "day")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub date: NaiveDate,
    pub completed: bool,
    pub user_id: i32,
    pub daily_goal_id: i32, 
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::user::Entity",
        from = "Column::UserId",
        to = "super::user::Column::Id"
    )]
    User,
    #[sea_orm(
        belongs_to = "super::daily_goal::Entity",
        from = "Column::DailyGoalId",
        to = "super::daily_goal::Column::Id"
    )]
    DailyGoal,
    #[sea_orm(has_many = "super::meal::Entity")]
    Meals,
}

impl Related<super::user::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::User.def()
    }
}

impl Related<super::daily_goal::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::DailyGoal.def()
    }
}

impl Related<super::meal::Entity> for Entity {
    fn to() -> RelationDef {
        super::meal::Relation::Day.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}