import { useState, useEffect, useRef } from "react";
import update from 'react-addons-update';

function getErrorsFromInitialValue(values, validators) {
    var errors = {};
    var is_valid = {};
    var fields = Object.getOwnPropertyNames(values);
    for (var index = 0; index < fields.length; index++) {
        var key = fields[index];
        if (typeof values[fields[index]] == "object") {
            errors[key] = [];
            is_valid[key] = [];
            var arrayLength = values[key].length;
            for (var i = 0; i < arrayLength; i++) {
                var [message, status] = validators[key](values[key][i], values[key], i);
                errors[key].push(message);
                is_valid[key].push(status);
            }
        }
        else {
            var [message, status] = validators[key](values[key]);
            errors[key] = message;
            is_valid[key] = status;

        }
    }
    return [errors, is_valid];
}

function validateForm(status_values) {
    var status = true;
    var fields = Object.getOwnPropertyNames(status_values);
    for (var index = 0; index < fields.length; index++) {
        var key = fields[index];
        if (typeof status_values[fields[index]] == "object") {
            var arrayLength = status_values[key].length;
            for (var i = 0; i < arrayLength; i++) {
                status = status && status_values[key][i];
            }
        }
        else {
            status = status && status_values[key];
        }
    }
    return status;
}

const useCustomForm = ({
    initialValues, validators,
    onSubmit
}) => {
    const [values, setValues] = useState(initialValues || {});

    var [initial_errors, initial_valid] = getErrorsFromInitialValue(initialValues, validators);
    const [errors, setErrors] = useState(initial_errors || {});
    const [isValid, setIsValid] = useState(initial_valid || {});

    const [isFormValid, setIsFormValid] = useState(validateForm(initial_valid));

    const [touched, setTouched] = useState({});
    const [onSubmitting, setOnSubmitting] = useState(false);
    const [onBlur, setOnBlur] = useState(false);

    const formRendered = useRef(true);

    useEffect(() => {
        if (!formRendered.current) {
            setValues(initialValues);

            var [initial_errors, initial_valid] = getErrorsFromInitialValue(initialValues, validators);
            setErrors(initial_errors);
            setIsValid(initial_valid);

            setTouched({});
            setOnSubmitting(false);
            setOnBlur(false);
        }
        formRendered.current = false;
    }, [initialValues]);


    useEffect(() => {
        setIsFormValid(validateForm(isValid));
    }, [isValid]);


    const handleChange = (event) => {
        const { target } = event;
        const { name, value } = target;
        if (event.target.type == "checkbox") {
            setValues({ ...values, [name]: event.target.checked });
        }
        else {
            setValues({ ...values, [name]: value });
            var [message, status] = validators[name](value);
            setErrors({ ...errors, [name]: message });
            setIsValid({ ...isValid, [name]: status });
        }
        event.persist();
    };

    const handleBlur = (event) => {
        const { target } = event;
        const { name } = target;
        setTouched({ ...touched, [name]: true });
        setErrors({ ...errors });
    };

    const handleSubmit = (event) => {
        if (event) event.preventDefault();
        setErrors({ ...errors });
        onSubmit({ values, errors });
    };

    const init = (updatedValues) => {
        setValues(updatedValues);
        var [initial_errors, initial_valid] = getErrorsFromInitialValue(updatedValues, validators);
        setErrors(initial_errors);
        setIsValid(initial_valid);
    };

    const handleUpdateImages = function (field_name) {
        return (images) => {
            if (images.length == 0) {
                setValues({ ...values, [field_name]: "" });
            }
            else {
                setValues({ ...values, [field_name]: images[0] });
            }
        }
    };

    const handleRepeatedFieldChange = function (index) {
        const func = (event) => {
            setValues(update(values, { [event.target.name]: { [index]: { $set: event.target.value } } }));
            var [message, status] = validators[event.target.name](event.target.value, values[event.target.name], index);
            setErrors(update(errors, { [event.target.name]: { [index]: { $set: message } } }));
            setIsValid(update(isValid, { [event.target.name]: { [index]: { $set: status } } }));
        }
        return func;
    };

    const addRepeatedField = function (field_name) {
        return function (event) {
            setValues(update(values, { [field_name]: { $push: [""] } }));
            var [message, status] = validators[field_name]("");
            setErrors(update(errors, { [field_name]: { $push: [message] } }));
            setIsValid(update(isValid, { [field_name]: { $push: [status] } }));
        };
    };

    const handleRepeatedFieldDelete = function (field_name, index) {
        const func = (event) => {
            setValues(update(values, { [field_name]: { $splice: [[[index], 1]] } }));
            setErrors(update(errors, { [field_name]: { $splice: [[[index], 1]] } }));
            setIsValid(update(isValid, { [field_name]: { $splice: [[[index], 1]] } }));
        }
        return func;
    };

    return {
        values,
        errors,
        touched,
        isFormValid,
        handleChange,
        handleBlur,
        handleSubmit, init, handleUpdateImages, handleRepeatedFieldChange, addRepeatedField, handleRepeatedFieldDelete
    };
};

export default useCustomForm;
