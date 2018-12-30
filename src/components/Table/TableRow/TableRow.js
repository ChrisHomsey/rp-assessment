import React, { Component } from 'react';

import LinkIcon from './LinkIcon';

import './TableRow.css';

import PlaceHolder from '../../../static/placeholder.png';


export default class TableRow extends Component {
  render(props) {
    return (
        <tr>
            <td>
                {this.props.badge ? <img className="launch-badge" src={this.props.badge} alt={this.props.name}/> : <img className="launch-badge" src={PlaceHolder} alt="Placeholder"/>}
            </td>
            <td>{this.props.name ? this.props.name : "N/A"}</td>
            <td>{this.props.type ? this.props.type : "N/A"}</td>
            <td>{this.props.date ? this.props.date : "N/A"}</td>
            <td>{this.props.details ? this.props.details : "N/A"}</td>
            <td>{this.props.id ? this.props.id : "N/A"}</td>
            <td>
                <a href={this.props.article}>
                    <LinkIcon/>
                </a>
            </td>
        </tr>
    )
  }
}