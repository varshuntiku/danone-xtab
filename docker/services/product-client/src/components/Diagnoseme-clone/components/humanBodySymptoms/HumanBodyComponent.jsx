/* eslint-disable no-prototype-builtins */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MenFrontBodyComponent from './MenFrontBodyComponent';
import MenBackBodySvgComponent from './MenBackBodySvgComponent';
import FemaleFrontBodyComponent from './FemaleFrontBodyComponent';
import FemaleBackBodyComponent from './FemaleBackBodyComponent';
import { updateDiagnosisFormData } from '../../store/slices/diagnosisFormDataSlice';

import './body.css';
import './HumanBody.css';
import './BodyColor.css';
import './model.css';

const HumanBodyCompenent = ({ handleSelectChange, allSymptomsList, selectedSymptomsValue }) => {
    const dispatch = useDispatch();
    const selectedBodyPartWithSymptoms = useSelector(
        (state) => state.diagnosisFormData.step2.selectedBodyPartWithSymptoms
    );
    const { step1 } = useSelector((state) => state.diagnosisFormData);
    const [rotateModel, setRotateModel] = useState(true);
    const [selectedBodyPart, setSelectedBodyPart] = useState(null);
    const [selectedSymptoms, setSelectedSymptoms] = useState(selectedSymptomsValue || []);
    const [symptomsList, setSymptomsList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (selectedBodyPart) {
            setSymptomsList(allSymptomsList?.[selectedBodyPart] || []);
        }
    }, [selectedBodyPart]);

    const handleBodyPartClick = (bodyPart) => {
        setSelectedBodyPart(bodyPart);
        setIsModalOpen(true);
        setSelectedSymptoms(selectedSymptomsValue);
    };

    // Function to add or remove a symptom from a specific body part
    const manageSymptom = (bodyPart, symptom, action) => {
        // Check if the bodyPart key exists in the data object
        if (
            // eslint-disable-next-line no-prototype-builtins
            selectedBodyPartWithSymptoms &&
            selectedBodyPartWithSymptoms.hasOwnProperty(bodyPart)
        ) {
            const symptoms = [...selectedBodyPartWithSymptoms[bodyPart]];

            // Check if the action is 'add'
            if (action === 'add') {
                // Check if the symptom is not already present
                if (!symptoms.includes(symptom)) {
                    symptoms.push(symptom);
                }
                // Dispatch the action to update selectedBodyPartWithSymptoms in Redux state
                dispatch(
                    updateDiagnosisFormData({
                        step: 'step2',
                        fieldName: 'selectedBodyPartWithSymptoms',
                        value: { [bodyPart]: symptoms }
                    })
                );
            }
            // Check if the action is 'remove'
            else if (action === 'remove') {
                const index = symptoms.indexOf(symptom);
                // Check if the symptom is present for removal
                if (index !== -1) {
                    symptoms.splice(index, 1);
                }
                // Check if symptoms are empty

                if (symptoms.length === 0) {
                    // Create a copy of the previous state object
                    const updatedBodyPartWithSymptoms = { ...selectedBodyPartWithSymptoms };
                    // Remove the bodyPart key if it exists
                    if (updatedBodyPartWithSymptoms.hasOwnProperty(bodyPart))
                        delete updatedBodyPartWithSymptoms[bodyPart];

                    return dispatch(
                        updateDiagnosisFormData({
                            step: 'step2',
                            fieldName: 'selectedBodyPartWithSymptoms',
                            value: updatedBodyPartWithSymptoms
                        })
                    );
                } else {
                    return dispatch(
                        updateDiagnosisFormData({
                            step: 'step2',
                            fieldName: 'selectedBodyPartWithSymptoms',
                            value: { [bodyPart]: symptoms }
                        })
                    );
                }
            }
            // Return the updated list of symptoms
            return symptoms;
        } else {
            // If bodyPart not found, create a new entry with the specified symptom
            return dispatch(
                updateDiagnosisFormData({
                    step: 'step2',
                    fieldName: 'selectedBodyPartWithSymptoms',
                    value: { [bodyPart]: symptom }
                })
            );
        }
    };

    const handleSymptomSelect = (symptom) => {
        // Toggle the selected state of the symptom
        setSelectedSymptoms((prevSymptoms) => {
            const isSymptomSelected = prevSymptoms.includes(symptom);

            if (isSymptomSelected) {
                // selectedBodyPart adding into the list for body heighlight
                manageSymptom(selectedBodyPart, symptom, 'remove');
                handleSelectChange(
                    this,
                    prevSymptoms.filter((prevSymptom) => prevSymptom !== symptom)
                );
                return prevSymptoms.filter((prevSymptom) => prevSymptom !== symptom);
            } else {
                // selectedBodyPart adding into the list for body heighlight
                manageSymptom(selectedBodyPart, symptom, 'add');
                handleSelectChange(this, [...prevSymptoms, symptom]);
                return [...prevSymptoms, symptom];
            }
        });
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBodyPart(null);
        setSymptomsList([]);
    };

    const handleRotateModel = () => setRotateModel(!rotateModel);

    const maleBody = () => {
        return rotateModel ? (
            <MenFrontBodyComponent
                handleBodyPartClick={handleBodyPartClick}
                selectedBodyPart={selectedBodyPart}
                selectedBodyPartWithSymptoms={selectedBodyPartWithSymptoms}
            />
        ) : (
            <MenBackBodySvgComponent
                handleBodyPartClick={handleBodyPartClick}
                selectedBodyPart={selectedBodyPart}
                selectedBodyPartWithSymptoms={selectedBodyPartWithSymptoms}
            />
        );
    };

    const femaleBody = () => {
        return rotateModel ? (
            <FemaleFrontBodyComponent
                handleBodyPartClick={handleBodyPartClick}
                selectedBodyPart={selectedBodyPart}
                selectedBodyPartWithSymptoms={selectedBodyPartWithSymptoms}
            />
        ) : (
            <FemaleBackBodyComponent
                handleBodyPartClick={handleBodyPartClick}
                selectedBodyPart={selectedBodyPart}
                selectedBodyPartWithSymptoms={selectedBodyPartWithSymptoms}
            />
        );
    };

    return (
        <>
            {step1.gender === 'male' ? maleBody() : femaleBody()}

            <>
                <div
                    className="ui-button ui-button--text sc-body-model__rotate"
                    id="rotate"
                    aria-hidden="true"
                    tabIndex="-1"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        role="img"
                        className="ui-icon ui-button__icon"
                        onClick={handleRotateModel}
                    >
                        <path
                            fillRule="evenodd"
                            d="M40 22c0 1-.453 2.402-3.648 4-1.301.652-2.692 1.117-4.352 1.434v3.957c7.848-1.336 12-4.77 12-9.391 0-6-8.953-10-20-10S4 16 4 22c0 5.43 5.73 9.219 16.45 9.895l-3.762 3.761 2.828 2.828L28 30l-8.484-8.484-2.828 2.828 3.566 3.57c-3.79-.203-6.332-.777-8.606-1.914C8.453 24.402 8 23 8 22s.453-2.402 3.648-4c2.954-1.477 7.317-2 12.352-2s9.398.523 12.352 2C39.547 19.598 40 21 40 22zm0 0"
                        ></path>
                    </svg>
                    <span>Rotate model</span>
                </div>
            </>
            {/* Modal component */}
            {isModalOpen && (
                <div className="modal" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="modal-close" onClick={handleCloseModal}>
                            X
                        </span>
                        {/* <h2>Suggested symptoms for {selectedBodyPart}</h2> */}
                        <h2>Suggestions</h2>
                        <ul>
                            {symptomsList.map((symptom) => (
                                <li
                                    key={symptom}
                                    className={selectedSymptoms.includes(symptom) ? 'selected' : ''}
                                    onClick={() => handleSymptomSelect(symptom)}
                                >
                                    {symptom}
                                </li>
                            ))}
                        </ul>
                        {/* <button onClick={handleCloseModal}>Close</button> */}
                    </div>
                </div>
            )}
        </>
    );
};

export default HumanBodyCompenent;
