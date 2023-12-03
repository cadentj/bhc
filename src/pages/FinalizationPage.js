import React from "react";
import { Finalization } from "../data/Data";
import BasicGrid from "../components/Main";
import { FinalizationContents } from "../data/FinalizationContents";

const sectionDescription= "In this section you’ll learn... lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "

export default function FinalizationPage() {
    return (
        <BasicGrid data={Finalization} contents={FinalizationContents} color={"#B65965"} title={"Finalization"} sectionDescription={sectionDescription}/>
    );
}