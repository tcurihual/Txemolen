use sea_orm_migration::prelude::*;
use sea_orm::Statement;

#[derive(DeriveIden)]
enum Food {
    Table,
    Code,
    Name,
    ServingSize,
    EnergyKcal,
    Proteins,
    Fat,
    Carbohydrates,
}

#[derive(DeriveIden)]
enum User {
    Table,
    Id,
    Name,
    Email,
    Password,
    Gender,
    Age,
    Weight,
    Height,
    FatPercentage,
    DailyGoalId,
}

#[derive(DeriveIden)]
enum DailyGoal {
    Table,
    Id,
    Kcal,
    Protein,
    Carbos,
    Fat,
}

#[derive(DeriveIden)]
enum Day {
    Table,
    Id,
    Date,
    Completed,
    UserId,
    DailyGoalId,
}

#[derive(DeriveIden)]
enum Meal {
    Table,
    Id,
    MealType,
    DayId,
}

#[derive(DeriveIden)]
enum MealFood {
    Table,
    MealId,
    FoodCode,
    Servings,
}

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Create Food table
        manager
            .create_table(
                Table::create()
                    .table(Food::Table)
                    .col(
                        ColumnDef::new(Food::Code)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Food::Name).string().not_null())
                    .col(ColumnDef::new(Food::ServingSize).float().not_null())
                    .col(ColumnDef::new(Food::EnergyKcal).float().not_null())
                    .col(ColumnDef::new(Food::Proteins).float().not_null())
                    .col(ColumnDef::new(Food::Fat).float().not_null())
                    .col(ColumnDef::new(Food::Carbohydrates).float().not_null())
                    .to_owned(),
            )
            .await?;

        // Create DailyGoal table
        manager
            .create_table(
                Table::create()
                    .table(DailyGoal::Table)
                    .col(
                        ColumnDef::new(DailyGoal::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(DailyGoal::Kcal).float().not_null())
                    .col(ColumnDef::new(DailyGoal::Protein).float().not_null())
                    .col(ColumnDef::new(DailyGoal::Carbos).float().not_null())
                    .col(ColumnDef::new(DailyGoal::Fat).float().not_null())
                    .to_owned(),
            )
            .await?;

        // Create User table
        manager
            .create_table(
                Table::create()
                    .table(User::Table)
                    .col(
                        ColumnDef::new(User::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(User::Name).string().not_null())
                    .col(ColumnDef::new(User::Email).string().not_null())
                    .col(ColumnDef::new(User::Password).string().not_null())
                    .col(ColumnDef::new(User::Gender).string().not_null())
                    .col(ColumnDef::new(User::Age).integer().not_null())
                    .col(ColumnDef::new(User::Weight).float().not_null())
                    .col(ColumnDef::new(User::Height).float().not_null())
                    .col(ColumnDef::new(User::FatPercentage).float())
                    .col(ColumnDef::new(User::DailyGoalId).integer().not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-user-daily_goal")
                            .from(User::Table, User::DailyGoalId)
                            .to(DailyGoal::Table, DailyGoal::Id),
                    )
                    .to_owned(),
            )
            .await?;

        // Create Day table
        manager
            .create_table(
                Table::create()
                    .table(Day::Table)
                    .col(
                        ColumnDef::new(Day::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Day::Date).date().not_null())
                    .col(ColumnDef::new(Day::Completed).boolean().not_null().default(false))
                    .col(ColumnDef::new(Day::UserId).integer().not_null())
                    .col(ColumnDef::new(Day::DailyGoalId).integer().not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_day_user")
                            .from(Day::Table, Day::UserId)
                            .to(User::Table, User::Id),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_day_daily_goal")
                            .from(Day::Table, Day::DailyGoalId)
                            .to(DailyGoal::Table, DailyGoal::Id),
                    )
                    .to_owned(),
            )
            .await?;

        // Create MealType enum
        manager
            .get_connection()
            .execute(Statement::from_string(
                manager.get_database_backend(),
                "CREATE TYPE meal_type AS ENUM ('Breakfast', 'MorningSnack', 'Lunch', 'EveningSnack', 'Dinner' )".to_string(),
            ))
            .await?;

        // Create Meal table
        manager
            .create_table(
                Table::create()
                    .table(Meal::Table)
                    .col(
                        ColumnDef::new(Meal::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Meal::MealType).string_len(20).not_null())
                    .col(ColumnDef::new(Meal::DayId).integer().not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_meal_day")
                            .from(Meal::Table, Meal::DayId)
                            .to(Day::Table, Day::Id),
                    )
                    .to_owned(),
            )
            .await?;

        // Create MealFood table
        manager
            .create_table(
                Table::create()
                    .table(MealFood::Table)
                    .col(ColumnDef::new(MealFood::MealId).integer().not_null())
                    .col(ColumnDef::new(MealFood::FoodCode).string().not_null())
                    .col(ColumnDef::new(MealFood::Servings).float().not_null())
                    .primary_key(
                        Index::create()
                            .name("pk_meal_food")
                            .col(MealFood::MealId)
                            .col(MealFood::FoodCode),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_meal_food_meal")
                            .from(MealFood::Table, MealFood::MealId)
                            .to(Meal::Table, Meal::Id),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_meal_food_food")
                            .from(MealFood::Table, MealFood::FoodCode)
                            .to(Food::Table, Food::Code),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(MealFood::Table).to_owned())
            .await?;

        manager
            .drop_table(Table::drop().table(Meal::Table).to_owned())
            .await?;

        manager
            .get_connection()
            .execute(Statement::from_string(
                manager.get_database_backend(),
                "DROP TYPE IF EXISTS meal_type".to_string(),
            ))
            .await?;

        manager
            .drop_table(Table::drop().table(Day::Table).to_owned())
            .await?;

        manager
            .drop_table(Table::drop().table(User::Table).to_owned())
            .await?;

        manager
            .drop_table(Table::drop().table(DailyGoal::Table).to_owned())
            .await?;

        manager
            .drop_table(Table::drop().table(Food::Table).to_owned())
            .await
    }
}