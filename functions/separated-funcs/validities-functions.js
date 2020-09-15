const cors = require('cors');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const corsHandler = cors({ origin: true });
try { admin.initializeApp(functions.config().firebase) } catch (e) { console.log(e) }

// Obtiene todas las vigencias dados de alta
exports.getAllValidities = (req, res) => {
    corsHandler(req, res, async () => {
        const validitiesRef = admin.database().ref("validities");
        const validitiesData = await validitiesRef.once('value');
        const validitiesDataJSON = validitiesData.toJSON();
        res.status(200).json(
            validitiesDataJSON
        );
    });
}

// Obtiene una vigencia con la información dada de alta
exports.getValidityById = async (req, res) => {
    corsHandler(req, res, async () => {
        const validityId = req.query.validityId;
        const validitiesRef = admin.database().ref("validities");
        const validitiesData = await validitiesRef.once('value');
        const searchedValidityData = validitiesData.child(validityId);
        const searchedValidityDataJSON = searchedValidityData.toJSON();

        if(!searchedValidityDataJSON || searchedValidityDataJSON.deleteDate) {
            res.status(404).json(
                {
                    errorMessage : "There is no existing validity with the Id provided."
                }
            );
        }

        res.status(200).json(
            searchedValidityDataJSON
        );
    });
};

// Crea una vigencia con la información proporcionada
exports.createValidityById = async (req, res) => {
    corsHandler(req, res, async () => {
        const validityBody = req.body;
        const newValidityId = validityBody.validityId;
        const validitiesRef = admin.database().ref("validities");
        const { hasError, errorMessages } = await checkValidityBody(validityBody, true);

        if (hasError) {
            res.status(409).json(
                {
                    errorMessages : errorMessages
                }
            );
        } else {
            delete validityBody["validityId"];
            validityBody.status = false;
            validityBody.registerDate = new Date().toISOString();
            await validitiesRef.child(newValidityId).set(validityBody);
            validityBody.validityId = newValidityId;
            res.status(200).json(
                validityBody
            );
        }
    });
};

// Actualiza una vigencia con la información proporcionada
exports.updateValidityById = async (req, res) => {
    corsHandler(req, res, async () => {
        const validityBody = req.body;
        const validityId = validityBody.validityId;
        const validitiesRef = admin.database().ref("validities");
        const validitiesData = await validitiesRef.once('value');
        const searchedValidityData = validitiesData.child(validityId);
        const searchedValidityDataJSON = searchedValidityData.toJSON();
        if(!searchedValidityDataJSON) {
            res.status(404).json(
                {
                    errorMessage : "There is no existing validity with the Id provided."
                }
            );
        } else {
            const { hasError, errorMessages } = await checkValidityBody(validityBody);

            if (hasError) {
                res.status(409).json(
                    {
                        errorMessages : errorMessages
                    }
                );
            } else {
                searchedValidityDataJSON.nameEsp = validityBody.nameEsp;
                searchedValidityDataJSON.nameEng = validityBody.nameEsp;
                searchedValidityDataJSON.typeOfNuit = validityBody.typeOfNuit;
                searchedValidityDataJSON.units = validityBody.units;
                if (validityBody.pr1) {
                    searchedValidityDataJSON.pr1 = validityBody.pr1;
                }
                if (validityBody.pr2) {
                    searchedValidityDataJSON.pr2 = validityBody.pr2;
                }
                searchedValidityDataJSON.updateDate = new Date().toISOString();

                await validitiesRef.child(validityId).set(searchedValidityDataJSON);
                searchedValidityDataJSON.validityId = validityId;
                res.status(200).json(
                    searchedValidityDataJSON
                );
            }
        }
    });
};

// Baja lógica de una vigencia
exports.deleteValidityById = async (req, res) => {
    corsHandler(req, res, async () => {
        const validityBody = req.body;
        const validityId = validityBody.validityId;
        const validitiesRef = admin.database().ref("validities");
        const validitiesData = await validitiesRef.once('value');
        const searchedValidityData = validitiesData.child(validityId);
        const searchedValidityDataJSON = searchedValidityData.toJSON();

        if(!searchedValidityDataJSON) {
            res.status(404).json(
                {
                    errorMessage : "There is no existing validity with the Id provided."
                }
            );
        } else {
            searchedValidityDataJSON.deleteDate = new Date().toISOString();
            await validitiesRef.child(validityId).set(searchedValidityDataJSON);
            res.status(200).json(
                searchedValidityDataJSON
            );
        }
    });
};

const checkValidityBody = async(
    {
        validityId,
        nameEsp,
        nameEng,
        typeOfNuit,
        units,
        pr1,
        pr2
    }, isCreate = false) => {
        const specialCharsRegex = new RegExp(/[!@#$%^&*(),.?":{}|<>/=¿`]/, 'ig');
        let errorMessages = [];
        let hasError = false;

        const validitiesRef = admin.database().ref("validities");

        if(isCreate) {
            const validityToCreate = await validitiesRef.child(validityId).once("value");
            const validityToCreateJSON = validityToCreate.toJSON();

            if(validityToCreateJSON) {
                hasError = true;
                errorMessages = [...errorMessages, 'A validity with that Id "' + validityId +  '" already exist. Please verify the information'];
            }
        }
        if(!nameEsp || nameEsp === '' || specialCharsRegex.test(nameEsp) || nameEsp.length > 50) {
            hasError = true;
            errorMessages = [...errorMessages, 'Please add a valid spanish name that has less than or equal to 50 characters.'];
        }
        if(!nameEng || nameEng === '' || specialCharsRegex.test(nameEng) || nameEng.length > 50) {
            hasError = true;
            errorMessages = [...errorMessages, 'Please add a valid english name that has less than or equal to 50 characters.'];
        }
        if(!typeOfNuit || typeOfNuit === '' || specialCharsRegex.test(typeOfNuit) || typeOfNuit.length > 30) {
            hasError = true;
            errorMessages = [...errorMessages, 'Please add a valid typeOfNuit that has less than or equal to 30 characters.'];
        }
        if(!units || Number.isNaN(Number(units))) {
            hasError = true;
            errorMessages = [...errorMessages, 'Please add a valid value for units that is a real number.'];
        }
        if(pr1 && (pr1 === '' || pr1.length > 15)) {
            hasError = true;
            errorMessages = [...errorMessages, 'The "pr1" needs to be less than or equal to 15 characters.'];
        }
        if(pr2 && (pr2 === '' || pr2.length > 15)) {
            hasError = true;
            errorMessages = [...errorMessages, 'The "pr2" needs to be less than or equal to 15 characters.'];
        }

        return { hasError, errorMessages };
    }
;