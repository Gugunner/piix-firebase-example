const { getCountryByIdInternal } = require('./../country-functions');
const { getStateByIdInternal } = require('./../states-functions');

exports.validateLegalUser = async (userBody) => {
    let errorObj = { hasError: false, errorMessages: [] };

    errorObj = await validateBasicPersonalUserInfoInt(userBody, false);

    if(!userBody.einRFC || userBody.einRFC === '' || userBody.einRFC.length > 15) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid einRFC that has less than or equal to 15 characters.'];
    }
    if(userBody.efin && (userBody.efin === '' || userBody.efin.length > 15)) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid efin that has less than or equal to 15 characters.'];
    }
    if(userBody.ppr && (userBody.ppr === '' || userBody.ppr.length > 15)) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid ppr that has less than or equal to 15 characters.'];
    }
    if(userBody.additionalDocument1 && userBody.additionalDocument1 === '') {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid additionalDocument1.'];
    }
    if(userBody.additionalDocument2 && userBody.additionalDocument2 === '') {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid additionalDocument2.'];
    }
    if(userBody.mainContactName && (userBody.mainContactName === '' || userBody.mainContactName.length > 40)) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid mainContactName that has less than or equal to 40 characters.'];
    }
    if(userBody.mainContactLastName && (userBody.mainContactLastName === '' || userBody.mainContactLastName.length > 40)) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid mainContactLastName that has less than or equal to 40 characters.'];
    }
    if(userBody.mainContactPosition && (userBody.mainContactPosition === '' || userBody.mainContactPosition.length > 40)) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid mainContactPosition that has less than or equal to 40 characters.'];
    }
    if(userBody.mainContactInternationalLada && (userBody.mainContactInternationalLada === '' ||
    userBody.mainContactInternationalLada.length > 4)) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid mainContactLastName that has less than or equal to 4 characters.'];
    }
    if(userBody.mainContactPhone && (userBody.mainContactPhone === '' || userBody.mainContactPhone.length > 10)) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid mainContactPhone that has less than or equal to 10 characters.'];
    }
    if(userBody.mainContactEmail && (userBody.mainContactEmail === '' || userBody.mainContactEmail.length > 50)) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid mainContactEmail that has less than or equal to 50 characters.'];
    }
    if(userBody.mainContactName2 && (userBody.mainContactName2 === '' || userBody.mainContactName2.length > 40)) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid mainContactName2 that has less than or equal to 40 characters.'];
    }
    if(userBody.mainContactLastName2 && (userBody.mainContactLastName2 === '' || userBody.mainContactLastName2.length > 40)) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid mainContactLastName2 that has less than or equal to 40 characters.'];
    }
    if(userBody.mainContactPosition2 && (userBody.mainContactPosition2 === '' || userBody.mainContactPosition2.length > 40)) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid mainContactPosition2 that has less than or equal to 40 characters.'];
    }
    if(userBody.mainContactInternationalLada2 && (userBody.mainContactInternationalLada2 === '' ||
    userBody.mainContactInternationalLada2.length > 4)) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid mainContactInternationalLada2 that has less than or equal to 4 characters.'];
    }
    if(userBody.mainContactPhone2 && (userBody.mainContactPhone2 === '' || userBody.mainContactPhone2.length > 10)) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid mainContactPhone2 that has less than or equal to 10 characters.'];
    }
    if(userBody.mainContactEmail2 && (userBody.mainContactEmail2 === '' || userBody.mainContactEmail2.length > 50)) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid mainContactEmail2 that has less than or equal to 50 characters.'];
    }
    if(userBody.einRFCDoc && userBody.einRFCDoc === '') {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid einRFCDoc'];
    }
    if(userBody.efinDoc && userBody.efinDoc === '') {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid efinDoc.'];
    }
    if(userBody.pprDoc && userBody.pprDoc === '') {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid pprDoc.'];
    }
    if(userBody.addressDoc && userBody.addressDoc === '') {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid addressDoc.'];
    }
    if(userBody.additionalDocument1Doc && userBody.additionalDocument1Doc === '') {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid additionalDocument1Doc.'];
    }
    if(userBody.additionalDocument2Doc && userBody.additionalDocument2Doc === '') {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid additionalDocument2Doc.'];
    }

    return errorObj;
}

exports.validateBasicPersonalUserInfo = async (userBody, isPerson) => {
    let errorObj = { hasError: false, errorMessages: [] };
    errorObj = await validateBasicPersonalUserInfoInt(userBody, isPerson);
    return errorObj;
}

async function validateBasicPersonalUserInfoInt (userBody, isPerson) {
    let errorObj = { hasError: false, errorMessages: [] };

    if (isPerson) {
        errorObj = validateNaturalUserInfo(userBody);
    } else {
        errorObj = validateLegalUserInfo(userBody);
    }

    if(!userBody.internationalLada || userBody.internationalLada === '' || userBody.internationalLada.length > 4) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid internationalLada that has less than or equal to 4 characters.'];
    }
    if(!userBody.phone || userBody.phone === '' || userBody.phone.length > 10) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid phone that has less than or equal to 10 characters.'];
    }
    if(userBody.socialMediaId && (userBody.socialMediaId === '' || userBody.socialMediaId.length > 40)) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid socialMediaId that has less than or equal to 40 characters.'];
    }
    if(userBody.webAddress && (userBody.webAddress === '' || userBody.webAddress.length > 70)) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid webAddress that has less than or equal to 70 characters.'];
    }
    if(!userBody.address.street || userBody.address.street === '' || userBody.address.street.length > 40) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid street for the address that has less than or equal to 40 characters.'];
    }
    if(!userBody.address.externalNumber || Number.isNaN(Number(userBody.address.externalNumber)) || userBody.address.externalNumber > 9999) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid externalNumber for the address.'];
    }
    if(userBody.address.interiorNumber && (userBody.address.interiorNumber === '' || userBody.address.interiorNumber.length > 30)) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid interiorNumber for the address that has less than or equal to 30 characters.'];
    }
    if(userBody.address.subThoroughFare && (userBody.address.subThoroughFare === '' || userBody.address.subThoroughFare.length > 40)) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid subThoroughFare for the address that has less than or equal to 40 characters.'];
    }
    if(userBody.address.thoroughFare && (userBody.address.thoroughFare === '' || userBody.address.thoroughFare.length > 40)) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid thoroughFare for the address that has less than or equal to 40 characters.'];
    }
    const countrySearched = await getCountryByIdInternal(userBody.address.countryId);
    if(!userBody.address.countryId || !countrySearched || countrySearched.deleteDate) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid countryId for the address.'];
    }
    const stateSearched = await getStateByIdInternal(userBody.address.stateId);
    if(!userBody.address.stateId || !stateSearched || stateSearched.deleteDate || stateSearched.countryId !== userBody.address.countryId) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid stateId for the address.'];
    }
    if(!userBody.address.city || userBody.address.city === '') {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid city for the address.'];
    }
    if(!userBody.address.zipCode || userBody.address.zipCode === '' || userBody.address.zipCode.length > 8) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid zipCode for the address that has less than or equal to 8 characters.'];
    }

    return errorObj;
}

function validateNaturalUserInfo (userBody) {
    let errorObj = { hasError: false, errorMessages: [] };

    const birthdate = new Date(userBody.birthdate);
    if(!userBody.prefix || userBody.prefix === '' || userBody.prefix.length > 10) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid prefix that has less than or equal to 10 characters.'];
    }
    if(!userBody.name || userBody.name === '' || userBody.name.length > 30) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid name that has less than or equal to 30 characters.'];
    }
    if(userBody.middleName && (userBody.middleName === '' || userBody.middleName.length > 30)) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid middleName that has less than or equal to 30 characters.'];
    }
    if(!userBody.firstLastName || userBody.firstLastName === '' || userBody.firstLastName.length > 30) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid firstLastName that has less than or equal to 30 characters.'];
    }
    if(userBody.secondLastName && (userBody.secondLastName === '' || userBody.secondLastName.length > 30)) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid secondLastName that has less than or equal to 30 characters.'];
    }
    if(!userBody.birthdate || userBody.birthdate === '' || isNaN(birthdate)) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid birthdate.'];
    }

    return errorObj;
}

function validateLegalUserInfo (userBody) {
    let errorObj = { hasError: false, errorMessages: [] };

    if(!userBody.shortName || userBody.shortName === '' || userBody.shortName.length > 30) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid shortName that has less than or equal to 30 characters.'];
    }
    if(!userBody.name || userBody.name === '' || userBody.name.length > 60) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid name that has less than or equal to 60 characters.'];
    }
    if(userBody.logo && userBody.logo === '') {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid logo for the company.'];
    }
    if(userBody.slogan && (userBody.slogan === '' || userBody.slogan.length > 60)) {
        errorObj.hasError = true;
        errorObj.errorMessages = [...errorObj.errorMessages, 'Please add a valid slogan that has less than or equal to 60 characters.'];
    }

    return errorObj;
}