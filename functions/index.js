const cors = require('cors');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const corsHandler = cors({ origin: true });
admin.initializeApp();
const { getAllCurrencies, getCurrencyById, createCurrencyById, updateCurrencyById, deleteCurrencyById } = require('./separated-funcs/currency-functions');
const { getAllCountries, getCountryById, createCountryById, updateCountryById, deleteCountryById  } = require('./separated-funcs/country-functions');
const { getAllStates, getStateById, createStateById, updateStateById, deleteStateById } = require('./separated-funcs/states-functions');
const { getAllBranches, getBranchById, createBranchById, updateBranchById, deleteBranchById } = require('./separated-funcs/branch-functions');
const { getAllClients, getClientById, createClientById, updateClientById, deleteClientById } = require('./separated-funcs/clients-functions');
const { getAllProvisioners, getProvisionerById, createProvisionerById, updateProvisionerById, deleteProvisionerById } = require('./separated-funcs/provisioners-functions');
const { getAllBenefits, getBenefitById, createBenefitById, updateBenefitById, deleteBenefitById } = require('./separated-funcs/benefit-functions');
const { getAllPlans, getPlanById, createPlanById, updatePlanById, deletePlanById } = require('./separated-funcs/plans-functions');
const { getAllValidities, getValidityById, createValidityById, updateValidityById, deleteValidityById } = require('./separated-funcs/validities-functions');
const { getAllBenefitsPerProvisioner, getBenefitPerProvisionerById, createBenefitPerProvisionerById, updateBenefitPerProvisionerById, deleteBenefitPerProvisionerById } = require("./separated-funcs/benefit-per-provisioner-functions");
const { getAllPackages, getPackageById, createPackageById, updatePackageById, deletePackageById, getPackageInfo } = require("./separated-funcs/packages-functions");
const { getAllIntermediaryTypes, getIntermediaryTypeById, createIntermediaryTypeById, updateIntermediaryTypeById, deleteIntermediaryTypeById } = require("./separated-funcs/intermediary-types-functions");
const { getAllIntermediaries, getIntermediaryById, createIntermediaryById, updateIntermediaryById, deleteIntermediaryById } = require("./separated-funcs/intermediary-functions");
const { getAllLevels, getLevelById, createLevelById, updateLevelById, deleteLevelById } = require('./separated-funcs/levels-functions');
const { getAllAges, getAgeById, createAgeById, updateAgeById, deleteAgeById } = require('./separated-funcs/age-functions');
const { getAllGenders, getGenderById, createGenderById, updateGenderById, deleteGenderById } = require('./separated-funcs/gender-functions');
const { getAllKinships, getKinshipById, createKinshipById, updateKinshipById, deleteKinshipById } = require('./separated-funcs/kinships-functions');
const { getAllBenefitsPerProvisionerRatesByPackageId, getAllBenefitsPerProvisionerRatesByBenefitPerProvisionerId, getBenefitPerProvisionerRatesById, createBenefitsPerProvisionerRatesById, updateBenefitsPerProvisionerRatesById, deleteBenefitsPerProvisionerRatesById } = require("./separated-funcs/parameter-rates-by-benefit-per-provisioner-functions");

const { getAllInsuredPerPackage, getInsuredByEmail } = require('./separated-funcs/insured-functions');

let BreakException = {};
let timesIterated = -1;
let startingIdLetters = 'AA';
let startingIdNumber = '000';

/******************

    EMPIEZAN SERVICIOS PRINCIPALES DE MONEDAS

******************/

// Obtiene todas las monedas dadas de alta
exports.getAllCurrencies = functions.https.onRequest( async(req, res) => {
    await getAllCurrencies(req, res);
});

// Crea una moneda con la información proporcionada
exports.createCurrency = functions.https.onRequest( async(req, res) => {
    await createCurrencyById(req, res);
});

// Obtiene una moneda con la información dada de alta
exports.getCurrency = functions.https.onRequest(async(req, res) => {
    await getCurrencyById(req, res);
});

// Actualiza una moneda con la información proporcionada
exports.updateCurrency = functions.https.onRequest(async(req, res) => {
    await updateCurrencyById(req, res);
});

// Baja lógica de una moneda
exports.deleteCurrency = functions.https.onRequest( async(req, res) => {
    await deleteCurrencyById(req, res);
});

/******************

    EMPIEZAN SERVICIOS PRINCIPALES DE PAÍSES

******************/

// Obtiene todos los paises dados de alta
exports.getAllCountries = functions.https.onRequest( async(req, res) => {
    await getAllCountries(req, res);
});

// Crea un país con la información proporcionada
exports.createCountry = functions.https.onRequest(async (req, res) => {
    await createCountryById(req, res);
});

// Obtiene un país con la información dada de alta
exports.getCountry = functions.https.onRequest(async (req, res) => {
    await getCountryById(req, res);
});

// Actualiza un país con la información proporcionada
exports.updateCountry = functions.https.onRequest( async(req, res) => {
    await updateCountryById(req, res);
});

// Baja lógica de un país
exports.deleteCountry = functions.https.onRequest( async(req, res) => {
    await deleteCountryById(req, res);
});

/******************

    EMPIEZAN SERVICIOS PRINCIPALES DE ESTADOS

******************/

// Obtiene todos los estados dados de alta
exports.getAllStates = functions.https.onRequest( async(req, res) => {
    await getAllStates(req, res);
});

// Crea un estado con la información proporcionada
exports.createState = functions.https.onRequest(async(req, res) => {
    await createStateById(req, res);
});

// Obtiene un estado con la información dada de alta
exports.getState = functions.https.onRequest(async(req, res) => {
    await getStateById(req, res);
});

// Actualiza un estado con la información proporcionada
exports.updateState = functions.https.onRequest(async(req, res) => {
    await updateStateById(req, res);
});

// Baja lógica de un estado
exports.deleteState = functions.https.onRequest(async(req, res) => {
    await deleteStateById(req, res);
});

/******************

    EMPIEZAN SERVICIOS PRINCIPALES DE PLANES

******************/

// Obtiene todos los planes dados de alta
exports.getAllPlans = functions.https.onRequest( async(req, res) => {
    await getAllPlans(req, res);
});

// Crea un plan con la información proporcionada
exports.createPlan = functions.https.onRequest(async(req, res) => {
    await createPlanById(req, res);
});

// Obtiene un plan con la información dada de alta
exports.getPlan = functions.https.onRequest(async(req, res) => {
    await getPlanById(req, res);
});

// Actualiza un plan con la información proporcionada
exports.updatePlan = functions.https.onRequest(async(req, res) => {
    await updatePlanById(req, res);
});

// Baja lógica de un plan
exports.deletePlan = functions.https.onRequest(async(req, res) => {
    await deletePlanById(req, res);
});

/******************

    EMPIEZAN SERVICIOS PRINCIPALES DE NIVELES

******************/

// Obtiene todos los niveles dados de alta
exports.getAllLevels = functions.https.onRequest( async(req, res) => {
    await getAllLevels(req, res);
});

// Crea un nivel con la información proporcionada
exports.createLevel = functions.https.onRequest(async(req, res) => {
    await createLevelById(req, res);
});

// Obtiene un nivel con la información dada de alta
exports.getLevel = functions.https.onRequest(async(req, res) => {
    await getLevelById(req, res);
});

// Actualiza un nivel con la información proporcionada
exports.updateLevel = functions.https.onRequest(async(req, res) => {
    await updateLevelById(req, res);
});

// Baja lógica de un nivel
exports.deleteLevel = functions.https.onRequest(async(req, res) => {
    await deleteLevelById(req, res);
});

/******************

    EMPIEZAN SERVICIOS PRINCIPALES DE EDADES

******************/

// Obtiene todos los niveles dados de alta
exports.getAllAges = functions.https.onRequest( async(req, res) => {
    await getAllAges(req, res);
});

// Crea una edad con la información proporcionada
exports.createAge = functions.https.onRequest(async(req, res) => {
    await createAgeById(req, res);
});

// Obtiene una edad con la información dada de alta
exports.getAge = functions.https.onRequest(async(req, res) => {
    await getAgeById(req, res);
});

// Actualiza una edad con la información proporcionada
exports.updateAge = functions.https.onRequest(async(req, res) => {
    await updateAgeById(req, res);
});

// Baja lógica de una edad
exports.deleteAge = functions.https.onRequest(async(req, res) => {
    await deleteAgeById(req, res);
});

/******************

    EMPIEZAN SERVICIOS PRINCIPALES DE GÉNEROS

******************/

// Obtiene todos los géneros dados de alta
exports.getAllGenders = functions.https.onRequest( async(req, res) => {
    await getAllGenders(req, res);
});

// Crea un género con la información proporcionada
exports.createGender = functions.https.onRequest(async(req, res) => {
    await createGenderById(req, res);
});

// Obtiene un género con la información dada de alta
exports.getGender = functions.https.onRequest(async(req, res) => {
    await getGenderById(req, res);
});

// Actualiza un género con la información proporcionada
exports.updateGender = functions.https.onRequest(async(req, res) => {
    await updateGenderById(req, res);
});

// Baja lógica de un género
exports.deleteGender = functions.https.onRequest(async(req, res) => {
    await deleteGenderById(req, res);
});

/******************

    EMPIEZAN SERVICIOS PRINCIPALES DE PARENTESCOS

******************/

// Obtiene todos los parentescos dados de alta
exports.getAllKinships = functions.https.onRequest( async(req, res) => {
    await getAllKinships(req, res);
});

// Crea un parentesco con la información proporcionada
exports.createKinship = functions.https.onRequest(async(req, res) => {
    await createKinshipById(req, res);
});

// Obtiene un parentesco con la información dada de alta
exports.getKinship = functions.https.onRequest(async(req, res) => {
    await getKinshipById(req, res);
});

// Actualiza un parentesco con la información proporcionada
exports.updateKinship = functions.https.onRequest(async(req, res) => {
    await updateKinshipById(req, res);
});

// Baja lógica de un parentesco
exports.deleteKinship = functions.https.onRequest(async(req, res) => {
    await deleteKinshipById(req, res);
});

/******************

    EMPIEZAN SERVICIOS PRINCIPALES DE VIGENCIAS

******************/

// Obtiene todas las vigencias dados de alta
exports.getAllValidities = functions.https.onRequest( async(req, res) => {
    await getAllValidities(req, res);
});

// Crea una vigencia con la información proporcionada
exports.createValidity = functions.https.onRequest(async(req, res) => {
    await createValidityById(req, res);
});

// Obtiene una vigencia con la información dada de alta
exports.getValidity = functions.https.onRequest(async(req, res) => {
    await getValidityById(req, res);
});

// Actualiza una vigencia con la información proporcionada
exports.updateValidity = functions.https.onRequest(async(req, res) => {
    await updateValidityById(req, res);
});

// Baja lógica de una vigencia
exports.deleteValidity = functions.https.onRequest(async(req, res) => {
    await deleteValidityById(req, res);
});

/******************

    EMPIEZAN SERVICIOS PRINCIPALES DE RAMOS, SUBRAMOS Y SUBSUBRAMOS

******************/

// Obtiene todos los ramos/subramos/subsubramos dados de alta
exports.getAllBranches = functions.https.onRequest( async(req, res) => {
    await getAllBranches(req, res);
});

// Crea un ramo/subramo/subsubramo con la información proporcionada
exports.createBranch = functions.https.onRequest(async (req, res) => {
    await createBranchById(req, res);
});

// Obtiene un ramo/subramo/subsubramo con la información dada de alta
exports.getBranch = functions.https.onRequest(async (req, res) => {
    await getBranchById(req, res);
});

// Actualiza un ramo/subramo/subsubramo con la información proporcionada
exports.updateBranch = functions.https.onRequest(async (req, res) => {
    await updateBranchById(req, res);
});

// Baja lógica de un ramo/subramo/subsubramo
exports.deleteBranch = functions.https.onRequest(async (req, res) => {
    await deleteBranchById(req, res);
});

/******************

    EMPIEZAN SERVICIOS PRINCIPALES DE CLIENTES

******************/

// Obtiene todos los clientes dadas de alta
exports.getAllClients = functions.https.onRequest( async(req, res) => {
    await getAllClients(req, res);
});

// Crea un cliente con la información proporcionada
exports.createClient = functions.https.onRequest(async (req, res) => {
    await createClientById(req, res);
});

// Obtiene un cliente con la información dada de alta
exports.getClient = functions.https.onRequest(async (req, res) => {
    await getClientById(req, res);
});

// Actualiza un cliente con la información proporcionada
exports.updateClient = functions.https.onRequest(async (req, res) => {
    await updateClientById(req, res);
});

// Baja lógica de un cliente
exports.deleteClient = functions.https.onRequest(async (req, res) => {
    await deleteClientById(req, res);
});

/******************

    EMPIEZAN SERVICIOS PRINCIPALES DE PROVEEDORES

******************/

// Obtiene todos los proveedores dadas de alta
exports.getAllProvisioners = functions.https.onRequest( async(req, res) => {
    await getAllProvisioners(req, res);
});

// Crea un proveedor con la información proporcionada
exports.createProvisioner = functions.https.onRequest(async (req, res) => {
    await createProvisionerById(req, res);
});

// Obtiene un proveedor con la información dada de alta
exports.getProvisioner = functions.https.onRequest(async (req, res) => {
    await getProvisionerById(req, res);
});

// Actualiza un proveedor con la información proporcionada
exports.updateProvisioner = functions.https.onRequest(async (req, res) => {
    await updateProvisionerById(req, res);
});

// Baja lógica de un proveedor
exports.deleteProvisioner = functions.https.onRequest(async (req, res) => {
    await deleteProvisionerById(req, res);
});

/******************

    EMPIEZAN SERVICIOS PRINCIPALES DE BENEFICIOS Y COBENEFICIOS

******************/

// Obtiene todos los beneficios dadas de alta
exports.getAllBenefits = functions.https.onRequest( async(req, res) => {
    await getAllBenefits(req, res);
});

// Crea un beneficio/cobeneficio con la información proporcionada
exports.createBenefit = functions.https.onRequest(async (req, res) => {
    await createBenefitById(req, res);
});

// Obtiene un beneficio/cobeneficio con la información dada de alta
exports.getBenefit = functions.https.onRequest(async (req, res) => {
    await getBenefitById(req, res);
});

// Actualiza un beneficio/cobeneficio con la información proporcionada
exports.updateBenefit = functions.https.onRequest(async (req, res) => {
    await updateBenefitById(req, res);
});

// Baja lógica de un beneficio/cobeneficio
exports.deleteBenefit = functions.https.onRequest(async (req, res) => {
    await deleteBenefitById(req, res);
});

/******************

    EMPIEZAN SERVICIOS PRINCIPALES DE BENEFICIOS POR PAQUETE

******************/

//Obtiene todos los beneficios por proveedor de un paquete
exports.getAllBenefitsPerProvisioner = functions.https.onRequest(async(req,res) => {
    await getAllBenefitsPerProvisioner(req, res);
})

// Crea/Asigna un beneficio con su información extra a un paquete
exports.createBenefitPerProvisioner = functions.https.onRequest(async (req, res) => {
    await createBenefitPerProvisionerById(req, res);
});

// Obtiene un beneficio de un paquete con la información dada de alta
exports.getBenefitPerProvisioner = functions.https.onRequest(async (req, res) => {
    await getBenefitPerProvisionerById(req, res);
});

// Actualiza un beneficio por proveedor con la información proporcionada
exports.updateBenefitPerProvisioner = functions.https.onRequest(async (req, res) => {
    await updateBenefitPerProvisionerById(req, res);
});

// Baja lógica de un beneficio de un paquete
exports.deleteBenefitPerProvisioner = functions.https.onRequest(async (req, res) => {
    await deleteBenefitPerProvisionerById(req, res);
});

/******************

    EMPIEZAN SERVICIOS PRINCIPALES DE TIPOS DE INTERMEDIARIOS

******************/

// Obtiene todos los tipos de intermediarios dados de alta
exports.getAllIntermediaryTypes = functions.https.onRequest( async(req, res) => {
    await getAllIntermediaryTypes(req, res);
});

// Crea un tipo de intermediario con la información proporcionada
exports.createIntermediaryType = functions.https.onRequest(async (req, res) => {
    await createIntermediaryTypeById(req, res);
});

// Obtiene un tipo de intermediario con la información dada de alta
exports.getIntermediaryType = functions.https.onRequest(async (req, res) => {
    await getIntermediaryTypeById(req, res);
});

// Actualiza un tipo de intermediario con la información proporcionada
exports.updateIntermediaryType = functions.https.onRequest(async (req, res) => {
    await updateIntermediaryTypeById(req, res);
});

// Baja lógica de un tipo de intermediario
exports.deleteIntermediaryType = functions.https.onRequest(async (req, res) => {
    await deleteIntermediaryTypeById(req, res);
});

/******************

    EMPIEZAN SERVICIOS PRINCIPALES DE INTERMEDIARIOS

******************/

// Obtiene todos los intermediarios dados de alta
exports.getAllIntermediaries = functions.https.onRequest( async(req, res) => {
    await getAllIntermediaries(req, res);
});

// Crea un intermediario con la información proporcionada
exports.createIntermediary = functions.https.onRequest(async (req, res) => {
    await createIntermediaryById(req, res);
});

// Obtiene un intermediario con la información dada de alta
exports.getIntermediary = functions.https.onRequest(async (req, res) => {
    await getIntermediaryById(req, res);
});

// Actualiza un intermediario con la información proporcionada
exports.updateIntermediary = functions.https.onRequest(async (req, res) => {
    await updateIntermediaryById(req, res);
});

// Baja lógica de un intermediario
exports.deleteIntermediary = functions.https.onRequest(async (req, res) => {
    await deleteIntermediaryById(req, res);
});

/******************

    EMPIEZAN SERVICIOS PRINCIPALES DE PAQUETES

******************/

//Obtiene todos los paquetes por proveedor de un paquete
exports.getAllPackages = functions.https.onRequest(async(req,res) => {
    await getAllPackages(req, res);
})

// Crea un paquete con la información proporcionada
exports.createPackage = functions.https.onRequest(async (req, res) => {
    await createPackageById(req, res);
});

// Obtiene un paquete con la información dada de alta
exports.getPackage = functions.https.onRequest(async (req, res) => {
    await getPackageById(req, res);
});

// Actualiza un paquete con la información proporcionada
exports.updatePackage = functions.https.onRequest(async (req, res) => {
    await updatePackageById(req, res);
});

// Baja lógica de un paquete
exports.deletePackage = functions.https.onRequest(async (req, res) => {
    await deletePackageById(req, res);
});

/******************

 EMPIEZAN SERVICIOS PRINCIPALES DE TARIFAS POR BENEFICIOS

 ******************/

exports.getAllBenefitsPerProvisionerRatesByPackage = functions.https.onRequest(async(req,res) => {
    await getAllBenefitsPerProvisionerRatesByPackageId(req, res);
});

exports.getAllBenefitsPerProvisionerRatesByBenefitPerProvisioner = functions.https.onRequest(async(req,res) => {
    await getAllBenefitsPerProvisionerRatesByBenefitPerProvisionerId(req, res);
});

exports.getBenefitPerProvisionerRates = functions.https.onRequest(async(req,res) => {
    await getBenefitPerProvisionerRatesById(req, res);
});

exports.createBenefitsPerProvisionerRates = functions.https.onRequest(async(req,res) => {
    await createBenefitsPerProvisionerRatesById(req,res);
});

exports.updateBenefitsPerProvisionerRates = functions.https.onRequest(async(req,res) => {
    await updateBenefitsPerProvisionerRatesById(req,res);
});

exports.deleteBenefitsPerProvisionerRates = functions.https.onRequest(async(req,res) => {
    await deleteBenefitsPerProvisionerRatesById(req,res);
});

/******************

    EMPIEZAN SERVICIOS PRINCIPALES DE USUARIOS

******************/

// Regresa información muy básica del usuario así como sus protegidos a partir de su Id
exports.simpleInsuredSearchById = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        const insuredId = req.query.insuredId;
        var insuredRef = admin.database().ref("insured");
        const insuredsData = await insuredRef.once('value');
        const mainInsuredData = insuredsData.child(insuredId);

        if(mainInsuredData === undefined || mainInsuredData === null) {
            res.status(404).json(
                {
                    errorMessage : "There is no existing insured with the Id provided."
                }
            );
        }
        let insuredJSON = mainInsuredData.toJSON();

        const searchedInsured = await getSimpleInsuredInfo(insuredId, insuredsData, insuredJSON);
        res.status(200).json(
            searchedInsured
        );
    });
});

// Regresa información muy básica del usuario así como sus protegidos a partir de su CURP
exports.simpleInsuredSearchByCURP = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        const insuredCURP = req.query.curp;
        const insuredRef = admin.database().ref("insured");

        const insured = await insuredRef.orderByChild("governmentNumber").startAt(insuredCURP).limitToFirst(1).once("value");
        if(insured === undefined || insured === null) {
            res.status(404).json(
                {
                    errorMessage : "There is no existing insured with the CURP provided."
                }
            );
        }

        let insuredJSON = insured.toJSON();
        const insuredId = Object.keys(insuredJSON)[0];

        const insuredsData = await insuredRef.once('value');
        const insuredSnap = insuredsData.child(insuredId);
        insuredJSON = insuredSnap.toJSON();

        const searchedInsured = await getSimpleInsuredInfo(insuredId, insuredsData, insuredJSON);
        res.status(200).json(
            searchedInsured
        );
    });
});

// Regresa información muy básica del usuario así como sus protegidos a partir de su Id de membresía
exports.simpleInsuredSearchByMembershipId = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        const membershipId = req.query.membershipId;
        const membershipsPerUserRef = admin.database().ref("membershipsPerUser");

        const membershipsOfUser = await membershipsPerUserRef.orderByKey().startAt(membershipId).limitToFirst(1).once("value");
        if(membershipsOfUser === undefined || membershipsOfUser === null) {
            res.status(404).json(
                {
                    errorMessage : "There is no existing insured with the membershipId provided."
                }
            );
        }

        let membershipsOfUserJSON = membershipsOfUser.toJSON();

        const insuredId = membershipsOfUserJSON[membershipId].insured.split('/')[2];
        var insuredRef = admin.database().ref("insured");
        const insuredsData = await insuredRef.once('value');
        const mainInsuredData = insuredsData.child(insuredId);

        let insuredJSON = mainInsuredData.toJSON();

        const searchedInsured = await getSimpleInsuredInfo(insuredId, insuredsData, insuredJSON);
        res.status(200).json(
            searchedInsured
        );
    });
});

// Regresa información muy básica de uno o varios usuarios así como sus protegidos a partir de diferentes parámetros
exports.advanceInsuredSearch = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        const searchParameters = req.body;
        const insuredRef = admin.database().ref("insured");
        const insuredsData = await insuredRef.once('value');
        const searchedInsuredIds = [];
        const searchedInsureds = [];
        const promiseResults = [];

        if(searchParameters.name === undefined || searchParameters.name === null ||
        searchParameters.name === "" || searchParameters.firstLastName === undefined ||
        searchParameters.firstLastName === null || searchParameters.firstLastName === "") {
            res.status(404).json(
                {
                    errorMessage : "There are no existing insured with the parameters provided. Please be sure to at least provide the name and the firstLastName."
                }
            );
            return;
        }

        const hasAnyExtraParameters = checkIfUndefinedOrNullOrEmpty(searchParameters.middleName) ||
        checkIfUndefinedOrNullOrEmpty(searchParameters.secondLastName) ||
        checkIfUndefinedOrNullOrEmpty(searchParameters.phone) ||
        checkIfUndefinedOrNullOrEmpty(searchParameters.email) ||
        checkIfUndefinedOrNullOrEmpty(searchParameters.zipCode) ||
        checkIfUndefinedOrNullOrEmpty(searchParameters.country) ||
        checkIfUndefinedOrNullOrEmpty(searchParameters.state) ? true : false;

        const insured = await insuredRef.orderByChild("name").startAt(searchParameters.name).once("value");
        if(insured === undefined || insured === null) {
            res.status(404).json(
                {
                    errorMessage : "There are no existing insured with the name provided."
                }
            );
        } else {
            try {
                insured.forEach(user => {
                    const insuredJSON = user.toJSON();
                    const insuredId = user.key;
                    if (insuredJSON.name.includes(searchParameters.name) && searchParameters.firstLastName !== undefined &&
                    searchParameters.firstLastName !== null && searchParameters.firstLastName !== ""){
                        if (insuredJSON.firstLastName.includes(searchParameters.firstLastName) && !hasAnyExtraParameters) {
                            searchedInsuredIds.push({
                                insuredId : insuredId
                            });
                        } else if (insuredJSON.firstLastName.includes(searchParameters.firstLastName) && hasAnyExtraParameters) {
                            let hasErrors = false;
                            if(checkIfUndefinedOrNullOrEmpty(searchParameters.middleName)
                            && !insuredJSON.middleName.includes(searchParameters.middleName)) {
                                hasErrors = true;
                            }
                            if(checkIfUndefinedOrNullOrEmpty(searchParameters.secondLastName)
                            && !insuredJSON.secondLastName.includes(searchParameters.secondLastName)) {
                                hasErrors = true;
                            }
                            if(checkIfUndefinedOrNullOrEmpty(searchParameters.phone)
                            && !insuredJSON.phone.includes(searchParameters.phone)) {
                                hasErrors = true;
                            }
                            if(checkIfUndefinedOrNullOrEmpty(searchParameters.email)
                            && !insuredJSON.email.includes(searchParameters.email)) {
                                hasErrors = true;
                            }
                            if(checkIfUndefinedOrNullOrEmpty(searchParameters.zipCode)
                            && !insuredJSON.address.zipCode.includes(searchParameters.zipCode)) {
                                hasErrors = true;
                            }
                            if(checkIfUndefinedOrNullOrEmpty(searchParameters.country)
                            && !insuredJSON.address.country.includes(searchParameters.country)) {
                                hasErrors = true;
                            }
                            if(checkIfUndefinedOrNullOrEmpty(searchParameters.state)
                            && !insuredJSON.address.state.includes(searchParameters.state)) {
                                hasErrors = true;
                            }

                            if(!hasErrors) {
                                searchedInsuredIds.push({
                                    insuredId : insuredId
                                });
                            }
                        }
                    } else {
                        throw BreakException;
                    }
                });
            } catch (e) {
                if (e !== BreakException) throw e;
            }

            if (searchedInsuredIds.length === 0) {
                res.status(404).json(
                    {
                        errorMessage : "There are no existing insured with the parameters provided. Please verify the sent information."
                    }
                );
            } else {
                searchedInsuredIds.forEach(user => {
                    const mainInsuredData = insuredsData.child(user.insuredId);
                    let insuredJSON = mainInsuredData.toJSON();
                    promiseResults.push(getSimpleInsuredInfo(user.insuredId, insuredsData, insuredJSON)
                    .then(searchedInsured => {
                        searchedInsureds.push(searchedInsured);
                        return;
                    })
                    .catch ((error) => {
                    }));
                });
                await Promise.all(promiseResults);

                res.status(200).json(
                    searchedInsureds
                );
            }
        }
    });
});

// Regresa la información base de un socio por su correo electrónico
exports.getInsuredByEmail = functions.https.onRequest(async (req, res) => {
    await getInsuredByEmail(req, res);
});

// Regresa la información completa de un socio por su Id
exports.getInsuredInfo = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        const insuredId = req.query.insuredId;
        let insuredJSON = await getInsuredById(insuredId)
        return res.json(insuredJSON);
    });
});

// Regresa la lista de protegidos para un usuario de tenerlos
exports.getInsuredProtected = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        const insuredInfo = req.body;
        const insuredId = insuredInfo.insuredId;
        const insuredMembershipId = insuredInfo.insuredMembership;

        var insuredRef = admin.database().ref("insured");
        const insuredsData = await insuredRef.once('value');
        const mainInsuredData = insuredsData.child(insuredId);

        const insuredJSON = mainInsuredData.toJSON();
        const membershipId = insuredJSON.membershipsPerUser.split('/')[2];

        if (insuredMembershipId !== membershipId) {
            res.status(404).json(
                {
                    errorMessage : "The membershipId provided is not for the user"
                }
            );
        }
        const membershipIdSplitted = membershipId.split('-');

        if (parseInt(membershipIdSplitted[2]) > 0) {
            res.status(200).json(
                {
                    protected : []
                }
            );
        }

        const protectedArray = await getProtectedForInsured(insuredId, insuredsData, membershipIdSplitted, true);
        res.status(200).json(
            {
                protected : protectedArray
            }
        );
    });
});

// Regresa la información completa de un paquete por su Id
exports.getPackageInfo = functions.https.onRequest(async (req, res) => {
    await getPackageInfo(req, res);
});

// Función de crear de un socio que contemplando que el Id no se repita nunca
exports.createInsured = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        const insuredBodyInfo = req.body;
        const membershipId = insuredBodyInfo.membershipId;
        const insuredProtected = insuredBodyInfo.protected;
        const conflictError = 409;
        const internalServerError = 500;
        let errorMessages = [];
        let promiseResults = [];

        const insuredRef = admin.database().ref("insured");

        try {
            let mainUserExists = await admin.auth().getUserByEmail(insuredBodyInfo.email);
            if (mainUserExists !== undefined && mainUserExists !== null) {
                res.status(conflictError).json(
                    {
                        error : "A main insured already exists with that email. Please verify the information you sent."
                    }
                );
                return;
            }
        } catch (error) {
            console.log("email error - ", error);
            if (error.code !== "auth/user-not-found") {
                res.status(internalServerError).json(
                    {
                        error : error
                    }
                );
                return;
            }
        }

        if (insuredBodyInfo.phone !== undefined && insuredBodyInfo.phone !== null && insuredBodyInfo.phone !== "") {
            try {
                let phoneToValidate = insuredBodyInfo.phone;
                if (!phoneToValidate.includes("+52")) {
                    phoneToValidate = "+52" + phoneToValidate;
                } else if (!phoneToValidate.includes("+")) {
                    phoneToValidate = "+" + phoneToValidate;
                }
                let mainUserExists = await admin.auth().getUserByPhoneNumber(phoneToValidate);
                if (mainUserExists !== undefined && mainUserExists !== null) {
                    res.status(conflictError).json(
                        {
                            error : "A main insured already exists with that phone number. Please verify the information you sent."
                        }
                    );
                    return;
                }
            } catch (error) {
                console.log("phone error - ", error);
                if (error.code !== "auth/user-not-found") {
                    res.status(internalServerError).json(
                        {
                            error : error
                        }
                    );
                    return;
                }
            }
        }

        console.log("insuredBodyInfo.governmentNumber - ", insuredBodyInfo.governmentNumber);

        if (insuredBodyInfo.governmentNumber !== undefined && insuredBodyInfo.governmentNumber !== null && insuredBodyInfo.governmentNumber !== "") {
            const insuredCURP = await insuredRef.orderByChild("governmentNumber").startAt(insuredBodyInfo.governmentNumber).limitToFirst(1).once("value");
            const insuredCURPJSON = insuredCURP.toJSON();
            console.log("insuredCURPJSON - ", insuredCURPJSON);
            if(insuredCURPJSON !== undefined && insuredCURPJSON !== null) {
                const insuredCurpId = Object.keys(insuredCURPJSON)[0];
                if(insuredCurpId !== undefined && insuredCurpId !== null && insuredCURPJSON[insuredCurpId] !== undefined &&
                insuredCURPJSON[insuredCurpId].governmentNumber === insuredBodyInfo.governmentNumber) {
                    res.status(conflictError).json(
                        {
                            error : "A main insured already exists with that government number. Please verify the information you sent."
                        }
                    );
                    return;
                }
            }
        }

        if (insuredProtected !== undefined && insuredProtected !== null && insuredProtected.length > 0) {
            insuredProtected.forEach(protected => {
                promiseResults.push(admin.auth().getUserByEmail(protected.email)
                .then((protectedUserExists) => {
                    if (protectedUserExists !== undefined && protectedUserExists !== null) {
                        errorMessages.push(
                            {
                                error : "A protected already exists with that email '" + protected.email + "'. Please verify the information you sent."
                            }
                        );
                    }
                    return;
                }).catch ((error) => {
                    if (error.code !== "auth/user-not-found") {
                        errorMessages.push(
                            {
                                error : error
                            }
                        );
                    }
                }));

                let protectedPhoneToValidate = protected.phone;
                if (!protectedPhoneToValidate.includes("+52")) {
                    protectedPhoneToValidate = "+52" + protectedPhoneToValidate;
                } else if (!protectedPhoneToValidate.includes("+")) {
                    protectedPhoneToValidate = "+" + protectedPhoneToValidate;
                }
                promiseResults.push(admin.auth().getUserByPhoneNumber(protectedPhoneToValidate)
                .then((protectedUserExists) => {
                    if (protectedUserExists !== undefined && protectedUserExists !== null) {
                        const insuredId = Object.keys(insuredCURPJSON)[0];
                        if (insuredCURPJSON[insuredId].governmentNumber === insuredBodyInfo.governmentNumber) {
                            errorMessages.push(
                                {
                                    error : "A protected already exists with that phone number '" + protectedPhoneToValidate + "'. Please verify the information you sent."
                                }
                            );
                        }
                    }
                    return;
                }).catch ((error) => {
                    if (error.code !== "auth/user-not-found") {
                        errorMessages.push(
                            {
                                error : error
                            }
                        );
                    }
                }));

                if (protected.governmentNumber !== undefined && protected.governmentNumber !== null && protected.governmentNumber !== "") {
                    promiseResults.push(insuredRef.orderByChild("governmentNumber").startAt(protected.governmentNumber).limitToFirst(1).once("value")
                    .then((protectedCURP) => {
                        const protectedCURPJSON = protectedCURP.toJSON();
                        if(protectedCURPJSON !== undefined && protectedCURPJSON !== null) {
                            const protectedId = Object.keys(protectedCURPJSON)[0];
                            console.log("protectedId - ", protectedId);
                            if(protectedId !== undefined && protectedId !== null && protected[protectedId] !== undefined &&
                            protectedCURPJSON[protectedId].governmentNumber === protected.governmentNumber) {
                                errorMessages.push(
                                    {
                                        error : "A protected already exists with that government number '" + protected.governmentNumber + "'. Please verify the information you sent."
                                    }
                                );
                            }
                        }
                        return;
                    }).catch ((error) => {
                        console.log("protected CURP error - ", error);
                        errorMessages.push(
                            {
                                error : error
                            }
                        );
                    }));
                }
            });
            await Promise.all(promiseResults);
        }

        if (errorMessages.length > 0) {
            res.status(conflictError).json(
                {
                    errors : errorMessages
                }
            );
        } else {
            const membershipsPerUserRef = admin.database().ref("/membershipsPerUser");
            const membershipsRef = admin.database().ref("/memberships");
            const packagesRef = admin.database().ref("/packages");

            let membership = await membershipsRef.once('value');
            membership = membership.child(membershipId);
            let membershipJSON = membership.toJSON();
            let packageToObtain = membership.child('package').val().split('/')[2];

            let clientPackage = await packagesRef.once('value');
            clientPackage = clientPackage.child(packageToObtain);
            let clientPackageJSON = clientPackage.toJSON();

            let membershipRealId = membershipJSON.membershipId;
            console.log("membershipRealId - ", membershipRealId);

            let membershipsPerUser = await membershipsPerUserRef.orderByKey().startAt(membershipRealId).once("value");

            let totalMembers = 0;
            try {
                membershipsPerUser.forEach(member => {
                    if (member.key.includes(membershipRealId)){
                        let newTotalMembers = parseInt(member.key.split('-')[1]);
                        if (newTotalMembers > totalMembers) {
                            totalMembers = newTotalMembers;
                        }
                    } else {
                        throw BreakException;
                    }
                });
            } catch (e) {
                if (e !== BreakException) throw e;
            }
            totalMembers += 1;

            const todayDate = new Date();
            const day = todayDate.getDay();
            const month = todayDate.getMonth() + 1;
            const year = todayDate.getFullYear();

            let monthString = month <= 9 ? '0' + month : month;

            let newUserId = year + '-' + monthString;
            startingIdLetters = 'AA';
            startingIdNumber = '000';

            let insuredData = await insuredRef.orderByKey().startAt(newUserId).once("value");

            let totalNumUsers = 0;
            try {
                insuredData.forEach(insured => {
                    if (insured.key.includes(newUserId)){
                        startingIdLetters = insured.key.slice(8, 10);
                        totalNumUsers = parseInt(insured.key.slice(10, 14));
                    } else {
                        throw BreakException;
                    }
                });
            } catch (e) {
                if (e !== BreakException) throw e;
            }

            let usersCount = day === 0 && totalNumUsers === 0 ? 1 : totalNumUsers + 1;
            startingIdLetters = day === 0 && usersCount === 0 ? 'AA' : startingIdLetters;
            timesIterated = -1;

            startingIdNumber = assignUserNumber(usersCount, startingIdNumber);
            startingIdLetters = assignUserLetter(startingIdNumber, startingIdLetters);
            newUserId += '-' + startingIdLetters + startingIdNumber;

            insuredBodyInfo.registerDate = new Date().toISOString();
            insuredBodyInfo.age = assignInsuredAge(insuredBodyInfo);
            delete insuredBodyInfo.membershipId;
            delete insuredBodyInfo.protected;

            const authUser = createAuthUser(newUserId, insuredBodyInfo.email, insuredBodyInfo.phone, newUserId, insuredBodyInfo.name, insuredBodyInfo.middleName,
            insuredBodyInfo.firstLastName, insuredBodyInfo.secondLastName);

            let uid = "";
            try {
                const userAuthInfo = await admin.auth().createUser(authUser);
                uid = userAuthInfo.uid;
            } catch (error) {
                res.status(internalServerError).json(
                    {
                        customError : "The user couldn't be created. Please verify the information you sent.",
                        realError : error
                    }
                );
                return;
            }
            insuredBodyInfo.uid = uid;

            let membershipforUser = createMembershipforUser(membershipJSON, clientPackageJSON, totalMembers, newUserId, membershipId, true, 0);
            let newMembershipForUserId = membershipJSON.membershipId + "-" + membershipforUser.membershipNumber;
            insuredBodyInfo.membershipsPerUser = "/membershipsPerUser/" + newMembershipForUserId;

            await insuredRef.child(newUserId).set(insuredBodyInfo);
            await membershipsPerUserRef.child(newMembershipForUserId).set(membershipforUser);

            const responseBody = {};
            responseBody.newUserId = newUserId;
            responseBody.newMembershipForUserId = newMembershipForUserId;
            responseBody.usersCreatedProtected = [];

            const protectedMemberships = [];
            promiseResults = [];
            errorMessages = [];
            if (insuredProtected !== undefined && insuredProtected !== null && insuredProtected.length > 0) {
                let numberOfProtected = 1;
                insuredProtected.forEach(protected => {
                    startingIdNumber = '000';
                    usersCount = usersCount + 1;
                    startingIdNumber = assignUserNumber(usersCount, startingIdNumber);
                    startingIdLetters = assignUserLetter(startingIdNumber, startingIdLetters);
                    const newProtectedId = year + '-' + monthString + '-' + startingIdLetters + startingIdNumber;

                    protected.emergencyLastName = insuredBodyInfo.firstLastName;
                    protected.emergencyName = insuredBodyInfo.name;
                    protected.emergencyPhone = insuredBodyInfo.phone;
                    protected.registerDate = new Date().toISOString();
                    protected.age = assignInsuredAge(protected);

                    const authProtected = createAuthUser(newProtectedId, protected.email, protected.phone, newProtectedId, protected.name, protected.middleName,
                    protected.firstLastName, protected.secondLastName);

                    let protectedUid = "";
                    promiseResults.push(admin.auth().createUser(authProtected)
                    .then((protecetdAuthInfo) => {
                        protectedUid = protecetdAuthInfo.uid;
                        return;
                    }).catch ((error) => {
                        errorMessages.push(
                            {
                                customError : "The user's protected (" + authProtected.displayName + ") auth account couldn't be created. Please verify the information you sent.",
                                realError : error
                            }
                        );
                    }));

                    if (protectedUid !== "") {
                        protected.uid = protectedUid;
                    } else {
                        protected.uid = newProtectedId;
                    }

                    membershipforUser = createMembershipforUser(membershipJSON, clientPackageJSON, totalMembers, newProtectedId, membershipId, false, numberOfProtected);
                    const newMembershipForProtectedId = membershipJSON.membershipId + "-" + membershipforUser.membershipNumber;
                    promiseResults.push(membershipsPerUserRef.child(newMembershipForProtectedId).set(membershipforUser));
                    protectedMemberships.push(newMembershipForProtectedId);

                    protected.membershipsPerUser = "/membershipsPerUser/" + newMembershipForProtectedId;
                    promiseResults.push(insuredRef.child(newProtectedId).set(protected));

                    const protectedCreated = {};
                    protectedCreated.newProtectedId = newProtectedId;
                    protectedCreated.newMembershipForProtectedId = newMembershipForProtectedId;
                    responseBody.usersCreatedProtected.push(protectedCreated);

                    numberOfProtected += 1;
                });
            }
            await Promise.all(promiseResults);

            membershipJSON.insured += ",/membershipsPerUser/" + newMembershipForUserId;
            protectedMemberships.forEach((protectedMembership) => {
                membershipJSON.insured += ",/membershipsPerUser/" + protectedMembership;
            });
            membershipJSON.numberOfMemberships = membershipJSON.insured.split(',').length;
            await membershipsRef.child(membershipId).set(membershipJSON);

            res.status(200).json(
                {
                    responseBody : responseBody,
                    errorMessages : errorMessages
                }
            );
        }
    });
});

// Valida si un paquete existe dado su nombre, nombre del nivel y nombre del plan
exports.validatePackage = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        const packageInfo = req.body;
        const packageName = packageInfo.packageName;
        const levelName = packageInfo.levelName;
        const planName = packageInfo.planName;

        let packageExists = false;

        const levelsRef = admin.database().ref("levels");
        const levelToBeSearched = await levelsRef.orderByChild("name").startAt(levelName).limitToFirst(1).once("value");
        const levelJSON = levelToBeSearched.toJSON();
        const levelId = Object.keys(levelJSON)[0];

        const plansRef = admin.database().ref("plans");
        const planToBeSearched = await plansRef.orderByChild("name").startAt(planName).limitToFirst(1).once("value");
        const planJSON = planToBeSearched.toJSON();
        const planId = Object.keys(planJSON)[0];

        const packagesRef = admin.database().ref("packages");
        const packagesData = await packagesRef.orderByChild("name").startAt(packageName).once("value");
        try {
            packagesData.forEach(package => {
                const packageJson = package.toJSON();
                if (packageJson.name.includes(packageName)){
                    if (packageJson.basePlan.includes(planId) && packageJson.level.includes(levelId)) {
                        packageExists = true;
                        throw BreakException;
                    }
                } else {
                    throw BreakException;
                }
            });
        } catch (e) {
            if (e !== BreakException) throw e;
        }

        let responseStatus = 200;
        if (!packageExists) {
            responseStatus = 404;
        }

        res.status(responseStatus).json(
            {
                packageExists : packageExists
            }
        );
    });
});

const getSimpleInsuredInfo = async (insuredId, insuredsData, insuredJSON) => {
    const membershipsPerUserToObtain = insuredJSON.membershipsPerUser.split('/')[2];

    // Membresía por Usuario
    var membershipsPerUserRef = admin.database().ref("membershipsPerUser");
    let membershipsPerUser = await membershipsPerUserRef.once('value');
    membershipsPerUser = membershipsPerUser.child(membershipsPerUserToObtain);
    let membershipToObtain = membershipsPerUser.child('membership').val().split('/')[2];

    // Membresía
    var membershipsRef = admin.database().ref("memberships");
    let membership = await membershipsRef.once('value');
    membership = membership.child(membershipToObtain);
    let packageToObtain = membership.child('package').val().split('/')[2];

    // Paquete
    var packagesRef = admin.database().ref("packages");
    let clientPackage = await packagesRef.once('value');
    clientPackage = clientPackage.child(packageToObtain);
    let clientPackageJSON = clientPackage.toJSON();

    const membershipSplitted = membershipsPerUserToObtain.split('-');
    let isMain = true;
    if ((membershipSplitted.length > 2 && parseInt(membershipSplitted[2]) > 0) ||
    (membershipSplitted.length === 2 && parseInt(membershipSplitted[1]) > 0)) {
        isMain = false;
    }

    const searchedInsured = createSimpleInfoForInsured(insuredId, isMain, membershipsPerUserToObtain, insuredJSON, packageToObtain,
    clientPackageJSON);

    const membershipIdSplitted = membershipToObtain.split('-');
    searchedInsured.protected = await getProtectedForInsured(insuredId, insuredsData, membershipIdSplitted, false);
    return searchedInsured;
}

const getInsuredById = async (insuredId) => {
    var ref = admin.database().ref("insured");
    let snap = await ref.once('value');
    snap = snap.child(insuredId);
    let membershipsPerUserToObtain = snap.child('membershipsPerUser').val().split('/')[2];

    // Membresías por Usuario
    var membershipsPerUserRef = admin.database().ref("membershipsPerUser");
    let membershipsPerUser = await membershipsPerUserRef.once('value');
    membershipsPerUser = membershipsPerUser.child(membershipsPerUserToObtain);
    let membershipToObtain = membershipsPerUser.child('membership').val().split('/')[2];

    const membershipLevel = membershipsPerUser.child('level').val().split('/')[2];

    // Membresía
    var membershipsRef = admin.database().ref("memberships");
    let membership = await membershipsRef.once('value');
    membership = membership.child(membershipToObtain);
    let clientToObtain = membership.child('client').val().split('/')[2];
    let packageToObtain = membership.child('package').val().split('/')[2];

    // Cliente
    var clientsRef = admin.database().ref("clients");
    let client = await clientsRef.once('value');
    client = client.child(clientToObtain);

    // Paquete
    var packagesRef = admin.database().ref("packages");
    let clientPackage = await packagesRef.once('value');
    clientPackage = clientPackage.child(packageToObtain);
    let levelToObtain = clientPackage.child('level').val().split('/')[2];

    // Nivel
    var levelRef = admin.database().ref("levels");
    let level = await levelRef.once('value');
    level = level.child(levelToObtain);

    let packageJSON = clientPackage.toJSON();
    packageJSON.packageId = packageToObtain;
    packageJSON.level = level;
    delete packageJSON.client;

    let membershipJSON = membership.toJSON();
    membershipJSON.client = client;
    membershipJSON.membershipId = membershipsPerUserToObtain;
    membershipJSON.package = packageJSON;
    membershipJSON.membershipImage = getMembershipLevelImage(membershipLevel);

    delete membershipJSON.insured;
    delete membershipJSON.numberOfMemberships;

    const insuredJSON = snap.toJSON();
    insuredJSON.membershipsPerUser = [];
    insuredJSON.membershipsPerUser.push(membershipJSON);

    return insuredJSON;
}

const getProtectedForInsured = async (insuredId, insuredsData, membershipIdSplitted, fullInfo) => {
    let protectedIds = [];
    const protectedArray = [];
    const membershipIdToUse = membershipIdSplitted[0] + "-" + membershipIdSplitted[1];

    const membershipsPerUserRef = admin.database().ref("/membershipsPerUser");
    let membershipsPerUser = await membershipsPerUserRef.orderByKey().startAt(membershipIdToUse).once("value");
    let mainMembership = "";
    try {
        membershipsPerUser.forEach(member => {
            if (member.key.includes(membershipIdToUse)){
                const insuredIdFromMembership = member.child("insured").val().split("/")[2];
                protectedIds.push(insuredIdFromMembership);
                mainMembership = member.child("membership").val().split("/")[2];
            } else {
                throw BreakException;
            }
        });
    } catch (e) {
        if (e !== BreakException) throw e;
    }

    // Membresía por Usuario
    let membershipsPerUserProtected = await membershipsPerUserRef.once('value');

    // Paquete
    var packagesRef = admin.database().ref("packages");
    let clientPackage = await packagesRef.once('value');

    // Membresía
    var membershipsRef = admin.database().ref("memberships");
    let membership = await membershipsRef.once('value');

    protectedIds = protectedIds.filter(id => id !== insuredId);
    protectedIds.forEach(protectedId => {
        const protected = {};
        protected.id = protectedId;
        if (fullInfo) {
            protected.info = insuredsData.child(protectedId).toJSON();
            const protectedMembership = protected.info.membershipsPerUser.split('/')[2];
            const membershipForProtected = membershipsPerUserProtected.child(protectedMembership);
            protected.membershipFrom = membershipForProtected.child('fromDate').val();
        } else {
            protectedJSON = insuredsData.child(protectedId).toJSON();
            const membershipsPerUserToObtain = insuredJSON.membershipsPerUser !== undefined && insuredJSON.membershipsPerUser !== null
            ? insuredJSON.membershipsPerUser.split('/')[2] : "";

            membershipsPerUserProtected = membershipsPerUserProtected.child(membershipsPerUserToObtain);
            let membershipToObtain = membershipsPerUserProtected.child('membership').val().split('/')[2];

            membership = membership.child(membershipToObtain);
            let packageToObtain = membership.child('package').val().split('/')[2];

            clientPackage = clientPackage.child(packageToObtain);
            let clientPackageJSON = clientPackage.toJSON();

            protected.info = createSimpleInfoForInsured(protectedId, false, membershipsPerUserToObtain, protectedJSON, packageToObtain,
            clientPackageJSON);
        }
        protectedArray.push(protected);
    });

    return protectedArray;
}

function createSimpleInfoForInsured(insuredId, isMain, membershipsPerUserToObtain, insuredJSON, packageToObtain, clientPackageJSON) {
    const searchedInsured = {};
    searchedInsured.id = insuredId;
    searchedInsured.isMain = isMain;
    searchedInsured.membershipId = membershipsPerUserToObtain;
    searchedInsured.name = insuredJSON.name;
    searchedInsured.middleName = insuredJSON.middleName;
    searchedInsured.firstLastName = insuredJSON.firstLastName;
    searchedInsured.secondLastName = insuredJSON.secondLastName;
    searchedInsured.phone = insuredJSON.phone;
    searchedInsured.email = insuredJSON.email;
    searchedInsured.zipCode = insuredJSON.address.zipCode;
    searchedInsured.state = insuredJSON.address.state;
    searchedInsured.country = insuredJSON.address.country;
    searchedInsured.packageId = packageToObtain;
    searchedInsured.packageName = clientPackageJSON.name;
    return searchedInsured;
}

function createAuthUser(uid, email, phone, password, name, middleName, firstLastName, secondLastName) {
    const authUser = {};
    authUser.uid = uid;
    authUser.password = password;
    authUser.disabled = false;

    let insuredFullName = name + " ";
    if (middleName !== undefined && middleName !== null && middleName !== "") {
        insuredFullName += middleName + " ";
    }
    insuredFullName += firstLastName + " " + secondLastName;
    authUser.displayName = insuredFullName;

    if (email !== undefined && email !== null && email !== "") {
        authUser.email = email;
        authUser.emailVerified = true;
    }

    if (phone !== undefined && phone !== null && phone !== "") {
        if (!phone.includes("+52")) {
            phone = "+52" + phone;
        } else if (!phone.includes("+")) {
            phone = "+" + phone;
        }
        authUser.phoneNumber = phone;
    }
    return authUser;
}

function createMembershipforUser(membershipJSON, clientPackageJSON, totalMembers, newUserId, membershipId, isFirst, numberOfProtected){
    let insuredSubDivision = "00";
    if (!isFirst) {
        insuredSubDivision = numberOfProtected > 10 ? String(numberOfProtected) : "0" + numberOfProtected;
    }
    const membershipforUser = {};
    membershipforUser.fromDate = new Date(membershipJSON.fromDate).toISOString();
    membershipforUser.toDate = new Date(membershipJSON.toDate).toISOString();
    membershipforUser.status = "active";
    membershipforUser.plan = clientPackageJSON.basePlan;
    membershipforUser.level = clientPackageJSON.level;
    membershipforUser.membership = "/memberships/" + membershipId;
    membershipforUser.membershipNumber = totalMembers > 10 ? String(totalMembers) + insuredSubDivision :
    "0" + totalMembers + "-" + insuredSubDivision;
    membershipforUser.insured = "/insured/" + newUserId;
    return membershipforUser;
}

function assignInsuredAge(insuredBodyInfo){
    let insuredBirthdate = new Date(insuredBodyInfo.birthdate);
    const age = new Date().getFullYear() - insuredBirthdate.getFullYear();
    return age;
}

function assignUserNumber(usersCount, startingIdNumber) {
    timesIterated += 1;
    if(usersCount < 10) {
        startingIdNumber += usersCount;
    } else if (usersCount < 100) {
        startingIdNumber = startingIdNumber.slice(0, 2);
        startingIdNumber += usersCount;
    } else if (usersCount < 1000) {
        startingIdNumber = startingIdNumber.slice(0, 1);
        startingIdNumber += usersCount;
    } else if (usersCount < 9999) {
        startingIdNumber = String(usersCount);
    } else if (usersCount >= 9999) {
        usersCount = usersCount - 9999;
        startingIdNumber = assignUserNumber(usersCount, startingIdNumber);
    }

    return startingIdNumber;
}

function assignUserLetter(startingIdNumber, startingIdLetters) {
    if (startingIdNumber === '0001' && timesIterated > 0) {
        const lettersArray = startingIdLetters.split('');
        if (lettersArray[1] !== 'Z') {
            const newCharASCIIValue = transformCharToASCII(lettersArray[1]) + 1;
            lettersArray[1] = transformASCIIToChar(newCharASCIIValue);
        } else {
            const newCharASCIIValue = transformCharToASCII(lettersArray[0]) + 1;
            lettersArray[0] = transformASCIIToChar(newCharASCIIValue);
            lettersArray[1] = 'A';
        }
        startingIdLetters = lettersArray.join("");
    }
    return startingIdLetters;
}

function transformASCIIToChar(charCode) {
    return String.fromCharCode(charCode);
}

function transformCharToASCII(char) {
    return char.charCodeAt(0);
}

function checkIfUndefinedOrNullOrEmpty (parameter) {
    return parameter !== undefined && parameter !== null && parameter !== "";
}

function getMembershipLevelImage(membershipLevel) {
    let membershipImage = "";
    switch(membershipLevel) {
        case 'level1': {
            membershipImage = "https://firebasestorage.googleapis.com/v0/b/piix-a89e2.appspot.com/o/memberships%2Fblue-membership.png?alt=media&token=7948bcf9-ebe5-4ba1-b388-0aa3e14ad8e6";
            break;
        }
        case 'level2': {
            membershipImage = "https://firebasestorage.googleapis.com/v0/b/piix-a89e2.appspot.com/o/memberships%2Fblack-membership.png?alt=media&token=290dfadf-a419-4183-b25d-8fe4288d2468";
            break;
        }
        case 'level3': {
            membershipImage = "https://firebasestorage.googleapis.com/v0/b/piix-a89e2.appspot.com/o/memberships%2Fsilver-membership.png?alt=media&token=59a12169-3521-48af-bc52-5be9bd97729c";
            break;
        }
        case 'level4': {
            membershipImage = "https://firebasestorage.googleapis.com/v0/b/piix-a89e2.appspot.com/o/memberships%2Fgold-membership.png?alt=media&token=0dbd9a4d-2b7e-4ffd-b378-52b62800e2db";
            break;
        }
        case 'level5': {
            membershipImage = "https://firebasestorage.googleapis.com/v0/b/piix-a89e2.appspot.com/o/memberships%2Felite-membership.png?alt=media&token=d0ca0861-7a31-4b9d-84ba-d2ed0ccc3ca2";
            break;
        }
    }
    return membershipImage;
}