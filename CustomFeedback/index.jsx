import React, { useState } from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { connect } from "react-redux";
import Select, { components } from "react-select";
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import { postTagsFeedback } from "../../../../Store/feature_lookup";


function SelectMultiple(props) {
    function onChange(selectedOptions, action) {
        console.log(selectedOptions);
        props.setTagsList(selectedOptions);
    }

    const selectStyles = {
        menu: base => ({
            ...base,
            zIndex: 100,
            backgroundColor: "black",
            color: "red"
        })
    };

    return (
        <div>
            <Select
                styles={selectStyles}
                isMulti={props.isMulti}
                name={props.keyname}
                value={props.tagsList}
                options={props.options}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(item, action) => onChange(item, action)}
                closeMenuOnSelect={true}
                autoBlur={true}
            />
        </div>
    );
}

function SelectRadio(props) {
    return (
        <div>
            <FormLabel id="demo-row-radio-buttons-group-label">{props.tagname}</FormLabel>
            <RadioGroup
                row
                name="controlled-radio-buttons-group"
                value={props.value}
                onChange={props.handleChange}
                style={{ backgroundColor: "grey", marginTop: "10px" }}
            >
                {props.values.map((value) => (
                    <FormControlLabel value={value} control={<Radio />} label={value} key={value} />
                ))}
            </RadioGroup>
        </div>
    );
}


function CustomFeedback(props) {
    // Possible Tag values.
    const tagValues = ["trend", "bodytype", "styling", "personality / aesthetic", "product_market", "occasion", "matching", "small_business", "brand", "influencer/celeb", "color_combo"];
    const [tagsList, setTagsList] = useState([]);

    // Tag text.
    const [tagsText, setTagsText] = useState('');

    // CTA Text.
    const [ctaText, setCtaText] = useState('');

    const ctaUsefulValues = ["useful", "not_useful"];
    const [ctaUseful, setCtaUseful] = React.useState('not_useful');
    const handleCTAUsefulChange = (event) => {
        setCtaUseful(event.target.value);
    };

    const [scriptIdea, setScriptIdea] = useState('');

    const dataSourceList = ["brand_insta", "brand_website", "pinterest", "blogs", "google"];
    const [dataSources, setDataSources] = useState([]);

    function postFeedback() {
        let tagsFeedback = {
            'tags': tagsList,
            'extraTags': tagsText,
            'ctaUseful': ctaUseful,
            'scriptIdea': scriptIdea,
            'dataSources': dataSources,
            'cta': ctaText
        }
        props.postTagsFeedback(props.current_index, tagsFeedback);
    }

    return (
        <>
            <Container
                maxWidth="xs"
                style={{
                    width: "100%",
                    padding: 0,
                }}
            >
                <p style={{ color: "white" }}>
                    Tags
                </p>
                <SelectMultiple
                    options={tagValues.map((x) => { return { value: x, label: x } })}
                    isMulti={true}
                    keyname={"tag"}
                    tagsList={tagsList}
                    setTagsList={setTagsList}
                ></SelectMultiple>
                <TextField
                    label="Tags"
                    style={{ width: "100%", marginTop: "20px" }}
                    placeholder="Tags"
                    variant="outlined"
                    value={tagsText}
                    onChange={(e) => {
                        setTagsText(e.target.value)
                    }}
                />
                <p>
                    Sources
                </p>
                <SelectMultiple
                    options={dataSourceList.map((x) => { return { value: x, label: x } })}
                    isMulti={true}
                    keyname={"data_source"}
                    tagsList={dataSources}
                    setTagsList={setDataSources}
                ></SelectMultiple>
                <TextField
                    label="CTA"
                    style={{ width: "100%", marginTop: "20px" }}
                    placeholder="CTA"
                    variant="outlined"
                    value={ctaText}
                    onChange={(e) => {
                        setCtaText(e.target.value)
                    }}
                />
                <SelectRadio
                    tagname={"CTA"}
                    value={ctaUseful}
                    values={ctaUsefulValues}
                    handleChange={handleCTAUsefulChange}
                ></SelectRadio>
                <TextField
                    label="Story"
                    multiline
                    rows={2}
                    style={{ width: "100%", marginTop: "20px" }}
                    placeholder="Story"
                    variant="outlined"
                    value={scriptIdea}
                    onChange={(e) => {
                        setScriptIdea(e.target.value)
                    }}
                />
                <Button
                    onClick={postFeedback}
                    sx={{ float: "auto", color: "red", backgroundColor: "white", marginTop: "10px", marginBottom: "10px" }}
                >
                    Submit
                </Button>
            </Container>
        </>
    );
}

const mapStateToProps = (state, ownProps) => ({
    ...ownProps,
    current_index: state.feature_lookup.current_index,
});

const mapDispatchToProps = (dispatch) => ({
    postTagsFeedback: (index, feedbackObject) => dispatch(postTagsFeedback(index, feedbackObject)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomFeedback);