const cors = require('cors');
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const corsHandler = cors({ origin: true });
try { admin.initializeApp(functions.config().firebase) } catch (e) { console.log(e) }

exports.getAllBenefits = (req, res) => {
    corsHandler(req, res, async () => {
        const benefitsRef = admin.database().ref("benefits");
        const benefitsData = await benefitsRef.once('value');
        const benefitsDataJSON = benefitsData.toJSON();
        res.status(200).json(
            benefitsDataJSON
        );
    });
};

exports.getBenefitById = async(req, res) => {
    corsHandler(req, res, async () => {
        const benefitId = req.query.benefitId;
        const benefitsRef = admin.database().ref("benefits");
        const benefitsData = await benefitsRef.once('value');
        const searchedBenefitData = benefitsData.child(benefitId);
        const searchedBenefitDataJSON = searchedBenefitData.toJSON();

        if(!searchedBenefitDataJSON || searchedBenefitDataJSON.deleteDate) {
            res.status(404).json(
                {
                    errorMessages : ["There is no existing benefit/coBenefit with the Id provided."]
                }
            );
        }
        searchedBenefitDataJSON.benefitId = benefitId
        res.status(200).json(
            searchedBenefitDataJSON
        );
    });
};

exports.createBenefitById = async(req, res) => {
    corsHandler(req, res, async () => {
        const benefitBody = req.body;
        const { newBenefitId, benefitSerial } = await addBenefitID(benefitBody);
        const benefitsRef = admin.database().ref("benefits");
        const { hasError, errorMessages } = await checkBenefitBody(benefitBody, true, newBenefitId);

        if (hasError) {
            res.status(409).json(
                {
                    errorMessages : errorMessages
                }
            );
        } else {
            const benefitId = benefitBody["benefitId"];
            delete benefitBody["benefitId"];
            benefitBody.status = false;
            benefitBody.registerDate = new Date().toISOString();
            if(benefitBody["isBenefit"]){
                benefitBody.benefitSerial = benefitSerial;
            }
            await benefitsRef.child(newBenefitId).set(benefitBody);
            await updateParentBenefit(benefitId, benefitBody["isBenefit"], newBenefitId, benefitSerial);
            benefitBody.benefitId = newBenefitId;
            res.status(200).json(
                benefitBody
            );
        }
    });
};

exports.updateBenefitById = async(req, res) => {
    corsHandler(req, res, async () => {
        const benefitBody = req.body;
        const benefitId = benefitBody.benefitId;
        const benefitsRef = admin.database().ref("benefits");
        const benefitsData = await benefitsRef.once('value');
        const searchedBenefitData = benefitsData.child(benefitId);
        const searchedBenefitDataJSON = searchedBenefitData.toJSON();

        if(!searchedBenefitDataJSON || searchedBenefitDataJSON.deleteDate) {
            res.status(404).json(
                {
                    errorMessage : "There is no existing benefit/coBenefit with the Id provided."
                }
            );
        } else {
            const { hasError, errorMessages } = checkBenefitBody(benefitBody);

            if (hasError) {
                res.status(409).json(
                    {
                        errorMessages : errorMessages
                    }
                );
            } else {
                searchedBenefitDataJSON.name = benefitBody.name;
                searchedBenefitDataJSON.updateDate = new Date().toISOString();
                await benefitsRef.child(benefitId).set(searchedBenefitDataJSON);
                searchedBenefitDataJSON.benefitId = benefitId;
                res.status(200).json(
                    searchedBenefitDataJSON
                );
            }
        }
    });
};

exports.deleteBenefitById = async(req, res) => {
    corsHandler(req, res, async () => {
        const benefitBody = req.body;
        const benefitId = benefitBody.benefitId;

        const benefitsRef = admin.database().ref("benefits");
        const benefitsData = await benefitsRef.once('value');
        const searchedBenefitData = benefitsData.child(benefitId);
        const searchedBenefitDataJSON = searchedBenefitData.toJSON();

        if(!searchedBenefitDataJSON || searchedBenefitDataJSON.deleteDate) {
            res.status(404).json(
                {
                    errorMessages : ["There is no existing benefit/coBenefit with the Id provided."]
                }
            );
        } else {
            const { coBenefitsDeleted } = await checkStatusOfBenefitToDelete(benefitId, benefitsRef);
            searchedBenefitDataJSON.deleteDate = new Date().toISOString();
            await benefitsRef.child(benefitId).set(searchedBenefitDataJSON);
            if(coBenefitsDeleted.length > 0) {
                searchedBenefitDataJSON.coBenefitsDeleted = coBenefitsDeleted;
            }
            res.status(200).json(
                searchedBenefitDataJSON
            );
        }
    });
};

const checkBenefitBody = async(
{
    benefitId,
    benefitBranchId,
    isBenefit,
    coBenefits,
    name,
    benefitSerial
}, isCreate = false, newBenefitId) => {
    let errorMessages = [];
    let hasError = false;
    const benefitsRef = admin.database().ref("benefits");

    if(!benefitId) {
        hasError = true;
        errorMessages = [...errorMessages, "No benefit id sent, can't create"];
    }

    if(isCreate) {
        const branchesRef = admin.database().ref("branches");
        const branch = await branchesRef.orderByKey().startAt(benefitBranchId).limitToFirst(1).once("value");
        const branchJSON = branch.toJSON();
        if(!branchJSON) {
            hasError = true;
            errorMessages = [...errorMessages, "The branch Id could not be found."];
        }

        const benefitToCreate = await benefitsRef.once("value");
        const benefitToCreateExists = benefitToCreate.child(newBenefitId).exists();

        if(benefitToCreateExists) {
            hasError = true;
            errorMessages = [...errorMessages, "Benefit id already exists"];
        }

        if(isBenefit === null || isBenefit === undefined) {
            hasError = true;
            errorMessages = [...errorMessages, "No isBenefit parameter found"];
        }

        if(isBenefit === false) {
            const benefitsRef = admin.database().ref("benefits");
            const benefit = await benefitsRef.orderByKey().startAt(benefitId+"-"+'000').limitToFirst(1).once("value");
            const benefitJSON = benefit.toJSON();
            if(!benefitJSON) {
                hasError = true;
                errorMessages = [...errorMessages, "No parent benefit found, please create one."];
            }
        }
    }

    if(!name) {
        hasError = true;
        errorMessages = [...errorMessages, "Benefit name is not valid"];
    }

    return { hasError, errorMessages };
};

const addBenefitID = async({ benefitId, isBenefit }) => {
    let benefitSerial = 0;
    if(!isBenefit) {
        const benefitsRef = admin.database().ref("benefits");
        const benefit = await benefitsRef.orderByKey().startAt(benefitId + "-" + '000').limitToFirst(1).once("value");
        const benefitJSON = benefit.toJSON();
        if (benefitJSON) {
            benefitSerial = benefitJSON[benefitId + "-" + '000'].benefitSerial + 1;
        }
    }
    const newBenefitId = benefitSerial > 9 ? benefitId+'-'+"0"+benefitSerial : benefitId+'-'+"00"+benefitSerial;
    return { newBenefitId, benefitSerial };
};

const updateParentBenefit = async(benefitId, isBenefit, newBenefitId, benefitSerial ) => {
    if(isBenefit === false) {
        const benefitsRef = admin.database().ref("benefits");
        const benefit = await benefitsRef.orderByKey().startAt(benefitId+"-"+'000').limitToFirst(1).once("value");
        const benefitJSON = benefit.toJSON();
        if(benefitJSON) {
            const realBenefitJSON = benefitJSON[benefitId + "-" + '000'];
            if(realBenefitJSON.coBenefits) {
                realBenefitJSON.coBenefits = Object.keys(realBenefitJSON.coBenefits).map(k => realBenefitJSON.coBenefits[k])
                realBenefitJSON.coBenefits.push(newBenefitId);

            } else {
                realBenefitJSON.coBenefits = [newBenefitId];
            }
            realBenefitJSON.benefitSerial = benefitSerial;
            await benefitsRef.child(benefitId+"-"+'000').set(realBenefitJSON);
        }
    }
};

const checkStatusOfBenefitToDelete = async(benefitId, benefitsRef) => {
    const benefitIdSplit = benefitId.split("-");
    const isBenefit = benefitIdSplit[benefitIdSplit.length - 1] === "000";
    let coBenefitsDeleted = [];
    const snapshot = await benefitsRef.once('value');
    if(isBenefit) {
        const benefitData = snapshot.child(benefitId);
        const benefitDataJSON = benefitData.toJSON();
        if(benefitDataJSON) {
            if(benefitDataJSON.coBenefits && Object.keys(benefitDataJSON.coBenefits.length > 0)) {
                coBenefitsDeleted = deleteAllCobenefits(benefitDataJSON, snapshot, benefitsRef);
            }
        }
    } else {
        const parentBenefitId = benefitIdSplit[0]+"-"+"000";
        const benefitData = snapshot.child(parentBenefitId);
        const benefitDataJSON = benefitData.toJSON();
        if(benefitDataJSON) {
            if(benefitDataJSON.coBenefits && Object.keys(benefitDataJSON.coBenefits.length > 0)) {
                removeBenefitIdFromCobenefitsArray(benefitId, parentBenefitId, benefitDataJSON, benefitsRef);
            }
        }
    }
    return { coBenefitsDeleted };
};

const deleteAllCobenefits = (benefitDataJSON, snapshot, benefitsRef) => {
    return Object.keys(benefitDataJSON.coBenefits).map(k => deleteCobenefitFromBenefit(benefitDataJSON.coBenefits[k], snapshot, benefitsRef));
};

const deleteCobenefitFromBenefit = (cobenefitId, snapshot, benefitsRef) => {
    const coBenefitData = snapshot.child(cobenefitId);
    const coBenefitDataJSON = coBenefitData.toJSON();
    if(coBenefitDataJSON) {
        coBenefitDataJSON.deleteDate = new Date().toISOString();
        benefitsRef.child(cobenefitId).set(coBenefitDataJSON);
    }
    return coBenefitDataJSON;
};

const removeBenefitIdFromCobenefitsArray = (benefitId, parentBenefitId, benefitDataJSON, benefitsRef) => {
    const newKeys =  Object.keys(benefitDataJSON.coBenefits).filter(k => benefitDataJSON.coBenefits[k] !== benefitId);
    benefitDataJSON.coBenefits = newKeys.map(k => benefitDataJSON.coBenefits[k]);
    benefitsRef.child(parentBenefitId).set(benefitDataJSON);
};

