export function findKeysBySymptoms(symptomsToFind, symptomsObject) {
    const selectedBodyPartWithSymptoms = {};

    for (const [key, symptoms] of Object.entries(symptomsObject)) {
        const matchingSymptoms = symptomsToFind.filter((symptom) => symptoms.includes(symptom));

        if (matchingSymptoms.length > 0) {
            selectedBodyPartWithSymptoms[key] = matchingSymptoms;
        }
    }

    return Object.keys(selectedBodyPartWithSymptoms).length > 0
        ? selectedBodyPartWithSymptoms
        : null;
}

// Function to remove objects based on a specific value in the 'symptoms' property
export function removeObjectsByValue(symptomArray, valuesToRemove) {
    return symptomArray.filter((obj) => {
        // Check if any value in 'valuesToRemove' is included in the 'symptoms' array
        return !valuesToRemove.some((value) => obj.symptoms.includes(value));
    });
}
