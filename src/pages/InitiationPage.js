import React from "react";
import { Initiation } from "../data/Data";
import BasicGrid from "../components/Main";
import { InitiationContents } from "../data/InitiationContents";

const sectionDescription = "In this section you’ll learn... lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "

export default function ApplicationPage() {
    return (
        <BasicGrid data={Initiation} contents={InitiationContents} color={"#4F9C82"} title={"Initiation"} sectionDescription={sectionDescription}/>
    );
}