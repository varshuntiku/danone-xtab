import { useState } from 'react';
import './body.css';
import './HumanBody.css';
import './BodyColor.css';
import MenFrontBodyComponent from './MenFrontBodyComponent';
import MenBackBodySvgComponent from './MenBackBodySvgComponent';
import FemaleFrontBodyComponent from './FemaleFrontBodyComponent';
import FemaleBackBodyComponent from './FemaleBackBodyComponent';

const HumanBody = () => {
    const [rotateModel, setRotateModel] = useState(true);
    const [selectedGender, setSelectedGender] = useState('male');
    const [isModalOpen] = useState(false);
    // const [activePath, setActivePath] = useState(null); // active class change
    // const [selectedPaths, setSelectedPaths] = useState([]); // selected paths array

    const handleSwitchChange = () => {
        // Toggle between 'male' and 'female'
        const newGender = selectedGender === 'male' ? 'female' : 'male';
        setSelectedGender(newGender);
    };

    // useEffect(() => {
    //   const handleClickOutside = (event) => {
    //     // Check if the click target is not a child of the SVG element
    //     if (event.target.closest('svg') === null) {
    //       // Remove the active class
    //       setActivePath(null);
    //     }
    //   };

    //   // Add global click event listener
    //   document.addEventListener('click', handleClickOutside);

    //   // Cleanup the event listener on component unmount
    //   return () => {
    //     document.removeEventListener('click', handleClickOutside);
    //   };
    // }, []);

    const handlePieceClick = (event) => {
        /**
         * classes:
         * body active sc-body-model-svg__path--active
         * body selected sc-body-model-svg__path--selected
         *
         */

        // Remove 'sc-body-model-svg__path--active' from all paths
        const activePath = document.querySelector('.sc-body-model-svg__path--active');
        if (activePath) {
            // Get the id attribute value
            // const idValue = activePath.getAttribute('id');
            activePath.classList.remove('sc-body-model-svg__path--active');
        }

        // Get the id or class of the clicked path
        const pathClass = event.target.getAttribute('class');

        // Check if the element exists
        if (pathClass) {
            // Add the 'newClass' and remove the 'originalClass'
            event.target.setAttribute('class', `${pathClass} sc-body-model-svg__path--active`);
        }
    };

    const handleRotateModel = () => setRotateModel(!rotateModel);

    const maleBody = () => {
        return rotateModel ? (
            <MenFrontBodyComponent handlePieceClick={handlePieceClick} />
        ) : (
            <MenBackBodySvgComponent handlePieceClick={handlePieceClick} />
        );
    };

    const femaleBody = () => {
        return rotateModel ? (
            <FemaleFrontBodyComponent handlePieceClick={handlePieceClick} />
        ) : (
            <FemaleBackBodyComponent handlePieceClick={handlePieceClick} />
        );
    };

    return (
        <>
            <div className="sc-body-model-height-width">
                <div>
                    <label>
                        Male
                        <input
                            type="checkbox"
                            checked={selectedGender === 'male'}
                            onChange={handleSwitchChange}
                        />
                    </label>
                    <label>
                        Female
                        <input
                            type="checkbox"
                            checked={selectedGender === 'female'}
                            onChange={handleSwitchChange}
                        />
                    </label>
                    <p>Selected Gender: {selectedGender}</p>
                </div>

                <div className="sc-body-model evidence-search-body-widget__body-model">
                    <div className="ui-dropdown ui-dropdown--compact sc-body-model__dropdown">
                        {selectedGender === 'male' ? maleBody() : femaleBody()}
                    </div>

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
                </div>
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{/*selectedBodyPart*/} Details</h2>
                        {/* Add content for the modal, e.g., additional information, dropdowns, etc. */}
                        <button>Close</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default HumanBody;
