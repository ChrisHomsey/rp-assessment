import React from 'react';
import PropTypes from 'prop-types';

// Child Components
import LinkIcon from './LinkIcon';

// Styling
import './TableRow.css';

// Static Assets
import PlaceHolder from '../../../static/placeholder.png';

export default function TableRow(props) {
  const {
    badge,
    name,
    type,
    date,
    details,
    id,
    article,
  } = props;

  return (
    <tr>
      <td>
        {badge ? <img className="launch-badge" src={badge} alt={name} /> : <img className="launch-badge" src={PlaceHolder} alt="Placeholder" />}
      </td>
      <td>{name || 'N/A'}</td>
      <td>{type || 'N/A'}</td>
      <td>{date || 'N/A'}</td>
      <td>{details || 'N/A'}</td>
      <td>{id || 'N/A'}</td>
      <td>
        <a href={article}>
          <LinkIcon />
        </a>
      </td>
    </tr>
  );
}

TableRow.propTypes = {
  badge: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  date: PropTypes.string,
  details: PropTypes.string,
  id: PropTypes.number,
  article: PropTypes.string,
};

TableRow.defaultProps = {
  badge: null,
  name: 'N/A',
  type: 'N/A',
  date: 'N/A',
  details: 'N/A',
  id: null,
  article: 'N/A',
};
