const cors = require('cors');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const corsHandler = cors({ origin: true });
try { admin.initializeApp(functions.config().firebase) } catch (e) { console.log(e) }

// Obtiene todos los estados dados de alta
exports.getAllStates = (req, res) => {
    corsHandler(req, res, async () => {
        const statesRef = admin.database().ref("states");
        const statesData = await statesRef.once('value');
        const statesDataJSON = statesData.toJSON();
        res.status(200).json(
            statesDataJSON
        );
    });
}

// Obtiene un estado con la información dada de alta
exports.getStateById = async(req, res) => {
    corsHandler(req, res, async () => {
        const stateId = req.query.stateId;
        const searchedStateDataJSON = await privateGetStateById(stateId);

        if(!searchedStateDataJSON || searchedStateDataJSON.deleteDate) {
            res.status(404).json(
                {
                    errorMessage : "There is no existing state with the Id provided."
                }
            );
        }

        res.status(200).json(
            searchedStateDataJSON
        );
    });
};

exports.getStateByIdInternal = async (stateId) => {
    const searchedStateDataJSON = await privateGetStateById(stateId);
    return searchedStateDataJSON;
}

// Crea un estado con la información proporcionada
exports.createStateById = async (req, res) => {
    corsHandler(req, res, async () => {
        const stateBody = req.body;
        const newStateId = stateBody.stateId;
        const statesRef = admin.database().ref("states");
        const { hasError, errorMessages } = await checkStateBody(stateBody, true);

        if (hasError) {
            res.status(409).json(
                {
                    errorMessages : errorMessages
                }
            );
        } else {
            delete stateBody["stateId"];
            stateBody.status = false;
            stateBody.registerDate = new Date().toISOString();
            await statesRef.child(newStateId).set(stateBody);
            stateBody.stateId = newStateId;
            res.status(200).json(
                stateBody
            );
        }
    });
};

// Actualiza un estado con la información proporcionada
exports.updateStateById = async (req, res) => {
    corsHandler(req, res, async () => {
        const stateBody = req.body;
        const stateId = stateBody.stateId;
        const statesRef = admin.database().ref("states");
        const statesData = await statesRef.once('value');
        const searchedStateData = statesData.child(stateId);
        const searchedStateDataJSON = searchedStateData.toJSON();
        if(!searchedStateDataJSON) {
            res.status(404).json(
                {
                    errorMessage : "There is no existing state with the Id provided."
                }
            );
        } else {
            const { hasError, errorMessages } = await checkStateBody(stateBody);

            if (hasError) {
                res.status(409).json(
                    {
                        errorMessages : errorMessages
                    }
                );
            } else {
                searchedStateDataJSON.name = stateBody.name;
                searchedStateDataJSON.statePercentageTax = stateBody.statePercentageTax;
                searchedStateDataJSON.stateEmblem = stateBody.stateEmblem;
                if (stateBody.statePercentage1) {
                    searchedStateDataJSON.statePercentage1 = stateBody.statePercentage1;
                }
                if (stateBody.statePercentage2) {
                    searchedStateDataJSON.statePercentage2 = stateBody.statePercentage2;
                }
                if (stateBody.stateAmount1) {
                    searchedStateDataJSON.stateAmount1 = stateBody.stateAmount1;
                }
                if (stateBody.stateAmount2) {
                    searchedStateDataJSON.stateAmount2 = stateBody.stateAmount2;
                }
                if (stateBody.stateFlag) {
                    searchedStateDataJSON.stateFlag = stateBody.stateFlag;
                }
                searchedStateDataJSON.updateDate = new Date().toISOString();

                await statesRef.child(stateId).set(searchedStateDataJSON);
                searchedStateDataJSON.stateId = stateId;
                res.status(200).json(
                    searchedStateDataJSON
                );
            }
        }
    });
};

// Baja lógica de un estado
exports.deleteStateById = async (req, res) => {
    corsHandler(req, res, async () => {
        const stateBody = req.body;
        const stateId = stateBody.stateId;
        const statesRef = admin.database().ref("states");
        const statesData = await statesRef.once('value');
        const searchedStateData = statesData.child(stateId);
        const searchedStateDataJSON = searchedStateData.toJSON();

        if(!searchedStateDataJSON) {
            res.status(404).json(
                {
                    errorMessage : "There is no existing state with the Id provided."
                }
            );
        } else {
            searchedStateDataJSON.deleteDate = new Date().toISOString();
            await statesRef.child(stateId).set(searchedStateDataJSON);
            res.status(200).json(
                searchedStateDataJSON
            );
        }
    });
};

async function privateGetStateById(stateId) {
    const statesRef = admin.database().ref("states");
    const statesData = await statesRef.once('value');
    const searchedStateData = statesData.child(stateId);
    const searchedStateDataJSON = searchedStateData.toJSON();
    return searchedStateDataJSON;
}

const checkStateBody = async(
{
    countryId,
    stateId,
    name,
    statePercentageTax,
    statePhoneCode,
    statePercentage1,
    statePercentage2,
    stateAmount1,
    stateAmount2,
    stateEmblem,
    stateFlag
}, isCreate = false) => {
    let errorMessages = [];
    let hasError = false;
    const statesRef = admin.database().ref("states");
    const countriesRef = admin.database().ref("countries");
    const stateToCreate = await statesRef.child(stateId);
    const stateToCreateData = await stateToCreate.once('value');
    const stateToCreateJSON = stateToCreateData.toJSON();
    const countriesData = await countriesRef.once('value');
    const searchedCountryData = countriesData.child(countryId);
    const searchedCountryDataJSON = searchedCountryData.toJSON();
    if(isCreate) {
        if(stateToCreateJSON) {
            hasError = true;
            errorMessages = [...errorMessages, 'A state with that Id "' + stateId +  '" already exist. Please verify the information.'];
        }
    }

    if(!searchedCountryDataJSON) {
        hasError = true;
        errorMessages = [...errorMessages, 'The countryId sent for the state doesnt exist. Please verify the information.'];
    }

    if(!name || name.length > 40) {
        hasError = true;
        errorMessages = [...errorMessages, 'Please add a valid name that has less than or equal to 40 characters.'];
    }

    if(!statePercentageTax || Number.isNaN(Number(statePercentageTax)) ||
    Number(statePercentageTax) < 0 || Number(statePercentageTax) > 100) {
        hasError = true;
        errorMessages = [...errorMessages, 'Please add a valid statePercentageTax that is less than 100.'];
    }

    if(statePhoneCode && (statePhoneCode.length === 0 || statePhoneCode.filter(phone => typeof phone !== 'number'))) {
        hasError = true;
        errorMessages = [...errorMessages, 'Please add one or more valid state phone codes as a number.'];
    }

    if(statePercentage1 && Number.isNaN(Number(statePercentage1)) ||
    Number(statePercentage1) < 0 || Number(statePercentage1) > 1) {
        hasError = true;
        errorMessages = [...errorMessages, 'The "statePercentage1" needs to be less than or equal to 1.'];
    }

    if(statePercentage2 && Number.isNaN(Number(statePercentage2)) ||
    Number(statePercentage2) < 0 || Number(statePercentage2) > 1) {
        hasError = true;
        errorMessages = [...errorMessages, 'The "statePercentage2" needs to be less than or equal to 1.'];
    }

    if(stateAmount1 && Number.isNaN(Number(stateAmount1)) ||
    Number(stateAmount1) < 0 || Number(stateAmount1) > 1){
        hasError = true;
        errorMessages = [...errorMessages, 'The "stateAmount1" needs to be less than or equal to 1.'];
    }

    if(stateAmount2 && Number.isNaN(Number(stateAmount2)) ||
    Number(stateAmount2) < 0 || Number(stateAmount2) > 1) {
        hasError = true;
        errorMessages = [...errorMessages, 'The "stateAmount2" needs to be less than or equal to 1.'];
    }

    if(!stateEmblem){
        hasError = true;
        errorMessages = [...errorMessages, 'Please add a valid url to the image of state emblem.'];
    }

    if(stateFlag && stateFlag === '') {
        hasError = true;
        errorMessages = [...errorMessages, 'Please add a valid url to the image of state flag.']
    }

    return { hasError, errorMessages };
}
