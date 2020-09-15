const cors = require('cors');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const corsHandler = cors( { origin: true });
try { admin.initializeApp(functions.config().firebase ) } catch (e) { console.log(e) }

// Obtiene todos los paquetes dados de alta
exports.getAllPackages = (req, res) => {
    corsHandler(req, res, async () => {
        const packagesRef = admin.database().ref("packages");
        const packagesData = await packagesRef.once('value');
        const packagesDataJSON = packagesData.toJSON();
        res.status(200).json(
            packagesDataJSON
        );
    });
}

// Obtiene un paquete con la información dada de alta
exports.getPackageById = async(req, res) => {
    corsHandler(req, res, async () => {
        const packageId = req.query.packageId;
        const searchedPackageDataJSON = await privateGetPackageById(packageId);

        if(!searchedPackageDataJSON || searchedPackageDataJSON.deleteDate) {
            res.status(404).json(
                {
                    errorMessage : "There is no existing package with the Id provided."
                }
            );
        }

        res.status(200).json(
            searchedPackageDataJSON
        );
    });
}

exports.privateGetPackageByIdByIdInternal = async(packageId) => {
    const searchedprivateGetPackageByIdDataJSON = await privateGetPackageById(packageId);
    return searchedprivateGetPackageByIdDataJSON;
}

// Crea un país con la información proporcionada
exports.createPackageById = async (req, res) => {
    corsHandler(req, res, async () => {
        const packageBody = req.body;
        const newPackageId = packageBody.packageId;
        const packagesRef = admin.database().ref("packages");
        const { hasError, errorMessages } = await checkPackageBody(packageBody, true);

        if (hasError) {
            res.status(409).json(
                {
                    errorMessages : errorMessages
                }
            );
        } else {
            delete packageBody["packageId"];
            packageBody.status = false;
            packageBody.registerDate = new Date().toISOString();
            await packagesRef.child(newPackageId).set(packageBody);
            packageBody.packageId = newPackageId;
            res.status(200).json(
                packageBody
            );
        }
    });
};

// Actualiza un tipo de intermediario con la información proporcionada
exports.updatePackageById = async (req, res) => {
    corsHandler(req, res, async () => {
        const packageBody = req.body;
        const packageId = packageBody.packageId;
        const packagesRef = admin.database().ref("packages");
        const packagesData = await packagesRef.once('value');
        const searchedPackageData = packagesData.child(packageId);
        const searchedPackageDataJSON = searchedPackageData.toJSON();

        if(!searchedPackageDataJSON) {
            res.status(404).json(
                {
                    errorMessage : "There is no existing package with the Id provided."
                }
            );
        } else {
            const { hasError, errorMessages } = await checkPackageBody(packageBody, false)

            if (hasError) {
                res.status(409).json(
                    {
                        errorMessages : errorMessages
                    }
                );
            } else {
                delete searchedPackageDataJSON["packageId"];
                searchedPackageDataJSON.countryId = packageBody.countryId;
                searchedPackageDataJSON.name = packageBody.name;
                searchedPackageDataJSON.clientId = packageBody.clientId;
                searchedPackageDataJSON.maxPlans = packageBody.maxPlans;
                searchedPackageDataJSON.planIds = packageBody.planIds;
                searchedPackageDataJSON.maxValidities = packageBody.maxValidities;
                searchedPackageDataJSON.validityIds = packageBody.validityIds;
                searchedPackageDataJSON.maxLevels = packageBody.maxLevels;
                searchedPackageDataJSON.levelIds = packageBody.levelIds;
                if(packageBody.benefitsPerProvisioner){
                    searchedPackageDataJSON.benefitsPerProvisioner = packageBody.benefitsPerProvisioner;
                }
                if(packageBody.salesPointId){
                    searchedPackageDataJSON.salesPointId = packageBody.salesPointId;
                }
                if(packageBody.enrollerId){
                    searchedPackageDataJSON.enrollerId = packageBody.enrollerId;
                }
                if(packageBody.brokerId){
                    searchedPackageDataJSON.brokerId = packageBody.brokerId;
                }
                if(packageBody.promoterId){
                    searchedPackageDataJSON.promoterId = packageBody.promoterId;
                }
                if(packageBody.officeId){
                    searchedPackageDataJSON.officeId = packageBody.officeId;
                }
                if(packageBody.percentageCommisionSalesPoint){
                    searchedPackageDataJSON.percentageCommisionSalesPoint = packageBody.percentageCommisionSalesPoint;
                }
                if(packageBody.percentageCommisionEnroller){
                    searchedPackageDataJSON.percentageCommisionEnroller = packageBody.percentageCommisionEnroller;
                }
                if(packageBody.percentageCommisionBroker){
                    searchedPackageDataJSON.percentageCommisionBroker = packageBody.percentageCommisionBroker;
                }
                if(packageBody.percentageCommisionPromoter){
                    searchedPackageDataJSON.percentageCommisionPromoter = packageBody.percentageCommisionPromoter;
                }
                if(packageBody.percentageCommisionOffice){
                    searchedPackageDataJSON.percentageCommisionOffice = packageBody.percentageCommisionOffice;
                }
                if(packageBody.packageWording){
                    searchedPackageDataJSON.packageWording = packageBody.packageWording;
                }
                searchedPackageDataJSON.updateDate = new Date().toISOString();

                await packagesRef.child(packageId).set(searchedPackageDataJSON);
                searchedPackageDataJSON.packageId = packageId;
                res.status(200).json(
                    searchedPackageDataJSON
                );
            }
        }
    });
};

// Baja lógica de un paquete
exports.deletePackageById = async(req, res) => {
    corsHandler(req, res, async () => {
        const packageBody = req.body;
        const packageId = packageBody.packageId;
        const packagesRef = admin.database().ref("packages");
        const packagesData = await packagesRef.once('value');
        const searchedPackageData = packagesData.child(packageId);
        const searchedPackageDataJSON = searchedPackageData.toJSON();

        if(!searchedPackageDataJSON) {
            res.status(404).json(
                {
                    errorMessage : "There is no existing package with the Id provided."
                }
            );
        } else {
            searchedPackageDataJSON.deleteDate = new Date().toISOString();

            await packagesRef.child(packageId).set(searchedPackageDataJSON);
            res.status(200).json(
                searchedPackageDataJSON
            );
        }
    });
}

async function privateGetPackageById(packageId) {
    const packagesRef = admin.database().ref("packages");
    const packagesData = await packagesRef.once('value');
    const searchedPackageData = packagesData.child(packageId);
    const searchedPackageDataJSON = searchedPackageData.toJSON();
    return searchedPackageDataJSON;
}

// Regresa la información completa de un paquete por su Id
exports.getPackageInfo = async (req, res) => {
    corsHandler(req, res, async () => {
        const packageId = req.query.packageId;

        const packagesRef = admin.database().ref("packages");
        let clientPackage = await packagesRef.once('value');
        clientPackage = clientPackage.child(packageId);
        const levelsToObtain = clientPackage.child('levelIds').val();
        const plansToObtain = clientPackage.child('planIds').val();
        const clientToObtain = clientPackage.child('clientId').val();

        const levelsList = [];
        const plansList = [];
        const benefitsPerProvisionerToObtain = clientPackage.child('benefitsPerProvisioner').val();

        // Niveles
        const levelRef = admin.database().ref("levels");
        const levelData = await levelRef.once('value');
        levelsToObtain.forEach(levelId => {
            const level = levelData.child(levelId);
            levelsList.push(level.toJSON());
        });

        // Planes
        const planRef = admin.database().ref("plans");
        const plansData = await planRef.once('value');
        plansToObtain.forEach(planId => {
            const plan = plansData.child(planId);
            plansList.push(plan.toJSON());
        });

        // Cliente
        const clientRef = admin.database().ref("clients");
        let client = await clientRef.once('value');
        client = client.child(clientToObtain);

        // Beneficios
        const benefitsRef = admin.database().ref("benefits");
        const benefits = await benefitsRef.once('value');

        // Tipo de Beneficio
        const benefitTypesRef = admin.database().ref("benefitTypes");
        const benefitType = await benefitTypesRef.once('value');

        // Proveedores
        const provisionersRef = admin.database().ref("provisioners");
        const provisioners = await provisionersRef.once('value');

        // Beneficios por Proveedor
        const benefitsPerProvisionerRef = admin.database().ref("benefitsPerProvisioner");
        const benefitsPerProvisioner = await benefitsPerProvisionerRef.once('value');
        const benefitsPerProvisionerArray = [];
        benefitsPerProvisionerToObtain.forEach(benefitPerProvisioner => {
            const realBenefitsPerProvisioner = benefitsPerProvisioner.child(benefitPerProvisioner);
            const realBenefitsPerProvisionerJSON = realBenefitsPerProvisioner.toJSON();
            const benefitToObtain = realBenefitsPerProvisionerJSON.benefitId;
            const provisionerToObtain = realBenefitsPerProvisionerJSON.provisionerId;

            let realBenefit = benefits.child(benefitToObtain);
            realBenefit = realBenefit.toJSON();
            const benefitTypeToObtain = realBenefit.benefitBranchId[0];

            realBenefit.benefitId = benefitToObtain;
            realBenefit.benefitType = benefitType.child(benefitTypeToObtain);

            let realProvisioner = provisioners.child(provisionerToObtain);

            realBenefitsPerProvisionerJSON.benefit = realBenefit;
            realBenefitsPerProvisionerJSON.provisioner = realProvisioner;
            benefitsPerProvisionerArray.push(realBenefitsPerProvisionerJSON);
        });

        let packageJSON = clientPackage.toJSON();
        packageJSON.packageId = packageId;
        packageJSON.levels = levelsList;
        packageJSON.plans = plansList;
        packageJSON.client = client;
        packageJSON.benefitsPerProvisioner = benefitsPerProvisionerArray;

        res.json(packageJSON);
    });
};

const checkPackageBody = async(
    {
        packageId,
        countryId,
        name,
        clientId,
        maxPlans,
        planIds,
        maxValidities,
        validityIds,
        maxLevels,
        levelIds,
        benefitsPerProvisioner,
        salesPointId,
        enrollerId,
        brokerId,
        promoterId,
        officeId,
        percentageCommisionSalesPoint,
        percentageCommisionEnroller,
        percentageCommisionBroker,
        percentageCommisionPromoter,
        percentageCommisionOffice,
        packageWording
    }, isCreate = false) => {
        let errorMessages = [];
        let hasError = false;
        const packagesRef = admin.database().ref("packages");
        const countriesRef = admin.database().ref("countries");
        const clientsRef = admin.database().ref("clients");
        const plansRef = admin.database().ref("plans");
        const validitiesRef = admin.database().ref("validities");
        const levelsRef = admin.database().ref("levels");
        const benefitsPerProvisionerRef = admin.database().ref("benefitsPerProvisioner");
        const intermediariesRef = admin.database().ref("intermediaries");
        const packagesData = await packagesRef.once('value');
        const searchedPackageDataExists = packagesData.child(packageId).exists();
        const countriesData = await countriesRef.once('value');
        const searchedCountryDataExists = countriesData.child(countryId).exists();
        const clientsData = await clientsRef.once('value');
        const searchedClientDataExists = clientsData.child(clientId).exists();
        if(isCreate) {
            if(searchedPackageDataExists) {
                hasError = true;
                errorMessages = [...errorMessages, 'A package with that Id "' + packageId +  '" already exist. Please verify the information.'];
            }
        }
        if(!searchedCountryDataExists) {
            hasError = true;
            errorMessages = [...errorMessages, 'The countryId sent for the package doesnt exist. Please verify the information.'];
        }
        if(!searchedClientDataExists) {
            hasError = true;
            errorMessages = [...errorMessages, 'The clientId sent for the package doesnt exist. Please verify the information.'];
        }
        if(!name || name === '' || name.length > 60) {
            hasError = true;
            errorMessages = [...errorMessages, 'Please add a valid name that has less than or equal to 60 characters.'];
        }
        if(!maxPlans && (Number.isNaN(Number(maxPlans)) || maxPlans <= 0)) {
            hasError = true;
            errorMessages = [...errorMessages, 'Please add a valid number higher tha 0 for the maxPlans field in the package.'];
        }
        if(!planIds || !Array.isArray(planIds)) {
            hasError = true;
            errorMessages = [...errorMessages, 'Please add at least one planId for the planIds array field in the package.'];
        } else {
            if(planIds.length !== maxPlans){
                hasError = true;
                errorMessages = [...errorMessages, 'The maxPlans and the planIds length dont match.'];
            }

            const plansData = await plansRef.once('value');
            planIds.forEach(planId => {
                const searchedPlanDataExists = plansData.child(planId).exists();
                if(!searchedPlanDataExists) {
                    hasError = true;
                    errorMessages = [...errorMessages, 'The planId sent "' + planId + '" for the package doesnt exist. Please verify the information.'];
                }
            });
        }
        if(!maxValidities && (Number.isNaN(Number(maxValidities) || maxValidities <= 0))) {
            hasError = true;
            errorMessages = [...errorMessages, 'Please add a valid number higher tha 0 for the maxValidities field in the package.'];
        }

        if(!validityIds || !Array.isArray(validityIds)) {
            hasError = true;
            errorMessages = [...errorMessages, 'Please add at least one validityId for the validityIds array field in the package.'];
        } else {
            if(validityIds.length !== maxValidities){
                hasError = true;
                errorMessages = [...errorMessages, 'The maxValidities and the validityIds length dont match.'];
            }

            const validitiesData = await validitiesRef.once('value');
            validityIds.forEach(validityId => {
                const searchedValidityDataExists = validitiesData.child(validityId).exists();
                if(!searchedValidityDataExists) {
                    hasError = true;
                    errorMessages = [...errorMessages, 'The validityId sent "' + validityId + '" for the package doesnt exist. Please verify the information.'];
                }
            });
        }
    
        if(!maxLevels && (Number.isNaN(Number(maxLevels) || maxLevels <= 0))) {
            hasError = true;
            errorMessages = [...errorMessages, 'Please add a valid number higher than 0 for the maxLevels field in the package.'];
        }

        if(!levelIds || !Array.isArray(levelIds)) {
            hasError = true;
            errorMessages = [...errorMessages, 'Please add at least one levelId for the levelIds array field in the package.'];
        } else {
            if(levelIds.length !== maxLevels){
                hasError = true;
                errorMessages = [...errorMessages, 'The maxLevels and the levelIds length dont match.'];
            }

            const levelsData = await levelsRef.once('value');
            levelIds.forEach(levelId => {
                const searchedLevelDataExists = levelsData.child(levelId).exists();
                if(!searchedLevelDataExists) {
                    hasError = true;
                    errorMessages = [...errorMessages, 'The levelId sent "' + levelId + '" for the package doesnt exist. Please verify the information.'];
                }
            });
        }

        const intermediariesData = await intermediariesRef.once('value');
        if (salesPointId) {
            const searchedSalesPointDataExists = intermediariesData.child(salesPointId).exists();
            if(!searchedSalesPointDataExists) {
                hasError = true;
                errorMessages = [...errorMessages, 'The salesPointId sent "' + v + '" for the package doesnt exist. Please verify the information.'];
            }
        }
        if(percentageCommisionSalesPoint && (Number.isNaN(Number(percentageCommisionSalesPoint) || percentageCommisionSalesPoint <= 0
        || percentageCommisionSalesPoint > 50))) {
            hasError = true;
            errorMessages = [...errorMessages, 'Please add a valid percentageCommisionSalesPoint higher than 0 and less than 50 for the package.'];
        }

        if (enrollerId) {
            const searchedEnrollerDataExists = intermediariesData.child(enrollerId).exists();
            if(!searchedEnrollerDataExists) {
                hasError = true;
                errorMessages = [...errorMessages, 'The enrollerId sent "' + enrollerId + '" for the package doesnt exist. Please verify the information.'];
            }
        }
        if(percentageCommisionEnroller && (Number.isNaN(Number(percentageCommisionEnroller) || percentageCommisionEnroller <= 0
        || percentageCommisionEnroller > 50))) {
            hasError = true;
            errorMessages = [...errorMessages, 'Please add a valid percentageCommisionEnroller higher than 0 and less than 50 for the package.'];
        }

        if (brokerId) {
            const searchedBrokerDataExists = intermediariesData.child(brokerId).exists();
            if(!searchedBrokerDataExists) {
                hasError = true;
                errorMessages = [...errorMessages, 'The brokerId sent "' + brokerId + '" for the package doesnt exist. Please verify the information.'];
            }
        }
        if(percentageCommisionBroker && (Number.isNaN(Number(percentageCommisionBroker) || percentageCommisionBroker <= 0
        || percentageCommisionBroker > 50))) {
            hasError = true;
            errorMessages = [...errorMessages, 'Please add a valid percentageCommisionBroker higher than 0 and less than 50 for the package.'];
        }

        if (promoterId) {
            const searchedPromoterDataExists = intermediariesData.child(promoterId).exists();
            if(!searchedPromoterDataExists) {
                hasError = true;
                errorMessages = [...errorMessages, 'The promoterId sent "' + promoterId + '" for the package doesnt exist. Please verify the information.'];
            }
        }
        if(percentageCommisionPromoter && (Number.isNaN(Number(percentageCommisionPromoter) || percentageCommisionPromoter <= 0
        || percentageCommisionPromoter > 50))) {
            hasError = true;
            errorMessages = [...errorMessages, 'Please add a valid percentageCommisionPromoter higher than 0 and less than 50 for the package.'];
        }
        
        if (officeId) {
            const searchedOfficerDataExists = intermediariesData.child(officeId).exists();
            if(!searchedOfficerDataExists) {
                hasError = true;
                errorMessages = [...errorMessages, 'The officeId sent "' + officeId + '" for the package doesnt exist. Please verify the information.'];
            }
        }
        if(percentageCommisionOffice && (Number.isNaN(Number(percentageCommisionOffice) || percentageCommisionOffice <= 0
        || percentageCommisionOffice > 50))) {
            hasError = true;
            errorMessages = [...errorMessages, 'Please add a valid percentageCommisionOffice higher than 0 and less than 50 for the package.'];
        }
    
        if(packageWording && packageWording === '') {
            hasError = true;
            errorMessages = [...errorMessages, 'Please add a valid packageWording for the package.']
        }

        if(benefitsPerProvisioner) {
            if (!Array.isArray(benefitsPerProvisioner)) {
                hasError = true;
                errorMessages = [...errorMessages, 'Please add at least one benefitPerProvisioner for the benefitsPerProvisioner array field in the package.'];
            } else {
                const benefitsPerProvisionerData = await benefitsPerProvisionerRef.once('value');
                benefitsPerProvisioner.forEach(benefitPerProvisioner => {
                    const searchedBenefitPerProvisionerDataExists = benefitsPerProvisionerData.child(benefitPerProvisioner).exists();
                    if(!searchedBenefitPerProvisionerDataExists) {
                        hasError = true;
                        errorMessages = [...errorMessages, 'The benefitPerProvisionerId sent "' + benefitPerProvisioner + '" for the package doesnt exist. Please verify the information.'];
                    }
                });
            }
        }
    
        return { hasError, errorMessages };
    }