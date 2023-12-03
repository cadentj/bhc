import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import Dendrogram from './Dendro.js';
import ProgressBar from './ProgressBar.js';
import Contents from './Contents.js';

import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

import "./section.css"

// New function to transform your specific data format into a hierarchical structure
function transformData(inputData) {
  const root = {
    type: 'node',
    name: 'You',
    children: []
  };

  var min = -50;
  var max = 50;
  var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  

  inputData.forEach(item => {
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

  preparation.forEach(item => {
    const sectionId = item.section;
    if (!sectionMap.has(sectionId)) {
      sectionMap.set(sectionId, true);
      sections.push({ id: sectionId, name: sectionId });
    }
  });

  return sections;
}

export default function BasicGrid({ data, contents, color, sectionDescription, title }) {
  const transformedData = transformData(data);


  const sections = extractSections(data);


  const graphWidth = window.innerWidth / 2.2;
  const dendrogramRef = useRef();

  const [activeSection, setActiveSection] = useState("start");
  const [previousSection, setPreviousSection] = useState(null);

  useEffect(() => {
    const container = document.querySelector('.container-snap');

    const handleScroll = () => {
      let activeSectionId = null;
      sections.forEach(section => {
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
      navigate('/exploration')
    }
  };

  const sectionNames = ["Preparation", "Exploration", "Application", "Closing"];

  // iterate through contents dict and make an array of contents[i].section
  const progressSections = contents.map(({ section }) => { return { id: section, name: section } })
  progressSections.unshift({ id: "start", name: "start" });

  return (
    <Box className="page">

      <Box className="page" sx={{ position: "absolute", zIndex: 50, background: "white" }} id="fade-overlay" />

      <Box className="centered-flex" sx={{ width: "50%", height: "100%", position: "fixed" }}>
        <Box sx={{ pr: 10, pb: 20 }}>
          <Dendrogram ref={dendrogramRef} data={transformedData} width={graphWidth} color={color} height={graphWidth*2} initialSection={contents[0].section} />
        </Box>
      </Box>

      <ProgressBar sections={progressSections} activeSection={activeSection} />

      <Box className="container-snap" sx={{ width: "50%", height: "100vh", right: 0, position: "absolute" }}>
        <Box
          key={-1}
          className="section budget-section"
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
          <Typography variant='h5' mb={1} >Contents</Typography>
          {sectionNames.map((section, index) => (
            <Stack direction={"row"} alignItems={"center"}>
              <Box sx={{ width: 15, height: 15, bgcolor: color, borderRadius: "50%", mr: 1 }}></Box>
              <Typography>{section}</Typography>
            </Stack>
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

            <Contents title={section} description={description} barriers={barriers} resources={resources} color={color}/>

            {(index === sections.length - 1) && <Box sx={{ width: "100%", mt: 10, display: "flex", justifyContent: "center" }} >
              <Button variant="outlined" color={location.slice(1)} onClick={nextPage}>Next</Button>
            </Box>}

          </Box>
        ))}

      </Box>
    </Box>
  );
}
