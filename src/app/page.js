'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import DegreesList from './DegreesList';

const UniversityDegreeForm = () => {
  // State for University Form
  const [universityData, setUniversityData] = useState({
    name: '',
    location: '',
    email: '',
    logo: null,
  });

  // State for Degree Form
  const [degreeData, setDegreeData] = useState({
    link: '',
    issue_date: '',
    university_id: '',
  });

  const [universities, setUniversities] = useState([]); // State to hold fetched universities
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [logoPreview, setLogoPreview] = useState(null); // For previewing the uploaded logo

  useEffect(() => {
    // Fetch the universities when the component mounts
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const response = await axios.get('http://localhost:5000/universities');
      setUniversities(response.data); // Update state with fetched data
    } catch (error) {
      console.error('Error fetching universities:', error);
    }
  };

  // Handle input change for university form
  const handleUniversityInputChange = (e) => {
    const { name, value } = e.target;
    setUniversityData({ ...universityData, [name]: value });
  };

  // Handle input change for degree form
  const handleDegreeInputChange = (e) => {
    const { name, value } = e.target;
    setDegreeData({ ...degreeData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUniversityData({ ...universityData, logo: file });
    setLogoPreview(URL.createObjectURL(file)); // Generate preview URL
  };

  const validateUniversityForm = () => {
    let errors = {};
    if (!universityData.name) errors.name = 'University name is required';
    if (!universityData.location) errors.location = 'Location is required';
    if (!universityData.email) errors.email = 'Email is required';
    if (!universityData.logo) errors.logo = 'Logo is required';
    return errors;
  };

  const validateDegreeForm = () => {
    let errors = {};
    if (!degreeData.link) errors.link = 'Degree link is required';
    if (!degreeData.issue_date) errors.issue_date = 'Issue date is required';
    if (!degreeData.university_id)
      errors.university_id = 'University must be selected';
    return errors;
  };

  const handleUniversitySubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateUniversityForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const form = new FormData();
    form.append('name', universityData.name);
    form.append('location', universityData.location);
    form.append('email', universityData.email);
    form.append('logo', universityData.logo);

    try {
      await axios.post('http://localhost:5000/university', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccessMessage('University added successfully!');
      setErrors({});
      setUniversityData({
        name: '',
        location: '',
        email: '',
        logo: null,
      });
      setLogoPreview(null); // Clear the logo preview
      fetchUniversities(); // Refetch the universities after adding a new one
    } catch (error) {
      console.error(error);
      setErrors({ form: 'An error occurred. Please try again.' });
    }
  };

  const handleDegreeSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateDegreeForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post('http://localhost:5000/degree', degreeData);
      setSuccessMessage('Degree added successfully!');
      setErrors({});
      setDegreeData({
        link: '',
        issue_date: '',
        university_id: '',
      });
      fetchUniversities(); // Refetch universities or perform any other necessary action
    } catch (error) {
      console.error(error);
      setErrors({ form: 'An error occurred. Please try again.' });
    }
  };

  return (
    <div className='container'>
      <h1 className='title'>Add University and Degree</h1>

      {/* University Form */}
      <form
        onSubmit={handleUniversitySubmit}
        encType='multipart/form-data'
        className='form'
      >
        <h2>Add University</h2>
        <div className='form-group'>
          <label htmlFor='name'>University Name:</label>
          <input
            type='text'
            name='name'
            value={universityData.name}
            onChange={handleUniversityInputChange}
            className='input-field'
          />
          {errors.name && <p className='error-message'>{errors.name}</p>}
        </div>
        <div className='form-group'>
          <label htmlFor='location'>Location:</label>
          <input
            type='text'
            name='location'
            value={universityData.location}
            onChange={handleUniversityInputChange}
            className='input-field'
          />
          {errors.location && (
            <p className='error-message'>{errors.location}</p>
          )}
        </div>
        <div className='form-group'>
          <label htmlFor='email'>Email:</label>
          <input
            type='email'
            name='email'
            value={universityData.email}
            onChange={handleUniversityInputChange}
            className='input-field'
          />
          {errors.email && <p className='error-message'>{errors.email}</p>}
        </div>
        <div className='form-group'>
          <label htmlFor='logo'>University Logo:</label>
          <input
            type='file'
            name='logo'
            accept='image/'
            onChange={handleFileChange}
            className='input-file'
          />
          {errors.logo && <p className='error-message'>{errors.logo}</p>}
          {logoPreview && (
            <div className='logo-preview'>
              <img src={logoPreview} alt='Logo Preview' />
            </div>
          )}
        </div>
        <button type='submit' className='submit-button'>
          Add University
        </button>
      </form>

      {/* Degree Form */}
      <form onSubmit={handleDegreeSubmit} className='form'>
        <h2>Add Degree</h2>
        <div className='form-group'>
          <label htmlFor='link'>Degree Link:</label>
          <input
            type='text'
            name='link'
            value={degreeData.link}
            onChange={handleDegreeInputChange}
            className='input-field'
          />
          {errors.link && <p className='error-message'>{errors.link}</p>}
        </div>
        <div className='form-group'>
          <label htmlFor='issue_date'>Issue Date:</label>
          <input
            type='date'
            name='issue_date'
            value={degreeData.issue_date}
            onChange={handleDegreeInputChange}
            className='input-field'
          />
          {errors.issue_date && (
            <p className='error-message'>{errors.issue_date}</p>
          )}
        </div>
        <div className='form-group'>
          <label htmlFor='university_id'>University:</label>
          <select
            name='university_id'
            value={degreeData.university_id}
            onChange={handleDegreeInputChange}
            className='input-field'
          >
            <option value=''>Select a university</option>
            {universities.map((university) => (
              <option key={university.id} value={university.id}>
                {university.name}
              </option>
            ))}
          </select>
          {errors.university_id && (
            <p className='error-message'>{errors.university_id}</p>
          )}
        </div>
        <button type='submit' className='submit-button'>
          Add Degree
        </button>
      </form>

      {successMessage && <p className='success-message'>{successMessage}</p>}
      {errors.form && <p className='error-message'>{errors.form}</p>}

      {/* Universities Table */}
      <h2 className='table-title'>Universities</h2>
      <table className='table'>
        <thead>
          <tr>
           
            <th>University Name</th>
            
            <th>Email</th>
            <th>Location</th>
            <th>Logo</th>
          </tr>
        </thead>
        <tbody>
          {universities.map((university) => (
            <tr key={university.id}>
              <td>
                <img
                  src={`http://localhost:3000/uploads/${university.logo}`}
                  alt={`${university.name} Logo`}
                  className='table-logo'
                />
              </td>
              <td>{university.name}</td>
              <td>{university.location}</td>
              <td>{university.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .title {
          text-align: center;
          margin-bottom: 20px;
          font-size: 28px;
          color: #333;
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          font-weight: bold;
          color: #555;
        }
        .input-field,
        .input-file {
          width: 100%;
          padding: 12px;
          margin-top: 5px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 16px;
          transition: border-color 0.3s;
        }
        .input-field:focus,
        .input-file:focus {
          border-color: #0070f3;
          outline: none;
        }
        .error-message {
          color: red;
          font-size: 14px;
        }
        .success-message {
          color: green;
          font-size: 14px;
          text-align: center;
          margin-top: 10px;
        }
        .submit-button {
          width: 100%;
          padding: 14px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 18px;
          cursor: pointer;
          margin-top: 10px;
          transition: background-color 0.3s;
        }
        .submit-button:hover {
          background-color: #005bb5;
        }
        .table {
          width: 100%;
          margin-top: 30px;
          border-collapse: collapse;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .table th,
        .table td {
          padding: 12px;
          border: 1px solid #ddd;
          text-align: left;
        }

        .logo-img {
          max-width: 60px;
          height: auto;
          border-radius: 4px;
        }
        .table th {
          background-color: #0070f3;
          color: white;
        }
        .table-title {
          margin-top: 40px;
          font-size: 24px;
          color: #333;
          text-align: center;
        }
        .table-logo {
          max-width: 60px;
          height: auto;
          border-radius: 4px;
        }
        @media (max-width: 768px) {
          .container {
            padding: 15px;
          }
          .table th,
          .table td {
            font-size: 14px;
            padding: 8px;
          }
        }
      `}</style>

      <div>
        <h1>Existing Degrees</h1>
        <DegreesList /> {/* This will render the DegreesList component */}
      </div>
    </div>
  );
};

export default UniversityDegreeForm;