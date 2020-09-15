const cors = require('cors');
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const corsHandler = cors({ origin: true });
try { admin.initializeApp(functions.config().firebase) } catch (e) { console.log(e) }


exports.getAllBenefitsPerProvisioner = async(req, res) => {
    corsHandler(req, res, async() => {
        const benefitsPerProvisionerRef = admin.database().ref("benefitsPerProvisioner");
        const benefitsPerProvisionerData = await benefitsPerProvisionerRef.once("value");
        const benefitsPerProvisionerJSON = benefitsPerProvisionerData.toJSON();
        res.status(200).json(
            benefitsPerProvisionerJSON
        );
    });
};

exports.getBenefitPerProvisionerById = async(req, res) => {
    corsHandler(req, res, async() => {
        const benefitsPerProvisionerId = req.query.benefitPerProvisionerId;
        const benefitsPerProvisionerRef = admin.database().ref("benefitsPerProvisioner");
        const benefitsPerProvisionerData = await benefitsPerProvisionerRef.once("value");
        const searchedBenefitPerProvisionerData = benefitsPerProvisionerData.child(benefitsPerProvisionerId);
        const searchedBenefitPerProvisionerJSON = searchedBenefitPerProvisionerData.toJSON();
        if(!searchedBenefitPerProvisionerJSON || searchedBenefitPerProvisionerJSON.deleteDate) {
            res.status(404).json(
                {
                    errorMessages: ["There is no existing benefit per provisioner with the Id provided"]
                }
            );
        }
        searchedBenefitPerProvisionerJSON.benefitPerProvisionerId = benefitsPerProvisionerId
        res.status(200).json(
            searchedBenefitPerProvisionerJSON
        );
    });
};

exports.createBenefitPerProvisionerById = async(req, res) => {
        corsHandler(req, res, async () => {
            const benefitPerProvisionerBody = req.body;
            const { hasIdError, idErrorMessages, benefitPerProvisionerId } = await addNewBenefitPerProvisionerId(benefitPerProvisionerBody);
            const benefitsPerProvisionerRef = admin.database().ref("benefitsPerProvisioner");
            const { hasError, errorMessages } = !hasIdError ?  await checkBenefitPerProvisionerBody(benefitPerProvisionerBody, true, benefitPerProvisionerId) : { hasError: true, errorMessages: [...idErrorMessages] };
            if (hasError) {
                res.status(409).json(
                    {
                        errorMessages : errorMessages
                    }
                );
            } else {
                benefitPerProvisionerBody.status = false;
                benefitPerProvisionerBody.registerDate = new Date().toISOString();
                await benefitsPerProvisionerRef.child(benefitPerProvisionerId).set(benefitPerProvisionerBody);
                benefitPerProvisionerBody.benefitPerProvisionerId = benefitPerProvisionerId;
                res.status(200).json(
                    benefitPerProvisionerBody
                );
            }
        });
};

exports.updateBenefitPerProvisionerById = async(req, res) => {
    corsHandler(req, res, async() => {
        const benefitsPerProvisionerBody = req.body;
        const benefitsPerProvisionerId = benefitsPerProvisionerBody.benefitPerProvisionerId;
        const benefitsPerProvisionerRef = admin.database().ref("benefitsPerProvisioner");
        const benefitsPerProvisionerData = await benefitsPerProvisionerRef.once("value");
        const searchedBenefitPerProvisionerData = benefitsPerProvisionerData.child(benefitsPerProvisionerId);
        const searchedBenefitPerProvisionerDataJSON =  searchedBenefitPerProvisionerData.toJSON();
        if(!searchedBenefitPerProvisionerDataJSON || searchedBenefitPerProvisionerDataJSON.deleteDate) {
            res.status(404).json({
                errorMessage: "There is no existing benefit per provisioner with the id provided"
            });
        } else {
            const { hasError, errorMessages } =  await checkBenefitPerProvisionerBody(benefitsPerProvisionerBody);
            if(hasError) {
                res.status(409).json({
                    errorMessages: errorMessages
                });
            } else {
                Object.keys(benefitsPerProvisionerBody).forEach(k => {
                    if(k !== "parameters" && k !== "benefitPerProvisionerId") {
                        searchedBenefitPerProvisionerDataJSON[k] = benefitsPerProvisionerBody[k];
                    }
                });
                const parameterKeys = Object.keys(searchedBenefitPerProvisionerDataJSON.parameters);
                const { parameters } = benefitsPerProvisionerBody;
                if(parameters) {
                    let newParameters  = [];
                    parameters.forEach(parameter => {
                        let deleteDate =  undefined;
                        const foundParameterKey = parameterKeys.find(k => searchedBenefitPerProvisionerDataJSON.parameters[k].type === parameter.type);
                        if(foundParameterKey) {
                            deleteDate = searchedBenefitPerProvisionerDataJSON.parameters[foundParameterKey].deleteDate;
                        }
                        if(!deleteDate) {
                            const { shouldUpdateParameter } = updateParameters(searchedBenefitPerProvisionerDataJSON.parameters, parameter, foundParameterKey);
                            if (!shouldUpdateParameter) {
                                newParameters = [...newParameters, parameter]
                            }
                        }
                    });
                    if(searchedBenefitPerProvisionerDataJSON.parameters && parameterKeys.length > 0) {
                        searchedBenefitPerProvisionerDataJSON.parameters = [...new Set([...parameterKeys.map(k => searchedBenefitPerProvisionerDataJSON.parameters[k]), ...newParameters])]
                    } else {
                        searchedBenefitPerProvisionerDataJSON.parameters = newParameters;
                    }
                }
                await benefitsPerProvisionerRef.child(benefitsPerProvisionerId).set(searchedBenefitPerProvisionerDataJSON);
                searchedBenefitPerProvisionerDataJSON.benefitPerProvisionerId = benefitsPerProvisionerId;
                res.status(200).json(searchedBenefitPerProvisionerDataJSON);
            }
        }
    })
};

exports.deleteBenefitPerProvisionerById = async(req, res) => {
    corsHandler(req, res, async() => {
        const benefitsPerProvisionerBody = req.body;
        const benefitsPerProvisionerId = benefitsPerProvisionerBody.benefitPerProvisionerId;
        const benefitsPerProvisionerRef = admin.database().ref("benefitsPerProvisioner");
        const benefitsPerProvisionerData = await benefitsPerProvisionerRef.once("value");
        const searchedBenefitsPerProvisionerData = benefitsPerProvisionerData.child(benefitsPerProvisionerId);
        const searchedBenefitsPerProvisionerJSON = searchedBenefitsPerProvisionerData.toJSON();
        if(!searchedBenefitsPerProvisionerJSON || searchedBenefitsPerProvisionerJSON.deleteDate) {
            res.status(404).json(
                {
                    errorMessages : ["There is no existing benefit per provisioner with the Id provided."]
                }
            );
        } else {
            searchedBenefitsPerProvisionerJSON.deleteDate = new Date().toISOString();
            await benefitsPerProvisionerRef.child(benefitsPerProvisionerId).set(searchedBenefitsPerProvisionerJSON);
            res.status(200).json(
                searchedBenefitsPerProvisionerJSON
            );
        }
    });
};

const checkBenefitPerProvisionerBody = async (
{
    provisionerId,
    packageId,
    benefitId,
    name,
    order,
    basicRiskPremium,
    basicNetPremium,
    packageBenefitWording0,
    packageBenefitWording1,
    packageBenefitWording2,
    packageBenefitWording3,
    packageBenefitWording4,
    parameters
}, isCreate = false, benefitPerProvisionerId) => {
    let errorMessages = [];
    let hasError = false;
    const provisionersRef = admin.database().ref("provisioners");
    const packagesRef = admin.database().ref("packages");
    const benefitsRef = admin.database().ref("benefits");
   [
       { ref: provisionersRef, refId: provisionerId, name: "Provisioner Id" },
       { ref: packagesRef, refId: packageId, name: "Package Id" },
       { ref: benefitsRef, refId: benefitId, name: "Benefit Id" }
   ].forEach(({ ref, refId, name }) => {
       checkIfItExists(ref, refId).then(exists => {
           if(!exists || !refId || refId === "") {
               errorMessages = [...errorMessages, `No ${name} ${refId} found`];
               hasError = true;
           }
           return null;
       }).catch(e => console.log(e));
   });

    if(isCreate) {
        const benefitPerProvisionerRef = admin.database().ref("benefitsPerProvisioner");
        const benefitPerProvisioner = await benefitPerProvisionerRef.once("value");
        const benefitPerProvisionerExists = benefitPerProvisioner.child(benefitPerProvisionerId).exists();
        if(benefitPerProvisionerExists) {
            hasError = true;
            errorMessages = [...errorMessages, "Benefit per provisioner already exists!"];
        }
    }

    if(!name) {
        hasError = true;
        errorMessages = [...errorMessages, "Benefit per provisioner name is not valid"];
    }

    if(!order || isNaN(order) || !Number.isInteger(order) || (order <0 || order > 99)) {
        hasError = true;
        errorMessages = [...errorMessages, "Order is not valid"];
    }

    if(!basicRiskPremium || isNaN(basicRiskPremium) || !Number(basicRiskPremium)  || (basicRiskPremium <= 0 || basicRiskPremium > 9999999)) {
        hasError = true;
        errorMessages = [...errorMessages, "Benefit per provisioner Basic Risk Premium must be a positive real value less than 10 million"];
    }

    if(!basicNetPremium || isNaN(basicNetPremium) || !Number(basicNetPremium) || (basicNetPremium <= 0 || basicNetPremium > 9999999)) {
        hasError = true;
        errorMessages = [...errorMessages, "Benefit per provisioner Basic Net Premium must be a positive real value less than 10 million"];
    }

    if(!packageBenefitWording0 || (typeof packageBenefitWording0 !== "string") || packageBenefitWording0 === ""  || packageBenefitWording0.length > 200) {
        hasError = true;
        errorMessages = [...errorMessages, "Please add a valid wording 0 with maximum 200 characters"];
    }

    if(!packageBenefitWording1 ||  (typeof packageBenefitWording1 !== "string") || packageBenefitWording1 === ""  || packageBenefitWording1.length > 500) {
        hasError = true;
        errorMessages = [...errorMessages, "Please add a valid wording 1 with maximum 500 characters"];
    }

    if(!packageBenefitWording2 || (typeof packageBenefitWording2 !== "string") || packageBenefitWording2 === ""  || packageBenefitWording2.length > 1000) {
        hasError = true;
        errorMessages = [...errorMessages, "Please add a valid wording 2 with maximum 1000 characters"];
    }

    if(!packageBenefitWording3 || (typeof packageBenefitWording3 !== "string") || packageBenefitWording3 === ""  || packageBenefitWording3.length > 40) {
        hasError = true;
        errorMessages = [...errorMessages, "Please add a valid wording 3 with maximum 40 characters"];
    }

    if(!packageBenefitWording4 || (typeof packageBenefitWording4 !== "string") || packageBenefitWording4 === "" || packageBenefitWording4.length > 40) {
        hasError = true;
        errorMessages = [...errorMessages, "Please add a valid wording 4 with maximum 40 characters"];
    }

    if(parameters && parameters.length > 0) {
        parameters.forEach(({status, type , deleteDate}) => {
            if(!deleteDate) {
                const { hasParameterError, parameterErrorMessage
                } = checkParameters(status, type, isCreate);
                if(hasParameterError) {
                    hasError = true;
                    errorMessages = [...errorMessages, ...parameterErrorMessage
                    ];
                }
            }
        });
    }
    return { hasError, errorMessages };
};

const checkParameters = (status, type, isCreate) => {
    let hasParameterError = false;
    let parameterErrorMessage
        = [];
    const validParameterTypes = ["levels","plans","vigencies","ages","genders","countries","zipcodes","kinships"];
    const foundParameterType = validParameterTypes.find(vType => vType === type);
    if(!foundParameterType) {
        hasParameterError = true;
        parameterErrorMessage = [...parameterErrorMessage, `Please add only valid parameter types (${validParameterTypes.join(", ")})`];
    }

    if(status === false && isCreate) {
        hasParameterError = true;
        parameterErrorMessage = [...parameterErrorMessage, "When creating if status is added it can only be 'true'"];
    }
    return { hasParameterError, parameterErrorMessage };
};

const checkIfItExists = async(ref, refId) => {
   const snapshot = await ref.once("value");
   const idExists = snapshot.child(refId).exists();
   return idExists;
};

const addNewBenefitPerProvisionerId = ({ packageId, benefitId }) => {
    let hasIdError = false;
    let idErrorMessages = [];
    let benefitPerProvisionerId = "";
    if(!packageId || packageId === "" || (typeof packageId !== "string")) {
        hasIdError = true;
        idErrorMessages = [...idErrorMessages,"Please include a valid package id"];
    }

    if(!benefitId || benefitId === "" || (typeof benefitId !== "string")) {
        hasIdError = true;
        idErrorMessages = [...idErrorMessages,"Please include a valid benefit id"];
    }

    if(!hasIdError) {
        benefitPerProvisionerId =  packageId+"-"+benefitId;
    }

    return { hasIdError, idErrorMessages, benefitPerProvisionerId };
};

const updateParameters = (parameters, updatedParameterObj, foundParameterKey) => {
    let shouldUpdateParameter = false;
    if(foundParameterKey) {
        if(updatedParameterObj.status === false && !updatedParameterObj.deleteDate) {
            parameters[foundParameterKey].deleteDate = new Date().toISOString();
            shouldUpdateParameter = true;
        } else {
            parameters[foundParameterKey].type = updatedParameterObj.type;
            shouldUpdateParameter = true;
        }
    }
    return { shouldUpdateParameter };
};
