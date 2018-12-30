import React, { Component } from 'react';

// Styling
import './Header.css';

export default class Header extends Component {
  render(props) {
    return (
        <h1 className="page-title">{this.props.content}</h1>
    )
  }
}
