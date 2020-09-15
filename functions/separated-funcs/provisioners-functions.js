const cors = require('cors');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const corsHandler = cors({ origin: true });
try { admin.initializeApp(functions.config().firebase) } catch (e) { console.log(e) }

const { validateLegalUser } = require('./shared-logic/person-representatives-funcs');

// Obtiene todos los proveedores dados de alta
exports.getAllProvisioners = (req, res) => {
    corsHandler(req, res, async () => {
        const provisionersRef = admin.database().ref("provisioners");
        const provisionersData = await provisionersRef.once('value');
        const provisionersDataJSON = provisionersData.toJSON();
        res.status(200).json(
            provisionersDataJSON
        );
    });
}

// Obtiene un proveedor con la información dada de alta
exports.getProvisionerById = async (req, res) => {
    corsHandler(req, res, async () => {
        const provisionerId = req.query.provisionerId;
        const provisionersRef = admin.database().ref("provisioners");
        const provisionersData = await provisionersRef.once('value');
        const searchedProvisionerData = provisionersData.child(provisionerId);
        const searchedProvisionerDataJSON = searchedProvisionerData.toJSON();

        if(!searchedProvisionerDataJSON || searchedProvisionerDataJSON.deleteDate) {
            res.status(404).json(
                {
                    errorMessage : "There is no existing provisioner with the Id provided."
                }
            );
        }

        res.status(200).json(
            searchedProvisionerDataJSON
        );
    });
};

// Crea un proveedor con la información proporcionada
exports.createProvisionerById = async (req, res) => {
    corsHandler(req, res, async () => {
        const provisionerBody = req.body;
        const newProvisionerId = provisionerBody.provisionerId;
        const provisionersRef = admin.database().ref("provisioners");
        const allProvisioners = await provisionersRef.orderByChild("id").once("value");
        
        const { hasError, errorMessages } = await checkProvisionerBody(provisionerBody, true);

        if (hasError) {
            res.status(409).json(
                {
                    errorMessages : errorMessages
                }
            );
        } else {
            delete provisionerBody["provisionerId"];
            provisionerBody.order = allProvisioners.numChildren() + 1;
            provisionerBody.status = false;
            provisionerBody.registerDate = new Date().toISOString();
            await provisionersRef.child(newProvisionerId).set(provisionerBody);
            provisionerBody.provisionerId = newProvisionerId;
            res.status(200).json(
                provisionerBody
            );
        }
    });
};

// Actualiza un proveedor con la información proporcionada
exports.updateProvisionerById = async (req, res) => {
    corsHandler(req, res, async () => {
        const provisionerBody = req.body;
        const provisionerId = provisionerBody.provisionerId;

        const provisionersRef = admin.database().ref("provisioners");
        const provisionersData = await provisionersRef.once('value');
        const searchedProvisionerData = provisionersData.child(provisionerId);
        let searchedProvisionerDataJSON = searchedProvisionerData.toJSON();

        if(!searchedProvisionerDataJSON) {
            res.status(404).json(
                {
                    errorMessage : "There is no existing provisioner with the Id provided."
                }
            );
        } else {
            const { hasError, errorMessages } = await checkProvisionerBody(provisionerBody);
    
            if (hasError) {
                res.status(409).json(
                    {
                        errorMessages : errorMessages
                    }
                );
            } else {
                searchedProvisionerDataJSON = provisionerBody;
                delete searchedProvisionerDataJSON["provisionerId"];
                searchedProvisionerDataJSON.updateDate = new Date().toISOString();
        
                await provisionersRef.child(provisionerId).set(searchedProvisionerDataJSON);
                searchedProvisionerDataJSON.provisionerId = provisionerId;
                res.status(200).json(
                    searchedProvisionerDataJSON
                );
            }
        }
    });
};

// Baja lógica de un proveedor
exports.deleteProvisionerById = async (req, res) => {
    corsHandler(req, res, async () => {
        const provisionerBody = req.body;
        const provisionerId = provisionerBody.provisionerId;

        const provisionersRef = admin.database().ref("provisioners");
        const provisionersData = await provisionersRef.once('value');
        const searchedProvisionerData = provisionersData.child(provisionerId);
        const searchedProvisionerDataJSON = searchedProvisionerData.toJSON();

        if(!searchedProvisionerDataJSON) {
            res.status(404).json(
                {
                    errorMessage : "There is no existing provisioner with the Id provided."
                }
            );
        } else {
            searchedProvisionerDataJSON.deleteDate = new Date().toISOString();
    
            await provisionersRef.child(provisionerId).set(searchedProvisionerDataJSON);
            res.status(200).json(
                searchedProvisionerDataJSON
            );
        }
    });
};

const checkProvisionerBody = async(
    provisionerBody
, isCreate = false) => {
    const newProvisionerId = provisionerBody.provisionerId;

    var provisionersRef = admin.database().ref("provisioners");
    let errorObj = { hasError: false, errorMessages: [] };

    const provisioner = await provisionersRef.orderByChild("id").startAt(newProvisionerId).limitToFirst(1).once("value");
    const provisionerJSON = provisioner.toJSON();
    if(!newProvisionerId || newProvisionerId === '') {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'The provisioner cant be empty. Please verify the information.'];
    } else if(isCreate && provisionerJSON) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'The provisioner with the Id "' + newProvisionerId + '" sent already exist. Please verify the information.'];
    }

    errorObj = await validateLegalUser(provisionerBody);
    return errorObj;
};