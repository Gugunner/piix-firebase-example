const cors = require('cors');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const corsHandler = cors({ origin: true });
try { admin.initializeApp(functions.config().firebase) } catch (e) { console.log(e) }

exports.getAllBenefitsPerProvisionerRatesByPackageId = (req, res) => {
    corsHandler(req,res,async() => {
        const packageId = req.query.packageId;
        const parameterRatesByBenefitPerProvisionerRef = admin.database().ref("benefitsPerProvisionerRates");
        const parameterRatesByBenefitPerProvisionerData =  await parameterRatesByBenefitPerProvisionerRef.once("value");
        const parameterRatesByBenefitPerProvisionerJSON = parameterRatesByBenefitPerProvisionerData.toJSON();
        if(!parameterRatesByBenefitPerProvisionerJSON) {
            res.status(404).json({
                errorMessages: ["There was an error with your request, please contact the system administrator "]
            });
        } else {
            const benefitsPerProvisionerRatesKeys = Object.keys(parameterRatesByBenefitPerProvisionerJSON);
            const benefitRatesBYPackageId = benefitsPerProvisionerRatesKeys.reduce((acc,val,idx) => {
                if(idx === 1) {
                    let result = []
                    if(parameterRatesByBenefitPerProvisionerJSON[acc].packageId === packageId && !parameterRatesByBenefitPerProvisionerJSON[acc].deleteDate) {
                        const accObj = Object.assign({},parameterRatesByBenefitPerProvisionerJSON[acc]);
                        accObj.benefitPerProvisionerRatesId = acc;
                        result = [ ...result, accObj ]
                    }
                    if(parameterRatesByBenefitPerProvisionerJSON[val].packageId === packageId && !parameterRatesByBenefitPerProvisionerJSON[val].deleteDate) {
                        const accObj = Object.assign({},parameterRatesByBenefitPerProvisionerJSON[val]);
                        accObj.benefitPerProvisionerRatesId = val;
                            result = [ ...result, accObj ]
                    }
                    return result;
                }
                if(parameterRatesByBenefitPerProvisionerJSON[val].packageId === packageId && !parameterRatesByBenefitPerProvisionerJSON[val].deleteDate) {
                    const accObj = Object.assign({},parameterRatesByBenefitPerProvisionerJSON[val]);
                    accObj.benefitPerProvisionerRatesId = val;
                        return [ ...acc, accObj ]
                }
                return acc;
            });
            if(benefitRatesBYPackageId.length > 0) {
                res.status(200).json(
                    benefitRatesBYPackageId
                );
            } else {
                res.status(404).json({
                    errorMessages: ["No benefit per provisioner rates found, please check the package id provided"]
                });
            }
        }
    });
};

exports.getAllBenefitsPerProvisionerRatesByBenefitPerProvisionerId = async(req, res) => {
    corsHandler(req,res,async() => {
        const benefitPerProvisionerId = req.query.benefitPerProvisionerId;
        const parameterRatesByBenefitPerProvisionerRef =  admin.database().ref("benefitsPerProvisionerRates");
        const parameterRatesByBenefitPerProvisionerData =  await parameterRatesByBenefitPerProvisionerRef.once("value");
        const parameterRatesByBenefitPerProvisionerJSON = parameterRatesByBenefitPerProvisionerData.toJSON();
        if(!parameterRatesByBenefitPerProvisionerJSON) {
            res.status(404).json({
                errorMessages: ["There was an error with your request, please contact the system administrator "]
            })
        } else {
            const benefitsPerProvisionerRatesKeys = Object.keys(parameterRatesByBenefitPerProvisionerJSON);
            const benefitRatesBYBenefitPerProvisionerId = benefitsPerProvisionerRatesKeys.reduce((acc,val,idx) => {
                if(idx === 1) {
                    let result = []
                    if(parameterRatesByBenefitPerProvisionerJSON[acc].packageId === packageId && !parameterRatesByBenefitPerProvisionerJSON[acc].deleteDate) {
                        const accObj = Object.assign({},parameterRatesByBenefitPerProvisionerJSON[acc]);
                        accObj.benefitPerProvisionerRatesId = acc;
                        result = [ ...result, accObj ]
                    }
                    if(parameterRatesByBenefitPerProvisionerJSON[val].packageId === packageId && !parameterRatesByBenefitPerProvisionerJSON[val].deleteDate) {
                        const accObj = Object.assign({},parameterRatesByBenefitPerProvisionerJSON[val]);
                        accObj.benefitPerProvisionerRatesId = val;
                        result = [ ...result, accObj ]
                    }
                    return result;
                }
                if(parameterRatesByBenefitPerProvisionerJSON[val].packageId === packageId && !parameterRatesByBenefitPerProvisionerJSON[val].deleteDate) {
                    const accObj = Object.assign({},parameterRatesByBenefitPerProvisionerJSON[val]);
                    accObj.benefitPerProvisionerRatesId = val;
                    return [ ...acc, accObj ]
                }
                return acc;
            });
            if(benefitRatesBYBenefitPerProvisionerId.length > 0) {
                res.status(200).json(
                    benefitRatesBYBenefitPerProvisionerId
                );
            } else {
                res.status(404).json({
                    errorMessages: ["No benefit per provisioner rates found, please check the benefit per provisioner id provided"]
                });
            }
        }
    });
};

exports.getBenefitPerProvisionerRatesById = async(req, res) => {
    corsHandler(req,res,async() => {
        const benefitPerProvisionerRatesId = req.query.benefitPerProvisionerRatesId;
        const parameterRatesByBenefitPerProvisionerRef = admin.database().ref("benefitsPerProvisionerRates");
        const parameterRatesByBenefitPerProvisionerData = await parameterRatesByBenefitPerProvisionerRef.once("value");
        const searchedparameterRatesByBenefitPerProvisionerJSON = parameterRatesByBenefitPerProvisionerData.child(benefitPerProvisionerRatesId).toJSON();
        if(!searchedparameterRatesByBenefitPerProvisionerJSON || searchedparameterRatesByBenefitPerProvisionerJSON.deleteDate) {
            res.status(404).json({
                errorMessage: "There is no existing parameter rates by benefit per provisioner with the id provided"
            })
        }
        searchedparameterRatesByBenefitPerProvisionerJSON.benefitPerProvisionerRatesId = benefitPerProvisionerRatesId;
        res.status(200).json(
            searchedparameterRatesByBenefitPerProvisionerJSON
        );
    });
};

exports.createBenefitsPerProvisionerRatesById = async(req, res) => {
    corsHandler(req, res, async() => {
        const parameterRatesByBenefitPerProvisionerBody = req.body;
        const { hasIdError, idErrorMessages, benefitPerProvisionerRatesId } = addNewBenefitsPerProvisionerRatesId(parameterRatesByBenefitPerProvisionerBody);
        const parameterRatesByBenefitPerProvisionerRef = admin.database().ref("benefitsPerProvisionerRates");
        parameterRatesByBenefitPerProvisionerBody.benefitPerProvisionerRatesId = benefitPerProvisionerRatesId;
        const { hasError, errorMessages } = !hasIdError ? await checkParameterRatesByBenefitPerProvisionsBody(parameterRatesByBenefitPerProvisionerBody,true) : { hasError: true, errorMessages: [...idErrorMessages] };
        if(hasError) {
            res.status(409).json(
                {
                    errorMessages: errorMessages
                }
            )
        } else {
            parameterRatesByBenefitPerProvisionerBody.registerDate = new Date().toISOString();
            delete parameterRatesByBenefitPerProvisionerBody.benefitPerProvisionerRatesId;
            await parameterRatesByBenefitPerProvisionerRef.child(benefitPerProvisionerRatesId).set(parameterRatesByBenefitPerProvisionerBody);
            parameterRatesByBenefitPerProvisionerBody.benefitPerProvisionerRatesId = benefitPerProvisionerRatesId;
            res.status(200).json(
                parameterRatesByBenefitPerProvisionerBody
            );
        }
    });
};

exports.updateBenefitsPerProvisionerRatesById = async(req, res) => {
    corsHandler(req,res, async() => {
        const parameterRatesByBenefitPerProvisionerBody = req.body;
        const benefitPerProvisionerRatesId = parameterRatesByBenefitPerProvisionerBody.benefitPerProvisionerRatesId;
        const parameterRatesByBenefitPerProvisionerRef = admin.database().ref("benefitsPerProvisionerRates");
        const parameterRatesByBenefitPerProvisionerData = await parameterRatesByBenefitPerProvisionerRef.once("value");
        const searchedparameterRatesByBenefitPerProvisionerJSON = parameterRatesByBenefitPerProvisionerData.child(benefitPerProvisionerRatesId).toJSON();
        if(!searchedparameterRatesByBenefitPerProvisionerJSON || searchedparameterRatesByBenefitPerProvisionerJSON.deleteDate) {
            res.status(404).json({
                errorMessage: "There is no existing parameter rates by benefit per provisioner with the id provided"
            })
        }
        const { hasError, errorMessages } = await checkParameterRatesByBenefitPerProvisionsBody(parameterRatesByBenefitPerProvisionerBody);
        if (hasError) {
            res.status(409).json({
                errorMessages: errorMessages
            });
        } else {
            if(parameterRatesByBenefitPerProvisionerBody.netRate) {
                searchedparameterRatesByBenefitPerProvisionerJSON.netRate = parameterRatesByBenefitPerProvisionerBody.netRate;
            }
            if(parameterRatesByBenefitPerProvisionerBody.premiumNet) {
                searchedparameterRatesByBenefitPerProvisionerJSON.premiumNet = parameterRatesByBenefitPerProvisionerBody.premiumNet;
            }
            await parameterRatesByBenefitPerProvisionerRef.child(benefitPerProvisionerRatesId).set(searchedparameterRatesByBenefitPerProvisionerJSON);
            searchedparameterRatesByBenefitPerProvisionerJSON.benefitPerProvisionerRatesId = benefitPerProvisionerRatesId;
            res.status(200).json(
                searchedparameterRatesByBenefitPerProvisionerJSON
            );
        }
    });
};

exports.deleteBenefitsPerProvisionerRatesById = async(req,res) => {
  corsHandler(req,res,async() => {
      const parameterRatesByBenefitPerProvisionerBody = req.body;
      const benefitPerProvisionerRatesId = parameterRatesByBenefitPerProvisionerBody.benefitPerProvisionerRatesId;
      const parameterRatesByBenefitPerProvisionerRef = admin.database().ref("benefitsPerProvisionerRates");
      const parameterRatesByBenefitPerProvisionerData = await parameterRatesByBenefitPerProvisionerRef.once("value");
      const searchedparameterRatesByBenefitPerProvisionerJSON = parameterRatesByBenefitPerProvisionerData.child(benefitPerProvisionerRatesId).toJSON();
      if(!searchedparameterRatesByBenefitPerProvisionerJSON || searchedparameterRatesByBenefitPerProvisionerJSON.deleteDate) {
          res.status(404).json(
              {
                  errorMessages : ["There is no existing benefits per provisioner rates with the Id provided."]
              }
          );
      } else {
          searchedparameterRatesByBenefitPerProvisionerJSON.deleteDate = new Date().toISOString();
          await parameterRatesByBenefitPerProvisionerRef.child(benefitPerProvisionerRatesId).set(searchedparameterRatesByBenefitPerProvisionerJSON);
          searchedparameterRatesByBenefitPerProvisionerJSON.benefitPerProvisionerRatesId = benefitPerProvisionerRatesId;
          res.status(200).json(
              searchedparameterRatesByBenefitPerProvisionerJSON
          );
      }
  });
};

const addNewBenefitsPerProvisionerRatesId = ({packageId, benefitId, benefitPerProvisionerId, parameters}) => {
    let hasIdError = false;
    let idErrorMessages = [];
    let benefitPerProvisionerRatesId = "";
    if(!packageId || packageId === "" || (typeof packageId !== "string")) {
        hasIdError = true;
        idErrorMessages = [...idErrorMessages,"Please include a valid package id"];
    }
    if(!benefitId || benefitId === "" || (typeof benefitId !== "string")) {
        hasIdError = true;
        idErrorMessages = [...idErrorMessages,"Please include a valid benefit id"];
    }
    if(!benefitPerProvisionerId || benefitPerProvisionerId === "" || (typeof benefitPerProvisionerId !== "string")) {
        hasIdError = true;
        idErrorMessages = [...idErrorMessages,"Please include a valid benefit per provisioner id"];
    }
    if(Array.isArray(parameters)) {
        parameters.forEach(p => {
            if(p.type === "" || (typeof p.type !== "string")) {
                hasIdError = true;
                idErrorMessages = [...idErrorMessages,"Please add valid parameters only"];
            }
        })
    } else {
        hasIdError = true;
        idErrorMessages = [...idErrorMessages,"The parameters need to be added a a list/array of string values"];
    }
    if(!hasIdError) {
        benefitPerProvisionerRatesId = packageId+"-"+benefitId+"-"+benefitPerProvisionerId+"-"+parameters.map(p => p.id).join("-");
    }
    return { hasIdError, idErrorMessages, benefitPerProvisionerRatesId };
};

const checkParameterRatesByBenefitPerProvisionsBody = async(
{
    packageId,
    benefitId,
    benefitPerProvisionerId,
    benefitPerProvisionerRatesId,
    name,
    parameters,
    netRate,
    premiumNet,
}, isCreate = false) => {
    let errorMessages = [];
    let hasError = false;
    if(isCreate) {
        const packagesRef = admin.database().ref("packages");
        const packagesSnapshot = await packagesRef.once("value");
        const benefitsRef = admin.database().ref("benefits");
        const benefitsSnapshot = await benefitsRef.once("value");
        const benefitPerProvisionerRef = admin.database().ref("benefitsPerProvisioner");
        const benefitPerProvisionerSnapshot = await benefitPerProvisionerRef.once("value");
        const packageExists = packagesSnapshot.child(packageId).exists();
        const benefitExists = benefitsSnapshot.child(benefitId).exists();
        const benefitPerProvisionerExists = benefitPerProvisionerSnapshot.child(benefitPerProvisionerId).exists();
        if(benefitPerProvisionerExists) {
            const benefitPerProvisionerJSON = benefitPerProvisionerSnapshot.child(benefitPerProvisionerId).toJSON();
            const { hasParamError, errorParamMessages } = await checkParameters(parameters, benefitPerProvisionerJSON);
            console.log("Has Param Error", hasParamError);
            if(hasParamError) {
                hasError = true;
                errorMessages = [...errorMessages, errorParamMessages];
            }
        } else {
            hasError = true;
            errorMessages = [...errorMessages, "The benefit per provisioner id provided does not exist"];
        }
        const benefitPerProvisionerRatesRef = admin.database().ref("benefitsPerProvisionerRates");
        const benefitPerProvisionerRatesSnapshot = await benefitPerProvisionerRatesRef.once("value");
        const benefitPerProvisionerRatesExists = benefitPerProvisionerRatesSnapshot.child(benefitPerProvisionerRatesId).exists();
        if(!packageExists) {
            hasError = true;
            errorMessages = [...errorMessages, "The package id provided does not exist"];
        }
        if(!benefitExists) {
            hasError = true;
            errorMessages = [...errorMessages, "The benefit id provided does not exist"];
        }
        if(benefitPerProvisionerRatesExists) {
            hasError = true;
            errorMessages = [...errorMessages, "Parameter Rate Benefit Per Provisioner Id already exists!"];
        }
    }
    if(netRate && (isNaN(netRate) || !Number(netRate) || netRate < 0 || netRate > 9999999)) {
        hasError = true;
        errorMessages = [...errorMessages,"The net rate must be a positive integer or float number"];
    }

    if(premiumNet && (isNaN(premiumNet) || !Number(premiumNet) || premiumNet < 0 || premiumNet > 9999999)) {
        hasError = true;
        errorMessages = [...errorMessages,"The premium net must be a positive integer or float number"];
    }
    return { hasError, errorMessages };
};

const checkParameters = async(parametersToCheck, benefitPerProvisionerJSON,) => {
    let hasParamError = false;
    let errorParamMessages = [];
    const { parameters } = benefitPerProvisionerJSON;
    //Order of parameters to check levels, plans, vigencies, ages, genders, countries, zipcodes, kinships
    //TODO ADD Missing parameters to check once they are in DB
    const parametersReferences = Object.keys(parameters).map(key => parameters[key].type);
    console.log("Parameter References",parametersReferences);
    console.log("Parameters comes from benefitPerProvisionerJSON",parameters);
    let errors = [];
    parametersToCheck.forEach(({type, id}) => {
       const foundType = parametersReferences.find(pRef => pRef === type) ? true : false;
       if(!foundType) {
           hasParamError = true;
           errorParamMessages = [...errorParamMessages,`The parameter ${type} was not found in the benefit per provisioner provided`];
       } else {
           errors.push(
               admin.database().ref(type).once("value").then(snapshot => {
                   const exists = snapshot.child(id).exists();
                   if(!exists || snapshot.child(id).toJSON().status === false) {
                       return {
                           hasParamError: true,
                           errorParamMessages: `The parameter ${type}/${id} was not found in the benefit per provisioner provided`
                       }
                   }
                   return {
                       hasParamError: false,
                       errorParamMessages: ""
                   }
               }).catch(e => {
                   return {
                       hasParamError: true,
                       errorParamMessages: `The parameter ${type}/${id} was not found in the benefit per provisioner provided`
                   }
               })
           );
       }
    });
    errors = await Promise.all(errors).then(result => {
        console.log("All", result)
        return result;
    }).catch(e => console.log(e));
    console.log("Errors", errors);
    if(!hasParamError) {
        hasParamError = errors.find(e => e.hasParamError === true);
        errorParamMessages = [...errorParamMessages, ...errors.filter(e => e.errorParamMessages !== "").map(e => e.errorParamMessages)];
    }
    return {
        hasParamError,
        errorParamMessages
    }
};