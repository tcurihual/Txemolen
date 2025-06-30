use axum::{
    extract::State,
    {Json},
    http::StatusCode,
};
use sea_orm::{ActiveModelTrait, ActiveValue::NotSet, EntityTrait, Set};
use sea_orm::{IntoActiveModel};

use crate::{
    models::{
        daily_goal, user::{self, BiometricManagementResponse, BiometricUpdateDTO} 
    },
    AppState,
};
use crate::middlewares::auth::VerifiedOwner; 
use crate::utils::biometrics::{calculate_bmr, calculate_tdee, calculate_macronutrients};
use crate::utils::conversions; 

pub async fn biometrics_management(
    State(state): State<AppState>,
    VerifiedOwner(user_id): VerifiedOwner,
    Json(biometric_data): Json<BiometricUpdateDTO>,
) -> Result<Json<BiometricManagementResponse>, (StatusCode, String)> {
    let user_model = user::Entity::find_by_id(user_id)
        .one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::NOT_FOUND, "User not found".to_string()))?;

    let bmr = calculate_bmr(&biometric_data);
    let tdee = calculate_tdee(bmr, &biometric_data.activity_level);
    let (protein, carbos, fat) = calculate_macronutrients(tdee);

    let mut daily_goal_active_model: daily_goal::ActiveModel;
    let current_daily_goal_model: daily_goal::Model;

    if let Some(daily_goal_id) = user_model.daily_goal_id {
        let existing_daily_goal = daily_goal::Entity::find_by_id(daily_goal_id)
            .one(&state.db)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

        if let Some(goal) = existing_daily_goal {
            daily_goal_active_model = goal.into_active_model();
            daily_goal_active_model.kcal = Set(tdee);
            daily_goal_active_model.protein = Set(protein);
            daily_goal_active_model.carbos = Set(carbos);
            daily_goal_active_model.fat = Set(fat);

            current_daily_goal_model = daily_goal_active_model.update(&state.db)
                .await
                .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
        } else {
            daily_goal_active_model = daily_goal::ActiveModel {
                id: NotSet, 
                kcal: Set(tdee),
                protein: Set(protein),
                carbos: Set(carbos),
                fat: Set(fat),
            };
            current_daily_goal_model = daily_goal_active_model.insert(&state.db)
                .await
                .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
        }
    } else {
        daily_goal_active_model = daily_goal::ActiveModel {
            id: NotSet,
            kcal: Set(tdee),
            protein: Set(protein),
            carbos: Set(carbos),
            fat: Set(fat),
        };
        current_daily_goal_model = daily_goal_active_model.insert(&state.db)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    }

    let mut user_active_model: user::ActiveModel = user_model.into_active_model();

    user_active_model.gender = Set(Some(biometric_data.gender));
    user_active_model.age = Set(Some(biometric_data.age));
    user_active_model.weight = Set(Some(biometric_data.weight));
    user_active_model.height = Set(Some(biometric_data.height));
    user_active_model.fat_percentage = Set(biometric_data.fat_percentage);
    user_active_model.activity_level = Set(Some(biometric_data.activity_level));
    user_active_model.daily_goal_id = Set(Some(current_daily_goal_model.id));

    let updated_user_model = user_active_model.update(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(BiometricManagementResponse {
        user: conversions::to_response(&updated_user_model),
        daily_goal: current_daily_goal_model, 
    }))
}