export const nonEmptyStr = function (value) {
    if (!value) {
        return ["Cannot be empty", false];
    }

    if (typeof value !== "undefined") {
        if (!value.match(/^[a-zA-Z0-9 _]+$/)) {
            return ["Only letters, numbers, space and underscore supported", false];
        }
    }
    return ["", true];
}

export const nonEmpty = function (value) {
    if (!value) {
        return ["Cannot be empty", false];
    }

    return ["", true];
}


export const nonEmptyStrNoSpace = function (value) {
    if (!value) {
        return ["Cannot be empty", false];
    }

    if (typeof value !== "undefined") {
        if (!value.match(/^[A-Za-z0-9_]+$/)) {
            return ["Only letters, numbers and underscore supported", false];
        }
    }
    return ["", true];
}

export const nonNonEmptyUniqueStrList = function (value, values, index) {
    var [message, status] = nonEmptyStr(value);
    if (!status) {
        return [message, status];
    }
    var arrLen = values.length;
    for (var i = 0; i < arrLen; i++) {
        if (i != index && value == values[i]) {
            return ["Value should be unique.", false];
        }
    }
    return ["", true];
}

export const nonNonEmptyUniqueStrListWithKey = function (value, values, index, key) {
    var [message, status] = nonEmptyStr(value);
    if (!status) {
        return [message, status];
    }
    var arrLen = values.length;
    for (var i = 0; i < arrLen; i++) {
        if (i > index) {
            break;
        }
        if (i != index && value == values[i][key]) {
            return ["Value should be unique.", false];
        }
    }
    return ["", true];
}

export const nonNonEmptyStrListWithKey = function (value, values, index, key) {
    return nonEmptyStr(value);
}

export const IntListWithKey = function (value, values, index, key) {
    return intGreaterThanZero(value);
}

export const defaultValidateListWithKey = function (value, values, index, key) {
    return ["", true];
}

export const emptyOrValidEmail = function (value) {
    if (!value) {
        return ["", true];
    }

    if (value && typeof value !== "undefined") {
        let lastAtPos = value.lastIndexOf('@');
        let lastDotPos = value.lastIndexOf('.');

        if (!(lastAtPos < lastDotPos && lastAtPos > 0 && value.indexOf('@@') == -1 && lastDotPos > 2 && (value.length - lastDotPos) > 2)) {
            return ["Invalid email.", false];
        }
    }
    return ["", true];
}

function isNumeric(value) {
    return /^\d+$/.test(value);
}

export const intGreaterThanZero = function (value) {
    if (isNumeric(value)) {
        return ["", true];
    } else {
        return ["Should be a number > 0", false];
    }
}

export const defaultValidate = function (value) {
    return ["", true];
}

export const isValidPhoneNumber = function (phone) {
    var phoneRe = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    var digits = phone.replace(/\D/g, "");
    if (phoneRe.test(digits)) {
        return ["", true];
    }
    else {
        return ["Should be valid phone number", false];
    }
}

export const emptyOrValidPhoneNumber = function (phone) {
    if (phone == "") {
        return ["", true];
    }
    var phoneRe = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    var digits = phone.replace(/\D/g, "");
    if (phoneRe.test(digits)) {
        return ["", true];
    }
    else {
        return ["Should be valid phone number", false];
    }
}


export const isValidPassword = function (password) {
    var passwordRe = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    if (passwordRe.test(password)) {
        return ["", true];
    }
    else {
        return ["Min length 8 with atleast one digit, one lower case and one upper case letter.", false];
    }
}
