use crate::models::user::{BiometricUpdateDTO, Gender, ActivityLevel};

pub fn calculate_bmr(biometric_data: &BiometricUpdateDTO) -> f32 {
    if let Some(fat_percentage) = biometric_data.fat_percentage {
        // Fórmula de Katch-McArdle: BMR = 370 + (21.6 * Lean Body Mass)
        let lean_mass = biometric_data.weight * (1.0 - (fat_percentage / 100.0));
        370.0 + (21.6 * lean_mass)
    } else {
        // Fórmula de Mifflin-St Jeor
        if biometric_data.gender == Gender::Male {
            (10.0 * biometric_data.weight) + (6.25 * biometric_data.height) - (5.0 * biometric_data.age as f32) + 5.0
        } else { // Gender::Female
            (10.0 * biometric_data.weight) + (6.25 * biometric_data.height) - (5.0 * biometric_data.age as f32) - 161.0
        }
    }
}

pub fn calculate_tdee(bmr: f32, activity_level: &ActivityLevel) -> f32 {
    bmr * activity_level.get_factor()
}

pub fn calculate_macronutrients(tdee: f32) -> (f32, f32, f32) {
    // Proporciones de ejemplo (ej. 30% proteína, 40% carbos, 30% grasa)
    // 1g Proteína = 4 kcal
    // 1g Carbohidratos = 4 kcal
    // 1g Grasa = 9 kcal

    let protein_kcal = tdee * 0.30;
    let carbos_kcal = tdee * 0.40;
    let fat_kcal = tdee * 0.30;

    let protein_grams = protein_kcal / 4.0;
    let carbos_grams = carbos_kcal / 4.0;
    let fat_grams = fat_kcal / 9.0;

    (protein_grams, carbos_grams, fat_grams)
}