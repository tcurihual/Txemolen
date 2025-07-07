use axum::{extract::{Path, State}, Json, http::StatusCode};
use sea_orm::{ActiveModelTrait, ActiveValue::Set, ColumnTrait, EntityTrait, QueryFilter};
use serde_json::json;
use crate::models::{food,meal, meal_food, day,  user};
use crate::AppState;

pub async fn get_foods(
    State(state): State<AppState>,
) -> Result<Json<Vec<food::Model>>, (StatusCode, String)> {
    let list = food::Entity::find()
        .all(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(list))
}

#[derive(serde::Deserialize)]
pub struct AddFoodDto {
    pub user_id: i32,
    pub meal_type: String,    
    pub food_code: String,
    pub servings: f32,
}

pub async fn add_food(
    State(state): State<AppState>,
    Json(payload): Json<AddFoodDto>,
) -> Result<StatusCode, (StatusCode, String)> {
    let today = chrono::Utc::now().date_naive();

    let user_model = user::Entity::find_by_id(payload.user_id)
        .one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::BAD_REQUEST, "Usuario no encontrado".into()))?;

    let daily_goal_id = user_model.daily_goal_id
        .ok_or((StatusCode::BAD_REQUEST, "El usuario no tiene daily_goal asignado".into()))?;

    let day_model = day::Entity::find()
        .filter(day::Column::UserId.eq(payload.user_id))
        .filter(day::Column::Date.eq(today))
        .one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let day = match day_model {
        Some(d) => d,
        None => {
            let mut new_day = <day::ActiveModel as std::default::Default>::default();
            new_day.user_id = Set(payload.user_id);
            new_day.date = Set(today);
            new_day.completed = Set(false);
            new_day.daily_goal_id = Set(daily_goal_id);
            new_day.insert(&state.db)
                .await
                .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        }
    };

    let meal_enum = payload.meal_type.parse::<meal::MealType>()
        .map_err(|_| (StatusCode::BAD_REQUEST, "Tipo inválido".into()))?;

    let meal_model = meal::Entity::find()
        .filter(meal::Column::DayId.eq(day.id))
        .filter(meal::Column::MealType.eq(meal_enum.clone()))
        .one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let meal_rec = match meal_model {
        Some(m) => m,
        None => {
            let mut am = <meal::ActiveModel as std::default::Default>::default();
            am.day_id = Set(day.id);
            am.meal_type = Set(meal_enum.clone());
            am.insert(&state.db)
                .await
                .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        }
    };

    // Insertar relación meal_food
    let mut mfm = <meal_food::ActiveModel as std::default::Default>::default();
    mfm.meal_id = Set(meal_rec.id);
    mfm.food_code = Set(payload.food_code.clone());
    mfm.servings = Set(payload.servings);
    mfm.insert(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(StatusCode::CREATED)
}

pub async fn get_consumed(
    Path(user_id): Path<i32>,
    State(state): State<AppState>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    let today = chrono::Utc::now().date_naive();
    // Cargar en batch: día -> comidas -> meal_foods con foods
    let days = day::Entity::find()
        .filter(day::Column::UserId.eq(user_id))
        .filter(day::Column::Date.eq(today))
        .find_with_related(meal::Entity)
        .all(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let mut results = Vec::new();
    for (_day, meals) in days {
        let mfs = meal_food::Entity::find()
            .filter(meal_food::Column::MealId.is_in(meals.iter().map(|m| m.id).collect::<Vec<_>>()))
            .find_with_related(food::Entity)
            .all(&state.db)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

        for (mf, food_model) in mfs {
            if let Some(meal) = meals.iter().find(|m| m.id == mf.meal_id) {
                results.push(json!({
                    "meal_type": meal.meal_type,
                    "food": food_model,
                    "servings": mf.servings,
                }));
            }
        }
    }
    Ok(Json(serde_json::Value::Array(results)))
}