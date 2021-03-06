# Robots & Pencils Assessment

A simple app that connects to the [SpaceX API](https://github.com/r-spacex/SpaceX-API) to request and display launch information.

**Run the app here:** [http://chrishomsey-rp-assessment.s3-website.us-east-2.amazonaws.com/](http://chrishomsey-rp-assessment.s3-website.us-east-2.amazonaws.com/)

## Design

Copying the original design wasn't too hard- especially using the sketch file.

I would say that the biggest design challenge was styling the `<table>` elements. My first instinct was to render each launch element as a div, but then I realized that the semantic solution would be to render all data into a table.

## Develop

I chose **Reactjs** as my UI. It seemed to be a great fit for a small project like this.

I've componentized elements that I feel would be resuable in a scaled project, and also SVG markup so that I can keep the code of parent components clean.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Define

I used the **v3 of the SpaceX API** as I thought it was appropriate to get the latest launches. Because this version also requests future launches that have incomplete info, I used **ternary conditionals** on the `<TableRow/>` component to display placeholders if the data was not present.

One of the more challenging parts of this was creating filters to organize the data that would stack with each other if the user checked multiple checkboxes. There may be a library that makes this easy, but I wanted to work through it.

## Author
**Chris Homsey**

* Feel free to check out my portfolio at [Chris Homsey | Web Developer](https://www.chrishomsey.com)
* You can find my latest projects at [Chris Homsey | Projects](https://www.chrishomsey.com/portfolio/development)


