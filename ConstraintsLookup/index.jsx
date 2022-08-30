import * as React from 'react';
import { useRef, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from "react";
import update from 'react-addons-update';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import PublishIcon from '@mui/icons-material/Publish';
import Select, { components } from "react-select";
import ProductList from '../ProductList';
import { loadQuizUserConstraints } from '../Store/constraints_lookup';
import { connect } from "react-redux";
import { useCustomForm } from './custom_form.jsx';

function SelectMultiple(props) {
    const selectStyles = {
        menu: base => ({
            ...base,
            zIndex: 100
        })
    };

    const [attribute_options, setAttributeOptions] = useState([]);
    const [cluster_options, setClusterOptions] = useState([]);


    function EmitLabelAndValues(value) {
        return { "value": value, "label": value };

    }
    function fetchOptionsWithName(schema, name) {
        if (schema == undefined) {
            return [];
        }
        var values = schema[name];
        return values.map(EmitLabelAndValues);
    }

    React.useEffect(() => {
        if (props.broad_category && props.broad_category.value != undefined && props.key_name && props.key_name.value != undefined) {
            var attr_values = props.schema['values'][props.broad_category.value][props.key_name.value]['values'];
            var cluster_values = props.schema['values'][props.broad_category.value][props.key_name.value]['clusters'];
            setAttributeOptions(attr_values.map(EmitLabelAndValues));
            setClusterOptions(cluster_values.map(EmitLabelAndValues));
            props.setClusterValues([]);
            props.setAttributeValues([]);
        }
    }, [props.broad_category, props.key_name])


    return (
        <Grid
            container
            direction="row"
            alignItems="flex-start"
            spacing={2}
        >
            <Grid item xs={12} sm={12} md={6}>
                <span style={{ fontSize: 16 }}> broad_category </span>
                <Select
                    styles={selectStyles}
                    isMulti={false}
                    name={"broad_category"}
                    value={props.broad_category}
                    options={fetchOptionsWithName(props.schema, "broad_categories")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={(item, action) => props.setBroadCategory(item)}
                    closeMenuOnSelect={true}
                    autoBlur={true}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
                <span style={{ fontSize: 16 }}> Key name </span>
                <Select
                    styles={selectStyles}
                    isMulti={false}
                    name={"key_name"}
                    value={props.key_name}
                    options={fetchOptionsWithName(props.schema, "key_names")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={(item, action) => props.setKeyName(item)}
                    closeMenuOnSelect={true}
                    autoBlur={true}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
                <span style={{ fontSize: 16 }}> Attribute Values </span>
                <Select
                    styles={selectStyles}
                    isMulti={true}
                    name={"attribute"}
                    value={props.attribute_values}
                    options={attribute_options}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={(item, action) => props.setAttributeValues(item)}
                    closeMenuOnSelect={true}
                    autoBlur={true}
                />

            </Grid>
            <Grid item xs={12} sm={12} md={6}>
                <span style={{ fontSize: 16 }}> Cluster Values </span>
                <Select
                    styles={selectStyles}
                    isMulti={true}
                    name={"clusters"}
                    value={props.cluster_values}
                    options={cluster_options}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={(item, action) => props.setClusterValues(item)}
                    closeMenuOnSelect={true}
                    autoBlur={true}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
                <span style={{ fontSize: 16 }}> Include </span>
                <input type="checkbox" defaultChecked={props.include} onChange={() => props.setInclude(!props.include)} />
            </Grid>
        </Grid>
    );
}

function ConstraintSelection(props) {
    const [broad_category, setBroadCategory] = useState(null);
    const [key_name, setKeyName] = useState(null);
    const [cluster_values, setClusterValues] = useState([]);
    const [attribute_values, setAttributeValues] = useState([]);
    const [include, setInclude] = useState(false);

    function addConstraint() {
        if (!broad_category || !key_name || broad_category.value == undefined || key_name.value == undefined) {
            console.log("Broad category and key name should be set.");
            return;
        }
        else {
            if (cluster_values.length == 0 && attribute_values.length == 0) {
                console.log("Atleast one of attribute or cluster values should be set.");
                return;
            }
            else {
                var atoms_array = [];
                var prefix = "NIN";
                if (include) {
                    prefix = "IN";
                }
                for (var index = 0; index < attribute_values.length; index++) {
                    atoms_array.push("A=" + attribute_values[index].value);
                }
                for (var index = 0; index < cluster_values.length; index++) {
                    atoms_array.push("C=" + cluster_values[index].value);
                }
                var joined_atoms = atoms_array.join();
                var constraint = `(${broad_category.value}|${key_name.value}:${prefix}[${joined_atoms}])`
                props.addRepeatedFieldValue("option_constraints", constraint)();
                setBroadCategory(null);
                setKeyName(null);
                setClusterValues([]);
                setAttributeValues([]);
            }
        }
    }
    return (
        <div>
            <SelectMultiple schema={props.schema}
                broad_category={broad_category}
                setBroadCategory={setBroadCategory}
                key_name={key_name}
                setKeyName={setKeyName}
                cluster_values={cluster_values}
                setClusterValues={setClusterValues}
                attribute_values={attribute_values}
                setAttributeValues={setAttributeValues}
                include={include}
                setInclude={setInclude}
            ></SelectMultiple>
            <Button
                variant="contained"
                onClick={addConstraint}
                startIcon={<PublishIcon />}
            >
                Add constraint
            </Button>
            {props.values && props.values.option_constraints && props.values.option_constraints.map((constraint, index) => (
                <Grid item xs={12} sm={12} key={"constraint_" + index}>
                    <Grid container spacing={2}>
                        <Grid item xs={10} sm={10}>
                            <p>
                                Constraint name: {constraint}
                            </p>
                        </Grid>
                        <Grid item xs={2} sm={2}>
                            <DeleteIcon style={{ fill: "red" }} fontSize="large" onClick={props.handleRepeatedFieldDelete("option_constraints", index)}></DeleteIcon>
                        </Grid>
                    </Grid>
                </Grid>
            ))}
            <Grid item xs={12} sm={12}>
                <Button
                    variant="contained"
                    onClick={() => {
                        if (props.values.option_constraints.length > 0) {
                            props.FetchProductsForConstraints(props.values.option_constraints);
                        }
                    }}
                    startIcon={<PublishIcon />}
                >
                    Fetch products
                </Button>
            </Grid>
        </div>
    );

}

function AddConstraintsText(props) {
    function handleSubmit() {
        var filtered_constraints = [];
        for (var index = 0; index < props.values.constraints.length; index++) {
            if (props.values.constraints[index] != '') {
                filtered_constraints.push(props.values.constraints[index]);
            }
        }
        if (filtered_constraints.length > 0) {
            props.FetchProductsForConstraints(filtered_constraints);
        }
    }

    function isFormValid() {
        return true;
    }

    return (
        <Container maxWidth="md">
            <Grid container spacing={2}>
                {/* <Grid item xs={12} sm={12} key={"user_box"}>
                    <UserQuizConstraints
                        loadQuizUserConstraints={props.loadQuizUserConstraints}
                        constraints={props.constraints}
                    >
                    </UserQuizConstraints>
                </Grid> */}
                {props.values && props.values.constraints && props.values.constraints.map((constraint, index) => (
                    <Grid item xs={12} sm={12} key={"constraint_" + index}>
                        <Grid container spacing={2}>
                            <Grid item xs={10} sm={10}>
                                <TextField
                                    required
                                    name="constraints"
                                    label="Constraint name"
                                    value={constraint}
                                    onChange={props.handleRepeatedFieldChange(index)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={2} sm={2}>
                                <DeleteIcon style={{ fill: "red" }} fontSize="large" onClick={props.handleRepeatedFieldDelete("constraints", index)}></DeleteIcon>
                            </Grid>
                        </Grid>
                    </Grid>
                ))}
                <Grid item xs={12} sm={12}>
                    <Button
                        variant="contained"
                        onClick={props.addRepeatedField("constraints")}
                        startIcon={<PublishIcon />}
                    >
                        Add constraint
                    </Button>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveAltIcon />}
                        disabled={!isFormValid}
                        onClick={handleSubmit}
                    >
                        Fetch Products
                    </Button>
                </Grid>
            </Grid>
        </Container >
    )
}

const sample_schema = {
    'broad_categories': ['DRESS', 'TOPS'],
    'key_names': ['color', 'details'],
    'values': {
        'DRESS': {
            'color': {
                'values': ['red', 'green'],
                'clusters': ['vibrant', 'neutral']
            },
            'details': {
                'values': ['o-ring', 'backless'],
                'clusters': ['exposing'],
            }
        },
        'TOPS': {
            'color': {
                'values': ['yellow', 'blue'],
                'clusters': ['vibrant1', 'neutral1']
            },
            'details': {
                'values': ['o-ring1', 'backless1'],
                'clusters': ['exposing1'],
            }
        }
    }
};

function UserQuizConstraints(props) {
    const [quizId, setQuizId] = useState('');
    const [userId, setUserId] = useState('');
    return (
        <Grid item xs={12} sm={12}>
            <Grid container spacing={2}>
                <Grid item xs={5} sm={5}>
                    <TextField
                        required
                        name="Quiz Id"
                        label="quiz_id"
                        value={quizId}
                        onChange={(event) => { setQuizId(event.target.value) }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={5} sm={5}>
                    <TextField
                        required
                        name="User Id"
                        label="user_id"
                        value={userId}
                        onChange={(event) => { setUserId(event.target.value) }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={2} sm={1}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            props.loadQuizUserConstraints(quizId, userId);
                        }}
                        endIcon={<PublishIcon />}
                    >
                        Fetch
                    </Button>
                </Grid>
            </Grid>
        </Grid >
    );
}

export function ConstraintBox(props) {
    const initialValues = {
        "constraints": [],
        "option_constraints": [],
    }

    const {
        values,
        handleFieldChange,
        handleRepeatedFieldChange,
        initValueList,
        addRepeatedField,
        addRepeatedFieldValue,
        handleRepeatedFieldDelete
    } = useCustomForm({ initialValues });

    const [schema, setSchema] = useState(null);

    useEffect(() => {
        setSchema(props.schema);
    }, [props.schema]);

    useEffect(() => {
        var text_constraints_list = [];
        // We return multiple possible responses for the user. Lets pick the most recent one, i.e first.
        if (props.constraints.length > 0) {
            for (var index = 0; index < props.constraints[0].answers.debug.length; index++) {
                text_constraints_list.push(props.constraints[0].answers.debug[index])
            }
        }
        if (text_constraints_list.length > 0) {
            initValueList('constraints')(text_constraints_list);
        }

    }, [props.constraints]);

    return (
        <div>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Constraint Text</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <AddConstraintsText
                        values={values}
                        handleRepeatedFieldChange={handleRepeatedFieldChange}
                        addRepeatedField={addRepeatedField}
                        handleRepeatedFieldDelete={handleRepeatedFieldDelete}
                        FetchProductsForConstraints={props.FetchProductsForConstraints}
                        loadQuizUserConstraints={props.loadQuizUserConstraints}
                    />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Typography>Constraint Filters</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ConstraintSelection
                        schema={schema}
                        values={values}
                        addRepeatedFieldValue={addRepeatedFieldValue}
                        handleRepeatedFieldDelete={handleRepeatedFieldDelete}
                        FetchProductsForConstraints={props.FetchProductsForConstraints}
                    />
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

const products_list =
    [{
        'id': '38c94ec4-5a22-42e6-8f5d-4938bc81f648',
        'images': ['https://images.unsplash.com/photo-1645915032069-6532e7a885c1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80'],
        'attributes': { 'color': 'red', 'neckline': 'v-neck', 'details': 'tie-front' },
        'broad_category_name': 'DRESS',
        'shallow_category_name': 'Womens Dresses',
        'source': 'myntra',
        'product_url': 'https://us.shein.com/Ripped-Detail-Straight-Leg-Jeans-p-6279482-cat-1934.html?scici=WomenHomePage~~ON_Banner,CN_CLEARANCE,HZ_sale1,HI_hotZonewqr9c9b20mb~~9_2~~itemPicking_00564605~~~~',
        'product_title': 'yellow square neck o ring',
        'price': 120
    },
    {
        'id': '38c94ec4-5a22-42e6-8f5d-4938bc81f649',
        'images': [],
        'attributes': { 'color': 'yellow', 'neckline': 'square neck', 'details': 'o-ring' },
        'broad_category_name': 'TOP',
        'shallow_category_name': 'Womens Tops',
        'source': 'myntra',
        'product_url': 'https://us.shein.com/Ripped-Detail-Straight-Leg-Jeans-p-6279482-cat-1934.html?scici=WomenHomePage~~ON_Banner,CN_CLEARANCE,HZ_sale1,HI_hotZonewqr9c9b20mb~~9_2~~itemPicking_00564605~~~~',
        'product_title': 'v-neck_red_tie-front',
        'price': 240
    }
    ];

function ConstraintsLookup(props) {
    function FetchProductsForConstraints(constraints) {
        console.log("Fetch the products for constraints:", constraints);
    }
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        setProductList(products_list);
    }, []);

    return (
        <Container maxWidth="md" >
            <Grid container spacing={2} >
                <Grid item xs={12} sm={12} md={12}>
                    <ConstraintBox
                        FetchProductsForConstraints={FetchProductsForConstraints}
                        loadQuizUserConstraints={props.loadQuizUserConstraints}
                        constraints={props.constraints}
                        schema={sample_schema}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                    <ProductList productList={productList} />
                </Grid>
            </Grid>
        </Container>
    )
}

const mapStateToProps = (state) => ({
    quiz_id: state.constraints_lookup.quiz_id,
    user_id: state.constraints_lookup.user_id,
    constraints: state.constraints_lookup.constraints
});

const mapDispatchToProps = (dispatch) => ({
    loadQuizUserConstraints: (quizId, userId) => dispatch(loadQuizUserConstraints(quizId, userId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConstraintsLookup);