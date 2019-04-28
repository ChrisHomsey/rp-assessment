import React, { Component } from 'react';
import axios from 'axios';

// Styling
import './Table.css';

// Components
import TableRow from './TableRow';
import RefreshButton from './RefreshButton';

// Utils
import LaunchDateConversion from '../../utils/LaunchDateConversion';

export default class Table extends Component {
  state = {
    launches: [],
    landToggled: false,
    reusedToggled: false,
    redditToggled: false,
  }

  componentDidMount = () => {
    this.handleRefresh();
  }

  // Called when the user clicks the refresh button (or when the component is mounted)
  handleRefresh = () => {
    const { launches } = this.state;
    // Sets state to default
    this.setState({
      launches: [],
      landToggled: false,
      reusedToggled: false,
      redditToggled: false,
    }, () => {
      // Request sent to SpaceX API via this.getLaunches()
      this.getLaunches()
        .then((response) => {
          // if there is a response, save all the data to state.launches
          if (response) {
            this.setState({ launches: response.data }, () => {
              console.log('Data returned from API:', launches);
            });
          }
        });
    });
  }

  // Handles the changing of state when the user checks any of the filter options
  handleFilterChange = (event) => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    console.log(name, value);
    this.setState({
      [name]: value,
    });
  }

  // The get request via Axios to the SpaceX launches API
  getLaunches = async () => {
    try {
      return await axios.get('https://api.spacexdata.com/v3/launches/');
    } catch (err) {
      return console.error(err);
    }
  }

  render() {
    // Handles the rendering of all launch data in the table body
    const handleLaunchDisplay = (launches) => {
      console.log('Filtered posts: ', launches);
      return launches.map(launch => (
        <TableRow
          key={launch.flight_number}
          badge={launch.links.mission_patch_small}
          name={launch.rocket.rocket_name}
          type={launch.rocket.rocket_type}
          date={LaunchDateConversion(launch.launch_date_unix)}
          details={launch.details}
          id={launch.flight_number}
          article={launch.links.article_link}
        />
      ));
    };

    // Function that checks launch data for reddit links
    // eslint-disable-next-line no-unused-vars
    const checkForReddit = (links) => {
      /* Turn the links object into an array of its values, then checks if any values
      start with a reddit url */
      const linkList = Object.values(links);

      for (let l = 0; l < linkList.length; l += 1) {
        if (linkList && typeof (linkList[l]) === 'string' && linkList[l].startsWith('https://www.reddit.com')) return true;
      }
      return false;
    };

    /* Builds the string filterCriteria that is returned by the filter() function. This string
    then is turned into code via eval() and returned. */
    /* @TODO Craft a solution for this operation that does not use eval(). May be
    better to create an object instead of a string. */
    let filteredLaunches;
    let filterCriteria = '';
    const {
      launches,
      landToggled,
      reusedToggled,
      redditToggled,
    } = this.state;

    if (landToggled) {
      filterCriteria += 'item.rocket.first_stage.cores[0].land_success';
    }

    if (reusedToggled) {
      if (filterCriteria) {
        filterCriteria += ' && ';
      }
      filterCriteria += 'item.rocket.first_stage.cores[0].reused';
    }

    if (redditToggled) {
      if (filterCriteria) {
        filterCriteria += ' && ';
      }
      filterCriteria += 'checkForReddit(item.links)';
    }

    if (filterCriteria) {
      console.log('filtering launches based on the following criteria: ', filterCriteria);
      // Returns the filterCriteria string as javascript to drive the filtering of this data
      /* Example:
      return item.rocket.first_stage.cores[0].land_success &&
      item.rocket.first_stage.cores[0].reused &&
      checkForReddit(item.links) */

      // eslint-disable-next-line no-unused-vars, no-eval
      filteredLaunches = launches.filter(item => eval(filterCriteria));
    } else {
      filteredLaunches = launches;
    }
    // End logic for building filterCriteria string

    return (
      <div>
        <div className="table-header-container">

          <RefreshButton handleClick={this.handleRefresh} />

          <div className="filter-menu">

            <label htmlFor="land-filter-checkbox" className="item">
              <input id="land-filter-checkbox" className="filter-checkbox" name="landToggled" checked={landToggled} onChange={this.handleFilterChange} type="checkbox" />
              <span className="checkmark" />
              Land Success
            </label>

            <label htmlFor="reused-filter-checkbox" className="item">
              <input id="reused-filter-checkbox" className="filter-checkbox" name="reusedToggled" checked={reusedToggled} onChange={this.handleFilterChange} type="checkbox" />
              <span className="checkmark" />
                Reused
            </label>

            <label htmlFor="reddit-filter-checkbox" className="item">
              <input id="reddit-filter-checkbox" className="filter-checkbox" name="redditToggled" checked={redditToggled} onChange={this.handleFilterChange} type="checkbox" />
              <span className="checkmark" />
                With Reddit
            </label>

          </div>

        </div>
        <table className="launch-table">
          <thead className="launch-table-header">
            <tr>
              <th>Badge</th>
              <th>Rocket Name</th>
              <th>Rocket Type</th>
              <th>Launch Date</th>
              <th>Details</th>
              <th>ID</th>
              <th>Article</th>
            </tr>
          </thead>
          <tbody id="target-body">

            {/* If there is any launches ready to be displayed, they are populated via
            handleLaunchDisplay(). Otherwise a loading message appears */}
            {filteredLaunches.length > 0 ? handleLaunchDisplay(filteredLaunches) : <tr><td colSpan="7">Loading results...</td></tr>}

          </tbody>
        </table>
      </div>
    );
  }
}
