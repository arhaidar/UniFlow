// import React from 'react';
import { useEffect, useState } from 'react'; // ✅ Add useState here
import { useCourseContext } from '../../mainpage';
import './dashboard.css'
// import '../css/checkbox.css'

export const DashBoard = () => {
  const { state, dispatch } = useCourseContext();
  return (
    <div className="cs1_container">
      <header className="zot-header">
        <div className="zot-underline"></div>
      </header>
      <div className="status-blocks-container">
        <div className="status-block major-block">
          <div className="block-title">School (Department)</div>
          <div className="block-value">Donald Bren School of Information and Computer Sciences (ICS)</div>
        </div>
        <div className="status-block major-block">
          <div className="block-title">Major</div>
          <div className="block-value">Computer Science</div>
        </div>
        <div className="status-block gpa-block">
          <div className="block-title">GPA</div>
          <div className="block-value">3.5</div>
        </div>
        <div className="status-block credits-block">
          <div className="block-title">Credits Completed</div>
          <div className="block-value">90</div>
        </div>
        <div className="status-block next-class-block">
          <div className="block-title">Major Specilization</div>
          <div className="block-value">Intelligence System</div>
        </div>
        <div className="status-block next-class-block">
          <div className="block-title">Next Class</div>
          <div className="block-value">COMPSCI 171</div>
          <div className="block-value">COMPSCI 116</div>
          <div className="block-value">COMPSCI 125</div>
          <div className="block-value">IN4MATX 113</div>
          <a href=''>...see more</a>
        </div>
        <div className="status-block next-class-block">
          <div className="block-title">Current Quarter</div>
          <div className="block-value">Winter 2025</div>
        </div>
        <div className="status-block next-class-block">
          <div className="block-title">A Year Of Course Availbility</div>
          <a href=''>check details</a>
        </div>
      </div>
    </div>
  );
};

