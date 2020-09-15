const cors = require("cors");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const corsHandler = cors({origin: true});
try { admin.initializeApp(functions.config().firebase) } catch (e) { console.log(e) }

exports.getAllMainWorkOrdersByClientId = (req, res) => {
    
};

exports.getAllMainWorkOrdersByDateOfIssue = (req, res) => {

};

exports.getAllMainWorkOrdersByVigency = (req, res) => {

};

exports.createMainWorkOrderById = (req, res) => {
    corsHandler(req, res, async() => {
        const workOrderBody = req.body;
        const packageId = workOrderBody.packageId;
        const packagesRef = admin.database().ref("packages");
        const { hasError, errorMessages } = await checkMainWorkOrderBody(workOrderBody, true, packagesRef);
        if(hasError) {
            res.status(409).json(
                {
                    errorMessages: errorMessages
                }
            )
        } else {
            await addWorkOrderToIntermediaries(workOrderBody);
            workOrderBody.registerDate = new Date().toISOString();
            delete workOrderBody.packageId;
            await packagesRef.child(packageId).set(workOrderBody);
            workOrderBody.packageId = packageId;
            res.status(200).json(
                workOrderBody
            );
        }
    });
};

exports.updateMainWorkOrderById = (req, res) => {

};

exports.deleteMainWorkOrderById = (req, res) => {

};

const checkMainWorkOrderBody = async(
{
    packageId,
    clientId,
    //TODO add an object for intermediary Info
    intermediaries,
    //TODO add an object for all information related to fees
    workOrderFeeInformation,
    fromDate,
    // TODO add DB refs to this las ids
    operatorsId,
    validityId
}, isCreate, packagesRef) => {
    let errorMessages = [];
    let hasError = false;
    const clientsRef = admin.database().ref("clients");
    const packageData = await packagesRef.once("value");
    const doesPackageIdExists = packageData.child(packageId).exists();
    const clientsData = await clientsRef.once("value");
    const doesClientIdExists = clientsData.child(clientId).exists();
    //TODO Add Validities to body check
    //TODO Add operators id check
    if(isCreate) {
        if(doesPackageIdExists) {
            hasError = true;
            errorMessages = [...errorMessages, 'A package with that Id "' + packageId +  '" already exist. Please verify the information.'];
        }
        if(doesClientIdExists) {
            hasError = true;
            errorMessages = [...errorMessages, "No client Id found with the id provided, please check the information."];
        }
        const { hasIntermediaryError, intermediaryErrorMessages } =  await checkIntermediaries(intermediaries);
        if(hasIntermediaryError) {
            hasError = true;
            errorMessages = [...errorMessages, ...intermediaryErrorMessages];
        }
    }
    if(isNaN((new Date(fromDate)).valueOf())) {
        hasError = true;
        errorMessages = [...errorMessages, "Please input a valid date format check UTC IS8601"];
    }
    const { hasWorkOrderError, workOrderErrorMessages } = checkWorkOrderFeeInformation(workOrderFeeInformation);
    if(hasWorkOrderError) {
        hasError = true;
        errorMessages = [...errorMessages, ...workOrderErrorMessages];
    }
    return { hasError, errorMessages };
};

const checkIntermediaries = async(intermediaries) => {
    // salesIntermediaryId,
    // enrollerIntermediaryId,
    // brokerIntermediaryId,
    // promoterIntermediaryId,
    // officeIntermediaryId,
    // percentageCommisionSalesPoint,
    // percentageCommisionEnroller,
    // percentageCommisionBroker,
    // percentageCommisionPromoter,
    // percentageCommisionOffice
    let hasIntermediaryError = false;
    let intermediaryErrorMessages = [];
    const intermediaryKeys = Object.keys(intermediaries);
    const intermediaryTypes = intermediaryKeys.map(intKey => intermediaries[intKey]["type"]);
    const hasDuplicates = intermediaryHasDuplicateTypes(intermediaryTypes);
    const hasUnknownTypes = intermediaryHasUnknownTypes(intermediaryTypes);
    const intermediariesRef = admin.database().ref("intermediaries");
    const intermediariesData = await intermediariesRef.once("value");
    if (hasDuplicates) {
        hasIntermediaryError = true;
        intermediaryErrorMessages = [...intermediaryErrorMessages, "There are duplicates in the intermediary types, please check the information provided."];
    }
    if (hasUnknownTypes) {
        hasIntermediaryError = true;
        intermediaryErrorMessages = [...intermediaryErrorMessages, "There are intermediary types in the information provisioned which are not valid. Please input either \"sales, enroller, broker, promoter, office\""];
    }
    const intermediaryObjs = intermediaryKeys.map(intKey => intermediaries[intKey]);
    //TODO intermediaryBody is a list of dictionaries with properties type, percentageCommision, id
    intermediaryObjs.forEach(({percentageCommission, id}) => {
        const doesIntermediaryIdExists = intermediariesData.child(id).exists();
        if(!doesIntermediaryIdExists) {
            hasIntermediaryError = true;
            intermediaryErrorMessages = [...intermediaryErrorMessages, `The intermediary with id ${id} was not found, please check again or add it before continuing`];
        }
        if(isNaN(percentageCommission) || Number(percentageCommission) < 0 || Number(percentageCommission) > 1 || Number(percentageCommission) % 1 !== 0) {
            hasIntermediaryError = true;
            intermediaryErrorMessages = [...intermediaryErrorMessages, "Please input only decimal values between 0 and 1 for percentage commission"];
        }
    });
    return { hasIntermediaryError, intermediaryErrorMessages };
};

const intermediaryHasDuplicateTypes = (intermediaryTypes) => {
    return intermediaryTypes.some(intType => intermediaryTypes.indexOf(intType) !== intermediaryTypes.lastIndexOf(intType));
};

const intermediaryHasUnknownTypes = (intermediaryTypes) => {
    const knownTypes =  ["sales, enroller, broker, promoter, office"];
    return intermediaryTypes.some(intType => knownTypes.indexOf(intType) === -1);
};

const checkWorkOrderFeeInformation = ({percentageDiscount, federalPercentageTax, statePercentageTax}) => {
    //TODO Check issuanceExpenses,
    let hasWorkOrderError = false;
    let workOrderErrorMessages = [];
    if(isNaN(percentageDiscount) || Number(percentageDiscount) < 0 || Number(percentageDiscount) > 1 || Number(percentageDiscount) % 1 !== 0) {
        hasWorkOrderError = true;
        workOrderErrorMessages = [...workOrderErrorMessages, "Please input only decimal values between 0 and 1 for a percentage discount"];
    }
    if(federalPercentageTax && (isNaN(federalPercentageTax) || Number(federalPercentageTax) < 0 || Number(federalPercentageTax) > 1 || Number(federalPercentageTax) % 1 !== 0)) {
        hasWorkOrderError = true;
        workOrderErrorMessages = [...workOrderErrorMessages, "Please input only decimal values between 0 and 1 for a federal percentage tax"];
    }
    if(statePercentageTax && (isNaN(statePercentageTax) || Number(statePercentageTax) < 0 || Number(statePercentageTax) > 1 || Number(statePercentageTax) % 1 !== 0)) {
        hasWorkOrderError = true;
        workOrderErrorMessages = [...workOrderErrorMessages, "Please input only decimal values between 0 and 1 for a state percentage tax"];
    }
    return { hasWorkOrderError, workOrderErrorMessages };
};

const addWorkOrderToIntermediaries = async({intermediaries, packageId}) => {
    const intermediariesRef = admin.database().ref("intermediaries");
    const intermediariesData = await intermediariesRef.once("value");
    const intermediaryKeys = Object.keys(intermediaries);
    const setPromises = await Promise.all(intermediaryKeys.map(({type, percentageCommision, id}) => {
        const doesIntermediaryWorkOrdersExist = intermediariesData.child(`${id}/workOrders`).exists();
        let newWorkOrders = [{ registerDate: new Date().toISOString(), type: type, percentageCommision: percentageCommision, packageId: packageId }]
        if(doesIntermediaryWorkOrdersExist) {
            const oldWorkOrders = intermediariesData.child(id).toJSON()["workOrders"];
            const oldWorkOrdersKeys = Object.keys(oldWorkOrders);
            const oldWorkOrdersArray = oldWorkOrdersKeys.map(key => oldWorkOrders[key]);
            newWorkOrders = [...oldWorkOrdersArray, ...newWorkOrders];
        }
        return intermediariesRef.child(id).set({workOrders: newWorkOrders}).then(res => true).catch(e => false);
    })).then(result => {
        return result
    }).catch(e => {
        return "error";
    });
    if(setPromises === "error") {
        res.status(409).json(
            {
                errorrMessages: ["There was an error saving data to intermediaries, please contact your system administrator"]
            }
        )
    }
};