const cors = require('cors');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const corsHandler = cors({ origin: true });
try { admin.initializeApp(functions.config().firebase) } catch (e) { console.log(e) }

// Obtiene todos los planes dados de alta
exports.getAllPlans = (req, res) => {
    corsHandler(req, res, async () => {
        const plansRef = admin.database().ref("plans");
        const plansData = await plansRef.once('value');
        const plansDataJSON = plansData.toJSON();
        res.status(200).json(
            plansDataJSON
        );
    });
}

// Obtiene un plan con la información dada de alta
exports.getPlanById = async (req, res) => {
    corsHandler(req, res, async () => {
        const planId = req.query.planId;
        const plansRef = admin.database().ref("plans");
        const plansData = await plansRef.once('value');
        const searchedPlanData = plansData.child(planId);
        const searchedPlanDataJSON = searchedPlanData.toJSON();

        if(!searchedPlanDataJSON || searchedPlanDataJSON.deleteDate) {
            res.status(404).json(
                {
                    errorMessage : "There is no existing plan with the Id provided."
                }
            );
        }

        res.status(200).json(
            searchedPlanDataJSON
        );
    });
};

// Crea un plan con la información proporcionada
exports.createPlanById = async (req, res) => {
    corsHandler(req, res, async () => {
        const planBody = req.body;
        const newPlanId = planBody.planId;
        const plansRef = admin.database().ref("plans");
        const { hasError, errorMessages } = await checkPlanBody(planBody, true);

        if (hasError) {
            res.status(409).json(
                {
                    errorMessages : errorMessages
                }
            );
        } else {
            delete planBody["planId"];
            planBody.status = false;
            planBody.registerDate = new Date().toISOString();
            await plansRef.child(newPlanId).set(planBody);
            planBody.planId = newPlanId;
            res.status(200).json(
                planBody
            );
        }
    });
};

// Actualiza un plan con la información proporcionada
exports.updatePlanById = async (req, res) => {
    corsHandler(req, res, async () => {
        const planBody = req.body;
        const planId = planBody.planId;
        const plansRef = admin.database().ref("plans");
        const plansData = await plansRef.once('value');
        const searchedPlanData = plansData.child(planId);
        const searchedPlanDataJSON = searchedPlanData.toJSON();
        if(!searchedPlanDataJSON) {
            res.status(404).json(
                {
                    errorMessage : "There is no existing plan with the Id provided."
                }
            );
        } else {
            const { hasError, errorMessages } = await checkPlanBody(planBody);

            if (hasError) {
                res.status(409).json(
                    {
                        errorMessages : errorMessages
                    }
                );
            } else {
                searchedPlanDataJSON.description = planBody.description;
                searchedPlanDataJSON.fare = planBody.description;
                searchedPlanDataJSON.name = planBody.name;
                searchedPlanDataJSON.updateDate = new Date().toISOString();

                await plansRef.child(planId).set(searchedPlanDataJSON);
                searchedPlanDataJSON.planId = planId;
                res.status(200).json(
                    searchedPlanDataJSON
                );
            }
        }
    });
};

// Baja lógica de un plan
exports.deletePlanById = async (req, res) => {
    corsHandler(req, res, async () => {
        const planBody = req.body;
        const planId = planBody.planId;
        const plansRef = admin.database().ref("plans");
        const plansData = await plansRef.once('value');
        const searchedPlanData = plansData.child(planId);
        const searchedPlanDataJSON = searchedPlanData.toJSON();

        if(!searchedPlanDataJSON) {
            res.status(404).json(
                {
                    errorMessage : "There is no existing plan with the Id provided."
                }
            );
        } else {
            searchedPlanDataJSON.deleteDate = new Date().toISOString();
            await plansRef.child(planId).set(searchedPlanDataJSON);
            res.status(200).json(
                searchedPlanDataJSON
            );
        }
    });
};

const checkPlanBody = async(
    {
        planId,
        description,
        fare,
        name
    }, isCreate = false) => {
        const specialCharsRegex = new RegExp(/[!@#$%^&*(),.?":{}|<>/=¿`]/, 'ig');
        let errorMessages = [];
        let hasError = false;

        const plansRef = admin.database().ref("plans");

        if(isCreate) {
            const planToCreate = await plansRef.child(planId).once("value");
            const planToCreateJSON = planToCreate.toJSON();

            if(planToCreateJSON && !planToCreateJSON.deleteDate) {
                hasError = true;
                errorMessages = [...errorMessages, 'A plan with that Id "' + planId +  '" already exist. Please verify the information'];
            }
        }
        if(!description || description === '' || specialCharsRegex.test(description) || description.length > 50) {
            hasError = true;
            errorMessages = [...errorMessages, 'Please add a valid description that has less than or equal to 50 characters.'];
        }
        if(!fare || fare === '' || fare.length > 5) {
            hasError = true;
            errorMessages = [...errorMessages, 'Please add a valid fare that has less than or equal to 5 characters.'];
        }
        if(!name || name === '' || specialCharsRegex.test(name) || name.length > 30) {
            hasError = true;
            errorMessages = [...errorMessages, 'Please add a valid name that has less than or equal to 30 characters.'];
        }

        return { hasError, errorMessages };
    }
;