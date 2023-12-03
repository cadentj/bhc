import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import Dendrogram from './Dendro.js';
import ProgressBar from './ProgressBar.js';
import Contents from './Contents.js';

import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

import CircleIcon from '@mui/icons-material/Circle';

import "./section.css"

// New function to transform your specific data format into a hierarchical structure



function transformData(inputData) {
  const root = {
    type: 'node',
    name: 'You',
    children: []
  };


  inputData.forEach(item => {
    var min = -30;
    var max = 30;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    root.children.push({
      type: 'leaf',
      name: item.name,
      value: item['Position'],
      section: item.section, // Storing the section information
      links: ['Root'],
      offset: randomNumber
    });
  });

  return root;
}

function extractSections(preparation) {
  const sectionMap = new Map();
  const sections = [];

  let ind = 0
  preparation.forEach((item) => {
    const sectionId = item.section;
    if (!sectionMap.has(sectionId)) {
      sectionMap.set(sectionId, true);
      sections.push({ id: sectionId, name: sectionId, ind: ind });
    }
  });

  return sections;
}

function extractIndexs(finalizationArray) {
  const result = {};
  finalizationArray.forEach(item => {
    if (!result[item.section]) {
      result[item.section] = item.Position;
    }
  });
  result["start"] = 0
  return result;
}


export default function BasicGrid({ data, contents, color, sectionDescription, title }) {
  const transformedData = useMemo(() => transformData(data), [data]);

  const sections = extractSections(data);


  const graphWidth = window.innerWidth / 1.8;
  const dendrogramRef = useRef();

  const [activeSection, setActiveSection] = useState("start");
  const [previousSection, setPreviousSection] = useState(null);

  useEffect(() => {
    const container = document.querySelector('.container-snap');

    const handleScroll = () => {
      let activeSectionId = null;

      sections.forEach((section) => {
        const sectionElement = document.getElementById(section.id);
        const { top, bottom } = sectionElement.getBoundingClientRect();

        if (top < window.innerHeight && bottom >= 0) {
          // Section is in the viewport
          activeSectionId = section.id;
        }
      });

      if (activeSectionId && activeSectionId !== activeSection) {
        setPreviousSection(activeSection);
        setActiveSection(activeSectionId);

        console.log(activeSectionId)

        // Call revealNodes for the new active section
        dendrogramRef.current.revealNodes(activeSectionId);
      }
    };

    container.addEventListener('scroll', handleScroll);

    return () => container.removeEventListener('scroll', handleScroll);
  }, [activeSection, sections, previousSection]);

  const navigate = useNavigate();

  // Use navigate to change the route

  const location = useLocation().pathname
  const nextPage = () => {
    navigate("/exploration")
    // You can use navigate with a string path
    if (location === "/preparation") {
      navigate('/exploration')
    } else if (location === "/exploration") {
      navigate('/initiation')
    } else if (location === "/initiation") {
      navigate('/finalization')
    } else if (location === "/finalization") {
      navigate('/final')
    }
  };

  const test = extractIndexs(data)

  let height = window.innerHeight;

  const overlayStyle = {
    position: 'absolute',
    zIndex: 20
  }
  const imageLocation = require(`../media${location}/${test[activeSection]}.png`)

  console.log(activeSection)

  // iterate through contents dict and make an array of contents[i].section
  const progressSections = contents.map(({ section }) => { return { id: section, name: section } })
  progressSections.unshift({ id: "start", name: "start" });

  return (
    <Box className="page">
      <div style={{ ...overlayStyle, ...{ top: 20, left: 25, fontSize: '13px', position: "fixed", display: "flex", alignItems: "center" } }} id="fade-in">
        <Box component="img" sx={{ height: 40 }} src={imageLocation} /><Typography pl={2} color={color} variant="h4">{title}</Typography>
      </div>

      <Box className="page" sx={{ position: "absolute", zIndex: 50, background: "white" }} id="fade-overlay" />

      <Box className="centered-flex" sx={{ width: "50%", height: "100%", position: "fixed" }}>
        <Box sx={{ pr: 5, pb: 25 }}>
          <Dendrogram ref={dendrogramRef} data={transformedData} width={graphWidth} color={color} height={graphWidth * 1.5} initialSection={contents[0].section} />
        </Box>
      </Box>

      <ProgressBar sections={progressSections} activeSection={activeSection} />

      <Box className="container-snap" sx={{ width: "50%", height: "100vh", right: 0, position: "absolute" }}>
        <Box
          key={-1}
          className="section top-section"
          sx={{
            width: '35vw',
            height: '100vh',
            margin: '10px',
          }}
          id={"start"}
        >

          <Typography variant='h3' color={color}>{title}</Typography>
          <p>
            {sectionDescription}
          </p>
          <Typography variant='h5' mb={2} fontWeight={600}>Contents</Typography>
          {sections.map((section, index) => (
            <Box key={section["id"]} sx={{ display: "flex", alignItems: "center", cursor: "pointer", zIndex: 10, mb: "10px" }}>
              <CircleIcon sx={{ color: color, fontSize: 15, pr: 1 }} />
              <Typography marginBottom={0}>{section["id"]}</Typography>
            </Box>
          ))}
        </Box>
        {contents.map(({ section, description, resources, barriers }, index) => (

          <Box
            key={index + 1}
            className="section budget-section"
            sx={{
              width: '35vw',
              height: '100vh',
              margin: '10px',
            }}
            id={section}
          >

            <Contents title={section} description={description} barriers={barriers} resources={resources} color={color} />

            {(index === sections.length - 1) && <Box sx={{ width: "100%", mt: 10, display: "flex", justifyContent: "center" }} >
              <Button variant="outlined" size='large' color={location.slice(1)} onClick={nextPage}>Next</Button>
            </Box>}

          </Box>
        ))}

      </Box>
    </Box >
  );
}
