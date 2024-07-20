import React from 'react'
import { useParams } from 'react-router-dom';
import PersonalDetails from './PersonalDetails';
import SelectGenres from './SelectGenres';
import SelectArtists from './SelectArtists';
import SelectPlan from './SelectPlan';

const CreateProfile = () => {
    const {section} = useParams();
    const renderComponent = () => {
        switch (section) {
          case "details":
            return <PersonalDetails />;
          case "genres":
            return <SelectGenres />;
          case "artists":
            return <SelectArtists />;
          case "plan":
            return <SelectPlan/>
          default:
            return <PersonalDetails />;
        }
      };
    
  return (
    <div>
        {renderComponent()}
    </div>
  )
}

export default CreateProfile