import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DegreesList = () => {
  const [degrees, setDegrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDegrees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/degrees');
        setDegrees(response.data); // Axios automatically parses JSON
      } catch (err) {
        setError(err.response ? err.response.data.error : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDegrees();
  }, []);

  if (loading) return <p>Loading degrees...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='degrees-container'>
      <h2>Degrees List</h2>
      {degrees.length === 0 ? (
        <p>No degrees found.</p>
      ) : (
        <table className='degrees-table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Link</th>
              <th>Issue Date</th>
              <th>University ID</th>
            </tr>
          </thead>
          <tbody>
            {degrees.map((degree) => (
              <tr key={degree.id}>
                <td>{degree.id}</td>
                <td>
                  <a
                    href={degree.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='degree-link'
                  >
                    {degree.link}
                  </a>
                </td>
                <td>{new Date(degree.issue_date).toLocaleDateString()}</td>
                <td>{degree.university_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <style jsx>{`
        .degrees-container {
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
          text-align: center;
          margin-bottom: 20px;
        }
        .degrees-table {
          width: 100%;
          border-collapse: collapse;
        }
        .degrees-table th,
        .degrees-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        .degrees-table th {
          background-color: #4caf50;
          color: white;
        }
        .degrees-table tr:nth-child(even) {
          background-color: #f2f2f2;
        }
        .degree-link {
          color: #007bff;
          text-decoration: none;
        }
        .degree-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default DegreesList;