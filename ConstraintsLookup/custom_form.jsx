import { useState } from "react";
import update from 'react-addons-update';


export const useCustomForm = ({ initialValues }) => {
    const [values, setValues] = useState(initialValues || {});

    function handleFieldChange() {
        const func = (event) => {
            setValues(update(values, { [event.target.name]: { $set: event.target.value } }));
        }
        return func;
    };

    function handleRepeatedFieldChange(index) {
        const func = (event) => {
            setValues(update(values, { [event.target.name]: { [index]: { $set: event.target.value } } }));
        }
        return func;
    };

    function initValueList(field_name) {
        return function (values_list) {
            setValues(update(values, { [field_name]: { $set: values_list } }));
        };
    };

    function addRepeatedField(field_name) {
        return function (event) {
            setValues(update(values, { [field_name]: { $push: [""] } }));
        };
    };

    function addRepeatedFieldValue(field_name, value) {
        return function (event) {
            setValues(update(values, { [field_name]: { $push: [value] } }));
        };
    };

    function handleRepeatedFieldDelete(field_name, index) {
        const func = (event) => {
            setValues(update(values, { [field_name]: { $splice: [[[index], 1]] } }));
        }
        return func;
    };


    return {
        values,
        handleFieldChange,
        handleRepeatedFieldChange,
        initValueList,
        addRepeatedField,
        addRepeatedFieldValue,
        handleRepeatedFieldDelete
    };
};