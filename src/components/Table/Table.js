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
        redditToggled: false
    }

    componentDidMount = () => {
        this.handleRefresh();
    }

    // Called when the user clicks the refresh button (or when the component is mounted)
    handleRefresh = () => {
        // Sets state to default
        this.setState({launches: [], landToggled: false, reusedToggled: false, redditToggled: false}, ()=>{
            // Request sent to SpaceX API via this.getLaunches()
            this.getLaunches()
            .then(response => {
                // if there is a response, save all the data to state.launches
                if (response) {
                    this.setState({launches: response.data}, () => {
                        console.log("Data returned from API:", this.state.launches);
                    });
                }
            })   
        })   
    }

    // Handles the changing of state when the user checks any of the filter options
    handleFilterChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        console.log(name, value);
        this.setState({
        [name]: value
        });
    }

    // The get request via Axios to the SpaceX launches API
    getLaunches = async () => {
        try {
            return await axios.get('https://api.spacexdata.com/v3/launches/')
        } catch (err) {
            console.error(err);
        }
    }
    
    render() {
        
        // Handles the rendering of all launch data in the table body
        const handleLaunchDisplay = (launches) => {
            console.log("Filtered posts: ", launches)
            return launches.map(launch => {
                return (
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
                )
            })

        }

        // Function that checks launch data for reddit links - this is called 
        const checkForReddit = links => {
            // Turn the links object into an array of its keys, then checks if any values start with "reddit"
            let linkList = Object.keys(links);
            for (let key in linkList) {
                if (linkList[key].startsWith("reddit")) return true;
            }
        }

        // Builds the string filterCriteria that is returned by the filter() function. This string then is turned into code via eval() and returned.
        // @TODO Craft a solution for this operation that does not use eval(). May be better to create an object instead of a string.
        let filteredLaunches;
        let filterCriteria = '';

        if (this.state.landToggled) {

            filterCriteria += 'item.rocket.first_stage.cores[0].land_success';
        }

        if (this.state.reusedToggled) {
            if (filterCriteria) {
                filterCriteria += " && ";
            }
            filterCriteria += 'item.rocket.first_stage.cores[0].reused';
        }

        if (this.state.redditToggled) {
            if (filterCriteria) {
                filterCriteria += " && ";
            }
            filterCriteria += 'checkForReddit(item.links)';
        }

        if (filterCriteria){
            console.log("filtering launches based on the following criteria: ", filterCriteria);
            filteredLaunches = this.state.launches.filter(item => {
                // Returns the filterCriteria string as javascript to drive the filtering of this data
                // Example: return item.rocket.first_stage.cores[0].land_success && item.rocket.first_stage.cores[0].reused && checkForReddit(item.links)
                return eval(filterCriteria);
            })
        } else {
            filteredLaunches = this.state.launches;
        }
        // End logic for building filterCriteria string

        return (
            <div>
                <div className="table-header-container">

                    <RefreshButton handleClick={this.handleRefresh}/>

                    <div className="filter-menu">

                        <label className="item">
                            <input className="filter-checkbox" name="landToggled" checked={this.state.landToggled} onChange={this.handleFilterChange} type="checkbox"></input>
                            <span className="checkmark"></span>
                            Land Success
                        </label>

                        <label className="item">
                            <input className="filter-checkbox" name="reusedToggled" checked={this.state.reusedToggled} onChange={this.handleFilterChange} type="checkbox"></input>
                            <span className="checkmark"></span>
                            Reused
                        </label>
                        
                        <label className="item">
                            <input className="filter-checkbox" name="redditToggled" checked={this.state.redditToggled} onChange={this.handleFilterChange} type="checkbox"></input>
                            <span className="checkmark"></span>
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

                        {/* If there is any launches ready to be displayed, they are populated via handleLaunchDisplay(). Otherwise a loading message appears */}
                        {filteredLaunches.length > 0 ? handleLaunchDisplay(filteredLaunches) : <tr><td colSpan="7">"Loading results..."</td></tr>}
                        
                    </tbody>
                </table>
            </div>
        )
    }
}

