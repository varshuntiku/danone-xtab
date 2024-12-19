import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    step1: {},
    step2: { symptoms: [], selectedBodyPartWithSymptoms: {}, symptom_details: [] },
    step3: { medical_history: [], fam_medical_history: [], personal_history: [] }
};

const diagnosisFormDataSlice = createSlice({
    name: 'diagnosisFormData',
    initialState,
    reducers: {
        updateDiagnosisFormData: (state, action) => {
            const { step, fieldName, value } = action.payload;
            state[step][fieldName] = value;
        },
        resetDiagnosisFormData: () => {
            return initialState;
        }
    }
});

export const { updateDiagnosisFormData, resetDiagnosisFormData } = diagnosisFormDataSlice.actions;
export default diagnosisFormDataSlice.reducer;
